import { defineCollection, reference } from 'astro:content';
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
    // Etapas do diagrama mermaid em uma linha, para a faixa de fluxo do card (ex.: [PokeAPI, extract, load]).
    fluxo: z.array(z.string().min(1)).min(2).optional(),
    // PipelineFlow da página do projeto. Sem status de execução: só o que o código faz.
    pipeline: z
      .object({
        titulo: z.string().min(1),
        agenda: z.string().min(1).optional(),
        orquestrador: z.string().min(1).optional(),
        etapas: z
          .array(
            z.object({
              nome: z.string().min(1),
              tech: z.string().min(1).optional(),
              detalhe: z.string().min(1).optional(),
            }),
          )
          .min(2),
      })
      .optional(),
    // SchemaCards da página do projeto, copiados do código do repositório.
    schemas: z
      .array(
        z.object({
          tipo: z.enum(['pydantic', 'table', 'dbt']),
          nome: z.string().min(1),
          motor: z.string().min(1).optional(),
          descricao: z.string().min(1).optional(),
          campos: z
            .array(
              z.object({
                nome: z.string().min(1),
                tipo: z.string().min(1),
                pk: z.boolean().default(false),
                nulo: z.boolean().default(false),
                regra: z.string().min(1).optional(),
              }),
            )
            .min(1),
        }),
      )
      .optional(),
  }),
});

// profissional: usado no trabalho. projetos: usado em repositório pessoal.
// Nunca promover uma tecnologia de categoria sem confirmação do Pedro.
const stack = defineCollection({
  loader: file('src/data/stack.json'),
  schema: z.object({
    nome: z.string().min(1),
    grupo: z.enum(['linguagens', 'ia', 'processamento', 'bancos', 'orquestração', 'infraestrutura', 'cloud', 'industrial']),
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

// Um único arquivo: frontmatter alimenta o Hero, o corpo vira a seção "Sobre".
// Texto coerente com Career Engineering/linkedin/perfil_atual.md.
const perfil = defineCollection({
  loader: glob({ pattern: 'perfil.md', base: './src/content' }),
  schema: z.object({
    nome: z.string().min(1),
    cargo: z.string().min(1),
    chamada: z.string().min(1),
    // Usados no painel pedro.py do Hero.
    background: z.string().min(1),
    principais: z.array(reference('stack')).min(1),
    github: z.url(),
    linkedin: z.url(),
  }),
});

export const collections = { projects, stack, roadmap, perfil };
