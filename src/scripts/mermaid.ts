// Renderiza os blocos ```mermaid do Markdown. O pacote só é baixado quando um diagrama
// chega perto da tela, e o diagrama é refeito quando o tema muda.
// Com excludeLangs no astro.config, o bloco sai como <pre><code class="language-mermaid">.
const blocos = [...document.querySelectorAll<HTMLElement>('pre > code.language-mermaid')].map((c) => c.parentElement!);

if (blocos.length > 0) {
  const escuro = () => document.documentElement.classList.contains('dark');
  const renderizados: { pre: HTMLElement; alvo: HTMLElement }[] = [];
  let contador = 0;

  const carregar = async () => {
    const { default: mermaid } = await import('mermaid');
    return mermaid;
  };
  let mermaidPromise: ReturnType<typeof carregar> | undefined;

  const renderizar = async (pre: HTMLElement, alvo: HTMLElement) => {
    mermaidPromise ??= carregar();
    const mermaid = await mermaidPromise;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: escuro() ? 'dark' : 'default' });
    const { svg } = await mermaid.render(`mermaid-${contador++}`, pre.textContent ?? '');
    alvo.innerHTML = svg;
    pre.hidden = true;
  };

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        observador.unobserve(entrada.target);
        const pre = entrada.target as HTMLElement;
        const alvo = document.createElement('div');
        alvo.className = 'mermaid-diagrama not-prose my-6 flex justify-center overflow-x-auto';
        pre.before(alvo);
        renderizados.push({ pre, alvo });
        // Se falhar, o código-fonte do diagrama continua visível.
        renderizar(pre, alvo).catch((erro) => {
          alvo.remove();
          console.error('Falha ao renderizar diagrama Mermaid', erro);
        });
      }
    },
    { rootMargin: '200px' },
  );
  blocos.forEach((pre) => observador.observe(pre));

  // O ThemeToggle troca a classe .dark no <html>.
  new MutationObserver(() => {
    for (const { pre, alvo } of renderizados) renderizar(pre, alvo).catch(() => {});
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
