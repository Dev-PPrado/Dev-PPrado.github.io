// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dev-pprado.github.io',
  integrations: [sitemap()],
  markdown: {
    // Blocos mermaid saem como texto puro; o Mermaid renderiza no cliente, só nas páginas de projeto.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
