Sistema visual do portfólio de Pedro Prado, Data Engineer (dev-pprado.github.io): um engenheiro de automação industrial que constrói pipelines de dados em Python. O tom é técnico, sóbrio e honesto — mostra o trabalho, não promete. A identidade vem do site atual (slate + sky-700, tema claro e escuro); este sistema moderniza os componentes e acrescenta o vocabulário de Python, engenharia de dados e IA.

## Conteúdo e voz

- Escreva em português do Brasil, frases curtas, primeira pessoa no "Sobre" ("Construo pipelines com Python, SQL, Airflow e Docker."), impessoal no resto.
- Títulos em caixa de frase: "Projetos em destaque", "Atividade no GitHub". Caixa alta só no eyebrow (`label`) e nos rótulos técnicos (`mono-label`: BRONZE, PYTHON).
- Nomes de tecnologia exatamente como a marca escreve: "Apache Airflow", "PostgreSQL", "pandas", "dbt", "uv".
- Termos técnicos ficam em inglês quando é assim que a área fala: extract, transform, load, DAG, schema.
- **Honestidade é regra de design.** `profissional` só para o que é usado no trabalho (SQL Server, PLC Rockwell, MES, OPC); o resto é `projetos`, `estudando` ou `próximo`. Nada de métricas inventadas: StatTile e Terminal mostram números de execuções reais. Exemplos ilustrativos dizem que são ilustrativos no `caption`.
- Sem emoji. Símbolos tipográficos permitidos: → (fluxo), ★ (foco), · (separador), ✓ ✗ (Terminal).

## Cor

- Neutros slate do Tailwind v4, acento sky. Fundo `surface`, cards `surface-raised` com hairline `border`, faixas e cabeçalhos de card em `surface-muted`.
- Texto: títulos `ink-strong`, corpo `ink`, descrições `ink-muted`, datas e eixos `ink-subtle`. Cada par está anotado no token com o fundo em que passa 4,5:1 nos dois temas.
- Acento: `accent` (sky-700) só em preenchimentos com `on-accent` (branco) — botão primário, tag selecionada, a marca. Links e eyebrow em `accent-ink` (sky-700 no claro, sky-300 no escuro). Nunca use sky-600 com texto branco: falha 4,5:1.
- Status: `success-*` (emerald), `info-*` (sky), `warn-*` (amber), neutro `chip`. Sempre ponto + palavra.
- Dados: `chart` (sky-600) para colunas e barras; camadas medallion `layer-bronze`, `layer-silver`, `layer-gold`, sempre com o nome escrito.
- Código: painel escuro nos dois temas (`code-bg`, `code-bar`, `code-line`) com sintaxe `code-keyword` (sky), `code-string` (emerald), `code-function` (amber), `code-decorator` (amarelo Python), `code-type` (cyan), `code-builtin` (rose), `code-number` (orange), comentários `code-muted` em itálico.
- Foco: anel sólido de 2px `focus-ring` (sky-600), offset 2px, ≥3:1 nos dois temas.
- Os pontos `warn-dot` (amber-500) e `neutral-dot` (slate-400) vêm do site e ficam abaixo de 3:1 no claro: eles são sempre acompanhados da palavra do status.

## Tipografia

- `sans` = IBM Plex Sans (variável 100–700): herança de engenharia, legível em português. `mono` = JetBrains Mono (variável) para código, dados, datas, tags e números.
- Títulos: `display` (nome no Hero), `h1`, `h2` (seções), `h3` (cards), todos com tracking −0.025em exceto `h3`.
- Texto: `body-lg` na chamada do Hero, `body` corrido, `small` em cards e botões, `label` no eyebrow, `caption` em badges.
- Dados: `stat` para números (algarismos tabulares), `code` em blocos, `mono-sm` para datas/metadados/TechTag, `mono-label` para rótulos técnicos em caixa alta.
- O mono é o sinal visual de "dado": use-o para tudo que é valor, identificador ou nome de etapa; nunca para parágrafos.

## Espaço, forma e profundidade

- Escala de 4px do Tailwind: `space-1` a `space-24`; conteúdo em `content-max` (1024px) com gutter `space-4`; seções com `space-12` vertical; Hero começa em `space-24` (`space-16` no mobile).
- Raios: `radius-sm` tags, `radius-md` botões, `radius-lg` StackCard, painéis de código e nós de pipeline, `radius-xl` cards de destaque, `radius-full` badges.
- Bordas antes de sombras: todo card tem hairline `border` e `shadow-card` quase invisível. Só o hover de card interativo usa `shadow-lift` + `border-strong` + translateY(−2px); o painel de código do Hero usa `shadow-code`.
- Textura: uma única grade de pontos (`border`, passo 24px) no fundo do Hero, esmaecendo para baixo. Sem gradientes coloridos, sem glow.

## Movimento

- Transições de 150–200ms em cor, borda, sombra e transform. A seta de "Ver detalhes" desliza 3px no hover.
- Respeite `prefers-reduced-motion`: sem deslocamento de card e sem rolagem suave.

## Iconografia e logos

- Logos de tecnologia: Simple Icons (CC0), via `TechLogo` — `brand` na cor oficial (com troca automática para `ink-strong` onde a cor some no tema) ou `mono` em `currentColor`. Os SVGs coloridos estão no grupo de assets Stack.
- AWS, SQL Server e dbt não têm marca no Simple Icons, e PLC Rockwell, OPC UA, SCADA e MES não são logos: aparecem como monogramas tipográficos. Não desenhe nem aproxime logos oficiais.
- Glifos de interface: traço 2px, 24px, cantos arredondados (seta, externo, copiar, check, estrela, arquivo, terminal, download, chave, lua, sol), via `Prado.Glyph`.
- Marca pessoal: o favicon (três barras crescentes brancas em sky-700, `pp-mark.svg`) — um gráfico de colunas, ponte entre automação e dados. Não há wordmark: o nome é escrito em `sans` 600.

## Componentes

- Ações: Button, ThemeToggle. Status: StatusBadge. Stack: TechLogo, TechTag, StackCard.
- Conteúdo: ProjectCard, Timeline. Dados: StatTile, LanguageBars, ActivityChart.
- Código (Python): CodeBlock com realce de sintaxe embutido, Terminal.
- Engenharia de dados: PipelineFlow (ETL e medallion), SchemaCard (Pydantic, tabela, dbt). IA: PromptCard.
- Layout: SectionHeader, SiteHeader, Hero.

## Usando no site (Astro + Tailwind v4)

- Os componentes vivem em `components/bundle.js` como `window.Prado` (React 18) e servem de referência viva; no site Astro, reproduza a mesma marcação e as classes `pp-*` de `components/bundle.css` em componentes `.astro`, que continuam estáticos.
- Os tokens viram variáveis CSS em `tokens.css` sob `[data-theme="dark"]`. O site usa a classe `.dark`: aplique as duas no toggle (o ThemeToggle já faz isso) ou mapeie os tokens dentro de `@theme` do Tailwind.
- Carregue IBM Plex Sans e JetBrains Mono dos arquivos em `fonts/` (ou do Google Fonts) com `font-display: swap`.
