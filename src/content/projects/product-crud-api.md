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
fluxo: [Streamlit, FastAPI, PostgreSQL]
---

## Arquitetura

```mermaid
flowchart LR
  UI[Streamlit] -- HTTP --> API[FastAPI + Pydantic]
  API -- SQLAlchemy --> DB[(PostgreSQL)]
```

Projeto desenvolvido durante a formação Jornada de Dados.

## O que aprendi

[//]: # (Texto provisório e genérico; revisar com o Pedro.)

- Construir uma API REST com FastAPI e entender como cada operação do CRUD vira um endpoint.
- Validar a entrada com schemas Pydantic, recusando dados inválidos antes de chegar ao banco.
- Acessar o PostgreSQL pelo SQLAlchemy, separando a camada de dados da camada da API.
- Conectar vários serviços (banco, API e front-end Streamlit) na mesma rede do Docker Compose.
