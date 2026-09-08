"use client";
import { useMemo } from "react";
import { Stage } from "./Stage";
import { useTimeline } from "./anim/useTimeline";
import { ease, lerp, seg, window_ } from "@/lib/anim";
import { Arrow, C, ListBox, NameTag, ObjBox } from "./viz/prims";

/** 홈 히어로: 짧은 루프 데모 (a=10 → b=a → a=20 → 리스트 append) */
export function HeroDemo() {
  const total = 11000;
  const tl = useTimeline(total, { autoplay: true, loop: true });
  const t = tl.t;
  const M = useMemo(() => ({ obj10: 300, tagA: 1100, tagB: 2400, obj20: 3900, swing: 4600, fade: 6300, list: 6900, other: 8000, append: 9000 }), []);

  const part1 = 1 - seg(t, M.fade, 500);
  const part2 = seg(t, M.fade + 400, 500);
  const p10 = seg(t, M.obj10, 700, ease.outBack) * part1;
  const p20 = seg(t, M.obj20, 700, ease.outBack) * part1;
  const pA = seg(t, M.tagA, 500, ease.outBack) * part1;
  const pB = seg(t, M.tagB, 500, ease.outBack) * part1;
  const sw = seg(t, M.swing, 1200, ease.outBack);
  const pL = seg(t, M.list, 700, ease.outBack) * part2;
  const pN = seg(t, M.list + 400, 500, ease.outBack) * part2;
  const pO = seg(t, M.other, 500, ease.outBack) * part2;
  const ap = seg(t, M.append, 800, ease.outBack);
  const label = t < M.tagA ? "a = 10" : t < M.tagB ? "a = 10" : t < M.obj20 ? "b = a" : t < M.fade ? "a = 20" : t < M.other ? "nums = [1, 2]" : t < M.append ? "other = nums" : "other.append(3)";

  return (
    <Stage title="변수는 이름표다" kicker="미리보기">
      <svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid meet">
        <text x={40} y={60} className="st-mono" style={{ fill: C.text, fontSize: 30, fontWeight: 700 }}>{label}</text>
        <g opacity={part1}>
          <ObjBox x={470} y={100} type="int" value="10" p={p10} glow={window_(t, M.obj10, M.obj10 + 1500)} />
          <ObjBox x={470} y={280} type="int" value="20" p={p20} glow={window_(t, M.obj20, M.obj20 + 1500)} tone={window_(t, M.obj20, M.swing + 800) > 0 ? "fresh" : "normal"} />
          <NameTag x={120} y={138} name="a" p={pA} glow={window_(t, M.swing, M.swing + 1500)} />
          <NameTag x={120} y={258} name="b" p={pB} />
          <Arrow x1={196} y1={162} x2={466} y2={lerp(162, 342, sw)} p={seg(t, M.tagA + 300, 800, ease.out)} color={sw > 0 && sw < 1 ? C.name : C.arrow} />
          <Arrow x1={196} y1={282} x2={466} y2={162} p={seg(t, M.tagB + 300, 800, ease.out)} />
        </g>
        <g opacity={part2}>
          <ListBox x={430} y={160} items={ap > 0 ? ["1", "2", "3"] : ["1", "2"]} p={pL} appearFrom={2} appendP={ap} glow={window_(t, M.append, M.append + 1600)} />
          <NameTag x={100} y={196} name="nums" p={pN} />
          <NameTag x={100} y={296} name="other" p={pO} glow={window_(t, M.append, M.append + 1600)} />
          <Arrow x1={196} y1={220} x2={426} y2={234} p={seg(t, M.list + 700, 800, ease.out)} />
          <Arrow x1={196} y1={320} x2={426} y2={234} p={seg(t, M.other + 300, 800, ease.out)} />
        </g>
      </svg>
    </Stage>
  );
}
