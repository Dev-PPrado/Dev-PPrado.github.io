import { z } from 'astro/zod';
import bruto from '../data/github_stats.json';

// Espelha o schema Pydantic de scripts/collect_github.py: um JSON inválido quebra o build.
const schema = z.object({
  coletado_em: z.iso.datetime({ offset: true }),
  usuario: z.string().min(1),
  repositorios: z.number().int().nonnegative(),
  total_commits: z.number().int().nonnegative(),
  commits_por_mes: z.array(
    z.object({
      mes: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
      commits: z.number().int().nonnegative(),
    }),
  ),
  linguagens: z.array(
    z.object({
      nome: z.string().min(1),
      bytes: z.number().int().nonnegative(),
      percentual: z.number().min(0).max(100),
    }),
  ),
});

export type GithubStats = z.infer<typeof schema>;

export const githubStats: GithubStats = schema.parse(bruto);
