/** 경량 파이썬 토크나이저 — 구문 강조용. 정확한 파서가 아니라 색칠용이다. */
export type Tok = { t: "kw" | "fn" | "str" | "num" | "cmt" | "op" | "cls" | "bi" | "id" | "ws"; v: string };

const KW = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in",
  "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
  "match", "case",
]);
const BUILTIN = new Set([
  "print", "len", "range", "int", "str", "float", "bool", "list", "dict", "set", "tuple", "type",
  "id", "input", "sum", "min", "max", "abs", "sorted", "reversed", "enumerate", "zip", "map", "filter",
  "isinstance", "hasattr", "getattr", "setattr", "open", "iter", "next", "super", "object", "repr",
  "round", "any", "all", "hash", "callable", "vars", "dir", "help", "format", "chr", "ord", "divmod", "pow",
]);

const RE = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|f?"(?:\\.|[^"\\\n])*"|f?'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d[\d_]*)?(?:e[+-]?\d+)?j?\b|\b0[xob][\da-fA-F_]+\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_]+)/g;

export function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  let prevWord = "";
  while ((m = RE.exec(src))) {
    const [all, cmt, str, num, id, ws, op] = m;
    if (cmt) out.push({ t: "cmt", v: cmt });
    else if (str) out.push({ t: "str", v: str });
    else if (num) out.push({ t: "num", v: num });
    else if (id) {
      if (KW.has(id)) out.push({ t: "kw", v: id });
      else if (prevWord === "def") out.push({ t: "fn", v: id });
      else if (prevWord === "class") out.push({ t: "cls", v: id });
      else if (BUILTIN.has(id)) out.push({ t: "bi", v: id });
      else if (/^[A-Z][A-Za-z0-9_]*$/.test(id) && id.length > 1) out.push({ t: "cls", v: id });
      else {
        // 뒤에 '(' 가 오면 함수 호출
        const rest = src.slice(RE.lastIndex, RE.lastIndex + 1);
        out.push({ t: rest === "(" ? "fn" : "id", v: id });
      }
    } else if (ws) out.push({ t: "ws", v: ws });
    else if (op) out.push({ t: "op", v: op });
    else out.push({ t: "id", v: all });
    if (!ws) prevWord = id ?? "";
  }
  return out;
}

/** 줄 단위로 토큰 분리 (여러 줄 문자열은 줄마다 쪼갠다) */
export function tokenizeLines(src: string): Tok[][] {
  const lines: Tok[][] = [[]];
  for (const tok of tokenize(src)) {
    const parts = tok.v.split("\n");
    parts.forEach((p, i) => {
      if (i > 0) lines.push([]);
      if (p) lines[lines.length - 1].push({ t: tok.t, v: p });
    });
  }
  return lines;
}
