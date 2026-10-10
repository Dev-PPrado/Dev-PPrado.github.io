# StatusBadge

Pílula de status com ponto + palavra: a cor nunca carrega o significado sozinha.

**Fornece:** `status` — stack: `profissional` | `projetos` | `estudando` | `próximo`; roadmap: `concluído` | `em andamento` | `planejado`; projeto: `em desenvolvimento` | `pausado`. `children` sobrescreve o rótulo padrão.

- Regra de honestidade do portfólio: `profissional` só para o que é usado no trabalho (SQL Server, PLC, MES, OPC). Databricks e AWS ficam em `estudando`/`próximo` até haver uso real.
- Tons: success = emerald, info = sky, warn = amber, neutral = slate — os mesmos do `StatusBadge.astro`.
