"""Coleta estatísticas dos repositórios públicos do GitHub e grava src/data/github_stats.json.

Pipeline em três etapas:
- extract: lista os repositórios públicos (sem forks) e busca, para cada um, os commits por
  semana do último ano (/stats/commit_activity) e os bytes por linguagem (/languages).
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

# /stats/commit_activity responde 202 enquanto o GitHub calcula a estatística.
TENTATIVAS_202 = 6
ESPERA_INICIAL_S = 2.0

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


def buscar_commit_activity(cliente: httpx.Client, repo: str) -> list[dict[str, Any]]:
    url = f"{API}/repos/{USUARIO}/{repo}/stats/commit_activity"
    espera = ESPERA_INICIAL_S
    for tentativa in range(1, TENTATIVAS_202 + 1):
        resposta = _get(cliente, url)
        if resposta.status_code == 204:  # repositório vazio
            return []
        if resposta.status_code == 200:
            return resposta.json()
        log.info("%s: estatística em cálculo (202), tentativa %d/%d, aguardando %.0fs", repo, tentativa, TENTATIVAS_202, espera)
        time.sleep(espera)
        espera *= 2
    raise RuntimeError(f"{repo}: commit_activity ainda em cálculo após {TENTATIVAS_202} tentativas")


def extract(cliente: httpx.Client) -> list[dict[str, Any]]:
    brutos = []
    for repo in listar_repositorios(cliente):
        nome = repo["name"]
        brutos.append(
            {
                "nome": nome,
                "commit_activity": buscar_commit_activity(cliente, nome),
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
