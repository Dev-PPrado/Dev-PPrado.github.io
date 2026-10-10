# ThemeToggle

Alterna claro/escuro: aplica a classe `.dark` (como o site faz hoje) e `data-theme` no `<html>`, e grava `localStorage.tema` como `claro`/`escuro`.

**Fornece:** opcional `label` e `onChange(theme)`.

- Mantenha o script inline do `<head>` do Layout para evitar flash de tema.
- Ícone lua no claro, sol no escuro (mesmos paths do `ThemeToggle.astro`).
