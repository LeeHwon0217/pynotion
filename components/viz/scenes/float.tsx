/* 장면: 0.1 + 0.2 가 0.3 이 아닌 이유 — 이진 소수의 무한 반복 */
import { ScriptBuilder, seg, ease, lerp, window_ } from "@/lib/anim";
import { Badge, C } from "../prims";

const BITS_01 = "0.0001100110011001100110011001100110011001100110011001101"; // 0.1 근사 (반올림된 끝)
const HALVES = ["1/2", "1/4", "1/8", "1/16", "1/32", "1/64", "1/128", "1/256"];
const DEC = ["0.5", "0.25", "0.125", "0.0625", "0.03125", "0.015625", "0.0078125", "0.0039"];

export function buildFloatScene() {
  const s = new ScriptBuilder();
  s.chapter("십진수와 이진수").mark("intro");
  s.say("우리는 **10진법**으로 생각하지만 컴퓨터는 모든 수를 **2진법**으로 저장한다.", 3400);
  s.mark("halves").say("2진 소수에서 각 자리는 `1/2`, `1/4`, `1/8`… 을 뜻한다. 이것들의 합으로 수를 표현한다.", 4200);
  s.chapter("0.5 는 딱 떨어진다").mark("half");
  s.say("`0.5` 는 정확히 `1/2` — 첫째 자리 하나로 끝. **정확하다.**", 3200);
  s.mark("q").say("`0.75` 는 `1/2 + 1/4` — 역시 딱 떨어진다.", 3000);
  s.chapter("0.1 은 안 떨어진다").mark("tenth");
  s.say("그런데 `0.1` 은? 1/2, 1/4, 1/8 어느 조합으로도 **딱 맞게** 만들 수 없다.", 3800);
  s.mark("expand").say("가장 가까운 값을 좇다 보면 `0011` 이 **무한히 반복**된다. 10진법에서 1/3 = 0.333… 인 것과 같은 상황.", 5200);
  s.mark("cut").say("메모리는 64비트뿐이다. 그래서 **어딘가에서 잘라** 저장한다. 이 순간 아주 작은 오차가 생긴다.", 4400);
  s.chapter("0.1 + 0.2").mark("sum");
  s.say("`0.1` 과 `0.2` 는 둘 다 **살짝 큰 근사값**으로 저장돼 있다.", 3400);
  s.mark("add").say("둘을 더하면 오차도 더해진다. 결과는 `0.3` 의 근사값보다 **한 칸 더 큰** 수가 된다.", 4200);
  s.mark("result").say("그래서 `0.1 + 0.2 == 0.3` 은 `False`. 파이썬의 버그가 아니라 **2진 부동소수점의 성질**이다.", 4600);
  s.chapter("대처법").mark("fix");
  s.say("돈처럼 정확해야 하면 `decimal.Decimal`, 비교할 땐 `math.isclose()`, 출력할 땐 `round()` 나 `f\"{x:.2f}\"`.", 5200);
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const render = (t: number) => {
    const halvesP = (i: number) => seg(t, M.halves + 300 + i * 160, 400, ease.outBack);
    const halfOn = window_(t, M.half, M.tenth, 300);
    const qOn = window_(t, M.q, M.tenth, 300);
    const tenthOn = seg(t, M.tenth, 400);
    const expandN = t < M.expand ? 0 : Math.min(BITS_01.length, 2 + Math.floor((t - M.expand) / 75));
    const cutP = seg(t, M.cut, 600);
    const sumOn = seg(t, M.sum, 500);
    const addP = seg(t, M.add + 300, 900, ease.inOut);
    const resP = seg(t, M.result, 500);
    const fixP = seg(t, M.fix, 500);
    const prePart = 1 - seg(t, M.sum, 400);

    return (
      <g>
        {/* 상단: 자리값 표 */}
        <g opacity={prePart}>
          <text x={60} y={44} className="st-type">2진 소수의 자리값</text>
          {HALVES.map((h, i) => {
            const p = halvesP(i);
            const x = 60 + i * 138;
            const lit = (halfOn > 0 && i === 0) || (qOn > 0 && i <= 1);
            return (
              <g key={i} opacity={p} transform={`translate(${x} ${lerp(80, 64, p)})`}>
                <rect width={124} height={78} rx={12} fill={lit ? C.hi : C.node} stroke={lit ? C.hi : C.stroke} strokeWidth={1.5} />
                <text x={62} y={32} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 20, fontWeight: 700 }}>{h}</text>
                <text x={62} y={60} textAnchor="middle" className="st-mono" style={{ fill: lit ? C.text : C.muted, fontSize: 13 }}>{DEC[i]}</text>
              </g>
            );
          })}
          {/* 0.5 / 0.75 */}
          <g opacity={halfOn}>
            <text x={60} y={200} className="st-mono" style={{ fill: C.text, fontSize: 24, fontWeight: 650 }}>0.5  =  0.<tspan fill={C.fresh}>1</tspan>  (2진)  =  1/2</text>
            <Badge x={560} y={192} text="정확" p={halfOn} color={C.fresh} />
          </g>
          <g opacity={qOn}>
            <text x={60} y={250} className="st-mono" style={{ fill: C.text, fontSize: 24, fontWeight: 650 }}>0.75 =  0.<tspan fill={C.fresh}>11</tspan> (2진)  =  1/2 + 1/4</text>
            <Badge x={600} y={242} text="정확" p={qOn} color={C.fresh} />
          </g>
          {/* 0.1 전개 */}
          <g opacity={tenthOn}>
            <text x={60} y={320} className="st-mono" style={{ fill: C.text, fontSize: 24, fontWeight: 650 }}>0.1  =  0.</text>
            <text x={190} y={320} className="st-mono" style={{ fill: C.warn, fontSize: 24, fontWeight: 650, letterSpacing: 1 }}>{BITS_01.slice(2, expandN)}{expandN >= BITS_01.length && cutP < 1 ? "…" : ""}</text>
            {expandN > 6 && cutP === 0 && <Badge x={700} y={360} text="0011 이 끝없이 반복" p={seg(t, M.expand + 1500, 400)} color={C.warn} />}
            {/* 잘라내기 */}
            <g opacity={cutP}>
              <line x1={190 + 54 * 15.9} y1={295} x2={190 + 54 * 15.9} y2={332} stroke={C.dead} strokeWidth={3} strokeDasharray="6 4" />
              <rect x={190 + 54 * 15.9 + 6} y={296} width={200} height={38} fill="var(--stage-bg)" opacity={0.85} />
              <text x={190 + 54 * 15.9 + 14} y={322} className="st-mono" style={{ fill: C.dead, fontSize: 18, fontWeight: 650 }}>✂ 64비트에서 자름</text>
              <text x={60} y={380} className="st-t" style={{ fontSize: 18 }}>저장된 값 =</text>
              <text x={180} y={380} className="st-mono" style={{ fill: C.warn, fontSize: 20, fontWeight: 650 }}>0.1000000000000000055511151231257827…</text>
              <Badge x={640} y={420} text="0.1 보다 아주 조금 크다" p={cutP} color={C.warn} />
            </g>
          </g>
        </g>

        {/* 덧셈 */}
        <g opacity={sumOn}>
          <text x={60} y={44} className="st-type">실제로 저장된 값</text>
          {[["0.1", "0.1000000000000000055511151231257827"], ["0.2", "0.2000000000000000111022302462515654"]].map(([a, b], i) => (
            <g key={i} transform={`translate(60 ${80 + i * 70})`}>
              <rect width={110} height={50} rx={10} fill={C.node} stroke={C.stroke} />
              <text x={55} y={33} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 22, fontWeight: 700 }}>{a}</text>
              <text x={130} y={33} className="st-mono" style={{ fill: C.muted, fontSize: 18 }}>→</text>
              <text x={165} y={33} className="st-mono" style={{ fill: C.warn, fontSize: 19, fontWeight: 600 }}>{b}</text>
            </g>
          ))}
          <line x1={60} y1={230} x2={1140} y2={230} stroke={C.stroke} strokeWidth={2} strokeDasharray="6 5" opacity={addP} />
          <g opacity={addP} transform={`translate(60 ${lerp(230, 250, addP)})`}>
            <rect width={110} height={50} rx={10} fill={C.hi} />
            <text x={55} y={33} textAnchor="middle" className="st-mono" style={{ fill: "#fff", fontSize: 20, fontWeight: 700 }}>합</text>
            <text x={165} y={33} className="st-mono" style={{ fill: C.dead, fontSize: 19, fontWeight: 650 }}>0.3000000000000000444089209850062616</text>
          </g>
          <g opacity={resP} transform="translate(60 330)">
            <rect width={110} height={50} rx={10} fill={C.node} stroke={C.stroke} />
            <text x={55} y={33} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 22, fontWeight: 700 }}>0.3</text>
            <text x={130} y={33} className="st-mono" style={{ fill: C.muted, fontSize: 18 }}>→</text>
            <text x={165} y={33} className="st-mono" style={{ fill: C.fresh, fontSize: 19, fontWeight: 600 }}>0.2999999999999999888977697537484346</text>
            <Badge x={540} y={80} text="0.1 + 0.2 == 0.3  →  False" p={resP} color={C.dead} />
            <Badge x={870} y={80} text="0.30000000000000004" p={resP} color={C.warn} />
          </g>
          <g opacity={fixP} transform="translate(60 450)">
            {["Decimal('0.1') + Decimal('0.2') == Decimal('0.3')  → True", "math.isclose(0.1 + 0.2, 0.3)  → True", "round(0.1 + 0.2, 2)  → 0.3"].map((l, i) => (
              <text key={i} x={i === 0 ? 0 : i === 1 ? 560 : 900} y={i === 0 ? 0 : 0} className="st-mono" style={{ fill: C.fresh, fontSize: 15, fontWeight: 600 }}>{l}</text>
            ))}
          </g>
        </g>
      </g>
    );
  };
  return { script, render };
}
