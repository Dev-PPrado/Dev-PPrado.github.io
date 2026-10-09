// Textos fixos de interface. Conteúdo (projetos, stack, roadmap) vem de src/content e src/data.
export const pt = {
  lang: 'pt-BR',
  siteTitle: 'Pedro Prado | Data Engineer',
  siteDescription: 'Portfólio de Pedro Prado, Data Engineer.',
  role: 'Data Engineer',
} as const;

export type UiStrings = typeof pt;
