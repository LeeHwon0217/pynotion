/* 장면: "변수는 상자가 아니라 이름표" — 약 75초짜리 서사형 애니메이션 */
import { ScriptBuilder, seg, ease, lerp, window_ } from "@/lib/anim";
import { Arrow, Badge, C, CodePanel, CrossOut, ListBox, NameTag, ObjBox, Pulse } from "../prims";

const CODE = ["a = 10", "b = a", "a = 20", "", "nums = [1, 2]", "other = nums", "other.append(3)", "print(nums)"];

export function buildVariablesScene() {
  const s = new ScriptBuilder();
  // ── 1. 상자 모델의 오해 ──
  s.chapter("상자 모델의 오해").mark("box");
  s.say("많은 입문서가 변수를 **값을 담는 상자**라고 설명한다.", 3200);
  s.mark("boxX").say("파이썬에서는 이 그림이 **틀렸다.** 이 오해 때문에 나중에 리스트에서 크게 당한다.", 3600);
  s.mark("boxOut").wait(600);
  // ── 2. a = 10 ──
  s.chapter("a = 10").mark("l1");
  s.say("`a = 10` 을 실행하면 파이썬은 **오른쪽부터** 본다.", 2400);
  s.mark("obj10").say("정수 객체 `10`이 메모리에 만들어진다. 타입은 `int`, 고유한 주소(id)를 갖는다.", 3600);
  s.mark("tagA").say("그 다음 왼쪽. 이름 `a`가 만들어져 그 객체에 **붙는다.**", 3000);
  s.say("`a`는 10을 '담고' 있지 않다. 그저 10이 있는 곳을 **가리킬 뿐**이다.", 3400);
  // ── 3. b = a ──
  s.chapter("b = a").mark("l2");
  s.say("`b = a` — 값이 복사될 것 같지만, 아니다.", 2400);
  s.mark("tagB").say("이름 `b`가 하나 더 생겨서 **같은 객체**에 붙는다. 객체 10은 여전히 하나뿐.", 3600);
  s.mark("isBadge").say("그래서 `a is b` 는 `True` — 둘의 id가 완전히 같다.", 3200);
  // ── 4. a = 20 ──
  s.chapter("a = 20").mark("l3");
  s.say("이제 `a = 20`. 상자 모델이라면 'a 안의 10이 20으로 바뀐다'고 생각하겠지만…", 3400);
  s.mark("obj20").say("실제로는 **새 객체 `20`이 따로 만들어진다.** 10은 건드리지 않는다.", 3200);
  s.mark("swing").say("그리고 이름 `a`가 **떼어져서 20으로 옮겨 붙는다.** 이것이 재바인딩(rebinding).", 3400);
  s.mark("bStay").say("`b`는 여전히 10을 가리킨다. `b`는 `a`를 따라간 게 아니라 **객체를** 가리켰으니까.", 3800);
  // ── 5. 리스트 ──
  s.chapter("리스트라면?").mark("part2");
  s.wait(700);
  s.mark("l5").say("정수는 바꿀 수 없는(immutable) 객체라 차이가 안 보였다. **바꿀 수 있는** 리스트로 가보자.", 3600);
  s.mark("objList").say("`nums = [1, 2]` — 리스트 객체가 만들어지고 이름 `nums`가 붙는다.", 3000);
  s.mark("l6").mark("tagOther").say("`other = nums` — 역시 복사가 아니다. 이름 하나 더, 같은 객체.", 3000);
  s.mark("l7").say("`other.append(3)` — 이건 재바인딩이 아니라 **객체 자체를 바꾸는** 연산이다.", 2800);
  s.mark("append").say("리스트 객체 안에 `3`이 들어간다. 이 객체를 가리키는 이름은 둘 다 이 변화를 본다.", 3600);
  s.mark("l8").mark("print").say("`print(nums)` → `[1, 2, 3]`. `nums`는 손도 안 댔는데 바뀌어 있다. **같은 객체니까.**", 4200);
  // ── 6. 정리 ──
  s.chapter("정리").mark("wrap");
  s.say("① `=` 는 복사가 아니라 **이름 붙이기**다.", 2800);
  s.say("② 객체를 **바꾸면**, 그 객체에 붙은 **모든 이름**이 그 변화를 본다.", 3200);
  s.say("③ 이름을 **다시 붙이면**(재바인딩), 다른 이름은 영향받지 않는다.", 3400);
  s.wait(1200);
  const script = s.build();
  const M = s.marks;

  const render = (t: number) => {
    // 좌표계 1200 x 520
    const codeX = 36, codeY = 56, codeW = 350;
    const tagX = 480;
    const objX = 760;
    const y10 = 110, y20 = 330;

    // 챕터 1: 상자 모델
    const boxP = seg(t, M.box, 700, ease.outBack) * (1 - seg(t, M.boxOut, 500));
    const xP = seg(t, M.boxX, 600);

    // 파트 1 요소 페이드아웃 (리스트 챕터 진입)
    const part1 = 1 - seg(t, M.part2, 600);
    const part2 = seg(t, M.part2 + 500, 600);

    // 코드 패널: 몇 줄까지 보이나, 현재 줄
    const shown = t >= M.l8 ? 8 : t >= M.l7 ? 7 : t >= M.l6 ? 6 : t >= M.l5 ? 5 : t >= M.l3 ? 3 : t >= M.l2 ? 2 : t >= M.l1 ? 1 : 0;
    const current = t >= M.wrap ? -1 : t >= M.l8 ? 7 : t >= M.l7 ? 6 : t >= M.l6 ? 5 : t >= M.l5 ? 4 : t >= M.l3 ? 2 : t >= M.l2 ? 1 : t >= M.l1 ? 0 : -1;

    // 객체 10 / 20
    const p10 = seg(t, M.obj10, 700, ease.outBack) * part1;
    const p20 = seg(t, M.obj20, 700, ease.outBack) * part1;
    const glow10 = window_(t, M.obj10, M.obj10 + 2600) + window_(t, M.bStay, M.bStay + 2600);
    const glow20 = window_(t, M.obj20, M.obj20 + 2600);
    // 이름표
    const pA = seg(t, M.tagA, 600, ease.outBack) * part1;
    const pB = seg(t, M.tagB, 600, ease.outBack) * part1;
    const arrA = seg(t, M.tagA + 350, 900, ease.out);
    const arrB = seg(t, M.tagB + 350, 900, ease.out);
    // a 화살표 끝점: 10 → 20 으로 스윙
    const sw = seg(t, M.swing + 200, 1300, ease.outBack);
    const aEndY = lerp(y10 + 62, y20 + 62, sw);
    const isP = window_(t, M.isBadge, M.l3 - 200, 350);

    // 파트 2: 리스트
    const pList = seg(t, M.objList, 700, ease.outBack) * part2;
    const pNums = seg(t, M.objList + 500, 600, ease.outBack) * part2;
    const arrNums = seg(t, M.objList + 800, 900, ease.out);
    const pOther = seg(t, M.tagOther, 600, ease.outBack) * part2;
    const arrOther = seg(t, M.tagOther + 350, 900, ease.out);
    const appendP = seg(t, M.append + 300, 900, ease.outBack);
    const glowList = window_(t, M.append, M.append + 3200) + window_(t, M.print, M.print + 3000);
    const printP = seg(t, M.print + 600, 500);
    const items = appendP > 0 ? ["1", "2", "3"] : ["1", "2"];

    // 정리 카드
    const wrapP = seg(t, M.wrap, 700);
    const rule = (i: number) => seg(t, M.wrap + 400 + i * 3000, 500);

    const listY = 190;
    const listW = Math.max(200, 3 * 68 + 32);

    return (
      <g>
        {/* 코드 패널 (챕터 2 이후) */}
        <g opacity={seg(t, M.l1 - 500, 600) * (1 - wrapP)}>
          <CodePanel x={codeX} y={codeY} w={codeW} lines={CODE} shown={shown} current={current} />
          {/* 출력 */}
          <g opacity={printP} transform={`translate(${codeX} ${codeY + CODE.length * 44 + 76})`}>
            <text x={0} y={0} className="st-type">출력</text>
            <text x={0} y={30} className="st-mono" style={{ fill: C.fresh, fontSize: 22, fontWeight: 650 }}>[1, 2, 3]</text>
          </g>
        </g>

        {/* 챕터 1: 틀린 그림 */}
        {boxP > 0 && (
          <g opacity={boxP} transform={`translate(600 300) scale(${lerp(0.7, 1, boxP)}) translate(-600 -300)`}>
            <text x={600} y={150} textAnchor="middle" className="st-m" style={{ fontSize: 16 }}>흔한 오해 — “변수 = 상자”</text>
            <rect x={470} y={190} width={260} height={200} rx={18} fill={C.node} stroke={C.stroke} strokeWidth={2} strokeDasharray="10 8" />
            <text x={600} y={235} textAnchor="middle" className="st-mono" style={{ fill: C.name, fontSize: 24, fontWeight: 700 }}>a</text>
            <rect x={545} y={262} width={110} height={90} rx={12} fill={C.node2} />
            <text x={600} y={322} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 40, fontWeight: 700 }}>10</text>
            <CrossOut x={470} y={190} w={260} h={200} p={xP} />
          </g>
        )}

        {/* 힙 영역 라벨 */}
        <g opacity={Math.max(p10, pList) * (1 - wrapP)}>
          <text x={objX} y={92} className="st-type">메모리 (객체들)</text>
          <line x1={objX - 40} y1={70} x2={objX - 40} y2={470} stroke={C.stroke} strokeDasharray="4 6" />
          <text x={tagX} y={92} className="st-type">이름</text>
        </g>

        {/* ── 파트 1 ── */}
        <g opacity={part1}>
          <ObjBox x={objX} y={y10} type="int" value="10" id="0x1f8a" p={p10} glow={glow10} />
          <ObjBox x={objX} y={y20} type="int" value="20" id="0x1f9c" p={p20} glow={glow20} tone={window_(t, M.obj20, M.obj20 + 3000) > 0 ? "fresh" : "normal"} />
          <Pulse cx={objX + 100} cy={y10 + 62} t={t} start={M.tagA} on={t < M.tagA + 2500} />

          <NameTag x={tagX} y={y10 + 38} name="a" p={pA} glow={window_(t, M.swing, M.swing + 2800)} />
          <NameTag x={tagX} y={y10 + 38 + 120} name="b" p={pB} glow={window_(t, M.bStay, M.bStay + 2800, 400)} />
          <Arrow x1={tagX + 76} y1={y10 + 62} x2={objX - 4} y2={aEndY} p={arrA} color={sw > 0 && sw < 1 ? C.name : C.arrow} />
          <Arrow x1={tagX + 76} y1={y10 + 62 + 120} x2={objX - 4} y2={y10 + 62} p={arrB} />
          <Badge x={objX + 100} y={y10 - 24} text="a is b → True" p={isP} color={C.fresh} />
          <Badge x={objX + 100} y={y20 + 152} text="새 객체 — 10은 그대로" p={window_(t, M.obj20, M.swing + 1200, 350)} color={C.fresh} />
          <Badge x={tagX + 40} y={y10 + 38 + 120 + 72} text="b는 그대로" p={window_(t, M.bStay, M.part2, 350)} color={C.name} />
        </g>

        {/* ── 파트 2 ── */}
        <g opacity={part2}>
          <ListBox x={objX} y={listY} items={items} p={pList} id="0x2b40" glow={glowList} appearFrom={2} appendP={appendP} />
          <NameTag x={tagX} y={listY + 50} name="nums" p={pNums} glow={window_(t, M.print, M.print + 3000, 400)} />
          <NameTag x={tagX} y={listY + 170} name="other" p={pOther} glow={window_(t, M.l7, M.append + 1200, 400)} />
          <Arrow x1={tagX + 96} y1={listY + 74} x2={objX - 4} y2={listY + 74} p={arrNums} />
          <Arrow x1={tagX + 96} y1={listY + 194} x2={objX - 4} y2={listY + 74} p={arrOther} />
          <Pulse cx={objX + listW - 44} cy={listY + 74} t={t} start={M.append + 300} on={t > M.append + 300 && t < M.print} color={C.fresh} />
          <Badge x={objX + listW / 2} y={listY - 26} text="객체는 하나, 이름은 둘" p={window_(t, M.tagOther + 900, M.wrap, 350)} color={C.arrow} />
          <Badge x={objX + listW / 2} y={listY + 172} text="append = 객체를 바꾼다 (재바인딩 아님)" p={window_(t, M.append, M.wrap, 350)} color={C.fresh} />
        </g>

        {/* ── 정리 ── */}
        {wrapP > 0 && (
          <g opacity={wrapP}>
            <text x={600} y={130} textAnchor="middle" className="st-t" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>변수 = 이름표</text>
            {[
              ["=", "복사가 아니라 이름 붙이기"],
              ["바꾸기", "객체를 바꾸면 모든 이름이 본다 (append 등)"],
              ["재바인딩", "이름을 다시 붙이면 다른 이름은 그대로"],
            ].map(([k, v], i) => {
              const q = rule(i);
              return (
                <g key={i} opacity={q} transform={`translate(${lerp(-30, 0, q)} ${200 + i * 92})`}>
                  <rect x={250} y={0} width={700} height={70} rx={16} fill={C.node} stroke={C.stroke} />
                  <rect x={266} y={16} width={130} height={38} rx={10} fill={C.name} />
                  <text x={331} y={42} textAnchor="middle" className="st-mono" style={{ fill: "#1a1300", fontSize: 18, fontWeight: 750 }}>{k}</text>
                  <text x={420} y={43} className="st-t" style={{ fontSize: 20 }}>{v}</text>
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

  return { script, render };
}
