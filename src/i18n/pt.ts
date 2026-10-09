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
  sobre: {
    titulo: 'Sobre',
    contato: 'Contato',
    contatoTexto: 'O melhor canal para falar comigo é o LinkedIn.',
  },
  rodape: 'Site estático feito com Astro e Tailwind CSS.',
} as const;

export type UiStrings = typeof pt;
