/* 장면: 딕셔너리 내부 — 해시로 자리를 바로 찾는다 */
import { ScriptBuilder, seg, ease, lerp, textW } from "@/lib/anim";
import { Badge, C } from "../prims";

const SLOTS = 8;
type Key = { k: string; v: string; hash: string; idx: number; probe?: number };
const KEYS: Key[] = [
  { k: '"apple"', v: "3", hash: "…a41c", idx: 4 },
  { k: '"kiwi"', v: "7", hash: "…9f01", idx: 1 },
  { k: '"pear"', v: "2", hash: "…7d3e", idx: 6 },
  { k: '"plum"', v: "5", hash: "…c8c4", idx: 4, probe: 5 }, // 충돌 → 다음 칸
];

export function buildHashTableScene() {
  const s = new ScriptBuilder();
  s.chapter("빈 딕셔너리").mark("intro");
  s.say("딕셔너리는 겉으로는 '키 → 값' 이지만, 속은 **번호가 매겨진 칸(슬롯)들**이다. 지금은 8칸, 전부 비어 있다.", 4200);
  s.chapter("넣기").mark("put0");
  s.say("`d[\"apple\"] = 3`. 키를 **해시 함수**에 넣으면 큰 정수가 나온다. 그 수를 칸 수(8)로 나눈 **나머지**가 칸 번호.", 4600);
  s.mark("place0").say("`4` 번 칸에 apple → 3 을 넣는다. 위치를 **계산**으로 정했다 — 순서대로 채우는 게 아니다.", 3800);
  s.mark("put1").say("`\"kiwi\"` 의 해시는 다른 수. 나머지는 1. 1 번 칸.", 3000);
  s.mark("place1").wait(1400);
  s.mark("put2").say("`\"pear\"` → 6 번 칸.", 2400);
  s.mark("place2").wait(1400);
  s.chapter("찾기").mark("get");
  s.say("`d[\"kiwi\"]` 를 찾을 때, 리스트처럼 앞에서부터 뒤지지 **않는다.**", 3200);
  s.mark("getHash").say("똑같이 해시 → 나머지 → **1 번 칸으로 곧장.** 칸에 있는 키가 kiwi 가 맞는지 확인하고 값 7 을 돌려준다.", 4400);
  s.mark("getDone").say("항목이 3개든 300만 개든 **똑같이 한 번**에 찾는다. 이것이 딕셔너리가 빠른 이유.", 4000);
  s.chapter("충돌").mark("put3");
  s.say("`\"plum\"` 의 해시 나머지가 4 — 그런데 4 번 칸엔 이미 apple 이 있다. **충돌.**", 3800);
  s.mark("probe").say("CPython 은 정해진 규칙으로 **다른 빈 칸을 찾아** 넣는다 (여기선 단순히 다음 칸). 찾을 때도 같은 경로를 따라간다.", 4600);
  s.chapter("조건").mark("rule");
  s.say("그래서 키는 **해시할 수 있어야** 한다 — 바뀌지 않는 객체(str, int, tuple). 리스트는 내용이 바뀌면 해시도 바뀌어 칸을 못 찾으니 키가 될 수 없다.", 5400);
  s.say("칸이 2/3 이상 차면 딕셔너리는 더 큰 칸 묶음으로 **전부 다시 배치**한다(리해싱). 그래서 충돌이 드물게 유지된다.", 4400);
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const slotX = 640, slotY0 = 70, slotH = 50, slotW = 380;
  const render = (t: number) => {
    const placed = (i: number) => (i === 0 ? t >= M.place0 : i === 1 ? t >= M.place1 : i === 2 ? t >= M.place2 : t >= M.probe + 1500);
    const flying = (i: number) => {
      const from = i === 0 ? M.put0 + 1200 : i === 1 ? M.put1 + 400 : i === 2 ? M.put2 + 300 : M.put3 + 300;
      const to = i === 0 ? M.place0 : i === 1 ? M.place1 : i === 2 ? M.place2 : M.probe + 1500;
      return t >= from && t < to ? seg(t, from, to - from, ease.inOut) : -1;
    };
    const getP = seg(t, M.getHash + 800, 900, ease.inOut);
    const getOn = t >= M.get && t < M.put3;
    const probeP = seg(t, M.probe + 300, 1000, ease.inOut);

    // 현재 설명 중인 키
    const curKey = t >= M.put3 ? 3 : t >= M.get ? 1 : t >= M.put2 ? 2 : t >= M.put1 ? 1 : t >= M.put0 ? 0 : -1;
    const kx = 90;
    return (
      <g>
        {/* 슬롯 */}
        <text x={slotX} y={slotY0 - 20} className="st-type">슬롯 (8칸)</text>
        {Array.from({ length: SLOTS }, (_, i) => {
          const key = KEYS.find((k) => (k.probe ?? k.idx) === i && placed(KEYS.indexOf(k)));
          const hot = (getOn && getP > 0.9 && i === 1) || (t >= M.put3 && t < M.probe + 1500 && i === 4);
          const conflict = t >= M.put3 && t < M.probe + 1500 && i === 4;
          return (
            <g key={i} transform={`translate(${slotX} ${slotY0 + i * (slotH + 6)})`}>
              <rect width={slotW} height={slotH} rx={10} fill={key ? C.node2 : C.node} stroke={conflict ? C.dead : hot ? C.fresh : C.stroke} strokeWidth={hot || conflict ? 2.5 : 1.2} />
              <text x={16} y={slotH / 2 + 6} className="st-mono" style={{ fill: C.muted, fontSize: 15, fontWeight: 700 }}>{i}</text>
              {key && (
                <g>
                  <text x={56} y={slotH / 2 + 7} className="st-mono" style={{ fill: C.name, fontSize: 18, fontWeight: 650 }}>{key.k}</text>
                  <text x={slotW - 20} y={slotH / 2 + 7} textAnchor="end" className="st-mono" style={{ fill: C.text, fontSize: 18, fontWeight: 650 }}>→ {key.v}</text>
                </g>
              )}
              {!key && <text x={56} y={slotH / 2 + 6} className="st-id st-mono">비어 있음</text>}
            </g>
          );
        })}

        {/* 왼쪽: 해시 계산 패널 */}
        {curKey >= 0 && (() => {
          const k = KEYS[curKey];
          const base = curKey === 3 ? M.put3 : curKey === 1 && getOn ? M.get : curKey === 0 ? M.put0 : curKey === 1 ? M.put1 : M.put2;
          const p1 = seg(t, base + 200, 400), p2 = seg(t, base + 900, 400), p3 = seg(t, base + 1500, 400);
          return (
            <g transform={`translate(${kx} 90)`}>
              <text className="st-type" y={0}>{getOn ? "찾기" : "넣기"}</text>
              <g opacity={p1}>
                <rect y={16} width={Math.max(150, textW(k.k, 24, true) + 40)} height={50} rx={12} fill={C.name} />
                <text x={20} y={49} className="st-mono" style={{ fill: "#1a1300", fontSize: 24, fontWeight: 750 }}>{k.k}</text>
              </g>
              <g opacity={p2}>
                <path d="M60 78 v34" stroke={C.arrow} strokeWidth={2.5} markerEnd="" />
                <text x={80} y={100} className="st-m">hash()</text>
                <rect y={118} width={230} height={44} rx={10} fill={C.node} stroke={C.stroke} />
                <text x={16} y={147} className="st-mono" style={{ fill: C.text, fontSize: 18 }}>{"8467…" + k.hash.slice(1)}</text>
              </g>
              <g opacity={p3}>
                <path d="M60 170 v34" stroke={C.arrow} strokeWidth={2.5} />
                <text x={80} y={192} className="st-m">% 8 (나머지)</text>
                <rect y={210} width={110} height={44} rx={10} fill={C.hi} />
                <text x={55} y={239} textAnchor="middle" className="st-mono" style={{ fill: "#fff", fontSize: 22, fontWeight: 750 }}>{k.idx}</text>
                <text x={125} y={239} className="st-m" style={{ fontSize: 15 }}>번 칸</text>
              </g>
              {getOn && getP > 0.9 && <Badge x={120} y={300} text="→ 7" p={seg(t, M.getHash + 1800, 400)} color={C.fresh} />}
              {curKey === 3 && t >= M.probe && <Badge x={140} y={300} text="4 는 이미 참 → 5 번으로" p={probeP} color={C.warn} />}
            </g>
          );
        })()}

        {/* 날아가는 키 */}
        {KEYS.map((k, i) => {
          const f = flying(i);
          if (f < 0) return null;
          const tx = lerp(kx, slotX + 56, f), ty = lerp(90 + 40, slotY0 + (k.idx) * (slotH + 6) + slotH / 2 + 7, f);
          return <text key={i} x={tx} y={ty} className="st-mono" style={{ fill: C.name, fontSize: 18, fontWeight: 650 }}>{k.k} → {k.v}</text>;
        })}
        {/* 충돌 시 옆 칸으로 */}
        {t >= M.probe && t < M.probe + 1500 && (
          <g transform={`translate(${slotX + 200} ${slotY0 + lerp(4, 5, probeP) * (slotH + 6) + slotH / 2 + 7})`}>
            <text className="st-mono" style={{ fill: C.name, fontSize: 18, fontWeight: 650 }}>{KEYS[3].k} → 5</text>
          </g>
        )}
        {/* 찾기 화살표 */}
        {getOn && getP > 0 && (
          <path d={`M${kx + 110} 330 C 400 330, 420 ${slotY0 + 1 * (slotH + 6) + 25}, ${slotX - 6} ${slotY0 + 1 * (slotH + 6) + 25}`} fill="none" stroke={C.fresh} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - getP} />
        )}
      </g>
    );
  };
  return { script, render };
}
