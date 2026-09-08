/* 장면: 인덱싱·슬라이싱 — 눈금자 위에서 범위가 잡히는 과정 */
import { ScriptBuilder, seg, ease, lerp, textW, fitFont } from "@/lib/anim";
import { Badge, C } from "../prims";

export type SliceExample = {
  expr: string;                 // 표시할 식, 예: "s[2:5]"
  start?: number | null;        // 정규화 전 값 (음수 가능). undefined = 생략
  stop?: number | null;
  step?: number;
  index?: number;               // 단일 인덱싱이면 이 값
  say: string[];                // 자막 1~3개
};
export type SliceProps = { items: string[]; name?: string; examples: SliceExample[] };

function norm(n: number, v: number | null | undefined, step: number, isStart: boolean) {
  if (v === undefined || v === null) return step > 0 ? (isStart ? 0 : n) : (isStart ? n - 1 : -1);
  let x = v < 0 ? v + n : v;
  if (step > 0) x = Math.max(0, Math.min(n, x));
  else x = Math.max(-1, Math.min(n - 1, x));
  return x;
}
export function sliceIndices(n: number, ex: SliceExample) {
  const step = ex.step ?? 1;
  const a = norm(n, ex.start, step, true), b = norm(n, ex.stop, step, false);
  const out: number[] = [];
  if (step > 0) for (let i = a; i < b; i += step) out.push(i);
  else for (let i = a; i > b; i += step) out.push(i);
  return { a, b, step, out };
}

export function buildSliceScene(props: SliceProps) {
  const items = props.items;
  const n = items.length;
  const name = props.name ?? "s";
  const s = new ScriptBuilder();
  s.chapter("눈금자").mark("ruler");
  s.say(`인덱스는 **칸의 번호**가 아니라 **칸 사이의 경계**라고 생각하자. 앞에서 세면 0부터, 뒤에서 세면 -1부터.`, 4200);
  const marks: string[] = [];
  props.examples.forEach((ex, i) => {
    const key = "ex" + i;
    marks.push(key);
    s.chapter(ex.expr).mark(key);
    ex.say.forEach((line, j) => s.mark(key + "s" + j).say(line, Math.max(2600, Math.min(6000, 1300 + line.replace(/[`*]/g, "").length * 90))));
  });
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const cellW = Math.min(88, Math.max(52, 900 / n));
  const x0 = 600 - (n * cellW) / 2;
  const yCell = 220;
  const cellH = 74;

  const render = (t: number) => {
    // 현재 예제
    let cur = -1;
    props.examples.forEach((_, i) => { if (t >= M["ex" + i]) cur = i; });
    const ex = cur >= 0 ? props.examples[cur] : null;
    const exStart = cur >= 0 ? M["ex" + cur] : 0;
    const local = t - exStart;
    const nextStart = cur >= 0 && cur < props.examples.length - 1 ? M["ex" + (cur + 1)] : Infinity;
    const fade = cur >= 0 ? Math.min(1, seg(local, 0, 300), 1 - seg(t, nextStart - 250, 250)) : 0;

    const rulerP = seg(t, M.ruler + 200, 700);
    const negP = seg(t, M.ruler + 1800, 700);

    let sel: number[] = [], a = 0, b = n, step = 1, isIndex = false;
    if (ex) {
      if (ex.index !== undefined) { isIndex = true; const i = ex.index < 0 ? ex.index + n : ex.index; sel = i >= 0 && i < n ? [i] : []; }
      else { const r = sliceIndices(n, ex); sel = r.out; a = r.a; b = r.b; step = r.step; }
    }
    const boundP = seg(local, 500, 500, ease.outBack);   // 시작·끝 경계 표시
    const sweepP = seg(local, 1200, 200 + sel.length * 260, ease.linear);
    const nSel = Math.floor(sweepP * sel.length + 1e-6);
    const resP = seg(local, 1400 + sel.length * 260, 500, ease.outBack);
    const boundaryX = (i: number) => x0 + i * cellW; // 경계 i 는 칸 i 의 왼쪽

    return (
      <g>
        {/* 제목 식 */}
        {ex && (
          <g opacity={fade}>
            <text x={600} y={70} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 40, fontWeight: 750 }}>{ex.expr}</text>
          </g>
        )}
        {/* 눈금자: 양수 인덱스 */}
        <g opacity={rulerP}>
          <text x={x0} y={yCell - 52} className="st-type">앞에서 센 인덱스</text>
          {Array.from({ length: n + 1 }, (_, i) => (
            <g key={i}>
              <line x1={boundaryX(i)} y1={yCell - 26} x2={boundaryX(i)} y2={yCell - 4} stroke={C.stroke} strokeWidth={1.5} />
              <text x={boundaryX(i)} y={yCell - 32} textAnchor="middle" className="st-mono" style={{ fill: !isIndex && ex && (i === a || i === b) && boundP > 0 ? C.hi : C.muted, fontSize: 15, fontWeight: 650 }}>{i}</text>
            </g>
          ))}
        </g>
        {/* 눈금자: 음수 */}
        <g opacity={negP}>
          <text x={x0} y={yCell + cellH + 62} className="st-type">뒤에서 센 인덱스</text>
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <line x1={boundaryX(i)} y1={yCell + cellH + 4} x2={boundaryX(i)} y2={yCell + cellH + 24} stroke={C.stroke} strokeWidth={1.5} />
              <text x={boundaryX(i)} y={yCell + cellH + 44} textAnchor="middle" className="st-mono" style={{ fill: C.muted, fontSize: 15, fontWeight: 650 }}>{i - n}</text>
            </g>
          ))}
        </g>
        {/* 칸 */}
        <text x={x0 - 12} y={yCell + cellH / 2 + 7} textAnchor="end" className="st-mono" style={{ fill: C.name, fontSize: 20, fontWeight: 700 }}>{name}</text>
        {items.map((it, i) => {
          const k = sel.indexOf(i);
          const on = k >= 0 && k < nSel;
          const p = on ? seg(local, 1200 + k * 260, 260, ease.outBack) : 0;
          return (
            <g key={i} transform={`translate(${boundaryX(i) + cellW / 2} ${yCell + cellH / 2})`}>
              <rect x={-cellW / 2 + 3} y={-cellH / 2} width={cellW - 6} height={cellH} rx={12} fill={on ? C.hi : C.node} stroke={on ? C.hi : C.stroke} strokeWidth={1.5} transform={`scale(${lerp(1, 1.06, p)})`} />
              <text y={8} textAnchor="middle" className="st-mono" style={{ fill: on ? "#fff" : C.text, fontSize: fitFont(it, cellW - 16, 24, 12, true), fontWeight: 700 }}>{it}</text>
              <text y={-cellH / 2 - 0} textAnchor="middle" className="st-id st-mono" opacity={0}>{i}</text>
            </g>
          );
        })}
        {/* 경계선 표시 (슬라이스) */}
        {ex && !isIndex && boundP > 0 && (
          <g opacity={fade}>
            {[[a, "시작"], [b, "끝 (포함 안 됨)"]].map(([pos, label], i) => {
              const bx = step > 0 ? boundaryX(Number(pos)) : boundaryX(Number(pos) + 1);
              const col = i === 0 ? C.fresh : C.dead;
              return (
                <g key={i} opacity={boundP}>
                  <line x1={bx} y1={yCell - 8} x2={bx} y2={yCell + cellH + 8} stroke={col} strokeWidth={4} strokeLinecap="round" />
                  <Badge x={bx} y={i === 0 ? yCell - 70 : yCell - 70} text={String(label)} p={boundP} color={col} anchor={i === 0 ? "end" : "start"} />
                </g>
              );
            })}
            {step !== 1 && <Badge x={600} y={yCell + cellH + 100} text={`step ${step} — ${step < 0 ? "거꾸로" : `${step}칸씩`}`} p={seg(local, 1000, 400)} color={C.name} />}
          </g>
        )}
        {ex && isIndex && sel.length > 0 && (
          <g opacity={fade}>
            <Badge x={boundaryX(sel[0]) + cellW / 2} y={yCell - 70} text={ex.index! < 0 ? `${ex.index} = ${ex.index! + n}` : `인덱스 ${ex.index}`} p={boundP} color={C.hi} />
          </g>
        )}
        {ex && isIndex && sel.length === 0 && (
          <Badge x={600} y={yCell - 70} text="범위 밖 → IndexError" p={boundP * fade} color={C.dead} />
        )}
        {/* 결과 */}
        {ex && (
          <g opacity={fade * resP} transform={`translate(600 ${yCell + cellH + 130 + lerp(10, 0, resP)})`}>
            {(() => {
              const txt = isIndex ? (sel.length ? items[sel[0]] : "IndexError") : "[" + sel.map((i) => items[i]).join(", ") + "]";
              const w = textW(txt, 26, true) + 40;
              return (
                <g>
                  <text x={-w / 2 - 14} y={9} textAnchor="end" className="st-m" style={{ fontSize: 16 }}>결과</text>
                  <rect x={-w / 2} y={-24} width={w} height={48} rx={12} fill={C.node2} stroke={sel.length || isIndex ? C.fresh : C.warn} strokeWidth={2} />
                  <text y={9} textAnchor="middle" className="st-mono" style={{ fill: C.fresh, fontSize: 26, fontWeight: 700 }}>{txt}</text>
                </g>
              );
            })()}
          </g>
        )}
      </g>
    );
  };
  return { script, render };
}
