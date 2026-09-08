/* ---------- 스코프 무대 ----------
   LEGB — 이름을 찾을 때 안쪽에서 바깥으로 튀어나가는 과정. 데이터(ScopeStory)만 적으면 된다. */
import { ScriptBuilder, ease, lerp, seg, textW, type Script } from "@/lib/anim";
import { Badge, C, CodePanel } from "./prims";
import type { ReactNode } from "react";

export type ScopeLevel = "L" | "E" | "G" | "B";
export type ScopeStep = {
  chapter?: string; say: string; dur?: number;
  line?: number;
  /** 각 스코프에 들어 있는 이름들 (전체 상태) */
  scopes?: Partial<Record<ScopeLevel, Record<string, string>>>;
  /** 이름 찾기: 어느 스코프부터 시작해서 어디서 찾았나 */
  lookup?: { name: string; from: ScopeLevel; found: ScopeLevel | null };
  /** 활성 스코프 (실행 중인 함수) */
  active?: ScopeLevel;
  badge?: string;
};
export type ScopeStory = { code?: string[]; steps: ScopeStep[]; labels?: Partial<Record<ScopeLevel, string>> };

const ORDER: ScopeLevel[] = ["L", "E", "G", "B"];
const NAMES: Record<ScopeLevel, string> = { L: "Local — 지금 실행 중인 함수", E: "Enclosing — 감싸는 함수", G: "Global — 모듈", B: "Built-in — 내장" };

export function buildScope(story: ScopeStory): { script: Script; render: (t: number) => ReactNode } {
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

  type St = { line: number; scopes: Partial<Record<ScopeLevel, Record<string, string>>>; lookup?: ScopeStep["lookup"]; active?: ScopeLevel; badge?: string };
  const states: St[] = [];
  let cur: St = { line: -1, scopes: { B: { print: "…", len: "…" } } };
  for (const st of story.steps) {
    cur = { line: st.line ?? cur.line, scopes: st.scopes ?? cur.scopes, lookup: st.lookup, active: st.active ?? cur.active, badge: st.badge };
    states.push(cur);
  }

  const hasCode = !!story.code?.length;
  const codeLines = story.code ?? [];
  const lineH = codeLines.length > 10 ? 30 : codeLines.length > 7 ? 36 : 42;
  const codeFont = lineH < 34 ? 16 : lineH < 42 ? 18 : 20;
  const codeW = hasCode ? Math.min(380, Math.max(260, Math.max(...codeLines.map((l) => textW(l, codeFont, true))) + 56)) : 0;
  const x0 = hasCode ? codeW + 70 : 80;
  const W = 1180 - x0;
  // 겹상자: B 가 가장 바깥
  const box = (lv: ScopeLevel) => { const d = 3 - ORDER.indexOf(lv); return { x: x0 + d * 22, y: 40 + d * 72, w: W - d * 44, h: 470 - d * 72 - d * 10 }; };

  const render = (t: number) => {
    let k = 0;
    for (let i = 0; i < starts.length; i++) if (t >= starts[i]) k = i;
    const local = t - starts[k];
    const st = states[k];
    const shown = states.slice(0, k + 1).reduce((m, s2) => Math.max(m, s2.line + 1), 0);
    // 찾기 애니메이션: from → found 까지 한 단계 700ms
    const lk = st.lookup;
    const path = lk ? ORDER.slice(ORDER.indexOf(lk.from), lk.found ? ORDER.indexOf(lk.found) + 1 : 4) : [];
    const stepDur = 800;
    const hop = lk ? Math.min(path.length - 1, Math.floor(Math.max(0, local - 300) / stepDur)) : -1;
    const hopP = lk ? seg(local - 300 - hop * stepDur, 0, 400, ease.outBack) : 0;
    const foundNow = lk && hop === path.length - 1 && lk.found;
    const notFound = lk && hop === path.length - 1 && !lk.found && local > 300 + path.length * stepDur;

    return (
      <g>
        {hasCode && <CodePanel x={36} y={40} w={codeW} lines={codeLines} shown={shown} current={st.line} lineH={lineH} fontSize={codeFont} />}
        {[...ORDER].reverse().map((lv) => {
          const b = box(lv);
          const names = st.scopes[lv];
          const isActive = st.active === lv;
          const onPath = lk && path.includes(lv);
          const reached = lk && ORDER.indexOf(lv) - ORDER.indexOf(lk.from) <= hop;
          const isFound = foundNow && lk!.found === lv;
          const exists = names !== undefined || lv === "B";
          return (
            <g key={lv} opacity={exists ? 1 : 0.22}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={18} fill={isFound ? "rgba(61,220,151,.10)" : isActive ? "rgba(91,140,255,.08)" : "rgba(255,255,255,.02)"} stroke={isFound ? C.fresh : reached && onPath ? C.hi : isActive ? C.hi : C.stroke} strokeWidth={isFound || (reached && onPath) ? 2.5 : 1.3} strokeDasharray={exists ? undefined : "6 5"} />
              <text x={b.x + 16} y={b.y + 22} className="st-type" style={{ fill: isFound ? C.fresh : reached && onPath ? C.text : undefined }}>{lv} · {story.labels?.[lv] ?? NAMES[lv]}</text>
              {names && Object.entries(names).map(([n, v], i) => {
                const hit = isFound && lk!.name === n;
                return (
                  <g key={n} transform={`translate(${b.x + 16 + i * 160} ${b.y + 32})`}>
                    <rect width={Math.max(120, textW(`${n} = ${v}`, 14, true) + 22)} height={30} rx={8} fill={hit ? C.fresh : C.node2} stroke={hit ? C.fresh : C.stroke} />
                    <text x={11} y={20} className="st-mono" style={{ fill: hit ? "#062" : C.text, fontSize: 14, fontWeight: 650 }}>{n} = {v}</text>
                  </g>
                );
              })}
              {!names && lv !== "B" && <text x={b.x + 16} y={b.y + 52} className="st-m" style={{ fontSize: 12 }}>(지금은 없음)</text>}
            </g>
          );
        })}
        {/* 찾기 마커 */}
        {lk && hop >= 0 && (() => {
          const lv = path[hop];
          const b = box(lv);
          const px = b.x + b.w - 50, py = b.y + 36;
          const prevLv = hop > 0 ? path[hop - 1] : null;
          const pb = prevLv ? box(prevLv) : null;
          const fx = pb ? pb.x + pb.w - 50 : px, fy = pb ? pb.y + 36 : py + 40;
          const cx = lerp(fx, px, hopP), cy = lerp(fy, py, hopP);
          return (
            <g transform={`translate(${cx} ${cy})`}>
              <circle r={22} fill={foundNow ? C.fresh : C.name} />
              <text y={6} textAnchor="middle" className="st-mono" style={{ fill: "#1a1300", fontSize: 14, fontWeight: 750 }}>{lk.name}?</text>
            </g>
          );
        })()}
        {lk && foundNow && <Badge x={x0 + W / 2} y={505} text={`${lk.name} 을(를) ${lk.found} 에서 찾음`} p={seg(local - 300 - hop * stepDur, 300, 400)} color={C.fresh} />}
        {notFound && <Badge x={x0 + W / 2} y={505} text={`NameError: name '${lk!.name}' is not defined`} p={1} color={C.dead} />}
        {st.badge && !lk && <Badge x={x0 + W / 2} y={505} text={st.badge} p={seg(local, 300, 400)} color={C.warn} />}
      </g>
    );
  };
  return { script, render };
}
