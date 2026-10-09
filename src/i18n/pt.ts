// Textos fixos de interface. Conteúdo (perfil, projetos, stack, roadmap) vem de src/content e src/data.
export const pt = {
  lang: 'pt-BR',
  locale: 'pt-BR',
  siteTitle: 'Pedro Prado | Data Engineer',
  siteDescription: 'Portfólio de Pedro Prado, Data Engineer: projetos de pipelines de dados, stack e trilha de estudos.',
  skipToContent: 'Pular para o conteúdo',
  nav: {
    projetos: 'Projetos',
    stack: 'Stack',
    evolucao: 'Evolução',
    atividade: 'Atividade',
    sobre: 'Sobre',
  },
  theme: {
    toggle: 'Alternar tema claro e escuro',
  },
  hero: {
    cv: 'Currículo (PDF)',
  },
  projetos: {
    titulo: 'Projetos em destaque',
    problema: 'Problema',
    solucao: 'Solução',
    repo: 'Ver repositório',
    detalhes: 'Ver detalhes',
    todos: 'Ver todos os projetos',
    voltar: 'Todos os projetos',
    stack: 'Tecnologias',
    indice: {
      titulo: 'Projetos',
      descricao: 'Todos os projetos publicados no meu GitHub. Filtre por tecnologia.',
      filtro: 'Filtrar por tecnologia',
      todas: 'Todas',
      vazio: 'Nenhum projeto usa essa tecnologia.',
      contagem: (n: number) => (n === 1 ? '1 projeto' : `${n} projetos`),
    },
    status: {
      'em desenvolvimento': 'Em desenvolvimento',
      concluído: 'Concluído',
      pausado: 'Pausado',
    },
  },
  stack: {
    titulo: 'Stack',
    descricao: 'Separado pelo tipo de uso: o que uso no trabalho, o que já apliquei em projetos e o que estou estudando.',
    foco: 'foco',
    grupos: {
      linguagens: 'Linguagens',
      processamento: 'Processamento e transformação',
      bancos: 'Bancos de dados',
      orquestração: 'Orquestração',
      infraestrutura: 'Infraestrutura e APIs',
      cloud: 'Cloud e plataformas',
      industrial: 'Industrial',
    },
    status: {
      profissional: 'Uso profissional',
      projetos: 'Usado em projetos',
      estudando: 'Estudando',
      próximo: 'Próximo',
    },
  },
  evolucao: {
    titulo: 'Evolução',
    descricao: 'Trilha de estudos com as datas de conclusão de cada etapa.',
    certificado: 'Ver certificado',
    semData: 'Sem data definida',
    status: {
      concluído: 'Concluído',
      'em andamento': 'Em andamento',
      planejado: 'Planejado',
    },
  },
  atividade: {
    titulo: 'Atividade no GitHub',
    descricao:
      'Coletado toda semana da API do GitHub por um pipeline em Python (extract, transform e load) que roda no GitHub Actions e publica o site de novo quando os dados mudam.',
    commits: 'Commits nos últimos 12 meses',
    repositorios: 'Repositórios públicos',
    porMes: 'Commits por mês',
    linguagens: 'Linguagens (por volume de código)',
    outras: 'Outras',
    tabela: 'Ver dados em tabela',
    mes: 'Mês',
    atualizado: 'Dados atualizados em',
    codigo: 'Código do pipeline',
    resumoGrafico: (inicio: string, fim: string, total: number, pico: string, picoCommits: number) =>
      `Commits por mês de ${inicio} a ${fim}: ${total} no total, com pico de ${picoCommits} em ${pico}.`,
    tooltip: (mes: string, commits: number) => `${mes}: ${commits} ${commits === 1 ? 'commit' : 'commits'}`,
  },
  sobre: {
    titulo: 'Sobre',
    contato: 'Contato',
    contatoTexto: 'O melhor canal para falar comigo é o LinkedIn.',
  },
  rodape: 'Site estático feito com Astro e Tailwind CSS.',
} as const;

export type UiStrings = typeof pt;
