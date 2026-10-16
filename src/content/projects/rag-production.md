---
titulo: RAG agêntico com Qdrant e LangGraph
resumo: API de Retrieval-Augmented Generation em FastAPI que ingere PDFs e TXTs no Qdrant e responde perguntas com um agente LangGraph que decide quando buscar contexto na base.
problema: Em um RAG tradicional toda pergunta dispara uma busca no banco vetorial, mesmo quando a mensagem não depende dos documentos, o que gasta chamadas e tokens sem necessidade.
solucao: Na ingestão, o texto é extraído, dividido em chunks com estratégia configurável, enriquecido com metadados gerados pelo LLM (classificação e descrição) e gravado como embeddings no Qdrant. No chat, um StateGraph do LangGraph dá ao LLM a ferramenta retrieve_documents, e ele decide a cada mensagem se responde direto ou busca os trechos mais relevantes, citando a fonte. As chamadas são rastreadas no Langfuse.
stack: [Python, FastAPI, LangGraph, LangChain, Qdrant, OpenAI, Langfuse, Pydantic, Docker, uv]
repo: https://github.com/Dev-PPrado/rag-production
data: 2026-10
destaque: true
status: em desenvolvimento
fluxo: [PDF/TXT, chunking, embeddings, Qdrant, agente LangGraph]
pipeline:
  titulo: Ingestão de documentos
  etapas:
    - { nome: extract, tech: PyMuPDF, detalhe: texto por página do PDF ou TXT }
    - { nome: chunking, tech: LangChain, detalhe: divisor recursivo ou por caractere }
    - { nome: metadados, tech: OpenAI, detalhe: classificação e descrição da 1ª página }
    - { nome: embeddings, tech: OpenAI, detalhe: text-embedding-3-large (3072 dim.) }
    - { nome: upsert, tech: Qdrant, detalhe: um ponto por chunk na coleção }
schemas:
  - tipo: pydantic
    nome: DocumentMetadataExtraction
    descricao: Saída estruturada do LLM na ingestão, gravada nos metadados de cada vetor (src/models.py).
    campos:
      - { nome: classificacao, tipo: str, regra: até 3 palavras }
      - { nome: descricao, tipo: str, regra: até 2 frases }
---

## Arquitetura

```mermaid
flowchart LR
  DOC[PDF / TXT] --> P[extract + chunking]
  P --> M[metadados via LLM]
  M --> E[embeddings]
  E --> Q[(Qdrant)]
  U[pergunta] --> A[agente LangGraph]
  A -- tool call --> R[retrieve_documents]
  R --> Q
  R --> A
  A --> RESP[resposta com fonte]
```

A API expõe endpoints para criar e remover coleções, ingerir, substituir e remover documentos, e conversar com o agente. Uma interface web simples (`index.html`) permite testar tudo localmente.

Projeto final do módulo de RAG da trilha de Engenharia de IA da Jornada de Dados.

## O que aprendi

[//]: # (Texto provisório e genérico; revisar com o Pedro.)

- Montar um fluxo de ingestão de documentos: extrair texto, dividir em chunks e gerar embeddings.
- Usar um banco vetorial (Qdrant) para guardar e buscar trechos por similaridade.
- Construir um agente com LangGraph e tool calling, deixando o LLM decidir quando buscar contexto.
- Gerar metadados com saída estruturada do LLM validada por Pydantic.
- Acompanhar chamadas, tokens e latência de uma aplicação com LLM usando o Langfuse.
