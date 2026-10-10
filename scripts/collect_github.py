"""Coleta estatísticas dos repositórios públicos do GitHub e grava src/data/github_stats.json.

Pipeline em três etapas:
- extract: lista os repositórios públicos (sem forks) e busca, para cada um, os commits por
  semana do último ano (/stats/commit_activity, com /commits como plano B) e os bytes por
  linguagem (/languages).
- transform: função pura que agrega commits por mês e linguagens por bytes.
- load: valida o schema e grava o JSON de forma atômica, só se os dados mudaram.

Se qualquer etapa falhar, o arquivo anterior é mantido e o script sai com código 1.

Uso: GITHUB_TOKEN=... uv run scripts/collect_github.py
"""

from __future__ import annotations

import json
import logging
import os
import sys
import time
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from pathlib import Path
from typing import Any

import httpx
from pydantic import BaseModel, Field, NonNegativeInt, model_validator

USUARIO = "Dev-PPrado"
API = "https://api.github.com"
SAIDA = Path(__file__).resolve().parent.parent / "src" / "data" / "github_stats.json"

# /stats/commit_activity responde 202 enquanto o GitHub calcula a estatística, e logo depois de
# um push isso pode durar mais de 15 minutos. Até 5 novas tentativas (5s a 60s, ~2 min no total);
# o que continuar pendente é contado pela lista de commits (ver contar_commits).
TENTATIVAS_202 = 5
ESPERA_INICIAL_S = 5.0
ESPERA_MAXIMA_S = 60.0

log = logging.getLogger("collect_github")


# ---------- schema ----------


class Mes(BaseModel):
    mes: str = Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")
    commits: NonNegativeInt


class Linguagem(BaseModel):
    nome: str = Field(min_length=1)
    bytes: NonNegativeInt
    percentual: float = Field(ge=0, le=100)


class GithubStats(BaseModel):
    coletado_em: datetime
    usuario: str
    repositorios: NonNegativeInt
    total_commits: NonNegativeInt
    commits_por_mes: list[Mes]
    linguagens: list[Linguagem]

    @model_validator(mode="after")
    def consistente(self) -> GithubStats:
        meses = [m.mes for m in self.commits_por_mes]
        if meses != sorted(set(meses)):
            raise ValueError("commits_por_mes precisa estar em ordem e sem meses repetidos")
        if sum(m.commits for m in self.commits_por_mes) != self.total_commits:
            raise ValueError("total_commits difere da soma de commits_por_mes")
        return self


# ---------- extract ----------


def _get(cliente: httpx.Client, url: str, **params: Any) -> httpx.Response:
    resposta = cliente.get(url, params=params or None)
    resposta.raise_for_status()
    return resposta


def listar_repositorios(cliente: httpx.Client) -> list[dict[str, Any]]:
    repos: list[dict[str, Any]] = []
    pagina = 1
    while True:
        lote = _get(cliente, f"{API}/users/{USUARIO}/repos", type="owner", per_page=100, page=pagina).json()
        repos.extend(lote)
        if len(lote) < 100:
            break
        pagina += 1
    return [r for r in repos if not r["fork"] and not r["private"]]


def pedir_commit_activity(cliente: httpx.Client, repo: str) -> list[dict[str, Any]] | None:
    """Commits por semana do último ano, ou None se o GitHub ainda está calculando (202)."""
    resposta = _get(cliente, f"{API}/repos/{USUARIO}/{repo}/stats/commit_activity")
    if resposta.status_code == 202:
        return None
    if resposta.status_code == 204:  # repositório vazio
        return []
    return resposta.json()


def contar_commits(cliente: httpx.Client, repo: str, hoje: date) -> list[dict[str, Any]]:
    """Plano B para o 202: monta o mesmo formato de commit_activity a partir de /commits.

    Cobre as mesmas 52 semanas (domingo a sábado, a última é a atual). Usa a data do autor em
    UTC, enquanto o GitHub usa o fuso do commit, então um commit perto da meia-noite pode cair
    no dia vizinho.
    """
    domingo_atual = hoje - timedelta(days=(hoje.weekday() + 1) % 7)
    inicio = domingo_atual - timedelta(weeks=51)
    semanas = {inicio + timedelta(weeks=i): [0] * 7 for i in range(52)}
    pagina = 1
    while True:
        lote = _get(
            cliente,
            f"{API}/repos/{USUARIO}/{repo}/commits",
            since=f"{inicio.isoformat()}T00:00:00Z",
            per_page=100,
            page=pagina,
        ).json()
        for item in lote:
            dia = datetime.fromisoformat(item["commit"]["author"]["date"]).astimezone(UTC).date()
            domingo = dia - timedelta(days=(dia.weekday() + 1) % 7)
            if domingo in semanas:
                semanas[domingo][(dia - domingo).days] += 1
        if len(lote) < 100:
            break
        pagina += 1
    return [
        {"week": int(datetime(d.year, d.month, d.day, tzinfo=UTC).timestamp()), "total": sum(dias), "days": dias}
        for d, dias in semanas.items()
    ]


def buscar_commit_activity(cliente: httpx.Client, repos: list[str], hoje: date) -> dict[str, list[dict[str, Any]]]:
    # A primeira rodada já dispara o cálculo de todos os repositórios; depois só os pendentes voltam.
    resultado: dict[str, list[dict[str, Any]]] = {}
    pendentes = list(repos)
    espera = ESPERA_INICIAL_S
    for tentativa in range(TENTATIVAS_202 + 1):
        if tentativa > 0:
            log.info("Estatística em cálculo (202) para %s; nova tentativa %d/%d em %.0fs", ", ".join(pendentes), tentativa, TENTATIVAS_202, espera)
            time.sleep(espera)
            espera = min(espera * 2, ESPERA_MAXIMA_S)
        ainda_pendentes = []
        for repo in pendentes:
            semanas = pedir_commit_activity(cliente, repo)
            if semanas is None:
                ainda_pendentes.append(repo)
            else:
                resultado[repo] = semanas
        pendentes = ainda_pendentes
        if not pendentes:
            return resultado
    for repo in pendentes:
        log.warning("%s: commit_activity ainda em cálculo; contando pela lista de commits", repo)
        resultado[repo] = contar_commits(cliente, repo, hoje)
    return resultado


def extract(cliente: httpx.Client) -> list[dict[str, Any]]:
    nomes = [repo["name"] for repo in listar_repositorios(cliente)]
    atividade = buscar_commit_activity(cliente, nomes, datetime.now(UTC).date())
    brutos = []
    for nome in nomes:
        brutos.append(
            {
                "nome": nome,
                "commit_activity": atividade[nome],
                "linguagens": _get(cliente, f"{API}/repos/{USUARIO}/{nome}/languages").json(),
            }
        )
        log.info("%s: coletado", nome)
    return brutos


# ---------- transform ----------


def _mes(d: date) -> str:
    return f"{d.year:04d}-{d.month:02d}"


def _meses_entre(inicio: str, fim: str) -> list[str]:
    ano, mes = map(int, inicio.split("-"))
    meses = []
    while f"{ano:04d}-{mes:02d}" <= fim:
        meses.append(f"{ano:04d}-{mes:02d}")
        ano, mes = (ano + 1, 1) if mes == 12 else (ano, mes + 1)
    return meses


def transform(brutos: list[dict[str, Any]], coletado_em: datetime) -> dict[str, Any]:
    """Agrega os dados brutos. Função pura: mesma entrada, mesma saída."""
    por_dia: dict[date, int] = defaultdict(int)
    for repo in brutos:
        for semana in repo["commit_activity"]:
            # "week" é o domingo que abre a semana (UTC); "days" vai de domingo a sábado.
            domingo = datetime.fromtimestamp(semana["week"], UTC).date()
            for i, commits in enumerate(semana["days"]):
                por_dia[domingo + timedelta(days=i)] += commits

    commits_por_mes: list[dict[str, Any]] = []
    if por_dia:
        primeiro, ultimo = min(por_dia), max(por_dia)
        por_mes: dict[str, int] = defaultdict(int)
        for dia, commits in por_dia.items():
            por_mes[_mes(dia)] += commits
        meses = _meses_entre(_mes(primeiro), _mes(ultimo))
        # A janela de 52 semanas raramente começa no dia 1: o primeiro mês viria incompleto.
        if primeiro.day != 1:
            meses = meses[1:]
        commits_por_mes = [{"mes": m, "commits": por_mes.get(m, 0)} for m in meses]

    bytes_por_linguagem: dict[str, int] = defaultdict(int)
    for repo in brutos:
        for nome, qtd in repo["linguagens"].items():
            bytes_por_linguagem[nome] += qtd
    total_bytes = sum(bytes_por_linguagem.values())
    linguagens = [
        {"nome": nome, "bytes": qtd, "percentual": round(100 * qtd / total_bytes, 1)}
        for nome, qtd in sorted(bytes_por_linguagem.items(), key=lambda item: (-item[1], item[0]))
    ]

    return {
        "coletado_em": coletado_em.isoformat(timespec="seconds"),
        "usuario": USUARIO,
        "repositorios": len(brutos),
        "total_commits": sum(m["commits"] for m in commits_por_mes),
        "commits_por_mes": commits_por_mes,
        "linguagens": linguagens,
    }


# ---------- load ----------


def _sem_data(dados: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in dados.items() if k != "coletado_em"}


def load(dados: dict[str, Any], destino: Path = SAIDA) -> bool:
    """Valida e grava. Retorna False quando nada mudou além da data de coleta."""
    validado = GithubStats.model_validate(dados).model_dump(mode="json")

    if destino.exists():
        anterior = json.loads(destino.read_text(encoding="utf-8"))
        if _sem_data(anterior) == _sem_data(validado):
            log.info("Dados iguais aos da última coleta; %s não foi alterado", destino.name)
            return False

    temporario = destino.with_suffix(".json.tmp")
    temporario.write_text(json.dumps(validado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporario.replace(destino)  # troca atômica: o arquivo nunca fica pela metade
    log.info("%s gravado", destino.name)
    return True


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        log.error("GITHUB_TOKEN não definido")
        return 1

    cabecalhos = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    try:
        with httpx.Client(headers=cabecalhos, timeout=30) as cliente:
            brutos = extract(cliente)
        load(transform(brutos, datetime.now(UTC)))
    except Exception:
        log.exception("Coleta falhou; o arquivo anterior foi mantido")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
