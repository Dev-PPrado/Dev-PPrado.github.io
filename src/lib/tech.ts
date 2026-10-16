// Logos de tecnologia do design system (.llm/design-system): Simple Icons (CC0) e monogramas.
// tech-icons.json foi extraído de components/bundle.js e traz path, cor da marca e as marcações
// lowLight/lowDark (cor some no tema claro/escuro → usar ink-strong).
import icones from './tech-icons.json';

export interface Icone {
  title: string;
  hex: string;
  path: string;
  lowLight?: boolean;
  lowDark?: boolean;
}

const ICONS = icones as Record<string, Icone>;

// Techs sem marca no Simple Icons: monograma tipográfico, nunca um logo desenhado.
const MONOGRAMS: Record<string, { title: string; mono: string }> = {
  aws: { title: 'AWS', mono: 'AWS' },
  sqlserver: { title: 'SQL Server', mono: 'SQL' },
  sql: { title: 'SQL', mono: 'SQL' },
  dbt: { title: 'dbt', mono: 'dbt' },
  plc: { title: 'PLC Rockwell', mono: 'PLC' },
  opcua: { title: 'OPC UA', mono: 'OPC' },
  scada: { title: 'SCADA', mono: 'SCD' },
  mes: { title: 'MES', mono: 'MES' },
  sqlite: { title: 'SQLite', mono: 'lite' },
  requests: { title: 'Requests', mono: 'req' },
  pgadmin: { title: 'pgAdmin', mono: 'pgA' },
  apis: { title: 'APIs', mono: 'API' },
  cicd: { title: 'CI/CD', mono: 'CI' },
  llm: { title: 'LLM', mono: 'LLM' },
  langgraph: { title: 'LangGraph', mono: 'LG' },
  qdrant: { title: 'Qdrant', mono: 'Qd' },
  openai: { title: 'OpenAI', mono: 'OAI' },
  langfuse: { title: 'Langfuse', mono: 'LF' },
};

// Nomes usados no site (frontmatter, stack.json, roadmap.json) → slug.
const ALIASES: Record<string, string> = {
  python: 'python', pandas: 'pandas', numpy: 'numpy', polars: 'polars', jupyter: 'jupyter',
  'jupyter notebook': 'jupyter', parquet: 'apacheparquet', 'apache parquet': 'apacheparquet',
  pydantic: 'pydantic', sqlalchemy: 'sqlalchemy', fastapi: 'fastapi', streamlit: 'streamlit',
  pytest: 'pytest', uv: 'uv', postgresql: 'postgresql', postgres: 'postgresql', duckdb: 'duckdb',
  airflow: 'apacheairflow', 'apache airflow': 'apacheairflow', spark: 'apachespark',
  pyspark: 'apachespark', 'apache spark': 'apachespark', 'apache spark / pyspark': 'apachespark',
  databricks: 'databricks', mlflow: 'mlflow', docker: 'docker', dockerfile: 'docker', git: 'git',
  github: 'github', 'git / github': 'github', 'github actions': 'githubactions', terraform: 'terraform',
  claude: 'claude', 'claude code': 'claude', anthropic: 'anthropic', langchain: 'langchain',
  'hugging face': 'huggingface', huggingface: 'huggingface', ollama: 'ollama', astro: 'astro',
  aws: 'aws', sql: 'sql', 'sql (sql server)': 'sqlserver', 'sql server': 'sqlserver', dbt: 'dbt',
  mes: 'mes', scada: 'scada', 'opc / opc ua / kepware': 'opcua', 'opc ua': 'opcua',
  'plc rockwell (controllogix, studio 5000)': 'plc', 'plc rockwell': 'plc', sqlite: 'sqlite',
  requests: 'requests', pgadmin: 'pgadmin', 'apis / web services': 'apis', apis: 'apis',
  'ci/cd': 'cicd', llm: 'llm', langgraph: 'langgraph', qdrant: 'qdrant', openai: 'openai',
  'openai api': 'openai', langfuse: 'langfuse',
};

export type Tech =
  | { slug: string; title: string; icone: Icone; mono?: undefined }
  | { slug: string; title: string; mono: string; icone?: undefined };

export function resolveTech(tech: string | undefined): Tech | null {
  if (!tech) return null;
  const k = tech.toLowerCase().trim();
  const slug = ICONS[k] || MONOGRAMS[k] ? k : ALIASES[k];
  if (!slug) return null;
  if (ICONS[slug]) return { slug, title: ICONS[slug].title, icone: ICONS[slug] };
  if (MONOGRAMS[slug]) return { slug, title: MONOGRAMS[slug].title, mono: MONOGRAMS[slug].mono };
  return null;
}
