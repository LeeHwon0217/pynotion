import { tokenizeLines } from "@/lib/tokenize";

export function Highlighted({ code, gutter = true, className }: { code: string; gutter?: boolean; className?: string }) {
  const lines = tokenizeLines(code.replace(/\n$/, ""));
  return (
    <>
      {lines.map((toks, i) => (
        <div key={i} className={className}>
          {gutter && <span className="ln">{i + 1}</span>}
          {toks.map((t, j) =>
            t.t === "ws" || t.t === "id" ? <span key={j}>{t.v}</span> : <span key={j} className={`tk-${t.t}`}>{t.v}</span>
          )}
          {toks.length === 0 && " "}
        </div>
      ))}
    </>
  );
}

export function CodeBlock({ code, title, caption, lang = "python" }: { code: string; title?: string; caption?: string; lang?: "python" | "text" }) {
  return (
    <div>
      <div className="codeblock">
        {(title || lang) && (
          <div className="codeblock-head">
            <span>{title ?? ""}</span>
            <span className="mono">{lang === "python" ? "python" : ""}</span>
          </div>
        )}
        <pre>
          {lang === "python" ? <Highlighted code={code} /> : code}
        </pre>
      </div>
      {caption && <p className="viz-caption">{caption}</p>}
    </div>
  );
}
