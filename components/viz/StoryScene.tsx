/* ---------- 스토리보드 무대 ----------
   레슨 파일에 데이터(Story)만 적으면 객체·이름표·화살표·배지·출력·자막이
   자동으로 애니메이션된다. 대부분의 "메모리 그림" 레슨은 이걸로 만든다.   */
import { ScriptBuilder, ease, lerp, seg, textW, window_, type Script } from "@/lib/anim";
import { Arrow, Badge, C, CodePanel, NameTag, ObjBox, Pulse } from "./prims";
import type { ReactNode } from "react";

export type StoryObj = {
  type: string; value?: string; items?: string[]; entries?: [string, string][]; fields?: [string, string][];
  /** 셀 안에 화살표 대신 다른 객체를 가리키게: items 대신 refs */
  refs?: string[];
  note?: string;
};
export type StoryOp =
  | { obj: string; type: string; value?: string; items?: string[]; entries?: [string, string][]; fields?: [string, string][]; refs?: string[]; note?: string }
  | { bind: string; to: string; frame?: string }
  | { unbind: string; frame?: string }
  | { del: string }
  | { mutate: string; value?: string; items?: string[]; entries?: [string, string][]; fields?: [string, string][]; refs?: string[]; note?: string }
  | { badge: string; text: string; color?: "hi" | "fresh" | "name" | "dead" | "warn"; id?: string }
  | { unbadge: string }
  | { pulse: string }
  | { output: string }
  | { line: number }
  | { clear: true }
  | { label: string; text: string }     // 자유 라벨 (객체 컬럼 위쪽)
  | { unlabel: string };
export type StoryStep = { chapter?: string; say: string; dur?: number; ops?: StoryOp[] };
export type Story = { code?: string[]; steps: StoryStep[]; codeTitle?: string; twoCols?: boolean };

const PRIM = new Set(["int", "float", "str", "bool", "NoneType", "None", "complex", "bytes"]);
const COLORS = { hi: C.hi, fresh: C.fresh, name: C.name, dead: C.dead, warn: C.warn };

type Binding = { name: string; frame: string; to: string };
type Badge_ = { id: string; target: string; text: string; color: string };
type State = {
  objs: Record<string, StoryObj>; order: string[];
  binds: Binding[]; badges: Badge_[]; labels: Record<string, string>;
  pulses: string[]; output: string; line: number; cleared: boolean;
};

function fold(story: Story) {
  const states: State[] = [];
  let s: State = { objs: {}, order: [], binds: [], badges: [], labels: {}, pulses: [], output: "", line: -1, cleared: false };
  for (const step of story.steps) {
    s = { ...s, objs: { ...s.objs }, order: [...s.order], binds: [...s.binds], badges: [...s.badges], labels: { ...s.labels }, pulses: [], cleared: false };
    for (const op of step.ops ?? []) {
      if ("clear" in op) { s = { ...s, objs: {}, order: [], binds: [], badges: [], labels: {}, pulses: [], output: "", line: -1, cleared: true }; }
      else if ("obj" in op) { const { obj, ...rest } = op; s.objs[obj] = rest; if (!s.order.includes(obj)) s.order.push(obj); }
      else if ("bind" in op) {
        const frame = op.frame ?? "";
        const i = s.binds.findIndex((b) => b.name === op.bind && b.frame === frame);
        if (i >= 0) s.binds[i] = { name: op.bind, frame, to: op.to }; else s.binds.push({ name: op.bind, frame, to: op.to });
      }
      else if ("unbind" in op) { s.binds = s.binds.filter((b) => !(b.name === op.unbind && b.frame === (op.frame ?? ""))); }
      else if ("del" in op) { delete s.objs[op.del]; s.binds = s.binds.filter((b) => b.to !== op.del); s.badges = s.badges.filter((b) => b.target !== op.del); }
      else if ("mutate" in op) { const { mutate, ...rest } = op; s.objs[mutate] = { ...s.objs[mutate], ...rest }; }
      else if ("badge" in op) { const id = op.id ?? op.badge + ":" + op.text; s.badges = s.badges.filter((b) => b.id !== id); s.badges.push({ id, target: op.badge, text: op.text, color: COLORS[op.color ?? "hi"] }); }
      else if ("unbadge" in op) { s.badges = s.badges.filter((b) => b.target !== op.unbadge && b.id !== op.unbadge); }
      else if ("pulse" in op) s.pulses.push(op.pulse);
      else if ("output" in op) s.output += op.output;
      else if ("line" in op) s.line = op.line;
      else if ("label" in op) s.labels[op.label] = op.text;
      else if ("unlabel" in op) delete s.labels[op.unlabel];
    }
    states.push(s);
  }
  return states;
}

const objH = (o: StoryObj) => o.items || o.refs ? 132 : o.entries ? 62 + Math.min(6, o.entries.length) * 34 + 12 : o.fields ? 62 + Math.min(6, o.fields.length) * 34 + 12 : PRIM.has(o.type) ? 100 : 100;
const objW = (o: StoryObj) => {
  if (o.items) return Math.max(200, Math.min(400, 32 + o.items.length * 66));
  if (o.refs) return Math.max(200, Math.min(400, 32 + o.refs.length * 66));
  if (o.entries || o.fields) return 270;
  return Math.max(200, Math.min(340, textW(o.value ?? "", 30, true) + 40));
};

export function buildStory(story: Story): { script: Script; render: (t: number) => ReactNode } {
  const states = fold(story);
  const sb = new ScriptBuilder();
  const starts: number[] = [];
  story.steps.forEach((st, i) => {
    if (st.chapter) sb.chapter(st.chapter);
    starts.push(sb.t);
    const dur = st.dur ?? Math.max(2600, Math.min(6000, 1400 + st.say.replace(/[`*]/g, "").length * 95));
    sb.say(st.say, dur);
    if (i === story.steps.length - 1) sb.wait(800);
  });
  const script = sb.build();

  // 레이아웃 (viewBox 1200 x 520)
  const hasCode = !!story.code?.length;
  const codeLines = story.code ?? [];
  const lineH = codeLines.length > 10 ? 32 : codeLines.length > 7 ? 38 : 44;
  const codeFont = lineH < 36 ? 17 : lineH < 44 ? 19 : 22;
  const codeW = hasCode ? Math.min(430, Math.max(300, Math.max(...codeLines.map((l) => textW(l, codeFont, true))) + 60)) : 0;
  const tagX = hasCode ? codeW + 70 : 50;
  const objX0 = tagX + 250;
  const colW = 290;
  const cols = story.twoCols ? 2 : Math.max(1, Math.min(3, Math.floor((1200 - objX0 + 60) / colW)));

  // 전역 슬롯: 등장 순서대로, 열 채우기
  const allIds: string[] = [];
  for (const st of states) for (const id of st.order) if (!allIds.includes(id)) allIds.push(id);
  const objMeta: Record<string, StoryObj> = {};
  for (const st of states) for (const id of st.order) if (st.objs[id]) objMeta[id] = st.objs[id]; // 마지막으로 존재한 형태 기준 크기
  const slot: Record<string, { x: number; y: number }> = {};
  const GAP = 18;
  {
    // clear 이후에는 배치를 처음부터 다시 (id 는 스토리 안에서 유일해야 한다)
    let cursor: number[] = Array(cols).fill(64);
    const place = (id: string, col: number, minY: number) => {
      if (slot[id]) return slot[id];
      const c = Math.min(col, cols - 1);
      const y = Math.max(cursor[c], minY);
      slot[id] = { x: objX0 + c * colW, y };
      cursor[c] = y + objH(objMeta[id]) + GAP;
      return slot[id];
    };
    for (const st of states) {
      if (st.cleared) cursor = Array(cols).fill(64);
      for (const id of st.order) {
        if (id in slot || !objMeta[id]) continue;
        // 이 객체를 refs 로 가리키는 부모가 이미 배치되어 있으면 부모 옆 열에
        const parent = Object.entries(objMeta).find(([pid, o]) => o.refs?.includes(id) && pid in slot);
        let mine: { x: number; y: number };
        if (parent) {
          const ps = slot[parent[0]];
          mine = place(id, Math.round((ps.x - objX0) / colW) + 1, ps.y);
        } else {
          // 첫 열이 넘치면 다음 열
          let best = 0;
          for (let c = 1; c < cols; c++) if (cursor[c] + objH(objMeta[id]) <= 505 && cursor[best] + objH(objMeta[id]) > 505) best = c;
          mine = place(id, best, 0);
        }
        // 자식들 즉시 배치 (부모 옆 열)
        const o = objMeta[id];
        if (o.refs) {
          const pcol = Math.round((mine.x - objX0) / colW);
          for (const rid of o.refs) if (objMeta[rid]) place(rid, pcol + 1, mine.y);
        }
      }
    }
  }
  // 넘치면 객체 영역 전체를 축소
  const maxBottom = Math.max(505, ...Object.entries(slot).map(([id, p]) => p.y + objH(objMeta[id])));
  const zoom = Math.min(1, (505 - 64) / (maxBottom - 64));
  const allNames: string[] = [];
  for (const st of states) for (const b of st.binds) { const k = b.frame + ":" + b.name; if (!allNames.includes(k)) allNames.push(k); }

  const render = (t: number) => {
    let k = 0;
    for (let i = 0; i < starts.length; i++) if (t >= starts[i]) k = i;
    const local = t - starts[k];
    const st = states[k];
    const prev = states[k - 1] ?? { ...st, objs: {}, order: [], binds: [], badges: [], labels: {}, pulses: [], output: "", line: -1, cleared: false };
    const appear = seg(local, 150, 650, ease.outBack);
    const swing = seg(local, 250, 1000, ease.outBack);
    const vanish = 1 - seg(local, 0, 450);
    const clearFade = st.cleared ? seg(local, 0, 500) : 1;

    // 이름 배치 (프레임별 그룹)
    const liveNames = allNames.filter((kk) => st.binds.some((b) => b.frame + ":" + b.name === kk) || prev.binds.some((b) => b.frame + ":" + b.name === kk));
    const frames: string[] = [];
    for (const kk of liveNames) { const f = kk.split(":")[0]; if (!frames.includes(f)) frames.push(f); }
    const nameY: Record<string, number> = {};
    const frameY: Record<string, number> = {};
    let yy = 70;
    for (const f of frames) {
      if (f) { frameY[f] = yy; yy += 30; }
      for (const kk of liveNames) if (kk.split(":")[0] === f) { nameY[kk] = yy; yy += 70; }
      yy += 8;
    }

    const sx = (x: number) => objX0 + (x - objX0) * zoom;
    const sy = (y: number) => 64 + (y - 64) * zoom;
    const anchor = (id: string) => {
      const o = st.objs[id] ?? prev.objs[id];
      if (o && slot[id]) return { x: sx(slot[id].x), y: sy(slot[id].y), w: objW(o) * zoom, h: objH(o) * zoom };
      const nk = liveNames.find((kk) => kk.split(":")[1] === id);
      if (nk) return { x: tagX, y: nameY[nk], w: Math.max(72, id.length * 13 + 34), h: 48 };
      return null;
    };

    const codeShown = st.line >= 0 ? st.line + 1 : hasCode ? (states.slice(0, k + 1).reduce((m, s2) => Math.max(m, s2.line + 1), 0)) : 0;

    return (
      <g>
        {hasCode && (
          <g>
            <CodePanel x={36} y={40} w={codeW} lines={codeLines} shown={Math.max(codeShown, states.slice(0, k + 1).reduce((m, s2) => Math.max(m, s2.line + 1), 0))} current={st.line} lineH={lineH} fontSize={codeFont} title={story.codeTitle ?? "코드"} />
            {(st.output || prev.output) && (() => {
              const out = st.output, before = prev.output;
              const fresh = out.slice(before.length);
              const typed = before + fresh.slice(0, Math.ceil(seg(local, 300, 700, ease.linear) * fresh.length));
              const y0 = 40 + codeLines.length * lineH + 52 + 22;
              return (
                <g transform={`translate(36 ${y0})`}>
                  <text x={0} y={0} className="st-type">출력</text>
                  {typed.split("\n").filter((l, i, a) => l || i < a.length - 1).map((l, i) => (
                    <text key={i} x={0} y={28 + i * 26} className="st-mono" style={{ fill: C.fresh, fontSize: 19, fontWeight: 650 }}>{l}</text>
                  ))}
                </g>
              );
            })()}
          </g>
        )}

        {/* 컬럼 라벨 */}
        <g opacity={(liveNames.length || allIds.some((id) => st.objs[id])) ? 1 : 0}>
          <text x={tagX} y={44} className="st-type">이름</text>
          <text x={objX0} y={44} className="st-type">객체 (메모리)</text>
          <line x1={objX0 - 36} y1={30} x2={objX0 - 36} y2={505} stroke={C.stroke} strokeDasharray="4 6" />
        </g>
        {Object.entries(st.labels).map(([id, text], i) => (
          <Badge key={id} x={objX0 + 120 + i * 260} y={20} text={text} p={prev.labels[id] === text ? 1 : seg(local, 100, 400)} color={C.arrow} />
        ))}

        {/* 프레임 헤더 */}
        {frames.filter(Boolean).map((f) => (
          <g key={f} transform={`translate(${tagX - 10} ${frameY[f]})`}>
            <rect width={200} height={22} rx={6} fill={C.node2} />
            <text x={10} y={16} className="st-type st-mono">{f}</text>
          </g>
        ))}

        {/* 객체 (넘치면 축소) */}
        <g transform={`translate(${objX0} 64) scale(${zoom}) translate(${-objX0} -64)`}>
        {allIds.map((id) => {
          const cur = st.objs[id], was = prev.objs[id];
          if (!cur && !was) return null;
          const o = cur ?? was!;
          const p = cur ? (was ? 1 : appear) : vanish * (st.cleared ? 1 - clearFade : 1);
          const isNew = !!cur && !was;
          const changed = !!cur && !!was && JSON.stringify(cur) !== JSON.stringify(was);
          const pulsed = st.pulses.includes(id);
          const glow = (isNew ? 1 - seg(local, 900, 1400) : 0) + (changed ? 1 - seg(local, 1000, 1200) : 0) + (pulsed ? window_(local, 0, 2400, 300) : 0);
          const { x, y } = slot[id];
          const w = objW(o), h = objH(o);
          const noteEl = o.note ? <text x={w / 2} y={h + 22} textAnchor="middle" className="st-m" style={{ fontSize: 13 }}>{o.note}</text> : null;
          if (o.items || o.refs) {
            const items = o.items ?? o.refs!.map((r) => "");
            const prevN = was?.items?.length ?? was?.refs?.length ?? (isNew ? 0 : items.length);
            const cellW = Math.max(46, Math.min(72, (w - 32) / items.length - 8));
            return (
              <ObjBox key={id} x={x} y={y} w={w} h={h} type={o.type} p={p} glow={Math.min(1, glow)} tone={isNew && local < 2200 ? "fresh" : "normal"}>
                {items.map((it, i) => {
                  const fresh = i >= prevN;
                  const q = fresh ? seg(local, 400, 700, ease.outBack) : 1;
                  const cx = 16 + i * (cellW + 8);
                  const wasVal = was?.items?.[i];
                  const valChanged = !fresh && wasVal !== undefined && wasVal !== it;
                  const flip = valChanged ? seg(local, 300, 600, ease.outBack) : 1;
                  return (
                    <g key={i} opacity={q} transform={`translate(${cx + cellW / 2} 76) scale(${lerp(0.5, 1, q)}) translate(${-cellW / 2} -30)`}>
                      <rect width={cellW} height={60} rx={10} fill={C.node2} stroke={(fresh && local < 2200) || (valChanged && local < 2200) ? C.fresh : C.stroke} strokeWidth={1.5} />
                      {o.items && <text x={cellW / 2} y={39} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: it.length > 4 ? 14 : 22, fontWeight: 650, opacity: flip }}>{it.length > 7 ? it.slice(0, 6) + "…" : it}</text>}
                      {o.refs && <circle cx={cellW / 2} cy={30} r={6} fill={C.arrow} />}
                      <text x={cellW / 2} y={-6} textAnchor="middle" className="st-id st-mono">{i}</text>
                    </g>
                  );
                })}
                {items.length === 0 && <text x={w / 2} y={h / 2 + 14} textAnchor="middle" className="st-m">비어 있음</text>}
                {noteEl}
              </ObjBox>
            );
          }
          if (o.entries || o.fields) {
            const rows = o.entries ?? o.fields!;
            const prevRows = was?.entries ?? was?.fields ?? [];
            return (
              <ObjBox key={id} x={x} y={y} w={w} h={h} type={o.type} p={p} glow={Math.min(1, glow)} tone={isNew && local < 2200 ? "fresh" : "normal"}>
                {rows.slice(0, 6).map(([kk, v], i) => {
                  const pr = prevRows.find((r) => r[0] === kk);
                  const fresh = !pr && !isNew;
                  const vchg = pr && pr[1] !== v;
                  const q = fresh ? seg(local, 400, 600, ease.outBack) : 1;
                  return (
                    <g key={i} opacity={q} transform={`translate(16 ${46 + i * 34})`}>
                      <rect width={w - 32} height={30} rx={8} fill={C.node2} stroke={(fresh || vchg) && local < 2200 ? C.fresh : "none"} />
                      <text x={10} y={21} className="st-mono" style={{ fill: C.name, fontSize: 15, fontWeight: 650 }}>{kk}</text>
                      <text x={w - 42} y={21} textAnchor="end" className="st-mono" style={{ fill: C.text, fontSize: 15 }}>{v.length > 20 ? v.slice(0, 19) + "…" : v}</text>
                    </g>
                  );
                })}
                {noteEl}
              </ObjBox>
            );
          }
          const vchg = !!was && was.value !== o.value;
          const flip = vchg ? seg(local, 200, 500, ease.outBack) : 1;
          return (
            <ObjBox key={id} x={x} y={y} w={w} h={h} type={o.type} p={p} glow={Math.min(1, glow)} tone={isNew && local < 2200 ? "fresh" : "normal"}>
              {o.value !== undefined && (
                <g transform={`translate(${w / 2} ${h / 2 + 12}) scale(${lerp(0.6, 1, flip)})`} opacity={flip}>
                  <text textAnchor="middle" className="st-val st-mono" style={{ fontSize: o.value.length > 12 ? 18 : o.value.length > 6 ? 24 : 30 }}>{o.value}</text>
                </g>
              )}
              {noteEl}
            </ObjBox>
          );
        })}
        </g>

        {/* refs 셀 → 객체 화살표 */}
        {allIds.map((id) => {
          const o = st.objs[id];
          if (!o?.refs) return null;
          const a = anchor(id)!;
          const cellW = Math.max(46, Math.min(72, (objW(o) - 32) / o.refs.length - 8)) * zoom;
          return o.refs.map((rid, i) => {
            const b = anchor(rid);
            if (!b) return null;
            const wasRef = prev.objs[id]?.refs?.[i];
            const isNew = wasRef !== rid;
            const x1 = a.x + (16 + i * (cellW / zoom + 8)) * zoom + cellW / 2, y1 = a.y + 76 * zoom;
            const toRight = b.x > a.x + a.w - 10;
            return <Arrow key={id + i} x1={x1} y1={y1} x2={toRight ? b.x - 4 : b.x + b.w / 2} y2={toRight ? b.y + Math.min(40, b.h / 2) : (b.y > a.y ? b.y - 4 : b.y + b.h + 4)} p={isNew ? seg(local, 500, 700, ease.out) : 1} width={2.5} />;
          });
        })}

        {/* 이름표 + 화살표 */}
        {liveNames.map((kk) => {
          const [frame, name] = [kk.split(":")[0], kk.split(":").slice(1).join(":")];
          const b = st.binds.find((x) => x.frame === frame && x.name === name);
          const pb = prev.binds.find((x) => x.frame === frame && x.name === name);
          const isNew = !!b && !pb, gone = !b;
          const p = gone ? vanish : isNew ? appear : 1;
          const y = nameY[kk];
          const tagW = Math.max(72, name.length * 13 + 34);
          const to = b ? anchor(b.to) : null, from = pb ? anchor(pb.to) : null;
          const retarget = !!(b && pb && b.to !== pb.to);
          const endOf = (a: { x: number; y: number; w: number; h: number } | null) => a && { x: a.x - 4, y: a.y + Math.min(50, a.h / 2) };
          const e1 = endOf(from ?? to), e2 = endOf(to ?? from);
          const end = e1 && e2 ? { x: lerp(e1.x, e2.x, retarget ? swing : 1), y: lerp(e1.y, e2.y, retarget ? swing : 1) } : e2;
          const pulsed = st.pulses.includes(name);
          return (
            <g key={kk}>
              <NameTag x={tagX} y={y} name={name} p={p} w={tagW} glow={isNew ? 1 - seg(local, 800, 1200) : retarget ? 1 - seg(local, 1200, 1000) : pulsed ? window_(local, 0, 2400, 300) : 0} />
              {end && <Arrow x1={tagX + tagW + 4} y1={y + 24} x2={end.x} y2={end.y} p={isNew ? seg(local, 450, 700, ease.out) : gone ? vanish : 1} color={retarget && swing < 1 ? C.name : C.arrow} />}
            </g>
          );
        })}

        {/* 펄스 */}
        {st.pulses.map((id) => {
          const a = anchor(id); if (!a) return null;
          return <Pulse key={id} cx={a.x + a.w / 2} cy={a.y + a.h / 2} t={local} start={0} on={local < 2400} r1={Math.max(a.w, a.h) * 0.7} />;
        })}

        {/* 배지 */}
        {st.badges.map((bd) => {
          const a = anchor(bd.target); if (!a) return null;
          const was = prev.badges.some((x) => x.id === bd.id);
          const isName = a.h === 48;
          return <Badge key={bd.id} x={a.x + a.w / 2} y={isName ? a.y + a.h + 24 : a.y - 22} text={bd.text} p={was ? 1 : seg(local, 600, 400)} color={bd.color} />;
        })}
        {prev.badges.filter((x) => !st.badges.some((y) => y.id === x.id)).map((bd) => {
          const a = anchor(bd.target); if (!a) return null;
          const isName = a.h === 48;
          return <Badge key={"gone" + bd.id} x={a.x + a.w / 2} y={isName ? a.y + a.h + 24 : a.y - 22} text={bd.text} p={vanish} color={bd.color} />;
        })}
        {!hasCode && st.output && (
          <g transform="translate(50 440)">
            <text x={0} y={0} className="st-type">출력</text>
            {st.output.split("\n").filter(Boolean).slice(-2).map((l, i) => <text key={i} x={0} y={28 + i * 26} className="st-mono" style={{ fill: C.fresh, fontSize: 19, fontWeight: 650 }}>{l}</text>)}
          </g>
        )}
      </g>
    );
  };
  return { script, render };
}
