# ProjectCard

Card de projeto em destaque: data em mono, status, título linkado, resumo, faixa do fluxo do pipeline, Problema/Solução, TechTags e ações.

**Fornece:** `date`, `status`, `title`, `href`, `summary`, opcional `flow` (etapas do diagrama mermaid, ex. `['PokeAPI','extract','transform','schema','load']`), `problem`, `solution`, `stack` (array do frontmatter), `repo`.

- Todo conteúdo vem de `src/content/projects/*.md`; nunca invente métricas.
- O card inteiro sobe 2px no hover (`shadow-lift`); respeita `prefers-reduced-motion`.
- Em grade de 2–3 colunas, `align-items: stretch` para alinhar as ações no rodapé.
