/* ---------- 콜스택 무대 ----------
   함수 호출·재귀 레슨용. 프레임이 쌓이고 풀리는 모습 + (선택) 재귀 트리.
   데이터(StackStory)만 적으면 된다.                                       */
import { ScriptBuilder, ease, fitFont, lerp, seg, textW, type Script } from "@/lib/anim";
import { Badge, C, CodePanel } from "./prims";
import type { ReactNode } from "react";

export type StackOp =
  | { push: string; locals?: Record<string, string> }        // 프레임 쌓기 (라벨 예: "fact(3)")
  | { set: Record<string, string> }                          // 맨 위 프레임의 지역 변경/추가
  | { pop: true; ret?: string }                              // 맨 위 프레임 제거 (+ 반환값)
  | { output: string }
  | { line: number }
  | { note: string }                                         // 맨 위 프레임에 배지
  | { raise: string }                                        // 예외 발생 (맨 위 프레임에서)
  | { catch: string }                                        // 예외 처리됨 (맨 위 프레임에서)
  | { uncaught: true };                                      // 끝까지 안 잡힘 — 프로그램 종료
export type StackStep = { chapter?: string; say: string; dur?: number; ops?: StackOp[] };
export type StackStory = { code?: string[]; steps: StackStep[]; tree?: boolean };

type Frame = { id: number; label: string; locals: Record<string, string>; parent: number | null; ret?: string; done: boolean; children: number[] };
type St = { stack: number[]; frames: Record<number, Frame>; output: string; line: number; note?: string; lastPop?: { id: number; ret?: string }; lastPush?: number; exc?: string; caught?: string; uncaught?: boolean };

export function buildStack(story: StackStory): { script: Script; render: (t: number) => ReactNode } {
  const sb = new ScriptBuilder();
  const starts: number[] = [];
  story.steps.forEach((st, i) => {
    if (st.chapter) sb.chapter(st.chapter);
    starts.push(sb.t);
    const dur = st.dur ?? Math.max(2400, Math.min(6000, 1300 + st.say.replace(/[`*]/g, "").length * 90));
    sb.say(st.say, dur);
    if (i === story.steps.length - 1) sb.wait(800);
  });
  const script = sb.build();

  // 상태 접기
  const states: St[] = [];
  let cur: St = { stack: [], frames: {}, output: "", line: -1 };
  let nextId = 1;
  for (const step of story.steps) {
    cur = { ...cur, frames: Object.fromEntries(Object.entries(cur.frames).map(([k, f]) => [k, { ...f, locals: { ...f.locals }, children: [...f.children] }])), stack: [...cur.stack], note: undefined, lastPop: undefined, lastPush: undefined, caught: undefined, uncaught: undefined };
    for (const op of step.ops ?? []) {
      if ("push" in op) {
        const parent = cur.stack.length ? cur.stack[cur.stack.length - 1] : null;
        const id = nextId++;
        cur.frames[id] = { id, label: op.push, locals: { ...(op.locals ?? {}) }, parent, done: false, children: [] };
        if (parent != null) cur.frames[parent].children.push(id);
        cur.stack.push(id); cur.lastPush = id;
      } else if ("set" in op) {
        const top = cur.stack[cur.stack.length - 1];
        if (top != null) Object.assign(cur.frames[top].locals, op.set);
      } else if ("pop" in op) {
        const id = cur.stack.pop();
        if (id != null) { cur.frames[id].done = true; cur.frames[id].ret = op.ret; cur.lastPop = { id, ret: op.ret }; }
      } else if ("output" in op) cur.output += op.output;
      else if ("line" in op) cur.line = op.line;
      else if ("note" in op) cur.note = op.note;
      else if ("raise" in op) cur.exc = op.raise;
      else if ("catch" in op) { cur.caught = op.catch; cur.exc = undefined; }
      else if ("uncaught" in op) { cur.uncaught = true; }
    }
    states.push(cur);
  }
  const allFrames = Object.values(states[states.length - 1].frames);

  // 트리 배치: 깊이별 순서
  const depthOf = (f: Frame): number => (f.parent == null ? 0 : 1 + depthOf(allFrames.find((x) => x.id === f.parent)!));
  const treePos: Record<number, { x: number; y: number }> = {};
  if (story.tree) {
    const byDepth: Record<number, Frame[]> = {};
    for (const f of allFrames) (byDepth[depthOf(f)] ??= []).push(f);
    const maxD = Math.max(...Object.keys(byDepth).map(Number));
    Object.entries(byDepth).forEach(([d, fs]) => {
      fs.forEach((f, i) => { treePos[f.id] = { x: 760 + (i - (fs.length - 1) / 2) * 200, y: 70 + (Number(d) * 380) / Math.max(1, maxD) }; });
    });
  }

  const hasCode = !!story.code?.length;
  const codeLines = story.code ?? [];
  const lineH = codeLines.length > 10 ? 30 : codeLines.length > 7 ? 36 : 42;
  const codeFont = lineH < 34 ? 16 : lineH < 42 ? 18 : 20;
  const codeW = hasCode ? Math.min(360, Math.max(240, Math.max(...codeLines.map((l) => textW(l, codeFont, true))) + 56)) : 0;
  const stackX = hasCode ? codeW + 70 : 60;
  const frameW = story.tree ? 260 : 300;

  const render = (t: number) => {
    let k = 0;
    for (let i = 0; i < starts.length; i++) if (t >= starts[i]) k = i;
    const local = t - starts[k];
    const st = states[k];
    const prev = states[k - 1] ?? { stack: [], frames: {}, output: "", line: -1 };
    const pushP = seg(local, 100, 600, ease.outBack);
    const popP = seg(local, 100, 700, ease.inOut);
    const shown = states.slice(0, k + 1).reduce((m, s2) => Math.max(m, s2.line + 1), 0);
    const fresh = st.output.slice(prev.output.length);
    const typed = prev.output + fresh.slice(0, Math.ceil(seg(local, 500, 600, ease.linear) * fresh.length));
    const outLines = typed.split("\n").filter((l, i, a) => l || i < a.length - 1);

    // 프레임 카드 높이
    const fh = (f: Frame) => 44 + Math.max(1, Object.keys(f.locals).length) * 28 + 12;
    const stackBottom = 470;
    // 스택 그리기 (아래에서 위로)
    const drawn = [...st.stack];
    if (st.lastPop && popP < 1) drawn.push(st.lastPop.id);
    let y = stackBottom;
    const cards: ReactNode[] = [];
    drawn.forEach((id, i) => {
      const f = st.frames[id];
      const h = fh(f);
      y -= h;
      const isTop = i === st.stack.length - 1 && !(st.lastPop && id === st.lastPop.id);
      const popping = st.lastPop && id === st.lastPop.id;
      const pushing = st.lastPush === id;
      const p = pushing ? pushP : 1;
      const op = popping ? 1 - popP : 1;
      const dy = pushing ? lerp(-40, 0, p) : popping ? lerp(0, -60, popP) : 0;
      cards.push(
        <g key={id} transform={`translate(${stackX} ${y + dy})`} opacity={op * (pushing ? p : 1)}>
          <rect width={frameW} height={h} rx={12} fill={isTop ? "rgba(91,140,255,.14)" : C.node} stroke={isTop ? C.hi : popping ? C.dead : C.stroke} strokeWidth={isTop ? 2 : 1.3} />
          <rect x={0} y={0} width={frameW} height={30} rx={12} fill={isTop ? C.hi : C.node2} />
          <rect x={0} y={16} width={frameW} height={14} fill={isTop ? C.hi : C.node2} />
          <text x={14} y={21} className="st-mono" style={{ fill: isTop ? "#fff" : C.text, fontSize: 16, fontWeight: 700 }}>{f.label}</text>
          {isTop && <text x={frameW - 12} y={21} textAnchor="end" className="st-mono" style={{ fill: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>실행 중</text>}
          {Object.entries(f.locals).map(([n, v], j) => {
            const was = prev.frames[id]?.locals?.[n];
            const changed = was !== v;
            const flash = changed && !pushing ? 1 - seg(local, 700, 900) : 0;
            return (
              <g key={n} transform={`translate(14 ${40 + j * 28})`}>
                <rect x={-4} y={-2} width={frameW - 20} height={24} rx={6} fill={flash > 0 ? "rgba(61,220,151,.15)" : "transparent"} />
                <text y={16} className="st-mono" style={{ fill: C.name, fontSize: 15, fontWeight: 650 }}>{n}</text>
                <text x={frameW - 28} y={16} textAnchor="end" className="st-mono" style={{ fill: flash > 0 ? C.fresh : C.text, fontSize: fitFont(v, frameW - 60 - textW(n, 15, true), 15, 10, true), fontWeight: 600 }}>= {v}</text>
              </g>
            );
          })}
          {Object.keys(f.locals).length === 0 && <text x={14} y={56} className="st-m">지역 이름 없음</text>}
        </g>,
      );
      // 반환값 떠오르기
      if (popping && st.lastPop?.ret !== undefined) {
        cards.push(
          <g key={"ret" + id} transform={`translate(${stackX + frameW / 2} ${y + h + 10 - lerp(0, 90, popP)})`} opacity={1 - seg(local, 900, 400)}>
            <rect x={-70} y={-16} width={140} height={32} rx={9} fill={C.fresh} />
            <text y={6} textAnchor="middle" className="st-mono" style={{ fill: "#062", fontSize: 15, fontWeight: 750 }}>return {st.lastPop.ret}</text>
          </g>,
        );
      }
      y -= 10;
    });

    // 예외 풍선 위치: 스택 맨 위 프레임 위 (프레임이 없으면 바닥 위)
    const excY = y - 8;
    const excEl = (st.exc || st.caught || st.uncaught) ? (() => {
      const label = st.caught ? `${st.caught} — 잡힘` : st.uncaught ? `${prev.exc ?? ""} — 아무도 안 잡음 → 종료` : st.exc!;
      const isNew = !prev.exc && !!st.exc;
      const p = st.caught ? 1 - seg(local, 1200, 700) : isNew ? seg(local, 200, 500, ease.outBack) : 1;
      const col = st.caught ? C.fresh : C.dead;
      const w = textW(label, 15, false) + 36;
      const yy = st.lastPop && popP < 1 ? lerp(excY - 60, excY, popP) : excY;
      return (
        <g transform={`translate(${stackX + frameW / 2} ${yy - 22}) scale(${lerp(0.6, 1, p)})`} opacity={p}>
          <rect x={-w / 2} y={-18} width={w} height={36} rx={12} fill={col} />
          <text y={6} textAnchor="middle" style={{ fill: st.caught ? "#062" : "#fff", fontSize: 15, fontWeight: 750 }}>{label}</text>
          {!st.caught && !st.uncaught && <text y={-26} textAnchor="middle" className="st-m" style={{ fontSize: 12 }}>except 를 찾는 중 ↑</text>}
        </g>
      );
    })() : null;
    return (
      <g>
        {hasCode && <CodePanel x={36} y={40} w={codeW} lines={codeLines} shown={shown} current={st.line} lineH={lineH} fontSize={codeFont} />}
        {/* 스택 */}
        <text x={stackX} y={44} className="st-type">콜스택 (위가 실행 중)</text>
        <line x1={stackX - 12} y1={56} x2={stackX - 12} y2={stackBottom} stroke={C.stroke} strokeDasharray="4 6" />
        <line x1={stackX - 12} y1={stackBottom} x2={stackX + frameW + 12} y2={stackBottom} stroke={C.stroke} strokeWidth={2} />
        {st.stack.length === 0 && !st.lastPop && <text x={stackX} y={stackBottom - 20} className="st-m">비어 있음 — 전역 코드 실행 중</text>}
        {cards}
        {st.note && st.stack.length > 0 && !st.exc && <Badge x={stackX + frameW / 2} y={y + 2} text={st.note} p={seg(local, 500, 400)} color={C.warn} />}
        {excEl}

        {/* 재귀 트리 */}
        {story.tree && (
          <g>
            <text x={620} y={44} className="st-type">호출 트리</text>
            {allFrames.map((f) => {
              const cf = st.frames[f.id];
              if (!cf || f.parent == null) return null;
              const a = treePos[f.parent], b = treePos[f.id];
              const p = st.lastPush === f.id ? pushP : 1;
              return <line key={"e" + f.id} x1={a.x} y1={a.y + 24} x2={lerp(a.x, b.x, p)} y2={lerp(a.y + 24, b.y - 24, p)} stroke={cf.done ? C.fresh : C.stroke} strokeWidth={2} />;
            })}
            {allFrames.map((f) => {
              const cf = st.frames[f.id];
              if (!cf) return null;
              const pos = treePos[f.id];
              const active = st.stack[st.stack.length - 1] === f.id;
              const p = st.lastPush === f.id ? pushP : 1;
              const justDone = st.lastPop?.id === f.id;
              return (
                <g key={"n" + f.id} transform={`translate(${pos.x} ${pos.y}) scale(${lerp(0.6, 1, p)})`} opacity={p}>
                  <rect x={-78} y={-24} width={156} height={48} rx={12} fill={active ? C.hi : cf.done ? "rgba(61,220,151,.14)" : C.node} stroke={active ? C.hi : cf.done ? C.fresh : C.stroke} strokeWidth={active || justDone ? 2 : 1.2} />
                  <text y={cf.done ? -3 : 6} textAnchor="middle" className="st-mono" style={{ fill: active ? "#fff" : C.text, fontSize: 15, fontWeight: 700 }}>{f.label}</text>
                  {cf.done && <text y={16} textAnchor="middle" className="st-mono" style={{ fill: C.fresh, fontSize: 13, fontWeight: 650 }}>→ {cf.ret}</text>}
                </g>
              );
            })}
          </g>
        )}

        {/* 출력 */}
        {(st.output || prev.output) && (
          <g transform={`translate(${story.tree ? 620 : stackX + frameW + 60} ${story.tree ? 470 : 44})`}>
            <text className="st-type" y={0}>출력</text>
            {outLines.slice(-6).map((l, i) => <text key={i} x={0} y={26 + i * 24} className="st-mono" style={{ fill: C.fresh, fontSize: 17, fontWeight: 600 }}>{l}</text>)}
          </g>
        )}
      </g>
    );
  };
  return { script, render };
}
