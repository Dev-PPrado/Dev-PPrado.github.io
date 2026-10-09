---
titulo: API CRUD de produtos
resumo: API REST com FastAPI para cadastrar, consultar, atualizar e remover produtos em PostgreSQL, com front-end em Streamlit e tudo orquestrado com Docker Compose.
problema: Praticar a construção de uma aplicação completa sobre um banco relacional, com validação de entrada e separação entre API, acesso a dados e interface.
solucao: Backend em FastAPI com schemas Pydantic (preço positivo, e-mail do fornecedor validado), acesso ao PostgreSQL via SQLAlchemy e endpoints de CRUD. Um front-end Streamlit consome a API, e os três serviços sobem em containers na mesma rede do Docker Compose.
stack: [Python, FastAPI, Pydantic, SQLAlchemy, PostgreSQL, Streamlit, Docker]
repo: https://github.com/Dev-PPrado/product-crud-api
data: 2026-09
destaque: false
status: em desenvolvimento
---

## Arquitetura

```mermaid
flowchart LR
  UI[Streamlit] -- HTTP --> API[FastAPI + Pydantic]
  API -- SQLAlchemy --> DB[(PostgreSQL)]
```

Projeto desenvolvido durante a formação Jornada de Dados.

## O que aprendi

TODO: preencher com o Pedro.
