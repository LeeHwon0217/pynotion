/* 장면: 중첩 반복문 — 바깥이 한 칸 갈 때 안쪽은 끝까지 */
import { ScriptBuilder, seg, ease, lerp, textW } from "@/lib/anim";
import { Badge, C, CodePanel } from "../prims";

const CODE = ["for i in range(3):", "    for j in range(4):", "        print(i, j)", '    print("---")'];
const NI = 3, NJ = 4;
const CELL = 700; // 셀 하나에 머무는 시간(ms)

export function buildNestedScene() {
  const s = new ScriptBuilder();
  s.chapter("구조").mark("intro");
  s.say("반복문 안에 반복문. 바깥 `for` 가 `i` 를 하나 정하면, 안쪽 `for` 는 `j` 를 **처음부터 끝까지** 돈다.", 4200);
  s.chapter("실행").mark("run");
  const cells = NI * NJ;
  s.wait(NI * (NJ * CELL + 900) + 400);
  s.chapter("횟수").mark("count");
  s.say(`안쪽 print 는 3 × 4 = **12번** 실행됐다. 바깥이 n번, 안쪽이 m번이면 안쪽 코드는 n × m 번.`, 4200);
  s.say("`\"---\"` 는 바깥 반복마다 한 번, 즉 **3번**. 안쪽 반복이 끝난 뒤에 실행되기 때문이다.", 4000);
  s.wait(600);
  const script = s.build();
  const M = s.marks;

  const render = (t: number) => {
    // 실행 진행: 시각 → (i, j, phase)
    let i = -1, j = -1, sepOf = -1; // sepOf: --- 출력 중인 i
    const done: boolean[][] = Array.from({ length: NI }, () => Array(NJ).fill(false));
    const seps = Array(NI).fill(false);
    let out: string[] = [];
    if (t >= M.run) {
      let e = t - M.run;
      outer: for (let a = 0; a < NI; a++) {
        for (let b = 0; b < NJ; b++) {
          if (e < CELL) { i = a; j = b; break outer; }
          e -= CELL; done[a][b] = true; out.push(`${a} ${b}`);
        }
        if (e < 900) { i = a; j = -1; sepOf = a; break; }
        e -= 900; seps[a] = true; out.push("---");
      }
      if (t >= M.count) { i = -1; j = -1; sepOf = -1; }
    }
    const line = sepOf >= 0 ? 3 : j >= 0 ? 2 : -1;
    const countP = seg(t, M.count, 500);

    const gx = 470, gy = 120, cw = 96, ch = 74;
    return (
      <g>
        <CodePanel x={36} y={40} w={330} lines={CODE} shown={4} current={line} lineH={44} fontSize={19} />
        {/* 변수 */}
        <g transform="translate(36 260)">
          <text className="st-type" y={0}>변수</text>
          {[["i", i], ["j", j]].map(([n, v], k) => (
            <g key={String(n)} transform={`translate(${k * 160} 14)`}>
              <rect width={140} height={44} rx={10} fill={C.node} stroke={C.stroke} />
              <rect x={8} y={8} width={34} height={28} rx={7} fill={C.name} />
              <text x={25} y={28} textAnchor="middle" className="st-mono" style={{ fill: "#1a1300", fontSize: 16, fontWeight: 750 }}>{n}</text>
              <text x={125} y={30} textAnchor="end" className="st-mono" style={{ fill: C.text, fontSize: 22, fontWeight: 700 }}>{Number(v) >= 0 ? v : "—"}</text>
            </g>
          ))}
        </g>
        {/* 출력 */}
        <g transform="translate(36 350)">
          <text className="st-type" y={0}>출력 (마지막 6줄)</text>
          {out.slice(-6).map((l, k) => <text key={k} x={0} y={26 + k * 24} className="st-mono" style={{ fill: l === "---" ? C.name : C.fresh, fontSize: 17, fontWeight: 600 }}>{l}</text>)}
        </g>

        {/* 격자 */}
        <text x={gx} y={gy - 30} className="st-type">안쪽 print(i, j) 가 실행되는 순서</text>
        <text x={gx - 16} y={gy - 8} textAnchor="end" className="st-m st-mono">j →</text>
        <text x={gx - 40} y={gy + 40} textAnchor="end" className="st-m st-mono">i ↓</text>
        {Array.from({ length: NJ }, (_, b) => <text key={"h" + b} x={gx + b * (cw + 10) + cw / 2} y={gy - 8} textAnchor="middle" className="st-mono" style={{ fill: j === b ? C.hi : C.muted, fontSize: 14, fontWeight: 700 }}>{b}</text>)}
        {Array.from({ length: NI }, (_, a) => (
          <g key={a}>
            <text x={gx - 24} y={gy + a * (ch + 10) + ch / 2 + 5} textAnchor="middle" className="st-mono" style={{ fill: i === a ? C.hi : C.muted, fontSize: 14, fontWeight: 700 }}>{a}</text>
            {i === a && <rect x={gx - 8} y={gy + a * (ch + 10) - 6} width={NJ * (cw + 10) + 6} height={ch + 12} rx={14} fill="none" stroke={C.name} strokeWidth={1.5} strokeDasharray="6 5" opacity={0.7} />}
            {Array.from({ length: NJ }, (_, b) => {
              const active = i === a && j === b;
              const d = done[a][b];
              const p = active ? seg(t - M.run - (a * (NJ * CELL + 900) + b * CELL), 0, 260, ease.outBack) : 1;
              return (
                <g key={b} transform={`translate(${gx + b * (cw + 10) + cw / 2} ${gy + a * (ch + 10) + ch / 2}) scale(${active ? lerp(0.8, 1.06, p) : 1})`}>
                  <rect x={-cw / 2} y={-ch / 2} width={cw} height={ch} rx={12} fill={active ? C.hi : d ? C.node2 : C.node} stroke={active ? C.hi : d ? C.arrow : C.stroke} strokeWidth={active ? 2 : 1.2} opacity={d || active ? 1 : 0.5} />
                  <text y={7} textAnchor="middle" className="st-mono" style={{ fill: active ? "#fff" : d ? C.text : C.muted, fontSize: 20, fontWeight: 700 }}>{a}, {b}</text>
                  {d && <text x={cw / 2 - 8} y={-ch / 2 + 16} textAnchor="end" className="st-id st-mono">{a * NJ + b + 1}</text>}
                </g>
              );
            })}
            {/* --- 표시 */}
            <g transform={`translate(${gx + NJ * (cw + 10) + 14} ${gy + a * (ch + 10) + ch / 2})`} opacity={seps[a] || sepOf === a ? 1 : 0.25}>
              <rect x={0} y={-16} width={64} height={32} rx={8} fill={sepOf === a ? C.name : C.node} stroke={C.stroke} />
              <text x={32} y={5} textAnchor="middle" className="st-mono" style={{ fill: sepOf === a ? "#1a1300" : C.muted, fontSize: 14, fontWeight: 700 }}>---</text>
            </g>
          </g>
        ))}
        <Badge x={gx + (NJ * (cw + 10)) / 2} y={gy + NI * (ch + 10) + 28} text="안쪽 print: 3 × 4 = 12번   ·   ---: 3번" p={countP} color={C.fresh} />
        <text x={0} y={0} opacity={0}>{textW("", 1)}</text>
      </g>
    );
  };
  return { script, render };
}
