# SchemaCard

Card de schema: modelo Pydantic, tabela SQL ou modelo dbt, com campo, tipo e regras de validação.

**Fornece:** `kind` (`pydantic` | `table` | `dbt`), `name`, opcional `engine` (logo, padrão `postgresql`), `layer`, `description`, `fields: [{ name, type, nullable?, pk?, rule? }]`.

- Ícone de chave em `layer-gold` marca a chave primária (com texto para leitor de tela).
- Tipos em `accent-ink` mono; regras em linguagem curta ("gt=0", "UTC").
