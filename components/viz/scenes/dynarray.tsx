/* 장면: 리스트 내부 — 동적 배열이 꽉 차면 더 큰 칸으로 이사한다 */
import { ScriptBuilder, seg, ease, lerp } from "@/lib/anim";
import { Badge, C } from "../prims";

// CPython 의 실제 성장 패턴 (0 → 4 → 8 → 16 → 24 …)
const GROWTH = [0, 4, 8, 16];
const N_APPEND = 9;
const STEP = 1500;

export function buildDynArrayScene() {
  const s = new ScriptBuilder();
  s.chapter("빈 리스트").mark("intro");
  s.say("리스트는 겉으로는 '늘어나는 배열' 이지만, 속은 **고정 크기 칸 묶음**이다. 처음엔 칸이 0개.", 3800);
  s.chapter("append").mark("run");
  // append 1..9 — 각 STEP, 재할당 시 +1600
  const events: { t: number; kind: "append" | "realloc"; i: number; cap?: number }[] = [];
  let cap = 0, len = 0, tt = s.t;
  const bumps: string[] = [
    "첫 `append`. 칸이 없으니 **4칸짜리 묶음**을 새로 잡는다. 1 은 그중 첫 칸에.",
    "", "", "",
    "5번째. 4칸이 **꽉 찼다.** 옆 칸을 늘릴 수는 없다 — 메모리는 이어져 있어야 하니까.",
    "", "", "",
    "9번째. 또 꽉 찼다. 이번엔 **16칸** — 여유를 점점 크게 잡는다.",
  ];
  for (let i = 0; i < N_APPEND; i++) {
    if (len === cap) {
      const nc = GROWTH[GROWTH.indexOf(cap) + 1];
      events.push({ t: tt, kind: "realloc", i, cap: nc });
      if (bumps[i]) s.say(bumps[i], 3400); else s.wait(1600);
      tt = s.t;
      if (i === 4) { s.say("그래서 **더 큰 묶음(8칸)** 을 새로 잡고, 기존 4개를 **전부 복사**한 뒤 5 를 넣는다. 이 복사가 비용이다.", 4600); tt = s.t; }
      cap = nc;
    }
    events.push({ t: tt, kind: "append", i });
    len++;
    s.wait(STEP); tt = s.t;
  }
  s.chapter("비용").mark("cost");
  s.say("복사는 가끔만 일어나고, 그 사이 append 는 **빈 칸에 넣기만** 한다. 평균하면 append 한 번은 거의 공짜 — **상각 O(1)** 이라 부른다.", 5200);
  s.say("여유 칸 덕분에 `len(lst)` 와 `sys.getsizeof(lst)` 가 다르게 움직인다. 리스트가 '남는 칸' 을 갖고 있는 것이다.", 4200);
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const cellW = 62, cellH = 62, gap = 7;
  const render = (t: number) => {
    let cap = 0, len = 0, moving = 0, copyP = 0, oldCap = 0, lastAppendT = -1, reallocAt = -1, copies = 0;
    for (const e of events) {
      if (t < e.t) break;
      if (e.kind === "realloc") { oldCap = cap; cap = e.cap!; reallocAt = e.t; copies += len; moving = len; copyP = seg(t, e.t + 500, 1800, ease.inOut); }
      else { len = e.i + 1; lastAppendT = e.t; }
    }
    const inRealloc = reallocAt >= 0 && t - reallocAt < 3200 && moving > 0;
    const newP = seg(t, reallocAt, 400, ease.outBack);
    const x0 = 100, yOld = 130, yNew = 290;
    const yMain = inRealloc ? yNew : 200;
    const costP = seg(t, M.cost, 500);

    return (
      <g>
        <text x={x0} y={70} className="st-type">len(nums) = {len}   ·   할당된 칸 = {cap}</text>
        {/* 이사 중이면 옛 묶음 */}
        {inRealloc && oldCap > 0 && (
          <g opacity={1 - seg(t, reallocAt + 2800, 350)}>
            <text x={x0} y={yOld - 14} className="st-m">옛 묶음 ({oldCap}칸) — 꽉 참</text>
            {Array.from({ length: oldCap }, (_, i) => (
              <g key={i} transform={`translate(${x0 + i * (cellW + gap)} ${yOld})`}>
                <rect width={cellW} height={cellH} rx={9} fill={C.node} stroke={C.dead} strokeWidth={1.5} />
                {i < moving && <text x={cellW / 2} y={cellH / 2 + 8} textAnchor="middle" className="st-mono" style={{ fill: C.muted, fontSize: 20, fontWeight: 650 }} opacity={1 - copyP}>{i + 1}</text>}
              </g>
            ))}
          </g>
        )}
        {/* 현재 묶음 */}
        {cap > 0 && (
          <g opacity={inRealloc ? newP : 1} transform={`translate(0 ${lerp(yMain, 200, inRealloc ? 0 : 1)})`}>
            <text x={x0} y={-14} className="st-m">{inRealloc ? `새 묶음 (${cap}칸) — 복사 중` : `${cap}칸 묶음`}</text>
            {Array.from({ length: cap }, (_, i) => {
              const filled = i < len;
              const justNow = filled && i === len - 1 && lastAppendT >= 0 && t - lastAppendT < 700 && !inRealloc;
              const pop = justNow ? seg(t, lastAppendT, 400, ease.outBack) : 1;
              const isCopy = inRealloc && i < moving;
              return (
                <g key={i} transform={`translate(${x0 + i * (cellW + gap)} 0)`}>
                  <rect width={cellW} height={cellH} rx={9} fill={filled ? C.node2 : "transparent"} stroke={filled ? (justNow ? C.fresh : C.stroke) : C.stroke} strokeWidth={1.5} strokeDasharray={filled ? undefined : "5 4"} />
                  {filled && !isCopy && <text x={cellW / 2} y={cellH / 2 + 8} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 20, fontWeight: 650 }} transform={`translate(${cellW / 2} ${cellH / 2}) scale(${lerp(0.5, 1, pop)}) translate(${-cellW / 2} ${-cellH / 2})`}>{i + 1}</text>}
                  {isCopy && (
                    <text x={cellW / 2} y={cellH / 2 + 8 - lerp(yNew - yOld, 0, copyP)} textAnchor="middle" className="st-mono" style={{ fill: C.name, fontSize: 20, fontWeight: 650 }}>{i + 1}</text>
                  )}
                  {!filled && <text x={cellW / 2} y={cellH / 2 + 6} textAnchor="middle" className="st-id st-mono">빈</text>}
                </g>
              );
            })}
          </g>
        )}
        {cap === 0 && <text x={x0} y={230} className="st-m" style={{ fontSize: 18 }}>nums = []   (칸 0개)</text>}
        {inRealloc && <Badge x={x0 + (oldCap * (cellW + gap)) / 2} y={yOld + cellH + 34} text={`${moving}개 복사`} p={copyP} color={C.warn} />}
        {/* 누적 비용 */}
        <g transform="translate(120 400)">
          <text className="st-type" y={0}>지금까지</text>
          <text y={30} className="st-mono" style={{ fill: C.text, fontSize: 18 }}>append {len}회 · 재할당 {GROWTH.indexOf(cap) > 0 ? GROWTH.indexOf(cap) : 0}회 · 복사 {copies}개</text>
        </g>
        <g opacity={costP} transform="translate(120 460)">
          <text className="st-mono" style={{ fill: C.fresh, fontSize: 17, fontWeight: 650 }}>append 평균 비용 ≈ 상수 (상각 O(1))   ·   lst.insert(0, x) 는 전부 밀어야 하니 O(n)</text>
        </g>
      </g>
    );
  };
  return { script, render };
}
