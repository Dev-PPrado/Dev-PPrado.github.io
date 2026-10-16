# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio for Pedro Prado, positioned as **Data & AI Engineer** (hybrid: data engineering plus the AI Engineering track he is following now; AI work is study and personal projects, never professional experience). It is deployed to GitHub Pages at `dev-pprado.github.io` from the repo `Dev-PPrado.github.io`. The source of truth for scope, section order, schemas, and the phased plan is `.llm/prd.md`. Read it before starting any phase. Site content is in Brazilian Portuguese only. Fixed UI strings live in `src/i18n/pt.ts`, so English can be added later without touching components.

Phases 0 to 5 are done (Fase 4 verified on 2026-10-09: a manual `collect.yml` run committed new stats and redeployed the site). Fase 5 (SEO, Lighthouse) is done: Lighthouse scored 100 in all four categories locally (home, `/projetos/`, a project page, light and dark) and on the live site (home and a project page, 2026-10-09). The PRD has no phase after it. Project cards link to `/projetos/<id>/` and to the repo. `roadmap.json` is filled from the certificates. The "O que aprendi" sections hold a provisional, generic text (marked with a `[//]: # (...)` Markdown comment, which is not rendered) until Pedro writes his own.

## Content and honesty rules

- All content comes from `src/content/` and `src/data/`. Components never hardcode content. Adding a project means adding one `.md` file and committing it.
- The site must stay consistent with `../../Estudos - Data Engineer/Career Engineering/CLAUDE.md`:
  - Never present studied or personal-project technology as professional experience. This applies especially to Cloud (AWS, Databricks), Airflow, and Spark.
  - Never invent metrics or results.
  - If information is missing, leave a TODO and ask.
- Stack status values: `profissional` | `projetos` | `estudando` | `próximo`. Databricks and AWS are flagged `foco`, but they are never `profissional` or `projetos` unless Pedro confirms.
- Project fields mirror the template in `Career Engineering/projetos/README.md`.

## Architecture

- **Stack:** Astro 7 (static output), Tailwind CSS v4 (via `@tailwindcss/vite`, imported in `src/styles/global.css`), TypeScript strict.
- **Layout:** `src/layouts/Layout.astro` is the base for every page. It sets `lang`, the meta tags, the font preload, the global CSS, the skip link, and the design-system SiteHeader (three-bar mark, section nav with `aria-current` on `/projetos`, ThemeToggle). The site name comes from `perfil.md`.
- **SEO:** the Layout emits the canonical URL (from `site` in `astro.config.mjs`), Open Graph and Twitter tags with `public/og.png`, and `theme-color`. Pages pass `title`, `description`, and `tipo` (`article` on project pages). `@astrojs/sitemap` writes `sitemap-index.xml`, and `public/robots.txt` points to it.
- **Static images:** `public/og.png`, `public/favicon.ico`, and `public/apple-touch-icon.png` are generated from `assets-src/og.html` and `public/favicon.svg`. See `assets-src/README.md` to regenerate them.
- **Design system:** the source is `.llm/design-system/` (brand book in `README.md`, `tokens.json`/`tokens.css`, `components/bundle.css`, and `components/bundle.js`, a React reference used only as a spec for markup and behavior). The site stays static Astro with no React.
- **Styles (`src/styles/`):**
  - `tokens.css`: all design tokens as CSS variables. Light values on `:root`, dark values on `.dark` and `[data-theme="dark"]`. It also holds the `@font-face` rules: IBM Plex Sans and JetBrains Mono as Latin-subset WOFF2 in `public/fonts/` (made from the design-system `.woff` with `pyftsubset`, variable weight kept), plus metric-matched local fallbacks (`size-adjust` and overrides computed with fontTools against Arial and Consolas) so the `font-display: swap` causes no layout shift. Only Plex is preloaded. It is unlayered on purpose: `--font-sans`, `--font-mono`, and `--radius-*` share names with Tailwind's theme and override its defaults.
  - `components.css`: the `pp-*` component classes copied from `bundle.css`; every value is a `var(--token)`. Local changes are marked `site:`. It is imported into `layer(components)`, so Tailwind utilities (`mt-*`, `gap-*`) can adjust a `pp-*` element.
  - `global.css`: imports Tailwind, typography, tokens, and components; maps the color tokens with `@theme inline` (`bg-surface-raised`, `text-ink-muted`, `border-border`, `text-accent-ink`...); maps `.prose` colors to tokens, so no `prose-invert` is needed.
  - Never hardcode a color: use a token utility or a `pp-*` class. White text only on `accent` (sky-700); `sky-600` with white fails 4.5:1. Links and eyebrows use `accent-ink`.
  - `astro.config.mjs` sets `build.inlineStylesheets: 'always'`, so the CSS ships inside the HTML and no request blocks the first paint.
- **Theme:** dark mode is class-based (`@custom-variant dark` in `global.css`). An inline script in the layout's `<head>` sets `.dark` and `data-theme` from `localStorage.tema`, falling back to the system preference. `ThemeToggle.astro` flips both.
- **Components (`src/components/`), Astro ports of the design system:** `Glyph` (UI icons from `src/lib/glyphs.ts`), `TechLogo` (inline Simple Icons SVG from `src/lib/tech-icons.json`, extracted from `bundle.js`; `brand` switches to `ink-strong` where the brand color disappears via `lowLight`/`lowDark`; AWS, SQL Server, dbt, PLC, OPC, SCADA, MES, SQLite... render as monograms; name→slug aliases live in `src/lib/tech.ts`), `TechTag` (span, link, or filter button with `aria-pressed`), `Button`, `StatusBadge` (dot + word, labels from `pt.ts`), `Section` (SectionHeader with eyebrow and `01`-style index, optional `acao` slot), `Hero`, `ProjectCard`, `StackPanel` (StackCards), `Timeline`, `StatTile`, `LanguageBars`, `ActivityChart`, `CodeBlock` (Python highlighting at build time by `src/lib/highlight.ts`, a TypeScript port of `tokenizePython`; no copy button, since that would need client JS), `PipelineFlow`, and `SchemaCard`.
- **Hero `pedro.py` panel:** generated in `Hero.astro` from `perfil.md` (`nome`, `cargo`, `background`, and `principais`, which are `stack.json` ids validated with `reference('stack')`) and `stack.json` (`next` = items with `foco` or status `estudando`/`próximo`).
- **Home (`src/pages/index.astro`):** composes `Hero`, then `Section`-wrapped (eyebrow + index 01–05) `ProjectCard` (only `destaque: true`), `StackPanel`, `Timeline`, `ActivityChart`, and "Sobre". `StatusBadge` holds the status tones shared by stack, roadmap, and projects. Dates go through `formatMes` in `src/lib/format.ts`.
- **Project pages:** `src/pages/projetos/[slug].astro` renders one page per `.md` (slug = entry `id`). `src/pages/projetos/index.astro` lists all projects with a client-side technology filter (synced to `?tec=`; hidden without JS, so every project still shows). Shared helpers (sorting, URLs, tech keys) are in `src/lib/projetos.ts`. Tech keys are case-insensitive. The Markdown body is styled with `@tailwindcss/typography` (`prose`).
- **Mermaid:** `astro.config.mjs` excludes `mermaid` from Shiki, so blocks render as `<pre><code class="language-mermaid">`. `src/scripts/mermaid.ts` is imported only by `[slug].astro`, uses an IntersectionObserver to `import('mermaid')` on demand, and re-renders on theme change.
- **CV link:** the Hero shows it only when `public/cv.pdf` exists at build time. `public/cv.pdf` is the public version without the phone number, generated from `../certificados/CV.html?publico` (print to PDF with Edge or Chrome headless; without `?publico` it prints the full version with phone). The CV text is mirrored in `Career Engineering/curriculo/curriculo_pt.md`.
- **Collections:** all defined with Zod (`astro/zod`, Zod 4) in `src/content.config.ts`. A missing or invalid field fails `npm run build`.
  - `projects`: a glob over `src/content/projects/*.md`. Frontmatter keys are in Portuguese (`titulo`, `resumo`, `problema`, `solucao`, `stack`, `repo`, `data`, `destaque`, `status`, `imagem?`). Optional, for the design-system components: `fluxo` (the mermaid diagram's steps in one line, shown in the ProjectCard), `pipeline` (`titulo`, `agenda?`, `orquestrador?`, `etapas[{nome, tech?, detalhe?}]` for PipelineFlow; no run status, since the site only shows what the code does), and `schemas` (`tipo` pydantic/table/dbt, `nome`, `motor?`, `descricao?`, `campos[{nome, tipo, pk?, nulo?, regra?}]` for SchemaCard). Fill `pipeline` and `schemas` only from the repository's code.
  - `perfil`: the single file `src/content/perfil.md`. Its frontmatter feeds the Hero, and its body is the "Sobre" section. Keep it consistent with `Career Engineering/linkedin/perfil_atual.md`.
  - `stack` and `roadmap`: `file()` loaders over `src/data/stack.json` and `src/data/roadmap.json`. Each array item needs a unique `id`.
  - Dates are months in `AAAA-MM` format. Roadmap items need `fim` when `concluído` (certificates prove only the completion date) and `inicio` when `em andamento`. Certificate PDFs live outside the repo in `../certificados/`.
- **`src/data/github_stats.json`:** generated by `scripts/collect_github.py`. Never edit it by hand. `src/lib/github-stats.ts` re-validates it with Zod (mirroring the Pydantic schema), so a bad file fails the build. `ActivityChart.astro` renders it: a build-time SVG column chart (native `<title>` tooltips, a table view in `<details>`) plus HTML bars for languages. The chart color is the `chart` token (sky-600) in both themes.
- **GitHub stats pipeline:** extract, then transform, then load.
  - Extract lists public non-fork repos, then calls `/stats/commit_activity` for every repo first (which starts the computation on all of them) and retries only the `202` ones with capped backoff (`204` = empty repo). Repos still at `202` after ~2 min (common right after a push) are counted from `/commits` in the same weekly shape, using the author date in UTC, so a commit near midnight can land on the next day. Languages come from `/languages`.
  - The transform is a pure function covered by `tests/test_collect_github.py`. Commits are attributed per day (from `days`), so weeks that cross a month boundary split correctly. The first month is dropped when the 52-week window does not start on day 1.
  - Load validates with Pydantic and writes atomically (temp file + replace). It skips the write when nothing but `coletado_em` changed, so `coletado_em` means "last time the data changed" and reruns are idempotent.
  - If any step fails, the script exits 1 and the previous JSON is kept.
  - Dependencies (`httpx`, `pydantic`) live in `pyproject.toml`, not inline PEP 723, so the tests and the script share one environment.
  - Locally: `GITHUB_TOKEN=$(gh auth token) uv run scripts/collect_github.py`.
- **Python:** a `uv` project with `package = false`, used only for `scripts/` and `tests/`. There is no Python package.
- **Workflows:**
  - `.github/workflows/deploy.yml` (`withastro/action`, then `deploy-pages`) runs on `push` to `main`, `workflow_dispatch`, and `workflow_call`. It checks out `ref: main`, so a caller that just committed gets the new commit.
  - `collect.yml` runs Mondays 09:00 UTC and on `workflow_dispatch`: pytest, then the script, then commits the JSON only if `git diff` shows a change, and in that case **calls `deploy.yml` as a job**. A push made with `GITHUB_TOKEN` does not trigger other workflows.
- **Performance:** the activity chart is SVG rendered at build time, with no JS chart library. Mermaid loads lazily, and only on `projetos/[slug]` pages. The target is Lighthouse ≥ 90.

## Workflow

Work one PRD phase per session, and stop for review and a commit before the next phase. Each phase has a "Pronto quando" (done-when) criterion in `.llm/prd.md`. Verify it before declaring the phase done.

## Commands

- `npm run dev`: dev server. From an agent, prefer `npx astro dev --background`, and manage it with `npx astro dev stop`, `status`, and `logs`.
- `npm run build`: production build. It also validates the content schemas.
- `npm run preview`: serves `dist/`.
- `npm run check`: runs `astro check` (TypeScript and Astro diagnostics).
- `uv run scripts/collect_github.py`: runs the GitHub stats collection (needs `GITHUB_TOKEN`).
- `uv run pytest tests/`: runs the Python tests. Use `uv run pytest tests/test_collect_github.py::<test_name>` for a single test.

Astro docs: https://docs.astro.build (content collections: `/en/guides/content-collections/`).
