/* ---------- Stage 위 SVG 기본 도형 ----------
   전부 "진행값 p(0..1)" 을 받아 그 상태를 그린다. 상태를 갖지 않는다.  */
import type { ReactNode } from "react";
import { fitFont, lerp, textW } from "@/lib/anim";

export const C = {
  text: "var(--stage-text)", muted: "var(--stage-muted)",
  node: "var(--stage-node)", node2: "var(--stage-node-2)", stroke: "var(--stage-stroke)",
  name: "var(--stage-name)", arrow: "var(--stage-arrow)", hi: "var(--stage-hi)",
  fresh: "var(--stage-new)", dead: "var(--stage-dead)", warn: "var(--stage-warn)",
};

/** 중심 기준 스케일+페이드 등장 */
export function Pop({ x, y, w, h, p, children, scaleFrom = 0.6 }: { x: number; y: number; w: number; h: number; p: number; children: ReactNode; scaleFrom?: number }) {
  if (p <= 0) return null;
  const s = lerp(scaleFrom, 1, p);
  return (
    <g opacity={p} transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-w / 2} ${-h / 2})`}>
      {children}
    </g>
  );
}

/** 힙 객체 상자 */
export function ObjBox({
  x, y, w = 200, h = 124, type, value, id, p = 1, glow = 0, tone = "normal", children,
}: {
  x: number; y: number; w?: number; h?: number; type: string; value?: string; id?: string;
  p?: number; glow?: number; tone?: "normal" | "fresh" | "dead" | "warn"; children?: ReactNode;
}) {
  const stroke = tone === "fresh" ? C.fresh : tone === "dead" ? C.dead : tone === "warn" ? C.warn : C.stroke;
  return (
    <Pop x={x} y={y} w={w} h={h} p={p}>
      {glow > 0 && (
        <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={20} fill="none" stroke={tone === "fresh" ? C.fresh : C.hi} strokeWidth={3} opacity={glow * 0.9} style={{ filter: "blur(4px)" }} />
      )}
      <rect width={w} height={h} rx={16} fill={C.node} stroke={stroke} strokeWidth={tone === "normal" ? 1.5 : 2.5} />
      <rect x={12} y={10} width={textW(type, 11.5, true) + 18} height={22} rx={6} fill={C.node2} />
      <text x={21} y={25.5} className="st-type st-mono">{type}</text>
      {value !== undefined && (
        <text x={w / 2} y={h / 2 + 18} textAnchor="middle" className="st-val st-mono" style={{ fontSize: fitFont(value, w - 28, 30, 12, true) }}>{value}</text>
      )}
      {id && <text x={w - 12} y={h - 12} textAnchor="end" className="st-id st-mono">id {id}</text>}
      {children}
    </Pop>
  );
}

/** 이름표 (노란 태그) */
export function NameTag({ x, y, name, p = 1, w, h = 48, glow = 0 }: { x: number; y: number; name: string; p?: number; w?: number; h?: number; glow?: number }) {
  const width = w ?? Math.max(72, textW(name, 18, true) + 36);
  return (
    <Pop x={x} y={y} w={width} h={h} p={p} scaleFrom={0.7}>
      {glow > 0 && <rect x={-5} y={-5} width={width + 10} height={h + 10} rx={14} fill="none" stroke={C.name} strokeWidth={3} opacity={glow} style={{ filter: "blur(4px)" }} />}
      <path d={`M10 0 H${width - 4} a4 4 0 0 1 4 4 V${h - 4} a4 4 0 0 1 -4 4 H10 L0 ${h / 2} Z`} fill={C.name} />
      <circle cx={13} cy={h / 2} r={3} fill="#0b0f1a" opacity={0.5} />
      <text x={width / 2 + 5} y={h / 2 + 7} textAnchor="middle" className="st-name st-mono" style={{ fontSize: 18 }}>{name}</text>
    </Pop>
  );
}

/** 3차 베지어 위의 점/접선 */
function bez(p0: number[], p1: number[], p2: number[], p3: number[], t: number) {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return { x, y, ang: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/** 참조 화살표: 그려지는 진행 p, 도착점은 (x2,y2). 끝점을 바꾸면 화살표가 '휘둘러' 이동한다 */
export function Arrow({ x1, y1, x2, y2, p = 1, color = C.arrow, width = 3, dashed = false, opacity = 1 }: {
  x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; width?: number; dashed?: boolean; opacity?: number;
}) {
  if (p <= 0 || opacity <= 0) return null;
  const dx = Math.max(60, Math.abs(x2 - x1) * 0.45);
  const p0 = [x1, y1], p1 = [x1 + dx, y1], p2 = [x2 - dx, y2], p3 = [x2, y2];
  const d = `M${x1} ${y1} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${x2} ${y2}`;
  const tip = bez(p0, p1, p2, p3, Math.max(0.001, p));
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
        pathLength={1} strokeDasharray={dashed ? "0.03 0.02" : "1"} strokeDashoffset={dashed ? 0 : 1 - p}
        style={dashed ? { clipPath: undefined } : undefined} />
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${tip.ang})`}>
        <path d="M-12 -7 L2 0 L-12 7 Z" fill={color} />
      </g>
      <circle cx={x1} cy={y1} r={5} fill={color} />
    </g>
  );
}

/** 반복 펄스 링 */
export function Pulse({ cx, cy, t, start, color = C.hi, r0 = 10, r1 = 46, period = 1400, on = true }: {
  cx: number; cy: number; t: number; start: number; color?: string; r0?: number; r1?: number; period?: number; on?: boolean;
}) {
  if (!on || t < start) return null;
  const k = ((t - start) % period) / period;
  return <circle cx={cx} cy={cy} r={lerp(r0, r1, k)} fill="none" stroke={color} strokeWidth={2.5} opacity={(1 - k) * 0.8} />;
}

/** 빨간 X 표시 (틀린 그림) */
export function CrossOut({ x, y, w, h, p }: { x: number; y: number; w: number; h: number; p: number }) {
  if (p <= 0) return null;
  return (
    <g stroke={C.dead} strokeWidth={8} strokeLinecap="round" opacity={0.95}>
      <line x1={x} y1={y} x2={x + w} y2={y + h} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, p * 2)} />
      <line x1={x + w} y1={y} x2={x} y2={y + h} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
    </g>
  );
}

/** 라벨 (배지) */
export function Badge({ x, y, text, p = 1, color = C.hi, anchor = "middle" }: { x: number; y: number; text: string; p?: number; color?: string; anchor?: "start" | "middle" | "end" }) {
  if (p <= 0) return null;
  const w = textW(text, 14, false) + 26;
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <g opacity={p} transform={`translate(0 ${lerp(8, 0, p)})`}>
      <rect x={left} y={y - 14} width={w} height={28} rx={8} fill={color} opacity={0.18} />
      <rect x={left} y={y - 14} width={w} height={28} rx={8} fill="none" stroke={color} strokeWidth={1.2} opacity={0.6} />
      <text x={left + w / 2} y={y + 5} textAnchor="middle" className="st-mono" style={{ fill: color, fontSize: 14, fontWeight: 650 }}>{text}</text>
    </g>
  );
}

/** 코드 패널 — 실행된 줄이 누적 표시되고 현재 줄이 빛난다 */
export function CodePanel({ x, y, w, lines, shown, current, lineH = 44, title = "코드", fontSize = 22 }: {
  x: number; y: number; w: number; lines: string[]; shown: number; current: number; lineH?: number; title?: string; fontSize?: number;
}) {
  const h = lines.length * lineH + 52;
  const fs = Math.min(fontSize, ...lines.map((l) => fitFont(l, w - 40, fontSize, 11, true)));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={16} fill="var(--stage-code-bg)" stroke={C.stroke} strokeWidth={1.2} />
      <text x={18} y={26} className="st-type">{title}</text>
      {lines.map((ln, i) => {
        const vis = i < shown;
        const cur = i === current;
        return (
          <g key={i} transform={`translate(0 ${44 + i * lineH})`} opacity={vis ? 1 : 0.18}>
            {cur && <rect x={6} y={0} width={w - 12} height={lineH} rx={8} fill="var(--stage-code-line)" />}
            {cur && <rect x={6} y={6} width={3} height={lineH - 12} rx={2} fill={C.hi} />}
            <text x={22} y={lineH / 2 + 6} className="st-mono" style={{ fill: cur ? C.text : vis ? "#b6c0dc" : C.muted, fontSize: fs, fontWeight: cur ? 650 : 450 }}>{ln}</text>
          </g>
        );
      })}
    </g>
  );
}

/** 리스트 객체 (셀 나열) */
export function ListBox({ x, y, items, p = 1, id, glow = 0, cellW = 60, cellH = 60, appearFrom = 0, appendP = 1 }: {
  x: number; y: number; items: string[]; p?: number; id?: string; glow?: number; cellW?: number; cellH?: number;
  /** 이 인덱스부터의 셀은 appendP 진행으로 등장 */
  appearFrom?: number; appendP?: number;
}) {
  const n = items.length;
  const w = Math.max(200, n * (cellW + 8) + 32);
  const h = cellH + 80;
  return (
    <ObjBox x={x} y={y} w={w} h={h} type="list" id={id} p={p} glow={glow}>
      {items.map((it, i) => {
        const q = i >= appearFrom ? appendP : 1;
        if (q <= 0) return null;
        const cx = 16 + i * (cellW + 8);
        return (
          <g key={i} opacity={q} transform={`translate(${cx + cellW / 2} ${44 + cellH / 2}) scale(${lerp(0.5, 1, q)}) translate(${-cellW / 2} ${-cellH / 2})`}>
            <rect width={cellW} height={cellH} rx={10} fill={C.node2} stroke={i >= appearFrom && appendP < 1 ? C.fresh : C.stroke} strokeWidth={1.5} />
            <text x={cellW / 2} y={cellH / 2 + 8} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 22, fontWeight: 650 }}>{it}</text>
            <text x={cellW / 2} y={-6} textAnchor="middle" className="st-id st-mono">{i}</text>
          </g>
        );
      })}
    </ObjBox>
  );
}
