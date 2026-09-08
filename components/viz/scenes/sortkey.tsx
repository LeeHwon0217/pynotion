/* 장면: sorted 와 key — 무엇을 기준으로 줄을 세우나, 그리고 안정 정렬 */
import { ScriptBuilder, seg, ease, lerp, textW } from "@/lib/anim";
import { Badge, C } from "../prims";

const WORDS = ["banana", "kiwi", "apple", "fig", "pear"];

export function buildSortKeyScene() {
  const s = new ScriptBuilder();
  s.chapter("sorted()").mark("intro");
  s.say("`sorted(words)` — 기본은 **사전순**. 문자열끼리 `<` 로 비교한다.", 3200);
  s.mark("alpha").wait(2200);
  s.say("결과는 **새 리스트**. 원본 `words` 는 그대로다. (`words.sort()` 는 원본을 제자리에서 바꾸고 None 을 돌려준다.)", 4600);
  s.chapter("key=len").mark("keyIntro");
  s.say("`sorted(words, key=len)` — 각 항목에 `len` 을 적용한 값을 **기준**으로 줄을 세운다. 항목 자체가 아니라 '기준값' 을 비교한다.", 5000);
  s.mark("keyShow").say("먼저 기준값을 전부 계산한다: banana→6, kiwi→4, apple→5, fig→3, pear→4.", 3800);
  s.mark("keySort").wait(2200);
  s.chapter("안정 정렬").mark("stable");
  s.say("kiwi 와 pear 는 기준값이 **같다**(4). 이때 파이썬은 **원래 순서를 유지**한다 — kiwi 가 앞. 이것이 **안정 정렬**.", 5000);
  s.say("안정 정렬 덕분에 '이름순 → 그다음 나이순' 같은 다단계 정렬을 두 번 나눠 해도 결과가 맞다. `key=lambda x: (x.age, x.name)` 처럼 튜플로 한 번에 할 수도 있다.", 5600);
  s.chapter("reverse").mark("rev");
  s.say("`reverse=True` 는 기준값의 순서만 뒤집는다. 안정성은 그대로.", 3400);
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const order = (mode: string) => {
    const idx = WORDS.map((_, i) => i);
    if (mode === "alpha") return [...idx].sort((a, b) => (WORDS[a] < WORDS[b] ? -1 : 1));
    if (mode === "len") return [...idx].sort((a, b) => WORDS[a].length - WORDS[b].length || a - b);
    if (mode === "rev") return [...idx].sort((a, b) => WORDS[b].length - WORDS[a].length || a - b);
    return idx;
  };
  const x0 = 120, y0 = 200, cardW = 170, gap = 14;
  const render = (t: number) => {
    const mode = t >= M.rev ? "rev" : t >= M.keySort ? "len" : t >= M.keyIntro ? "orig" : t >= M.alpha ? "alpha" : "orig";
    const prevMode = mode === "rev" ? "len" : mode === "len" ? "orig" : mode === "alpha" ? "orig" : "orig";
    const modeStart = mode === "rev" ? M.rev : mode === "len" ? M.keySort : mode === "alpha" ? M.alpha : mode === "orig" && t >= M.keyIntro ? M.keyIntro : 0;
    const p = seg(t, modeStart + 200, 1100, ease.inOut);
    const cur = order(mode), prev = order(prevMode);
    const showKey = t >= M.keyShow;
    const keyP = (i: number) => seg(t, M.keyShow + 300 + i * 250, 300, ease.outBack);
    const stableP = seg(t, M.stable, 500);
    const expr = mode === "alpha" ? "sorted(words)" : mode === "len" ? "sorted(words, key=len)" : mode === "rev" ? "sorted(words, key=len, reverse=True)" : "words";
    return (
      <g>
        <text x={600} y={70} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 32, fontWeight: 750 }}>{expr}</text>
        <text x={x0} y={y0 - 40} className="st-type">{mode === "orig" ? "원본 순서" : "정렬 결과 (새 리스트)"}</text>
        {WORDS.map((w, i) => {
          const rank = cur.indexOf(i), prevRank = prev.indexOf(i);
          const x = x0 + lerp(prevRank, rank, p) * (cardW + gap);
          const tie = (w === "kiwi" || w === "pear") && stableP > 0 && mode !== "alpha";
          return (
            <g key={w} transform={`translate(${x} ${y0})`}>
              <rect width={cardW} height={64} rx={14} fill={tie ? "rgba(247,193,75,.15)" : C.node} stroke={tie ? C.name : C.stroke} strokeWidth={tie ? 2 : 1.2} />
              <text x={cardW / 2} y={40} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 22, fontWeight: 650 }}>{w}</text>
              {showKey && (
                <g opacity={keyP(i)} transform={`translate(${cardW / 2} 96)`}>
                  <rect x={-24} y={-18} width={48} height={36} rx={9} fill={C.hi} />
                  <text y={7} textAnchor="middle" className="st-mono" style={{ fill: "#fff", fontSize: 18, fontWeight: 750 }}>{w.length}</text>
                </g>
              )}
              <text x={cardW / 2} y={-12} textAnchor="middle" className="st-id st-mono">{rank}</text>
            </g>
          );
        })}
        {showKey && <text x={x0} y={y0 + 140} className="st-m">↑ key=len 이 만든 기준값. 이 숫자로 비교한다</text>}
        <Badge x={600} y={y0 + 190} text="기준값이 같으면(4, 4) 원래 순서 유지 — 안정 정렬" p={stableP * (mode !== "alpha" ? 1 : 0)} color={C.name} />
        <text x={0} y={0} opacity={0}>{textW("", 1)}</text>
      </g>
    );
  };
  return { script, render };
}
