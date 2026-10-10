# Fontes das imagens estáticas

Arquivos em `public/` gerados a partir daqui (não são usados no build):

- `og.html` → `public/og.png` (1200×630, imagem de compartilhamento Open Graph).
- `public/favicon.svg` → `public/favicon.ico` (32×32) e `public/apple-touch-icon.png` (180×180).

Para regenerar, com o Chrome instalado:

```sh
chrome --headless --hide-scrollbars --window-size=1200,630 --screenshot=public/og.png assets-src/og.html
```

O `.ico` e o `apple-touch-icon.png` saem de capturas do `favicon.svg` convertidas com Pillow
(`uv run --no-project --with pillow`).
