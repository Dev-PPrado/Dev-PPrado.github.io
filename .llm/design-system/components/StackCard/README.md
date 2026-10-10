# StackCard

Card de grupo da seção Stack: tile do logo, nome, "★ foco" e StatusBadge abaixo do nome.

**Fornece:** `title` (grupo de `pt.stack.grupos`), `items: [{ tech, name, status, foco? }]` vindos de `src/data/stack.json`.

- Ordene os itens por status: profissional → projetos → estudando → próximo (como o `StackPanel.astro`).
- Coloque a legenda de status (uma fileira de StatusBadge) acima da grade de cards.
- Grade: `sm:grid-cols-2 lg:grid-cols-3`, gap `space-6`.
