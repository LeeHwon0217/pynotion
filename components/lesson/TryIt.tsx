"use client";
import { useState } from "react";
import { Highlighted } from "@/components/code/CodeBlock";

/** 직접 해보기 — M3에서 Pyodide 실행이 붙는다. 지금은 에디터 + 안내. */
export function TryIt({ starter, hint, title }: { starter: string; hint?: string; title?: string }) {
  const [code, setCode] = useState(starter);
  return (
    <div className="codeblock" style={{ maxWidth: 760, margin: "0 auto", width: "100%" }}>
      <div className="codeblock-head">
        <span>{title ?? "직접 해보기"}</span>
        <span style={{ fontSize: 11.5 }}>브라우저 실행은 곧 추가됩니다 (Pyodide)</span>
      </div>
      <div style={{ position: "relative" }}>
        <pre style={{ minHeight: 120, pointerEvents: "none" }} aria-hidden>
          <Highlighted code={code || " "} gutter={false} />
        </pre>
        <textarea
          value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", padding: "14px 16px", margin: 0,
            font: "inherit", fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 14, lineHeight: 1.7,
            background: "transparent", color: "transparent", caretColor: "var(--text-primary)", border: "none", outline: "none", resize: "none", whiteSpace: "pre",
          }}
        />
      </div>
      {hint && <div className="codeblock-head" style={{ borderTop: "1px solid var(--border)", borderBottom: "none" }}>💡 {hint}</div>}
    </div>
  );
}
