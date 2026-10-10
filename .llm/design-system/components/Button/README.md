# Button

Botão e link de ação: `primary` (sky-700) no máximo uma vez por bloco, para a ação principal (GitHub no Hero); `secondary` para as demais; `ghost` para ações de rodapé de card; `link` para "Ver detalhes →".

**Fornece:** `children` (rótulo), `href` (vira `<a>`) ou `onClick`, `variant`, `size` (`md` | `sm`), opcional `tech` (logo mono à esquerda, ex. `github`) ou `icon` (`download`, `external`, `arrowRight`…), `external` para abrir em nova aba.

- Rótulos em português, verbo ou destino, sem ponto final: "Ver detalhes", "Ver repositório", "Currículo (PDF)".
- Em listas de cards, complete o rótulo para leitores de tela (o ProjectCard já adiciona `: <título>` em `pp-sr`).
- Não use `primary` para links de navegação; não coloque dois `primary` lado a lado.
