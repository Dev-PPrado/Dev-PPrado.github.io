# TechTag

Chip de tecnologia em fonte mono com mini-logo; também funciona como filtro (`/projetos/?tec=`).

**Fornece:** `tech` (nome ou slug), `children` para o rótulo exibido, `href` ou `onClick` + `selected` para filtro, `logo={false}` para esconder o logo.

- Use o nome exatamente como no frontmatter do projeto ("Apache Airflow", "Parquet").
- Agrupe em `<ul class="pp-taglist">` com `aria-label="Tecnologias"`.
