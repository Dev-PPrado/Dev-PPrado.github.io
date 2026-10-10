// Pedro Prado design system — window.Prado (React 18). Types are documentation.
import type { ReactNode } from 'react';

export type TechSlug =
  | 'python' | 'pandas' | 'numpy' | 'polars' | 'jupyter' | 'apacheparquet' | 'pydantic' | 'sqlalchemy'
  | 'fastapi' | 'streamlit' | 'pytest' | 'uv' | 'postgresql' | 'duckdb' | 'apacheairflow' | 'apachespark'
  | 'databricks' | 'mlflow' | 'docker' | 'git' | 'github' | 'githubactions' | 'terraform' | 'claude'
  | 'anthropic' | 'langchain' | 'huggingface' | 'ollama' | 'astro'
  /* monogramas (sem marca no Simple Icons) */
  | 'aws' | 'sqlserver' | 'sql' | 'dbt' | 'plc' | 'opcua' | 'scada' | 'mes' | 'sqlite' | 'requests' | 'pgadmin' | 'apis' | 'cicd' | 'llm';
/** Slug, or a display name such as "Apache Airflow" or "PostgreSQL". */
export type Tech = TechSlug | string;

export type Status =
  | 'profissional' | 'projetos' | 'estudando' | 'próximo'
  | 'concluído' | 'em andamento' | 'planejado' | 'em desenvolvimento' | 'pausado';

export type GlyphName = 'arrowRight' | 'external' | 'copy' | 'check' | 'star' | 'file' | 'database' | 'sparkle' | 'terminal' | 'download' | 'key' | 'moon' | 'sun';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'md' | 'sm';
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Mono logo before the label, e.g. "github". */
  tech?: Tech;
  icon?: GlyphName;
  iconRight?: GlyphName;
  className?: string;
  children: ReactNode;
}
export interface ThemeToggleProps { label?: string; onChange?: (theme: 'light' | 'dark') => void }
export interface StatusBadgeProps { status: Status; children?: ReactNode; className?: string }
export interface TechLogoProps { tech: Tech; size?: number; variant?: 'brand' | 'mono'; decorative?: boolean; title?: string; className?: string }
export interface TechTagProps { tech: Tech; children?: ReactNode; label?: string; href?: string; onClick?: () => void; selected?: boolean; logo?: boolean; logoVariant?: 'brand' | 'mono'; className?: string }
export interface StackItem { tech?: Tech; name: string; status: Status; foco?: boolean }
export interface StackCardProps { title: string; items: StackItem[]; className?: string }
export interface ProjectCardProps {
  date: string; status?: Status; title: string; href?: string; summary?: string;
  /** Pipeline steps shown as "a → b → c". */
  flow?: string[];
  problem?: string; solution?: string; stack?: string[]; repo?: string; className?: string;
}
export interface TimelineItem { period: string; status: Status; title: string; topics?: string[]; link?: string }
export interface TimelineProps { items: TimelineItem[]; className?: string }
export interface StatTileProps { label: string; value: ReactNode; hint?: string; icon?: boolean; tech?: Tech; className?: string }
export interface LanguageBarsProps { title?: string; items: { name: string; percent: number }[]; className?: string }
export interface ActivityChartProps { title?: string; months: { label: string; year?: string; commits: number; full?: string }[]; className?: string }
export interface CodeBlockProps {
  code: string; language?: 'python' | 'py' | 'sql' | string; filename?: string;
  /** 1-based line numbers to highlight. */
  highlight?: number[]; lineNumbers?: boolean; copy?: boolean; caption?: ReactNode; elevated?: boolean; className?: string;
}
export interface TerminalLine { type?: 'cmd' | 'out' | 'info' | 'ok' | 'err'; text: string; prompt?: string }
export interface TerminalProps { title?: string; lines: TerminalLine[]; caption?: ReactNode; className?: string }
export interface PipelineStage { name: string; tech?: Tech; detail?: string; status?: 'done' | 'running' | 'failed' | 'planned'; layer?: 'bronze' | 'silver' | 'gold'; active?: boolean }
export interface PipelineFlowProps { title?: string; schedule?: string; orchestrator?: Tech; stages: PipelineStage[]; className?: string }
export interface SchemaField { name: string; type: string; nullable?: boolean; pk?: boolean; rule?: string }
export interface SchemaCardProps { kind?: 'pydantic' | 'table' | 'dbt'; name: string; engine?: Tech; layer?: 'bronze' | 'silver' | 'gold'; description?: string; fields: SchemaField[]; className?: string }
export interface PromptMessage { role: 'system' | 'user' | 'assistant' | 'tool'; text: string; code?: boolean }
export interface PromptCardProps { provider?: Tech; model?: string; meta?: string[]; messages: PromptMessage[]; caption?: ReactNode; className?: string }
export interface SectionHeaderProps { title: string; eyebrow?: string; index?: string; description?: string; action?: ReactNode; level?: 'h1' | 'h2'; id?: string; className?: string }
export interface SiteHeaderProps { name?: string; links: { href: string; label: string }[]; current?: string; homeHref?: string; themeToggle?: boolean; className?: string }
export interface HeroProps { eyebrow?: string; name: string; tagline?: string; links?: { href: string; label: string; tech?: Tech; icon?: GlyphName }[]; stack?: string[]; aside?: ReactNode; className?: string }

export declare function Button(p: ButtonProps): JSX.Element;
export declare function ThemeToggle(p: ThemeToggleProps): JSX.Element;
export declare function StatusBadge(p: StatusBadgeProps): JSX.Element;
export declare function TechLogo(p: TechLogoProps): JSX.Element;
export declare function TechTag(p: TechTagProps): JSX.Element;
export declare function StackCard(p: StackCardProps): JSX.Element;
export declare function ProjectCard(p: ProjectCardProps): JSX.Element;
export declare function Timeline(p: TimelineProps): JSX.Element;
export declare function StatTile(p: StatTileProps): JSX.Element;
export declare function LanguageBars(p: LanguageBarsProps): JSX.Element;
export declare function ActivityChart(p: ActivityChartProps): JSX.Element;
export declare function CodeBlock(p: CodeBlockProps): JSX.Element;
export declare function Terminal(p: TerminalProps): JSX.Element;
export declare function PipelineFlow(p: PipelineFlowProps): JSX.Element;
export declare function SchemaCard(p: SchemaCardProps): JSX.Element;
export declare function PromptCard(p: PromptCardProps): JSX.Element;
export declare function SectionHeader(p: SectionHeaderProps): JSX.Element;
export declare function SiteHeader(p: SiteHeaderProps): JSX.Element;
export declare function Hero(p: HeroProps): JSX.Element;
