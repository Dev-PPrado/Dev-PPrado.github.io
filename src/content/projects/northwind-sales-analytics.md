---
titulo: Análise de vendas Northwind com SQL
resumo: Consultas SQL sobre o banco Northwind em PostgreSQL para responder perguntas de negócio sobre receita, clientes e produtos.
problema: Dados transacionais de pedidos não respondem sozinhos perguntas como evolução da receita, receita acumulada no ano e quais clientes e produtos geram mais valor.
solucao: Relatórios em SQL com JOINs, agregações, CTEs e window functions (LAG para variação mensal, SUM OVER para receita acumulada no ano, NTILE para segmentar clientes). O banco roda em PostgreSQL com pgAdmin via Docker Compose.
stack: [SQL, PostgreSQL, Docker, pgAdmin]
repo: https://github.com/Dev-PPrado/northwind-sales-analytics
data: 2026-09
destaque: true
status: em desenvolvimento
---

## Arquitetura

```mermaid
flowchart LR
  DUMP[northwind.sql] --> PG[(PostgreSQL em Docker)]
  PG --> R[relatórios SQL]
  R --> A[receita, YTD, segmentação de clientes, top produtos]
```

## O que aprendi

TODO: preencher com o Pedro.
