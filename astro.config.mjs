// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dev-pprado.github.io',
  integrations: [sitemap()],
  // CSS embutido no HTML: sem requisição bloqueando a primeira pintura (o CSS gzipado tem ~10 KB).
  build: { inlineStylesheets: 'always' },
  markdown: {
    // Blocos mermaid saem como texto puro; o Mermaid renderiza no cliente, só nas páginas de projeto.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
