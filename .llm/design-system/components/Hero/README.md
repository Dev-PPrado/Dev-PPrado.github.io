# Hero

Abertura da home: eyebrow "Data Engineer", nome em `display`, chamada, botões e stack principal, sobre uma grade de pontos discreta; opcionalmente um painel ao lado (`aside`).

**Fornece:** `eyebrow`, `name`, `tagline` (do `perfil.md`), `links: [{ href, label, tech?, icon? }]` (o primeiro vira `primary`), opcional `stack` (nomes para TechTag), `aside` (ex. um CodeBlock `pedro.py`).

- O link do CV só aparece se `public/cv.pdf` existir (regra do site).
- Em telas < 860px o `aside` desce para baixo do texto.
