import type { ReactNode } from "react";

/** 아주 작은 마크다운: 문단, **굵게**, `코드`, - 목록, 1. 목록. 외부 의존성 없이. */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

export function Md({ md, inline: isInline = false }: { md: string; inline?: boolean }) {
  if (isInline) return <>{inline(md)}</>;
  const blocks = md.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((blk, i) => {
        const lines = blk.split("\n");
        if (lines.every((l) => /^\s*[-•]\s/.test(l))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-•]\s/, ""))}</li>)}</ul>;
        }
        if (lines.every((l) => /^\s*\d+[.)]\s/.test(l))) {
          return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s/, ""))}</li>)}</ol>;
        }
        if (/^##\s/.test(blk)) return <h2 key={i}>{inline(blk.replace(/^##\s/, ""))}</h2>;
        return <p key={i}>{lines.map((l, j) => <span key={j}>{inline(l)}{j < lines.length - 1 && <br />}</span>)}</p>;
      })}
    </>
  );
}
