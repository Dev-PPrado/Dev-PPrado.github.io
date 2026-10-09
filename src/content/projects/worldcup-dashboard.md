---
titulo: Dashboard da Copa do Mundo (1930–2014)
resumo: Dashboard em Streamlit que carrega, limpa e modela dados históricos das Copas do Mundo com pandas e apresenta KPIs, filtros e gráficos Plotly.
problema: Os CSVs públicos das Copas têm linhas vazias, duplicadas, nomes de seleções inconsistentes e eventos de jogadores codificados em texto, o que impede análise direta.
solucao: Uma camada de carga e limpeza em pandas remove vazios e duplicados, padroniza nomes de seleções, mapeia fases do torneio e extrai eventos (gols, cartões) do texto. Uma transformação gera a visão por seleção e jogo, consumida por um dashboard Streamlit com filtros globais e abas de análise.
stack: [Python, pandas, Streamlit, Plotly]
repo: https://github.com/Dev-PPrado/WorldCup
data: 2026-10
destaque: false
status: em desenvolvimento
---

## Arquitetura

```mermaid
flowchart LR
  CSV[CSVs brutos] --> C[carga e limpeza: pandas]
  C --> T[transformação: visão por seleção]
  T --> D[dashboard Streamlit + Plotly]
```

## O que aprendi

TODO: preencher com o Pedro.
