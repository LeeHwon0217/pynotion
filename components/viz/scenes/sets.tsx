/* 장면: 집합 연산 — 벤 다이어그램 위에서 */
import { ScriptBuilder, seg, window_ } from "@/lib/anim";
import { Badge, C } from "../prims";

const A = [1, 2, 3, 4], B = [3, 4, 5, 6];
const ONLY_A = [1, 2], BOTH = [3, 4], ONLY_B = [5, 6];

export function buildSetScene() {
  const s = new ScriptBuilder();
  s.chapter("두 집합").mark("intro");
  s.say("`a = {1, 2, 3, 4}`, `b = {3, 4, 5, 6}`. 집합은 **순서 없고 중복 없는** 모음이다. 3 과 4 는 둘 다에 있다.", 4400);
  s.chapter("| 합집합").mark("union");
  s.say("`a | b` — 둘 중 **하나라도** 속한 것. 3 과 4 는 한 번만 들어간다. `{1, 2, 3, 4, 5, 6}`", 4000);
  s.chapter("& 교집합").mark("inter");
  s.say("`a & b` — **둘 다**에 속한 것. `{3, 4}`", 3200);
  s.chapter("- 차집합").mark("diff");
  s.say("`a - b` — a 에는 있고 b 에는 **없는** 것. `{1, 2}`. 순서가 중요하다: `b - a` 는 `{5, 6}`.", 4200);
  s.chapter("^ 대칭차").mark("sym");
  s.say("`a ^ b` — **한쪽에만** 있는 것. `{1, 2, 5, 6}`", 3400);
  s.chapter("속도").mark("speed");
  s.say("`3 in a` 는 딕셔너리 키 찾기와 같은 원리(해시)라 **즉시** 답한다. 리스트의 `in` 은 앞에서부터 다 뒤진다.", 4400);
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const cx1 = 500, cx2 = 700, cy = 250, r = 150;
  const render = (t: number) => {
    const mode = t >= M.speed ? "speed" : t >= M.sym ? "sym" : t >= M.diff ? "diff" : t >= M.inter ? "inter" : t >= M.union ? "union" : "";
    const modeStart = mode === "speed" ? M.speed : mode === "sym" ? M.sym : mode === "diff" ? M.diff : mode === "inter" ? M.inter : mode === "union" ? M.union : 0;
    const p = seg(t, modeStart + 200, 500);
    const litA = mode === "union" || mode === "diff" || mode === "sym";
    const litBoth = mode === "union" || mode === "inter";
    const litB = mode === "union" || mode === "sym";
    const expr = { union: "a | b", inter: "a & b", diff: "a - b", sym: "a ^ b", speed: "3 in a", "": "" }[mode];
    const result = { union: "{1, 2, 3, 4, 5, 6}", inter: "{3, 4}", diff: "{1, 2}", sym: "{1, 2, 5, 6}", speed: "True — 해시로 즉시", "": "" }[mode];
    const introP = seg(t, M.intro + 300, 700);
    const elem = (v: number, x: number, y: number, lit: boolean) => (
      <g key={v} transform={`translate(${x} ${y})`}>
        <circle r={22} fill={lit ? C.hi : C.node2} stroke={lit ? C.hi : C.stroke} strokeWidth={1.5} />
        <text y={7} textAnchor="middle" className="st-mono" style={{ fill: lit ? "#fff" : C.text, fontSize: 19, fontWeight: 700 }}>{v}</text>
      </g>
    );
    return (
      <g opacity={introP}>
        <text x={600} y={60} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 36, fontWeight: 750 }}>{expr}</text>
        {/* 원 */}
        <circle cx={cx1} cy={cy} r={r} fill="rgba(59,108,245,.18)" stroke={C.arrow} strokeWidth={2} opacity={litA && mode !== "sym" ? 1 : 0.55} />
        <circle cx={cx2} cy={cy} r={r} fill="rgba(240,101,58,.16)" stroke={C.warn} strokeWidth={2} opacity={litB && mode !== "sym" ? 1 : 0.55} />
        {/* 영역 강조 */}
        {(litA || litB || litBoth) && (
          <g opacity={p * 0.35}>
            <defs>
              <clipPath id="clipA"><circle cx={cx1} cy={cy} r={r} /></clipPath>
              <clipPath id="clipB"><circle cx={cx2} cy={cy} r={r} /></clipPath>
            </defs>
            {litA && <circle cx={cx1} cy={cy} r={r} fill={C.hi} />}
            {litB && <circle cx={cx2} cy={cy} r={r} fill={C.hi} />}
            {litBoth && <circle cx={cx2} cy={cy} r={r} fill={C.hi} clipPath="url(#clipA)" />}
            {(mode === "diff" || mode === "sym") && <circle cx={cx2} cy={cy} r={r} fill="var(--stage-bg)" clipPath="url(#clipA)" opacity={1} />}
          </g>
        )}
        <text x={cx1 - r + 20} y={cy - r + 34} className="st-mono" style={{ fill: C.arrow, fontSize: 22, fontWeight: 750 }}>a</text>
        <text x={cx2 + r - 34} y={cy - r + 34} className="st-mono" style={{ fill: C.warn, fontSize: 22, fontWeight: 750 }}>b</text>
        {ONLY_A.map((v, i) => elem(v, cx1 - 60, cy - 30 + i * 60, litA))}
        {BOTH.map((v, i) => elem(v, 600, cy - 30 + i * 60, litBoth))}
        {ONLY_B.map((v, i) => elem(v, cx2 + 60, cy - 30 + i * 60, litB))}
        {mode === "speed" && <Badge x={600} y={cy + r + 40} text="3 → hash → 칸 번호 → 있음" p={p} color={C.fresh} />}
        {result && <g opacity={p}><text x={600} y={470} textAnchor="middle" className="st-mono" style={{ fill: C.fresh, fontSize: 26, fontWeight: 700 }}>{result}</text></g>}
        <text x={0} y={0} opacity={0}>{window_(t, 0, 1)}</text>
      </g>
    );
  };
  return { script, render };
}
