# PromptCard

Card de chamada a LLM para projetos de Engenharia de IA: modelo, metadados (tokens, latência) e mensagens system/user/assistant.

**Fornece:** `provider` (slug do logo: `claude`, `anthropic`, `ollama`, `huggingface`, `langchain`), `model`, `meta` (strings curtas), `messages: [{ role, text, code? }]`, `caption`.

- `code: true` mostra a resposta num painel escuro (JSON, SQL).
- Marque exemplos como ilustrativos no `caption`; métricas só de execuções reais.
