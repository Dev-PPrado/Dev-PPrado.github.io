// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dev-pprado.github.io',
  markdown: {
    // Blocos mermaid saem como texto puro; o Mermaid renderiza no cliente, só nas páginas de projeto.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
