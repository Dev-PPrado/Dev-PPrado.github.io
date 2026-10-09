---
titulo: Pipeline ETL da PokeAPI
resumo: Pipeline em Python que extrai dados da PokeAPI, transforma, valida com Pydantic e carrega em SQLite com SQLAlchemy, com logging e tratamento de erros em cada etapa.
problema: Construir uma base de projeto reutilizável para pipelines de dados, com responsabilidades separadas entre extração, transformação, validação e carga.
solucao: Cada etapa fica em um módulo próprio (extract, transform, schemas, load). Os dados brutos da API são transformados, validados por um schema Pydantic antes da persistência e gravados no SQLite via SQLAlchemy. Logs estruturados vão para console e arquivo, e falhas de uma execução são registradas sem derrubar o pipeline.
stack: [Python, Requests, Pydantic, SQLAlchemy, SQLite, pytest, uv]
repo: https://github.com/Dev-PPrado/Pokemon-ETL-Pipeline
data: 2026-09
destaque: true
status: em desenvolvimento
---

## Arquitetura

```mermaid
flowchart LR
  API[PokeAPI] --> E[extract: JSON bruto]
  E --> T[transform]
  T --> V[schema: validação Pydantic]
  V --> L[load: SQLAlchemy]
  L --> DB[(SQLite)]
```

Configuração em `src/config` (banco, logging e variáveis de ambiente via `.env`). Há um teste com pytest que verifica a criação da tabela no banco.

## O que aprendi

TODO: preencher com o Pedro.
