"use client";
import { useEffect, useMemo, useRef } from "react";
import { Stage } from "@/components/Stage";
import { useAutoplayOnView, useTimeline } from "@/components/anim/useTimeline";
import { richSub } from "@/components/anim/ScriptedStage";
import { tokenizeLines } from "@/lib/tokenize";
import { ease, lerp, seg } from "@/lib/anim";
import type { HeapObj, Prim, Ref, Trace, TraceStep } from "@/lib/types";
import { Arrow, C, NameTag, ObjBox, Pop } from "@/components/viz/prims";

const stepMsFor = (n: number) => Math.max(1100, Math.min(2600, Math.round(34000 / Math.max(1, n))));
const PRIM = new Set(["int", "float", "str", "bool", "NoneType", "complex"]);

type Binding = { name: string; frame: number; target: string | null; prim?: string };

/* ---------- 트레이스 사전 분석: 슬롯 배정 ---------- */
function analyze(trace: Trace) {
  const objOrder: string[] = [];
  const nameOrder: string[] = []; // "frameIdx:name"
  for (const st of trace.steps) {
    const reachable = topLevel(st);
    for (const id of reachable) if (!objOrder.includes(id)) objOrder.push(id);
    st.frames.forEach((f, fi) => {
      for (const n of Object.keys(f.locals)) {
        const k = `${fi}:${n}`;
        if (!nameOrder.includes(k)) nameOrder.push(k);
      }
    });
  }
  return { objOrder, nameOrder };
}

/** 이름에서 직접 가리키는 객체 + 그 컨테이너가 품은 컨테이너 (1단계) */
function topLevel(st: TraceStep): string[] {
  const ids: string[] = [];
  const push = (id: string) => { if (st.heap[id] && !ids.includes(id)) ids.push(id); };
  for (const f of st.frames) for (const v of Object.values(f.locals)) if ("ref" in v) push(v.ref);
  // 컨테이너 내부의 컨테이너
  for (const id of [...ids]) {
    const o = st.heap[id];
    const kids = [...(o.items ?? []), ...(o.entries?.flat() ?? []), ...Object.values(o.fields ?? {})];
    for (const k of kids) if ("ref" in k && st.heap[k.ref] && !PRIM.has(st.heap[k.ref].type)) push(k.ref);
  }
  return ids;
}

const short = (id: string) => "…" + id.slice(-4);
const valOf = (heap: Record<string, HeapObj>, v: Ref | Prim) => ("prim" in v ? v.prim : heap[v.ref]?.repr ?? "?");

/* 객체 상자 높이 */
function objH(o: HeapObj) {
  if (PRIM.has(o.type)) return 92;
  if (o.items) return 136;
  if (o.entries) return 60 + Math.min(6, o.entries.length) * 34 + 10;
  if (o.fields) return 60 + Math.min(6, Object.keys(o.fields).length) * 34 + 10;
  return 92;
}
function objW(o: HeapObj) {
  if (PRIM.has(o.type)) return Math.max(200, Math.min(320, o.repr.length * 14 + 60));
  if (o.items) return Math.max(220, Math.min(380, 24 + o.items.length * 62));
  return 260;
}

/* ---------- 객체 렌더 ---------- */
function HeapObject({ o, x, y, p, glow, heap, prevItems }: { o: HeapObj; x: number; y: number; p: number; glow: number; heap: Record<string, HeapObj>; prevItems: number }) {
  const w = objW(o), h = objH(o);
  if (PRIM.has(o.type)) {
    return <ObjBox x={x} y={y} w={w} h={h} type={o.type} value={o.repr} id={short(o.id)} p={p} glow={glow} />;
  }
  if (o.items) {
    const n = o.items.length;
    const cellW = Math.max(46, Math.min(70, (w - 32) / n - 8));
    return (
      <ObjBox x={x} y={y} w={w} h={h} type={o.type} id={short(o.id)} p={p} glow={glow}>
        {o.items.map((it, i) => {
          const fresh = i >= prevItems;
          const q = fresh ? seg(p, 0.5, 0.5, ease.outBack) : 1;
          const cx = 16 + i * (cellW + 8);
          const txt = valOf(heap, it);
          return (
            <g key={i} opacity={q} transform={`translate(${cx + cellW / 2} ${44 + 28}) scale(${lerp(0.5, 1, q)}) translate(${-cellW / 2} -28)`}>
              <rect width={cellW} height={56} rx={10} fill={C.node2} stroke={fresh && glow > 0 ? C.fresh : C.stroke} strokeWidth={1.5} />
              <text x={cellW / 2} y={36} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: txt.length > 4 ? 13 : 20, fontWeight: 650 }}>{txt.length > 8 ? txt.slice(0, 7) + "…" : txt}</text>
              <text x={cellW / 2} y={-6} textAnchor="middle" className="st-id st-mono">{i}</text>
            </g>
          );
        })}
        {n === 0 && <text x={w / 2} y={h / 2 + 12} textAnchor="middle" className="st-m">비어 있음</text>}
      </ObjBox>
    );
  }
  const rows: [string, string][] = o.entries
    ? o.entries.slice(0, 6).map(([k, v]) => [valOf(heap, k), valOf(heap, v)])
    : Object.entries(o.fields ?? {}).slice(0, 6).map(([k, v]) => [k, valOf(heap, v)]);
  return (
    <ObjBox x={x} y={y} w={w} h={h} type={o.type} id={short(o.id)} p={p} glow={glow} value={rows.length ? undefined : o.repr}>
      {rows.map(([k, v], i) => (
        <g key={i} transform={`translate(16 ${44 + i * 34})`}>
          <rect width={w - 32} height={30} rx={8} fill={C.node2} />
          <text x={10} y={20} className="st-mono" style={{ fill: C.name, fontSize: 14, fontWeight: 650 }}>{k}</text>
          <text x={w - 42} y={20} textAnchor="end" className="st-mono" style={{ fill: C.text, fontSize: 14 }}>{v.length > 18 ? v.slice(0, 17) + "…" : v}</text>
        </g>
      ))}
    </ObjBox>
  );
}

/* ---------- 힙 패널 ---------- */
function HeapPanel({ trace, stepIdx, prevIdx, local, order }: { trace: Trace; stepIdx: number; prevIdx: number; local: number; order: ReturnType<typeof analyze> }) {
  const st = trace.steps[stepIdx];
  const prev = trace.steps[prevIdx] ?? st;
  const W = 680;
  const tagX = 24, objX = 300;

  // 객체 슬롯 (y 누적)
  const curIds = topLevel(st), prevIds = topLevel(prev);
  const union = order.objOrder.filter((id) => curIds.includes(id) || prevIds.includes(id));
  const pos: Record<string, { x: number; y: number }> = {};
  let y = 30;
  for (const id of union) {
    const o = st.heap[id] ?? prev.heap[id];
    pos[id] = { x: objX, y };
    y += objH(o) + 22;
  }
  const H0 = Math.max(500, y + 10);

  // 이름 바인딩 (현재 & 이전)
  const bind = (s: TraceStep): Binding[] =>
    s.frames.flatMap((f, fi) => Object.entries(f.locals).map(([name, v]) => ({ name, frame: fi, target: "ref" in v ? v.ref : null, prim: "prim" in v ? v.prim : undefined })));
  const cur = bind(st), before = bind(prev);
  const names = order.nameOrder.filter((k) => cur.some((b) => `${b.frame}:${b.name}` === k) || before.some((b) => `${b.frame}:${b.name}` === k));
  // 프레임별로 묶어 배치 (모듈 → 안쪽 함수 순)
  const namePos: Record<string, number> = {};
  const frameHeads: { y: number; label: string; top: boolean }[] = [];
  {
    const byFrame: Record<number, string[]> = {};
    for (const k of names) { const fi = Number(k.split(":")[0]); (byFrame[fi] ??= []).push(k); }
    const frameIdxs = Object.keys(byFrame).map(Number).sort((a, b) => a - b);
    const multi = st.frames.length > 1 || prev.frames.length > 1;
    let y = 40;
    for (const fi of frameIdxs) {
      if (multi) { const fr = st.frames[fi] ?? prev.frames[fi]; frameHeads.push({ y, label: fr?.fn === "<module>" ? "전역 (모듈)" : `${fr?.fn ?? "?"}()`, top: fi === st.frames.length - 1 }); y += 30; }
      for (const k of byFrame[fi]) { namePos[k] = y; y += 72; }
      y += 6;
    }
  }

  const H = Math.max(H0, Object.values(namePos).reduce((m, v) => Math.max(m, v), 0) + 80);
  const appear = seg(local, 150, 650, ease.outBack);
  const move = seg(local, 250, 900, ease.outBack);
  const vanish = 1 - seg(local, 0, 500);

  const topFrame = st.frames.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin meet">
      <text x={tagX} y={20} className="st-type">이름</text>
      <text x={objX} y={20} className="st-type">객체</text>
      <line x1={objX - 30} y1={8} x2={objX - 30} y2={H - 8} stroke={C.stroke} strokeDasharray="4 6" />

      {/* 객체 */}
      {union.map((id) => {
        const inCur = curIds.includes(id), inPrev = prevIds.includes(id);
        const o = (inCur ? st.heap[id] : prev.heap[id])!;
        const p = inCur ? (inPrev ? 1 : appear) : vanish;
        const prevItems = prev.heap[id]?.items?.length ?? (inPrev ? 0 : 0);
        const changed = inPrev && inCur && (prev.heap[id]?.repr !== o.repr);
        const glow = (!inPrev && inCur ? 1 - seg(local, 900, 1500) : 0) + (changed ? 1 - seg(local, 1200, 1200) : 0);
        return <HeapObject key={id} o={o} x={pos[id].x} y={pos[id].y} p={p} glow={Math.min(1, glow)} heap={inCur ? st.heap : prev.heap} prevItems={inPrev ? prevItems : 99} />;
      })}

      {/* 프레임 헤더 */}
      {frameHeads.map((h, i) => (
        <g key={i} transform={`translate(${tagX - 8} ${h.y})`}>
          <rect width={220} height={22} rx={6} fill={h.top ? "rgba(91,140,255,.22)" : C.node2} stroke={h.top ? C.hi : "none"} />
          <text x={10} y={16} className="st-type st-mono" style={{ fill: h.top ? C.text : undefined }}>{h.label}</text>
        </g>
      ))}
      {/* 이름표 + 화살표 */}
      {names.map((k) => {
        const b = cur.find((x) => `${x.frame}:${x.name}` === k);
        const pb = before.find((x) => `${x.frame}:${x.name}` === k);
        const isNew = !pb && !!b;
        const gone = !b;
        const p = gone ? vanish : isNew ? appear : 1;
        const yy = namePos[k];
        const name = (b ?? pb)!.name;
        const dim = (b ?? pb)!.frame !== topFrame && st.frames.length > 1;
        const tagW = Math.max(64, name.length * 12 + 30);
        // 화살표 목표
        const tgt = (bb?: Binding) => (bb?.target && pos[bb.target] ? { x: pos[bb.target].x - 4, y: pos[bb.target].y + Math.min(46, objH((st.heap[bb.target] ?? prev.heap[bb.target])!) / 2) } : null);
        const to = tgt(b), from = tgt(pb) ?? to;
        const retarget = !!(b && pb && b.target !== pb.target);
        const end = to && from ? { x: lerp(from.x, to.x, retarget ? move : 1), y: lerp(from.y, to.y, retarget ? move : 1) } : to;
        return (
          <g key={k} opacity={dim ? 0.45 : 1}>
            <NameTag x={tagX} y={yy} name={name} p={p} w={tagW} glow={isNew ? 1 - seg(local, 800, 1400) : retarget ? 1 - seg(local, 1200, 1400) : 0} />
            {end && <Arrow x1={tagX + tagW + 4} y1={yy + 22} x2={end.x} y2={end.y} p={isNew ? seg(local, 450, 800, ease.out) : gone ? vanish : 1} color={retarget && move < 1 ? C.name : C.arrow} />}
            {b?.prim !== undefined && !b.target && (
              <Pop x={tagX + tagW + 16} y={yy + 4} w={120} h={36} p={p}>
                <rect width={Math.max(60, b.prim.length * 11 + 20)} height={36} rx={9} fill={C.node2} stroke={C.stroke} />
                <text x={12} y={24} className="st-mono" style={{ fill: C.text, fontSize: 16 }}>{b.prim}</text>
              </Pop>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- 메인 ----------
   표시 스텝 k  ⇔  trace.steps[k+1] 이 "지금 실행되는 줄".
   화면에는 그 줄이 실행된 **뒤**의 상태(steps[k+2])를, 실행 전 상태에서 애니메이션으로 보여준다.
   ("이 줄이 실행되면 → 이렇게 된다")                                                     */
export function TracePlayer({ trace, title, autoplay = false, initialT }: { trace: Trace; title?: string; autoplay?: boolean; initialT?: number }) {
  const n = Math.max(1, trace.steps.length - 1);
  const STEP_MS = stepMsFor(n);
  const total = n * STEP_MS;
  const tl = useTimeline(total);
  const wrap = useRef<HTMLDivElement>(null);
  useAutoplayOnView(wrap, tl.play, autoplay && initialT === undefined);
  useEffect(() => { if (initialT !== undefined) tl.seek(initialT); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [initialT]);
  const order = useMemo(() => analyze(trace), [trace]);
  const lines = useMemo(() => tokenizeLines(trace.code), [trace.code]);

  const k = Math.min(n - 1, Math.floor(tl.t / STEP_MS));
  const local = tl.t - k * STEP_MS;
  const lineStep = trace.steps[k + 1] ?? trace.steps[0];
  const beforeIdx = k + 1;
  const afterIdx = Math.min(trace.steps.length - 1, k + 2);
  const after = trace.steps[afterIdx];
  const before = trace.steps[beforeIdx];
  const marks = useMemo(() => Array.from({ length: n }, (_, i) => i * STEP_MS), [n, STEP_MS]);

  const finished = lineStep.event === "return" && lineStep.frames.length <= 1 && k === n - 1;
  const errored = lineStep.event === "exception" || !!after.exc;

  // 출력 타자 효과: 이 줄이 만든 출력만 타이핑
  const prevOut = before.stdout;
  const fresh = after.stdout.slice(prevOut.length);
  const typed = prevOut + fresh.slice(0, Math.ceil(seg(local, 500, 700, ease.linear) * fresh.length));

  const doneLines = new Set<number>();
  for (let i = 1; i <= k; i++) doneLines.add(trace.steps[i].line);

  const topFn = lineStep.frames[lineStep.frames.length - 1]?.fn;
  const note = lineStep.note ? richSub(lineStep.note)
    : finished ? "실행 끝"
    : errored ? <span style={{ color: C.dead }}>{after.exc ?? lineStep.exc}</span>
    : lineStep.event === "return" && lineStep.retval !== undefined ? richSub("**" + topFn + "()** 가 `" + lineStep.retval + "` 를 돌려주고 프레임이 사라진다")
    : lineStep.event === "call" ? richSub("**" + topFn + "()** 호출 — 새 프레임이 쌓이고 인자가 이름에 붙는다")
    : null;
  const headLabel = finished ? "실행 끝" : lineStep.event === "call" ? `${lineStep.line}번째 줄 · 함수 진입` : lineStep.event === "return" ? `${lineStep.line}번째 줄 · 함수 반환` : `${lineStep.line}번째 줄 실행`;

  return (
    <div ref={wrap}>
      <Stage
        tall title={title ?? "실행 추적"} kicker="한 줄씩"
        transport={{
          t: tl.t, total, playing: tl.playing, toggle: tl.toggle, seek: tl.seek,
          speed: tl.speed, setSpeed: tl.setSpeed, marks,
          stepBack: () => tl.seek(Math.max(0, (local > 400 ? k : k - 1)) * STEP_MS),
          stepFwd: () => tl.seek(Math.min(n - 1, k + 1) * STEP_MS),
          timeLabel: `${k + 1} / ${n}`,
        }}
        speeds={[0.5, 1, 1.5, 2]}
      >
        <div className="tp">
          <div className="tp-code">
            <div className="tp-code-head">코드 · {headLabel}</div>
            <pre>
              {lines.map((toks, i) => (
                <div key={i} className="tp-line" data-cur={i + 1 === lineStep.line && !finished} data-done={doneLines.has(i + 1) && i + 1 !== lineStep.line}>
                  <span className="ln">{i + 1}</span>
                  {toks.map((tk, j) => tk.t === "ws" || tk.t === "id" ? <span key={j}>{tk.v}</span> : <span key={j} className={`tk-${tk.t}`}>{tk.v}</span>)}
                  {toks.length === 0 && " "}
                </div>
              ))}
            </pre>
          </div>
          <div className="tp-heap">
            <HeapPanel trace={trace} stepIdx={afterIdx} prevIdx={beforeIdx} local={local} order={order} />
            {note && <div className="tp-note"><div>{note}</div></div>}
          </div>
          <div className="tp-tray">
            <div>
              <h4>출력</h4>
              <div className="tp-out">{typed || <span style={{ color: "var(--stage-muted)" }}>아직 출력 없음</span>}{!finished && <span className="cursor" />}</div>
            </div>
            <div>
              <h4>콜스택</h4>
              <div className="tp-stack">
                {after.frames.map((f, i) => (
                  <div key={i} className="tp-frame" data-top={i === after.frames.length - 1}>
                    <b>{f.fn}</b>
                    <span className="vars">{Object.entries(f.locals).map(([kk, v]) => `${kk}=${"prim" in v ? v.prim : after.heap[v.ref]?.repr ?? "…"}`).join("  ")}</span>
                  </div>
                ))}
                {after.frames.length === 0 && <span style={{ color: "var(--stage-muted)", fontSize: 12 }}>—</span>}
              </div>
            </div>
          </div>
        </div>
      </Stage>
    </div>
  );
}
