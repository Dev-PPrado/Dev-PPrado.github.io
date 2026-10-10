# PipelineFlow

Diagrama de etapas de pipeline (ETL ou medallion) com conectores, ferramenta de cada etapa e status.

**Fornece:** `title`, `schedule`, `orchestrator` (slug do logo, ex. `apacheairflow`, `databricks`), `stages: [{ name, tech?, detail?, status?, layer?, active? }]` — `status`: `done` | `running` | `failed` | `planned`; `layer`: `bronze` | `silver` | `gold`.

- Use nas páginas de projeto ao lado do mermaid, ou no card de destaque.
- Camadas sempre com o rótulo escrito; a cor (`layer-*`) é reforço.
- Rola na horizontal no mobile (cada etapa com no mínimo 132px).
