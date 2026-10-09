---
titulo: Pipeline ETL de dados climáticos
resumo: Pipeline que coleta dados meteorológicos da API OpenWeatherMap a cada hora, transforma com Pandas e carrega no PostgreSQL, orquestrado pelo Airflow em Docker.
problema: Dados de uma API REST chegam em JSON aninhado e precisam ser coletados periodicamente, padronizados e guardados em um banco para consulta.
solucao: Uma DAG do Airflow executa extract, transform e load a cada hora. O extract salva o JSON bruto, o transform normaliza com Pandas e grava Parquet, e o load insere na tabela sp_weather do PostgreSQL. Todo o ambiente sobe com Docker Compose.
stack: [Python, Apache Airflow, Pandas, Parquet, PostgreSQL, Docker, SQLAlchemy]
repo: https://github.com/Dev-PPrado/weather_data_pipeline_ETL
data: 2026-09
destaque: true
status: em desenvolvimento
---

## Arquitetura

```mermaid
flowchart LR
  API[OpenWeatherMap API] --> E[extract: JSON bruto]
  E --> T[transform: Pandas + Parquet]
  T --> L[load: PostgreSQL sp_weather]
  AF[Airflow, a cada hora] -.orquestra.-> E & T & L
```

Projeto de estudo construído a partir do tutorial da VBLUUIZA e evoluído a partir dele.

## O que aprendi

TODO: preencher com o Pedro.

## Próximos passos

Validação e qualidade dos dados, testes automatizados, tratamento de erros com retries, carga incremental e arquitetura medallion (bronze, silver, gold).
