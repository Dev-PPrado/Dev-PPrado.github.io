# CodeBlock

Bloco de código com realce de sintaxe Python embutido (sem dependências), barra com nome do arquivo, botão Copiar, números de linha e linhas destacadas.

**Fornece:** `code` (string), `language` (`python` padrão; outros saem sem realce), `filename`, `highlight` (números de linha), `lineNumbers={false}`, `copy={false}`, `caption`, `elevated` (sombra para o Hero).

- Painel sempre escuro (`code-bg`) nos dois temas; cores de sintaxe `code-*` têm ≥4,5:1 sobre ele.
- Decorators (`@dag`, `@task`, `@field_validator`) em `code-decorator` — o amarelo do Python.
- Para páginas de projeto em Astro, o Shiki continua renderizando o Markdown; use este componente em trechos do Hero e de destaques.
