/* ---------- 흐름도 무대 ----------
   조건문·반복문 레슨용. 순서도 위를 실행 경로가 빛나며 지나가고,
   오른쪽에 변수·출력이 함께 바뀐다. 데이터(Flow)만 적으면 된다.       */
import { ScriptBuilder, ease, fitFont, lerp, seg, textW, window_, type Script } from "@/lib/anim";
import { Badge, C, CodePanel } from "./prims";
import type { ReactNode } from "react";

export type FlowNode = { id: string; kind: "start" | "end" | "step" | "cond" | "io"; label: string; x: number; y: number; w?: number };
export type FlowEdge = { from: string; to: string; label?: string; via?: [number, number][] };
export type FlowStep = {
  chapter?: string; say: string; dur?: number;
  at?: string;                       // 활성 노드
  line?: number;                     // 코드 줄
  vars?: Record<string, string>;     // 변수 패널 (전체 상태)
  output?: string;                   // 누적 출력에 추가
  seq?: { items: string[]; index: number; label?: string; done?: number[] }; // 이터러블 띠
  badge?: { at: string; text: string; color?: "hi" | "fresh" | "name" | "dead" | "warn" };
  reset?: boolean;                   // 경로 기록 초기화
};
export type Flow = { code?: string[]; nodes: FlowNode[]; edges: FlowEdge[]; steps: FlowStep[]; chartX?: number; chartW?: number };

const COLORS = { hi: C.hi, fresh: C.fresh, name: C.name, dead: C.dead, warn: C.warn };

function nodeBox(n: FlowNode) {
  const w = n.w ?? (n.kind === "cond" ? Math.max(170, textW(n.label, 15, true) + 90) : Math.max(120, textW(n.label, 15, true) + 40));
  const h = n.kind === "cond" ? 74 : 44;
  return { x: n.x - w / 2, y: n.y - h / 2, w, h };
}

export function buildFlow(flow: Flow): { script: Script; render: (t: number) => ReactNode } {
  const sb = new ScriptBuilder();
  const starts: number[] = [];
  flow.steps.forEach((st, i) => {
    if (st.chapter) sb.chapter(st.chapter);
    starts.push(sb.t);
    const dur = st.dur ?? Math.max(2400, Math.min(6000, 1300 + st.say.replace(/[`*]/g, "").length * 90));
    sb.say(st.say, dur);
    if (i === flow.steps.length - 1) sb.wait(800);
  });
  const script = sb.build();
  const nodes = Object.fromEntries(flow.nodes.map((n) => [n.id, n]));

  // 상태 접기: 누적 출력, 변수, 경로
  type St = { at?: string; line: number; vars: Record<string, string>; output: string; path: string[]; seq?: FlowStep["seq"]; badge?: FlowStep["badge"] };
  const states: St[] = [];
  let cur: St = { line: -1, vars: {}, output: "", path: [] };
  for (const st of flow.steps) {
    const path = st.reset ? [] : [...cur.path];
    if (st.at && cur.at && st.at !== cur.at && !st.reset) path.push(cur.at + "->" + st.at);
    cur = { at: st.at ?? cur.at, line: st.line ?? cur.line, vars: st.vars ?? cur.vars, output: cur.output + (st.output ?? ""), path, seq: st.seq ?? (st.seq === undefined ? cur.seq : undefined), badge: st.badge };
    states.push(cur);
  }

  const hasCode = !!flow.code?.length;
  const codeLines = flow.code ?? [];
  const lineH = codeLines.length > 10 ? 30 : codeLines.length > 7 ? 36 : 42;
  const codeFont = lineH < 34 ? 16 : lineH < 42 ? 18 : 20;
  const codeW = hasCode ? Math.min(380, Math.max(260, Math.max(...codeLines.map((l) => textW(l, codeFont, true))) + 56)) : 0;
  const varsX = 930, varsW = 240;

  const edgePath = (e: FlowEdge) => {
    const a = nodes[e.from], b = nodes[e.to];
    const A = nodeBox(a), B = nodeBox(b);
    const pts: [number, number][] = [];
    if (e.via && e.via.length) {
      const first = e.via[0];
      // 시작점: via 방향에 맞춰 노드 가장자리
      const sx = first[0] > A.x + A.w ? A.x + A.w : first[0] < A.x ? A.x : a.x;
      const sy = first[0] > A.x + A.w || first[0] < A.x ? a.y : (first[1] > a.y ? A.y + A.h : A.y);
      pts.push([sx, sy], ...e.via);
      const last = e.via[e.via.length - 1];
      const ex = last[0] > B.x + B.w ? B.x + B.w : last[0] < B.x ? B.x : b.x;
      const ey = last[0] > B.x + B.w || last[0] < B.x ? b.y : (last[1] < b.y ? B.y : B.y + B.h);
      pts.push([ex, ey]);
    } else if (Math.abs(b.x - a.x) < 4) {
      pts.push([a.x, b.y > a.y ? A.y + A.h : A.y], [b.x, b.y > a.y ? B.y : B.y + B.h]);
    } else if (Math.abs(b.y - a.y) < 4) {
      pts.push([b.x > a.x ? A.x + A.w : A.x, a.y], [b.x > a.x ? B.x : B.x + B.w, b.y]);
    } else {
      // ㄱ 자: 옆으로 나가서 아래/위로
      const sx = b.x > a.x ? A.x + A.w : A.x;
      pts.push([sx, a.y], [b.x, a.y], [b.x, b.y > a.y ? B.y : B.y + B.h]);
    }
    return pts;
  };
  const pathD = (pts: [number, number][]) => pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
  const pathLen = (pts: [number, number][]) => pts.reduce((L, p, i) => (i ? L + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  const labelPos = (pts: [number, number][]) => { const [a, b] = [pts[0], pts[1]]; return [lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5)]; };

  const render = (t: number) => {
    let k = 0;
    for (let i = 0; i < starts.length; i++) if (t >= starts[i]) k = i;
    const local = t - starts[k];
    const st = states[k];
    const prev = states[k - 1] ?? { line: -1, vars: {}, output: "", path: [] };
    const newEdge = st.path.length > prev.path.length ? st.path[st.path.length - 1] : null;
    const edgeDraw = seg(local, 100, 550, ease.inOut);
    const nodeOn = seg(local, newEdge ? 550 : 0, 300);
    const shown = states.slice(0, k + 1).reduce((m, s2) => Math.max(m, s2.line + 1), 0);

    // 출력 타자
    const fresh = st.output.slice(prev.output.length);
    const typed = prev.output + fresh.slice(0, Math.ceil(seg(local, 600, 600, ease.linear) * fresh.length));
    const outLines = typed.split("\n");
    if (outLines[outLines.length - 1] === "") outLines.pop();

    const chartX = flow.chartX ?? (hasCode ? codeW + 60 : 40);

    return (
      <g>
        {hasCode && <CodePanel x={36} y={40} w={codeW} lines={codeLines} shown={shown} current={st.line} lineH={lineH} fontSize={codeFont} />}

        {/* 이터러블 띠 */}
        {st.seq && (() => {
          const sq = st.seq!;
          const cellW = Math.max(44, Math.min(64, 420 / Math.max(1, sq.items.length) - 8));
          const x0 = chartX;
          return (
            <g transform="translate(0 46)">
              <text x={x0} y={0} className="st-type">{sq.label ?? "이터러블"}</text>
              {sq.items.map((it, i) => {
                const active = i === sq.index;
                const done = i < sq.index || sq.done?.includes(i);
                const p = active ? seg(local, 100, 400, ease.outBack) : 1;
                return (
                  <g key={i} transform={`translate(${x0 + i * (cellW + 6)} 12)`}>
                    <rect width={cellW} height={40} rx={9} fill={active ? C.hi : C.node2} stroke={active ? C.hi : done ? C.stroke : C.stroke} strokeWidth={1.5} opacity={done && !active ? 0.45 : 1} transform={active ? `translate(${cellW / 2} 20) scale(${lerp(0.85, 1, p)}) translate(${-cellW / 2} -20)` : undefined} />
                    <text x={cellW / 2} y={26} textAnchor="middle" className="st-mono" style={{ fill: active ? "#fff" : C.text, fontSize: fitFont(it, cellW - 10, 16, 10, true), fontWeight: 650, opacity: done && !active ? 0.5 : 1 }}>{it}</text>
                  </g>
                );
              })}
              {sq.index >= sq.items.length && <Badge x={x0 + Math.min(sq.items.length, 7) * (cellW + 6) + 60} y={32} text="더 이상 없음 → 종료" p={seg(local, 200, 400)} color={C.warn} />}
            </g>
          );
        })()}

        {/* 간선 */}
        {flow.edges.map((e, i) => {
          const key = e.from + "->" + e.to;
          const pts = edgePath(e);
          const traversed = st.path.includes(key);
          const drawing = newEdge === key;
          const L = pathLen(pts);
          const [lx, ly] = labelPos(pts);
          const active = drawing || (traversed && st.path[st.path.length - 1] === key);
          return (
            <g key={i}>
              <path d={pathD(pts)} fill="none" stroke={C.stroke} strokeWidth={2} />
              {(traversed || drawing) && (
                <path d={pathD(pts)} fill="none" stroke={active ? C.hi : "rgba(126,163,255,.45)"} strokeWidth={active ? 3.5 : 2.5} strokeLinecap="round"
                  strokeDasharray={L} strokeDashoffset={drawing ? L * (1 - edgeDraw) : 0} />
              )}
              {/* 화살촉 */}
              {(() => { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]]; const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; return <path d="M-9 -5 L1 0 L-9 5 Z" transform={`translate(${b[0]} ${b[1]}) rotate(${ang})`} fill={traversed && (!drawing || edgeDraw > 0.95) ? (active ? C.hi : "rgba(126,163,255,.6)") : C.stroke} />; })()}
              {e.label && (
                <g>
                  <rect x={lx - textW(e.label, 12) / 2 - 6} y={ly - 10} width={textW(e.label, 12) + 12} height={20} rx={6} fill="var(--stage-bg)" />
                  <text x={lx} y={ly + 4} textAnchor="middle" className="st-mono" style={{ fill: traversed ? C.hi : C.muted, fontSize: 12, fontWeight: 650 }}>{e.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* 노드 */}
        {flow.nodes.map((n) => {
          const b = nodeBox(n);
          const active = st.at === n.id;
          const glow = active ? nodeOn : 0;
          const fill = active ? C.hi : n.kind === "start" || n.kind === "end" ? C.node2 : C.node;
          const stroke = active ? C.hi : C.stroke;
          const fs = fitFont(n.label, (n.kind === "cond" ? b.w - 60 : b.w - 24), 15, 10, true);
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
              {glow > 0 && <rect x={-b.w / 2 - 6} y={-b.h / 2 - 6} width={b.w + 12} height={b.h + 12} rx={n.kind === "cond" ? 16 : 14} fill="none" stroke={C.hi} strokeWidth={3} opacity={glow * 0.8} style={{ filter: "blur(4px)" }} />}
              {n.kind === "cond" ? (
                <polygon points={`0,${-b.h / 2} ${b.w / 2},0 0,${b.h / 2} ${-b.w / 2},0`} fill={fill} stroke={stroke} strokeWidth={1.5} />
              ) : n.kind === "io" ? (
                <polygon points={`${-b.w / 2 + 10},${-b.h / 2} ${b.w / 2},${-b.h / 2} ${b.w / 2 - 10},${b.h / 2} ${-b.w / 2},${b.h / 2}`} fill={fill} stroke={stroke} strokeWidth={1.5} />
              ) : (
                <rect x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} rx={n.kind === "step" ? 10 : 22} fill={fill} stroke={stroke} strokeWidth={1.5} />
              )}
              <text y={5} textAnchor="middle" className="st-mono" style={{ fill: active ? "#fff" : C.text, fontSize: fs, fontWeight: 600 }}>{n.label}</text>
            </g>
          );
        })}

        {/* 배지 */}
        {st.badge && (() => { const n = nodes[st.badge.at]; if (!n) return null; const b = nodeBox(n); return <Badge x={n.x} y={n.y - b.h / 2 - 22} text={st.badge.text} p={seg(local, 400, 400)} color={COLORS[st.badge.color ?? "hi"]} />; })()}

        {/* 변수 패널 */}
        <g transform={`translate(${varsX} 40)`}>
          <text x={0} y={4} className="st-type">변수</text>
          {Object.entries(st.vars).length === 0 && <text x={0} y={36} className="st-m">아직 없음</text>}
          {Object.entries(st.vars).map(([name, val], i) => {
            const changed = prev.vars[name] !== val;
            const isNew = !(name in prev.vars);
            const flash = changed ? 1 - seg(local, 700, 1200) : 0;
            const p = isNew ? seg(local, 300, 400, ease.outBack) : 1;
            return (
              <g key={name} transform={`translate(0 ${18 + i * 50})`} opacity={p}>
                <rect width={varsW} height={40} rx={10} fill={C.node} stroke={flash > 0 ? C.fresh : C.stroke} strokeWidth={flash > 0 ? 2 : 1.2} />
                <rect x={8} y={8} width={Math.max(40, textW(name, 14, true) + 18)} height={24} rx={6} fill={C.name} />
                <text x={8 + Math.max(40, textW(name, 14, true) + 18) / 2} y={25} textAnchor="middle" className="st-mono" style={{ fill: "#1a1300", fontSize: 14, fontWeight: 750 }}>{name}</text>
                <g transform={`translate(${varsW - 12} 26) scale(${changed ? lerp(0.7, 1, seg(local, 300, 500, ease.outBack)) : 1})`}>
                  <text textAnchor="end" className="st-mono" style={{ fill: flash > 0 ? C.fresh : C.text, fontSize: fitFont(val, varsW - 90, 17, 11, true), fontWeight: 650 }}>{val}</text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 출력 */}
        {(st.output || prev.output) && (
          <g transform={`translate(${varsX} ${40 + 24 + Math.max(1, Object.entries(st.vars).length) * 50 + 24})`}>
            <text x={0} y={0} className="st-type">출력</text>
            <rect x={0} y={10} width={varsW} height={Math.max(60, outLines.slice(-6).length * 24 + 16)} rx={10} fill="var(--stage-code-bg)" stroke={C.stroke} />
            {outLines.slice(-6).map((l, i) => (
              <text key={i} x={12} y={34 + i * 24} className="st-mono" style={{ fill: C.fresh, fontSize: fitFont(l, varsW - 24, 16, 10, true), fontWeight: 600 }}>{l}</text>
            ))}
          </g>
        )}
      </g>
    );
  };
  return { script, render };
}
