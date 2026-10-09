import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Mês no formato AAAA-MM. Datas de estudo e de projeto não precisam de dia.
const mes = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use o formato AAAA-MM');

// Campos espelham o template de Career Engineering/projetos/README.md.
// Arquitetura e "o que aprendi" ficam no corpo do Markdown.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    titulo: z.string().min(1),
    resumo: z.string().min(1),
    problema: z.string().min(1),
    solucao: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    repo: z.url(),
    data: mes,
    destaque: z.boolean(),
    status: z.enum(['em desenvolvimento', 'concluído', 'pausado']),
    imagem: z.string().optional(),
  }),
});

// profissional: usado no trabalho. projetos: usado em repositório pessoal.
// Nunca promover uma tecnologia de categoria sem confirmação do Pedro.
const stack = defineCollection({
  loader: file('src/data/stack.json'),
  schema: z.object({
    nome: z.string().min(1),
    grupo: z.enum(['linguagens', 'processamento', 'bancos', 'orquestração', 'infraestrutura', 'cloud', 'industrial']),
    status: z.enum(['profissional', 'projetos', 'estudando', 'próximo']),
    foco: z.boolean().default(false),
  }),
});

const roadmap = defineCollection({
  loader: file('src/data/roadmap.json'),
  schema: z
    .object({
      titulo: z.string().min(1),
      itens: z.array(z.string().min(1)).default([]),
      status: z.enum(['concluído', 'em andamento', 'planejado']),
      inicio: mes.optional(),
      fim: mes.optional(),
      link: z.url().optional(),
    })
    // Certificados comprovam só a conclusão, então "concluído" exige "fim" e não "inicio".
    .refine((e) => e.status !== 'em andamento' || e.inicio !== undefined, {
      message: 'itens em andamento precisam de "inicio"',
      path: ['inicio'],
    })
    .refine((e) => e.status !== 'concluído' || e.fim !== undefined, {
      message: 'itens concluídos precisam de "fim"',
      path: ['fim'],
    }),
});

export const collections = { projects, stack, roadmap };
