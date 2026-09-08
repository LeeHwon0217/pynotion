"use client";
import type { Block } from "@/lib/types";
import { CodeBlock } from "@/components/code/CodeBlock";
import { Viz } from "@/components/viz/registry";
import { TracePlayer } from "@/components/TracePlayer";
import { TRACES } from "@/data/traces";
import { Quiz } from "./Quiz";
import { TryIt } from "./TryIt";
import { Md } from "./Md";

export function Blocks({ blocks, lessonKey }: { blocks: Block[]; lessonKey: string }) {
  let quizNo = 0;
  return (
    <div className="lesson-body">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "text":
            return <div key={i} className="prose"><Md md={b.md} /></div>;
          case "heading":
            return <div key={i} className="prose"><h2 id={b.id}>{b.text}</h2></div>;
          case "viz":
            return (
              <div key={i} className="bleed">
                {(b.title || b.caption) && (
                  <div className="viz-title">
                    {b.title && <h2>{b.title}</h2>}
                  </div>
                )}
                <Viz component={b.component} props={b.props} title={b.title} />
                {b.caption && <p className="viz-caption">{b.caption}</p>}
              </div>
            );
          case "trace": {
            const tr = TRACES[b.traceId];
            return (
              <div key={i} className="bleed">
                {b.title && <div className="viz-title"><h2>{b.title}</h2></div>}
                {tr ? <TracePlayer trace={tr} title={b.title} /> : <div className="stage tp-loading">트레이스 없음: {b.traceId}</div>}
                {b.caption && <p className="viz-caption">{b.caption}</p>}
              </div>
            );
          }
          case "code":
            return <CodeBlock key={i} code={b.code} title={b.title} caption={b.caption} lang={b.lang} />;
          case "callout":
            return (
              <div key={i} className={`callout callout-${b.tone}`}>
                {b.title && <b className="t">{b.title}</b>}
                <Md md={b.md} />
              </div>
            );
          case "pitfall": {
            const tr = b.traceId ? TRACES[b.traceId] : null;
            return (
              <div key={i} className="pitfall">
                <div className="ph"><i>!</i><b>{b.title}</b></div>
                <Md md={b.md} />
                {b.code && <div style={{ marginTop: 12 }}><CodeBlock code={b.code} /></div>}
                {tr && <div className="bleed"><TracePlayer trace={tr} title={b.title} autoplay={false} /></div>}
              </div>
            );
          }
          case "table":
            return (
              <div key={i} className="table-wrap">
                <table className="tbl">
                  <thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Md md={c} inline /></td>)}</tr>)}</tbody>
                </table>
                {b.caption && <div className="table-cap">{b.caption}</div>}
              </div>
            );
          case "try":
            return <TryIt key={i} starter={b.starter} hint={b.hint} title={b.title} />;
          case "quiz":
            quizNo++;
            return <Quiz key={i} no={quizNo} question={b.question} code={b.code} choices={b.choices} explain={b.explain} storeKey={`${lessonKey}#${i}`} />;
          case "summary":
            return (
              <div key={i} className="summary">
                <h3>이 레슨의 핵심</h3>
                <ul>{b.items.map((s, j) => <li key={j}><Md md={s} inline /></li>)}</ul>
              </div>
            );
        }
      })}
    </div>
  );
}
