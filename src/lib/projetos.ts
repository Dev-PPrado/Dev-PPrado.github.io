import type { CollectionEntry } from 'astro:content';

type Projeto = CollectionEntry<'projects'>;

// Mais recentes primeiro.
export function ordenarPorData(projetos: Projeto[]): Projeto[] {
  return [...projetos].sort((a, b) => b.data.data.localeCompare(a.data.data));
}

export function urlProjeto(projeto: Projeto): string {
  return `/projetos/${projeto.id}/`;
}

// Chave do filtro: "pandas" e "Pandas" são a mesma tecnologia.
export function chaveTec(tec: string): string {
  return tec.trim().toLocaleLowerCase('pt-BR');
}

// Tecnologias únicas com a contagem de projetos, das mais usadas para as menos usadas.
export function tecnologias(projetos: Projeto[]): { chave: string; nome: string; total: number }[] {
  const mapa = new Map<string, { chave: string; nome: string; total: number }>();
  for (const projeto of projetos) {
    for (const chave of new Set(projeto.data.stack.map(chaveTec))) {
      const nome = projeto.data.stack.find((t) => chaveTec(t) === chave)!;
      const item = mapa.get(chave) ?? { chave, nome, total: 0 };
      item.total += 1;
      mapa.set(chave, item);
    }
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, 'pt-BR'));
}
