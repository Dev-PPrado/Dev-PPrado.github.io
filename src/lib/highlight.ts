// Realce de sintaxe Python feito no build (porte do tokenizePython de .llm/design-system/components/bundle.js).
// Tokenizador leve, sem dependências: não é um parser, só classifica tokens para colorir.

const PY_KW =
  /^(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|match|case)$/;
const PY_BI =
  /^(print|len|range|dict|list|set|tuple|str|int|float|bool|open|enumerate|zip|map|filter|sorted|sum|min|max|isinstance|super|self|cls|Exception|ValueError|KeyError|TypeError)$/;
const PY_TYPES =
  /^(str|int|float|bool|dict|list|tuple|set|bytes|None|Any|Optional|Iterator|Iterable|datetime|date|DataFrame|Path|Field|BaseModel)$/;

// s: string, c: comentário, d: decorator, n: número/constante, k: keyword, f: nome em def/class,
// fc: chamada, b: builtin, t: tipo, i: identificador, p: pontuação, w: espaço.
type Tipo = 's' | 'c' | 'd' | 'n' | 'k' | 'f' | 'fc' | 'b' | 't' | 'i' | 'p' | 'w';

export function tokenizePython(src: string): [Tipo, string][] {
  const re =
    /("""[\s\S]*?"""|'''[\s\S]*?'''|[rbfRBF]{0,2}"(?:\\.|[^"\\\n])*"|[rbfRBF]{0,2}'(?:\\.|[^'\\\n])*')|(#[^\n]*)|(@[A-Za-z_][\w.]*)|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(->|[\s\S])/g;
  const out: [Tipo, string][] = [];
  let mm: RegExpExecArray | null;
  let prev = '';
  let depoisDeDoisPontosOuSeta = false;
  while ((mm = re.exec(src))) {
    const t = mm[0];
    let k: Tipo = 'p';
    if (mm[1]) k = 's';
    else if (mm[2]) k = 'c';
    else if (mm[3]) k = 'd';
    else if (mm[4]) k = 'n';
    else if (mm[5]) {
      if (PY_KW.test(t)) k = t === 'True' || t === 'False' || t === 'None' ? 'n' : 'k';
      else if (prev === 'def' || prev === 'class') k = 'f';
      else if (depoisDeDoisPontosOuSeta && PY_TYPES.test(t)) k = 't';
      else if (PY_BI.test(t)) k = 'b';
      else if (/^[A-Z][A-Za-z0-9]+$/.test(t) && PY_TYPES.test(t)) k = 't';
      else k = /^\s*\(/.test(src.slice(re.lastIndex)) ? 'fc' : 'i';
    } else if (mm[6]) k = 'w';
    if (k !== 'w') {
      if (t === ':' || t === '->') depoisDeDoisPontosOuSeta = true;
      else if (t === '=' || t === ',' || t === ')' || t === '\n') depoisDeDoisPontosOuSeta = false;
      if (mm[5]) prev = t;
      else if (t !== '.') prev = '';
    } else if (/\n/.test(t)) depoisDeDoisPontosOuSeta = false;
    out.push([k, t]);
  }
  return out;
}

const CLASSE: Partial<Record<Tipo, string>> = {
  s: 'tk-str',
  c: 'tk-com',
  d: 'tk-dec',
  n: 'tk-num',
  k: 'tk-kw',
  f: 'tk-fn',
  fc: 'tk-call',
  b: 'tk-bi',
  t: 'tk-type',
  i: 'tk-id',
};

export type Trecho = { texto: string; classe?: string };

// Divide o código em linhas de trechos já classificados, prontos para virar <span>.
export function realcar(codigo: string, linguagem: string): Trecho[][] {
  if (linguagem !== 'python' && linguagem !== 'py') {
    return codigo.split('\n').map((l) => (l ? [{ texto: l }] : []));
  }
  const linhas: Trecho[][] = [[]];
  for (const [tipo, texto] of tokenizePython(codigo)) {
    texto.split('\n').forEach((parte, i) => {
      if (i > 0) linhas.push([]);
      if (parte) linhas[linhas.length - 1].push({ texto: parte, classe: CLASSE[tipo] });
    });
  }
  return linhas;
}
