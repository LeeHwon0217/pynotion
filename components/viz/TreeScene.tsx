/* ---------- 트리 무대 ----------
   예외 계층, 클래스 상속, MRO 처럼 '계층 위에서 경로가 빛나는' 레슨용.
   데이터(TreeStory)만 적으면 된다.                                        */
import { ScriptBuilder, ease, fitFont, lerp, seg, textW, type Script } from "@/lib/anim";
import { Badge, C, CodePanel } from "./prims";
import type { ReactNode } from "react";

export type TreeNode = { id: string; label: string; parent?: string; sub?: string; parents?: string[] };
export type TreeStep = {
  chapter?: string; say: string; dur?: number;
  line?: number;
  /** 순서대로 점등되는 노드 (경로) */
  path?: string[];
  /** 그냥 강조할 노드들 */
  lit?: string[];
  /** 흐리게 할 노드들 */
  dim?: string[];
  badge?: { at: string; text: string; color?: "hi" | "fresh" | "name" | "dead" | "warn" };
  /** 이 스텝에서 처음 나타나는 노드들 */
  reveal?: string[];
};
export type TreeStory = { code?: string[]; nodes: TreeNode[]; steps: TreeStep[]; layout?: "top-down" | "bottom-up"; nodeW?: number };

const COLORS = { hi: C.hi, fresh: C.fresh, name: C.name, dead: C.dead, warn: C.warn };

export function buildTree(story: TreeStory): { script: Script; render: (t: number) => ReactNode } {
  const sb = new ScriptBuilder();
  const starts: number[] = [];
  story.steps.forEach((st, i) => {
    if (st.chapter) sb.chapter(st.chapter);
    starts.push(sb.t);
    const dur = st.dur ?? Math.max(2600, Math.min(6500, 1400 + st.say.replace(/[`*]/g, "").length * 90));
    sb.say(st.say, dur);
    if (i === story.steps.length - 1) sb.wait(800);
  });
  const script = sb.build();

  const hasCode = !!story.code?.length;
  const codeLines = story.code ?? [];
  const lineH = codeLines.length > 10 ? 30 : codeLines.length > 7 ? 36 : 42;
  const codeFont = lineH < 34 ? 16 : lineH < 42 ? 18 : 20;
  const codeW = hasCode ? Math.min(380, Math.max(240, Math.max(...codeLines.map((l) => textW(l, codeFont, true))) + 56)) : 0;
  const x0 = hasCode ? codeW + 70 : 40;
  const W = 1180 - x0;

  // 레이아웃: 깊이별 행, 부모 아래 자식들을 균등 배치 (간단한 tidy tree)
  const byId = Object.fromEntries(story.nodes.map((n) => [n.id, n]));
  const parentsOf = (n: TreeNode) => n.parents ?? (n.parent ? [n.parent] : []);
  const depthOf = (id: string): number => { const ps = parentsOf(byId[id]); return ps.length ? 1 + Math.max(...ps.map(depthOf)) : 0; };
  const depths = Object.fromEntries(story.nodes.map((n) => [n.id, depthOf(n.id)]));
  const maxD = Math.max(...Object.values(depths));
  const rows: string[][] = [];
  for (const n of story.nodes) (rows[depths[n.id]] ??= []).push(n.id);
  const nodeW = story.nodeW ?? Math.min(200, Math.max(120, W / (Math.max(...rows.map((r) => r.length)) + 0.5)));
  const pos: Record<string, { x: number; y: number }> = {};
  rows.forEach((row, d) => {
    const gap = Math.min(nodeW + 24, W / row.length);
    const total = gap * row.length;
    row.forEach((id, i) => {
      const y = story.layout === "bottom-up" ? 480 - (d * 400) / Math.max(1, maxD) : 70 + (d * 400) / Math.max(1, maxD);
      pos[id] = { x: x0 + (W - total) / 2 + gap * (i + 0.5), y };
    });
  });

  // 상태 접기: reveal 누적
  const revealed: Set<string>[] = [];
  let acc = new Set<string>(story.steps.some((s) => s.reveal) ? [] : story.nodes.map((n) => n.id));
  for (const st of story.steps) { acc = new Set(acc); st.reveal?.forEach((r) => acc.add(r)); revealed.push(acc); }

  const render = (t: number) => {
    let k = 0;
    for (let i = 0; i < starts.length; i++) if (t >= starts[i]) k = i;
    const local = t - starts[k];
    const st = story.steps[k];
    const vis = revealed[k];
    const prevVis = revealed[k - 1] ?? new Set<string>();
    const shown = story.steps.slice(0, k + 1).reduce((m, s2) => Math.max(m, (s2.line ?? -1) + 1), 0);
    const path = st.path ?? [];
    const hopDur = 650;
    const hop = path.length ? Math.min(path.length - 1, Math.floor(Math.max(0, local - 300) / hopDur)) : -1;
    const litSet = new Set([...(st.lit ?? []), ...path.slice(0, hop + 1)]);
    const dimSet = new Set(st.dim ?? []);
    const nh = 46;

    return (
      <g>
        {hasCode && <CodePanel x={36} y={40} w={codeW} lines={codeLines} shown={shown} current={st.line ?? -1} lineH={lineH} fontSize={codeFont} />}
        {/* 간선 */}
        {story.nodes.map((n) => parentsOf(n).map((pid) => {
          if (!vis.has(n.id) || !vis.has(pid)) return null;
          const a = pos[pid], b = pos[n.id];
          const onPath = path.includes(pid) && path.includes(n.id) && Math.abs(path.indexOf(pid) - path.indexOf(n.id)) === 1 && litSet.has(pid) && litSet.has(n.id);
          const p = prevVis.has(n.id) ? 1 : seg(local, 200, 500, ease.out);
          const up = story.layout === "bottom-up";
          return <line key={n.id + pid} x1={a.x} y1={a.y + (up ? -nh / 2 : nh / 2)} x2={lerp(a.x, b.x, p)} y2={lerp(a.y + (up ? -nh / 2 : nh / 2), b.y + (up ? nh / 2 : -nh / 2), p)} stroke={onPath ? C.hi : C.stroke} strokeWidth={onPath ? 3.5 : 1.8} />;
        }))}
        {/* 노드 */}
        {story.nodes.map((n) => {
          if (!vis.has(n.id)) return null;
          const { x, y } = pos[n.id];
          const p = prevVis.has(n.id) ? 1 : seg(local, 200, 500, ease.outBack);
          const lit = litSet.has(n.id);
          const justLit = path[hop] === n.id;
          const dim = dimSet.has(n.id);
          const w = nodeW;
          const fs = fitFont(n.label, w - 20, 15, 10, true);
          return (
            <g key={n.id} transform={`translate(${x} ${y}) scale(${lerp(0.6, 1, p)})`} opacity={p * (dim ? 0.3 : 1)}>
              {justLit && <rect x={-w / 2 - 6} y={-nh / 2 - 6} width={w + 12} height={nh + 12} rx={16} fill="none" stroke={C.hi} strokeWidth={3} opacity={1 - seg(local - 300 - hop * hopDur, 200, 900)} style={{ filter: "blur(3px)" }} />}
              <rect x={-w / 2} y={-nh / 2} width={w} height={nh} rx={12} fill={lit ? C.hi : C.node} stroke={lit ? C.hi : C.stroke} strokeWidth={1.5} />
              <text y={n.sub ? 0 : 6} textAnchor="middle" className="st-mono" style={{ fill: lit ? "#fff" : C.text, fontSize: fs, fontWeight: 650 }}>{n.label}</text>
              {n.sub && <text y={16} textAnchor="middle" style={{ fill: lit ? "rgba(255,255,255,.8)" : C.muted, fontSize: 11 }}>{n.sub}</text>}
            </g>
          );
        })}
        {st.badge && pos[st.badge.at] && <Badge x={pos[st.badge.at].x} y={pos[st.badge.at].y - nh / 2 - 22} text={st.badge.text} p={seg(local, 400, 400)} color={COLORS[st.badge.color ?? "hi"]} />}
      </g>
    );
  };
  return { script, render };
}
