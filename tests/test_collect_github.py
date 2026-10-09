import json
import sys
from datetime import UTC, datetime
from pathlib import Path

import pytest
from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from collect_github import load, transform  # noqa: E402

COLETA = datetime(2026, 10, 5, 12, 0, tzinfo=UTC)


def domingo(ano: int, mes: int, dia: int) -> int:
    """Timestamp UTC de um domingo, como o campo "week" da API."""
    d = datetime(ano, mes, dia, tzinfo=UTC)
    assert d.weekday() == 6, "use um domingo"
    return int(d.timestamp())


def semana(ts: int, days: list[int]) -> dict:
    return {"week": ts, "total": sum(days), "days": days}


def repo(nome: str, activity: list[dict], linguagens: dict[str, int] | None = None) -> dict:
    return {"nome": nome, "commit_activity": activity, "linguagens": linguagens or {}}


def test_semana_que_cruza_o_mes_divide_os_commits_por_dia():
    # Domingo 2026-08-30: dom e seg em agosto, ter a sáb em setembro.
    # A janela começa no dia 30, então agosto (incompleto) sai do resultado.
    dados = transform([repo("a", [semana(domingo(2026, 8, 30), [1, 2, 3, 0, 0, 0, 4])])], COLETA)
    assert dados["commits_por_mes"] == [{"mes": "2026-09", "commits": 7}]
    assert dados["total_commits"] == 7


def test_primeiro_mes_completo_e_mantido():
    # Domingo 2026-03-01: a janela começa no dia 1, então março entra.
    dados = transform([repo("a", [semana(domingo(2026, 3, 1), [1, 0, 0, 0, 0, 0, 0])])], COLETA)
    assert dados["commits_por_mes"] == [{"mes": "2026-03", "commits": 1}]


def test_soma_commits_de_varios_repos_e_preenche_meses_sem_commit():
    activity_a = [semana(domingo(2026, 3, 1), [2, 0, 0, 0, 0, 0, 0])]
    activity_b = [semana(domingo(2026, 3, 1), [1, 0, 0, 0, 0, 0, 0]), semana(domingo(2026, 5, 3), [0, 5, 0, 0, 0, 0, 0])]
    dados = transform([repo("a", activity_a), repo("b", activity_b)], COLETA)
    assert dados["commits_por_mes"] == [
        {"mes": "2026-03", "commits": 3},
        {"mes": "2026-04", "commits": 0},
        {"mes": "2026-05", "commits": 5},
    ]
    assert dados["repositorios"] == 2


def test_virada_de_ano():
    dados = transform([repo("a", [semana(domingo(2026, 12, 27), [1, 0, 0, 0, 0, 1, 1])])], COLETA)
    # Começa em 27/12: dezembro incompleto sai; sex e sáb caem em 2027-01-01 e 02.
    assert dados["commits_por_mes"] == [{"mes": "2027-01", "commits": 2}]


def test_linguagens_agregadas_por_bytes_e_ordenadas():
    brutos = [repo("a", [], {"Python": 300, "Dockerfile": 100}), repo("b", [], {"Python": 500, "HTML": 100})]
    dados = transform(brutos, COLETA)
    assert dados["linguagens"] == [
        {"nome": "Python", "bytes": 800, "percentual": 80.0},
        {"nome": "Dockerfile", "bytes": 100, "percentual": 10.0},
        {"nome": "HTML", "bytes": 100, "percentual": 10.0},
    ]


def test_sem_dados():
    dados = transform([repo("vazio", [])], COLETA)
    assert dados["commits_por_mes"] == []
    assert dados["linguagens"] == []
    assert dados["total_commits"] == 0


def test_transform_e_deterministico():
    brutos = [repo("a", [semana(domingo(2026, 3, 1), [1, 2, 0, 0, 0, 0, 0])], {"Python": 10})]
    assert transform(brutos, COLETA) == transform(brutos, COLETA)


def test_load_grava_e_e_idempotente(tmp_path: Path):
    destino = tmp_path / "github_stats.json"
    dados = transform([repo("a", [semana(domingo(2026, 3, 1), [1, 0, 0, 0, 0, 0, 0])], {"Python": 10})], COLETA)
    assert load(dados, destino) is True
    assert json.loads(destino.read_text(encoding="utf-8"))["total_commits"] == 1

    # Mesma coleta em outra data: nada muda, o arquivo fica intacto.
    depois = dict(dados, coletado_em=datetime(2026, 10, 12, tzinfo=UTC).isoformat())
    conteudo = destino.read_text(encoding="utf-8")
    assert load(depois, destino) is False
    assert destino.read_text(encoding="utf-8") == conteudo


def test_load_rejeita_dados_invalidos_e_mantem_o_arquivo(tmp_path: Path):
    destino = tmp_path / "github_stats.json"
    destino.write_text('{"anterior": true}\n', encoding="utf-8")
    dados = transform([repo("a", [semana(domingo(2026, 3, 1), [1, 0, 0, 0, 0, 0, 0])])], COLETA)
    dados["total_commits"] = 99  # inconsistente com commits_por_mes
    with pytest.raises(ValidationError):
        load(dados, destino)
    assert destino.read_text(encoding="utf-8") == '{"anterior": true}\n'
