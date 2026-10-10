# Terminal

Janela de terminal para mostrar execuções reais: `uv run`, `pytest`, `docker compose up`, logs do pipeline.

**Fornece:** `title`, `lines: [{ type, text, prompt? }]` com `type` = `cmd` (prompt `$` verde) | `out` | `info` | `ok` (✓) | `err` (✗), `caption`.

- Copie a saída de execuções reais; não invente números de linhas processadas.
