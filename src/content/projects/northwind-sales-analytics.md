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
fluxo: [northwind.sql, PostgreSQL, relatórios SQL, análises]
---

## Arquitetura

```mermaid
flowchart LR
  DUMP[northwind.sql] --> PG[(PostgreSQL em Docker)]
  PG --> R[relatórios SQL]
  R --> A[receita, YTD, segmentação de clientes, top produtos]
```

## O que aprendi

[//]: # (Texto provisório e genérico; revisar com o Pedro.)

- Escrever consultas analíticas em SQL que vão além do SELECT básico: JOINs entre várias tabelas, agregações e CTEs para quebrar uma pergunta grande em partes menores.
- Usar window functions (LAG, SUM OVER, NTILE) para comparar períodos, acumular valores e segmentar clientes sem precisar de subconsultas complicadas.
- Traduzir uma pergunta de negócio em uma consulta e conferir se o resultado faz sentido.
- Subir o PostgreSQL e o pgAdmin com Docker Compose, para que o ambiente seja o mesmo em qualquer máquina.
