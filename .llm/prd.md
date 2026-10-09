1. Decisões técnicas
Framework: Astro. Gera um site estático rápido, e cada projeto vira um arquivo Markdown. Para adicionar um projeto novo, você cria um .md e faz commit, sem mexer em layout.
Estilo: Tailwind CSS.
Idioma: conteúdo só em português. Os textos fixos de interface ficam em src/i18n/pt.ts, para permitir adicionar inglês depois sem refazer componentes.
Hospedagem: GitHub Pages com deploy por GitHub Actions, em um repositório próprio chamado Dev-PPrado.github.io. Com esse nome, o site fica na raiz de dev-pprado.github.io e o Astro não precisa de `base`. O projeto sai da pasta "Estudos - Data Engineer": o .gitignore de lá ignora `/site`, e no Windows isso pega a pasta Site inteira.
Diferencial de Data Engineer: um job semanal no GitHub Actions coleta dados dos seus repositórios pela API do GitHub, salva em JSON e o site mostra a atividade (commits por mês, linguagens). O próprio portfólio vira um pequeno pipeline de dados, e você pode citar isso numa entrevista. Para isso ser defensável, o pipeline segue os mesmos critérios de maturidade usados nos outros projetos: extract e transform separados, schema validado, teste, idempotência, logging e tratamento de falha.
Posicionamento: título "Data Engineer", coerente com LinkedIn e currículo (ver Career Engineering/CLAUDE.md). A narrativa é automação industrial → dados. IA aparece na linha do tempo como próximo passo, não no título.
Regra de honestidade: o site nunca apresenta como experiência profissional algo que foi só estudado ou usado em projeto pessoal. Vale principalmente para Cloud (AWS/Databricks), Airflow e Spark.

2. Estrutura do repositório
Dev-PPrado.github.io/
├── CLAUDE.md                    # contexto e regras para o Claude Code
├── astro.config.mjs
├── src/
│   ├── content/projects/        # um .md por projeto
│   ├── data/stack.json          # tecnologias + status
│   ├── data/roadmap.json        # trilha de estudos com datas
│   ├── data/github_stats.json   # gerado pelo pipeline, não editar à mão
│   ├── i18n/pt.ts               # textos fixos de UI
│   ├── components/              # Hero, StackPanel, ProjectCard, Timeline, ActivityChart
│   └── pages/                   # index, projetos/index, projetos/[slug]
├── public/                      # favicon, cv.pdf, imagens
├── scripts/collect_github.py    # coleta da API do GitHub (script uv, dependências inline PEP 723)
├── tests/test_collect_github.py # pytest da transformação
└── .github/workflows/           # deploy.yml + collect.yml

O scaffold de pacote Python criado pelo uv (src/site/, [project.scripts], [build-system]) é removido, porque colide com o src/ do Astro. O Python existe só em scripts/ e tests/.

3. Seções do site (ordem pensada no recrutador)
Hero: nome, "Data Engineer", a narrativa automação industrial → dados, links para GitHub, LinkedIn e CV.
Projetos em destaque: 3 a 4 cards com problema, solução, stack, status e link. Filtro por tecnologia. Cada card abre uma página com detalhes e arquitetura.
Stack: tecnologias agrupadas com status visual (profissional / projetos / estudando / próximo). Databricks e AWS ficam marcados como foco, com status estudando ou próximo.
Evolução: linha do tempo dos estudos com datas reais. Sem barra de progresso geral, porque um percentual global é arbitrário e marcos datados (incluindo migrações de projeto) mostram evolução melhor.
Atividade no GitHub: gráfico gerado pelo pipeline.
Sobre e contato.

4. Fases de execução no Claude Code

Faça uma fase por sessão, revise e faça commit antes de seguir. Use o modo de planejamento (Shift+Tab) nas fases maiores para o Claude mostrar o plano antes de editar arquivos.

Fase 0: Setup

Mova o projeto para uma pasta fora de "Estudos - Data Engineer", rode git init e crie o repositório Dev-PPrado.github.io no GitHub. Remova o scaffold de pacote do uv. Crie um projeto Astro com Tailwind e TypeScript. Crie o deploy.yml com o action oficial do Astro para GitHub Pages, aceitando push na main, workflow_dispatch e workflow_call. Em Settings > Pages, configure a source como "GitHub Actions". Atualize o CLAUDE.md.

Pronto quando: npm run dev funciona e o primeiro deploy está no ar em dev-pprado.github.io.

Fase 1: Dados e conteúdo

Crie as content collections, todas validadas por Zod em src/content.config.ts:
- projects (glob em src/content/projects): título, resumo, problema, solução, stack (lista), repo (URL), data, destaque (boolean), status (em desenvolvimento | concluído | pausado), imagem (opcional). Arquitetura e "o que aprendi" ficam no corpo do Markdown.
- stack (file loader em src/data/stack.json): nome, grupo (linguagens, banco, orquestração, cloud...), status (profissional | projetos | estudando | próximo), foco (boolean).
- roadmap (file loader em src/data/roadmap.json): título, início, fim (opcional), status (concluído | em andamento | planejado), link (opcional).

Os campos de projeto espelham o template de Career Engineering/projetos/README.md. Candidatos reais: pipeline_weather (Airflow + PostgreSQL + Docker), ETL, Northwind-SQL-Analytics, WorldCup e CRUD. Cada um só vira destaque depois de avaliado por esse template.

Pronto quando: o build falha se um projeto tiver campo faltando ou se stack.json/roadmap.json tiver um item inválido.

Fase 2: Layout e componentes

Crie os componentes Hero, StackPanel, ProjectCard e Timeline lendo das collections. Mobile-first, tema claro e escuro, acessível. Textos fixos vêm de src/i18n/pt.ts.

Pronto quando: a home renderiza tudo a partir dos JSON e dos .md, sem texto de conteúdo hardcoded nos componentes.

Fase 3: Páginas de projeto

Crie a rota projetos/[slug] com página de detalhe, diagrama de arquitetura (Mermaid, carregado só nas páginas de projeto e de forma lazy, para não pesar na home) e seção "o que aprendi". Crie projetos/index com filtro por tecnologia.

Pronto quando: cada .md gera uma página e o filtro funciona.

Fase 4: Pipeline do GitHub

Crie scripts/collect_github.py, que consulta a API do GitHub para Dev-PPrado:
- Extract: lista os repositórios públicos, busca commits por semana via /repos/{repo}/stats/commit_activity (1 chamada por repo; resposta 202 significa estatística em cálculo, então refazer com retry) e linguagens via /repos/{repo}/languages. Autenticação com GITHUB_TOKEN.
- Transform: agrega commits por mês e linguagens por bytes. É uma função pura, testada com pytest em tests/test_collect_github.py.
- Load: valida o schema e grava src/data/github_stats.json com data de coleta. Se a coleta falhar, o arquivo anterior é mantido. Usar logging em vez de print.

Crie o collect.yml: roda toda segunda-feira (e por workflow_dispatch), executa o script com uv, faz commit do JSON só se ele mudou e então chama o deploy.yml como job seguinte (workflow_call). Isso é necessário porque um commit feito com GITHUB_TOKEN não dispara outros workflows.

Adicione na home um gráfico desse JSON, gerado como SVG no build por um componente Astro, sem biblioteca JavaScript.

Pronto quando: rodar o collect.yml manualmente atualiza o JSON no repositório e o site publicado mostra os dados novos.

Fase 5: Acabamento

Adicione SEO (meta tags, Open Graph, sitemap), favicon e CV em PDF para download (gerado a partir de Career Engineering/curriculo/curriculo_pt.md, para contar a mesma história). Rode o Lighthouse e corrija o que estiver abaixo de 90.

Pronto quando: Lighthouse ≥ 90 nas quatro categorias, na home e em uma página de projeto.

5. O que você precisa preparar (fora do código)
Projetos reais: para cada um, um README no GitHub com problema, arquitetura, como rodar e prints. Recrutador abre o repositório, então ele pesa tanto quanto o site.
Datas reais de conclusão de cada estudo, para a linha do tempo mostrar ritmo.
Link do LinkedIn, foto e CV em PDF.
Se faltar projeto, os que mais conversam com seu perfil são dados industriais: pipeline de logs de MES com Airflow + dbt e cálculo de OEE. Mais tarde, um RAG sobre manuais técnicos quando chegar em Engenharia de IA. Quando entrar em Databricks e AWS, migre um desses para lá e registre a migração no site. Isso mostra evolução melhor do que qualquer barra de progresso.
