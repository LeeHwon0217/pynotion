import type { Lesson } from "@/lib/types";

const ITEMS = ["1", "2", "3", "4", "5", "6"];
const sq = (index: number) => ({ items: ITEMS, index, label: "[1, 2, 3, 4, 5, 6]" });

export const breakContinue: Lesson = {
  part: 2,
  slug: "break-continue",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "continue 는 건너뛰고, break 는 끝낸다",
      props: {
        flow: {
          code: ["for n in [1, 2, 3, 4, 5, 6]:", "    if n % 2 == 0:", "        continue", "    if n > 4:", "        break", "    print(n)", 'print("종료")'],
          nodes: [
            { id: "c", kind: "cond", label: "다음 항목?", x: 640, y: 160 },
            { id: "even", kind: "cond", label: "n % 2 == 0 ?", x: 640, y: 260 },
            { id: "big", kind: "cond", label: "n > 4 ?", x: 640, y: 360 },
            { id: "p", kind: "io", label: "print(n)", x: 640, y: 450 },
            { id: "e", kind: "io", label: 'print("종료")', x: 900, y: 450 },
          ],
          edges: [
            { from: "c", to: "even", label: "있음" },
            { from: "even", to: "c", label: "continue", via: [[470, 260], [470, 160]] },
            { from: "even", to: "big", label: "아니오" },
            { from: "big", to: "e", label: "break", via: [[900, 360]] },
            { from: "big", to: "p", label: "아니오" },
            { from: "p", to: "c", via: [[820, 450], [820, 160]] },
            { from: "c", to: "e", label: "없음", via: [[900, 160]] },
          ],
          steps: [
            { chapter: "n = 1", say: "첫 항목 1. 짝수인가? 아니다. 4 보다 큰가? 아니다. 출력.", at: "c", line: 0, vars: { n: "1" }, seq: sq(0) },
            { say: "", dur: 1200, at: "even", line: 1 },
            { say: "", dur: 1200, at: "big", line: 3 },
            { say: "", dur: 1400, at: "p", line: 5, output: "1\n" },
            { chapter: "n = 2", say: "2 는 짝수. **`continue`** — 이 항목에 대한 나머지 블록을 전부 건너뛰고 **바로 다음 항목**으로.", at: "c", line: 0, vars: { n: "2" }, seq: sq(1) },
            { say: "", dur: 1600, at: "even", line: 2, badge: { at: "even", text: "continue → 다음 항목", color: "warn" } },
            { chapter: "n = 3", say: "3. 홀수, 4 이하. 출력.", at: "c", line: 0, vars: { n: "3" }, seq: sq(2) },
            { say: "", dur: 1100, at: "even", line: 1 },
            { say: "", dur: 1100, at: "big", line: 3 },
            { say: "", dur: 1300, at: "p", line: 5, output: "3\n" },
            { chapter: "n = 4", say: "4 는 짝수 → continue.", at: "c", line: 0, vars: { n: "4" }, seq: sq(3) },
            { say: "", dur: 1400, at: "even", line: 2, badge: { at: "even", text: "continue", color: "warn" } },
            { chapter: "n = 5", say: "5. 홀수. 그런데 4 보다 크다. **`break`** — 반복 자체를 **끝낸다.** 남은 항목 6 은 영영 보지 않는다.", at: "c", line: 0, vars: { n: "5" }, seq: sq(4) },
            { say: "", dur: 1100, at: "even", line: 1 },
            { say: "", dur: 1800, at: "big", line: 4, badge: { at: "big", text: "break → 반복 종료", color: "dead" } },
            { chapter: "종료", say: "for 다음 줄로. 출력된 건 1 과 3 뿐. `continue` 는 '이번만 건너뛰기', `break` 는 '여기서 그만'.", at: "e", line: 6, output: "종료\n", seq: { items: ITEMS, index: 4, label: "[1, 2, 3, 4, 5, 6]", done: [0, 1, 2, 3] } },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `반복문 안에서 흐름을 바꾸는 두 키워드:

- **\`continue\`** — 이번 항목의 나머지 블록을 건너뛰고 다음 항목으로. "이건 패스."
- **\`break\`** — 반복문 자체를 즉시 끝낸다. "그만."

둘 다 **가장 안쪽** 반복문에만 영향을 준다. 중첩 반복문에서 바깥까지 끝내려면 플래그 변수를 쓰거나 함수로 빼서 \`return\` 한다.`,
    },
    {
      kind: "trace", traceId: "p2-break-continue", title: "한 줄씩",
      caption: "continue 에서 6번 줄(print)을 건너뛰고 1번 줄로 돌아가는 것, break 에서 7번 줄로 바로 빠져나가는 것.",
    },
    {
      kind: "heading", text: "for-else — break 없이 끝났을 때",
    },
    {
      kind: "text",
      md: `파이썬만의 특이한 문법. \`for\`(또는 \`while\`)에 \`else\`를 붙이면, 반복이 **break 없이 끝까지 돌았을 때** 실행된다. break 로 나가면 실행되지 않는다. "찾았나, 못 찾았나"를 플래그 변수 없이 쓸 수 있다.`,
    },
    {
      kind: "trace", traceId: "p2-for-else", title: "for-else 두 경우",
      caption: "첫 반복은 12 에서 break → else 건너뜀. 둘째 반복은 break 없이 끝 → else 실행.",
    },
    {
      kind: "pitfall",
      title: "else 를 'if 의 else' 로 읽으면 헷갈린다",
      md: `\`for ... else\` 의 else 는 "반복이 **정상 종료**되면"이다. 이름이 \`nobreak\` 였다면 더 명확했을 것이다. 실제로 그렇게 읽는 사람이 많다. 팀에서 낯설어하면 플래그 변수를 쓰는 게 나을 수도 있다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `for i in range(5):
    if i == 3:
        break
    print(i)
else:
    print("끝")`,
      choices: [
        { text: "`0 1 2 끝`", why: "i == 3 에서 break 로 나갔으므로 else 는 실행되지 않는다." },
        { text: "`0 1 2`", correct: true, why: "0, 1, 2 출력 후 i=3 에서 break. break 로 빠져나왔으니 else 블록은 건너뛴다." },
        { text: "`0 1 2 3 4 끝`", why: "i == 3 에서 break 가 반복을 끝낸다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`continue` — 이번 항목 건너뛰고 **다음 항목**으로. `break` — 반복 **즉시 종료.**",
        "둘 다 가장 안쪽 반복문에만 작용한다.",
        "`for/while ... else:` — **break 없이** 끝났을 때 실행. '못 찾았음' 처리에 유용.",
      ],
    },
  ],
};
