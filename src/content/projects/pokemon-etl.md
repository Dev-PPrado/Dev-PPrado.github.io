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
fluxo: [PokeAPI, extract, transform, schema, load, SQLite]
pipeline:
  titulo: Pokemon ETL
  etapas:
    - { nome: extract, tech: Python, detalhe: PokeAPI → JSON }
    - { nome: transform, tech: Python, detalhe: padroniza os campos }
    - { nome: schema, tech: Pydantic, detalhe: PokemonSchema }
    - { nome: load, tech: SQLAlchemy, detalhe: tabela pokemons }
schemas:
  - tipo: pydantic
    nome: PokemonSchema
    descricao: Validação antes da carga (src/schemas/pokemon.py).
    campos:
      - { nome: name, tipo: str }
      - { nome: type, tipo: str }
  - tipo: table
    nome: pokemons
    motor: SQLite
    descricao: Modelo SQLAlchemy (src/models/pokemon.py).
    campos:
      - { nome: id, tipo: Integer, pk: true }
      - { nome: name, tipo: String }
      - { nome: type, tipo: String }
      - { nome: created_at, tipo: DateTime, regra: "default: now()" }
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

[//]: # (Texto provisório e genérico; revisar com o Pedro.)

- Separar o código em módulos (extract, transform, schemas, load), o que deixa cada parte mais fácil de entender e testar.
- Validar os dados com Pydantic antes de gravar, para que um registro inválido não chegue ao banco.
- Usar logging em vez de print e tratar erros sem derrubar a execução inteira.
- Configurar o projeto com variáveis de ambiente, gerenciar dependências com uv e escrever um primeiro teste com pytest.
