import type { Lesson } from "@/lib/types";

export const nestedComprehension: Lesson = {
  part: 3,
  slug: "nested-comprehension",
  blocks: [
    {
      kind: "viz", component: "Story", title: "for 가 두 개일 때 순서",
      props: {
        story: {
          code: ["grid = [[1, 2], [3, 4]]", "flat = [x for row in grid for x in row]"],
          steps: [
            { chapter: "2차원", say: "리스트 안에 리스트. `grid[0]` 은 `[1, 2]`, `grid[1]` 은 `[3, 4]`.", ops: [{ line: 0 }, { obj: "G", type: "list", refs: ["R0", "R1"] }, { obj: "R0", type: "list", items: ["1", "2"] }, { obj: "R1", type: "list", items: ["3", "4"] }, { bind: "grid", to: "G" }] },
            { chapter: "펼치기", say: "`for row in grid for x in row` — **왼쪽 for 가 바깥**, 오른쪽이 안쪽. 중첩 반복문을 쓴 순서 그대로다.", ops: [{ line: 1 }, { obj: "F", type: "list", items: [] }, { bind: "flat", to: "F" }] },
            { say: "row = [1, 2] 에서 x 를 하나씩: 1, 2 를 담는다.", ops: [{ pulse: "R0" }, { mutate: "F", items: ["1", "2"] }] },
            { say: "row = [3, 4] 에서: 3, 4.", ops: [{ pulse: "R1" }, { mutate: "F", items: ["1", "2", "3", "4"] }] },
            { say: "결과 `[1, 2, 3, 4]`. 헷갈리면 이렇게 기억하자 — **for 문으로 풀어 쓴 순서와 같다.**", ops: [{ badge: "F", text: "for row in grid:  for x in row:  append(x)", color: "fresh" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `컴프리헨션 안에 \`for\` 를 여러 개 쓸 수 있다. 순서는 **중첩 for 문을 쓴 순서와 같다** — 왼쪽이 바깥.

\`\`\`
[x for row in grid for x in row]
\`\`\`
는
\`\`\`
for row in grid:
    for x in row:
        result.append(x)
\`\`\`
와 같다. \`x\` 가 맨 앞에 오는 것만 다르다.`,
    },
    {
      kind: "trace", traceId: "p3-nested-comp", title: "펼치기, 표 만들기, 모든 쌍",
      caption: "table 은 컴프리헨션 안에 컴프리헨션 — 안쪽 [] 가 행 하나를 완성하고, 바깥이 그 행들을 모은다. 이건 '펼치기'와 구조가 다르다.",
    },
    {
      kind: "heading", text: "두 가지를 구분하라",
    },
    {
      kind: "table",
      head: ["", "for 두 개 (한 컴프리헨션)", "컴프리헨션 안의 컴프리헨션"],
      rows: [
        ["모양", "`[x for row in grid for x in row]`", "`[[i * j for j in r] for i in r]`"],
        ["결과", "**1차원** (펼치기)", "**2차원** (표)"],
        ["읽는 법", "왼쪽 for 가 바깥", "안쪽 `[]` 가 먼저 하나의 행을 완성"],
      ],
    },
    {
      kind: "callout", tone: "warn", title: "가독성의 한계",
      md: `for 가 두 개에 if 까지 붙으면 한 줄이 80자를 넘기 쉽다. 그 이상은 컴프리헨션의 장점("결과 모양이 먼저 읽힌다")이 사라진다. **for 세 개 이상, 또는 조건이 둘 이상이면 for 문으로 풀어 쓴다.** 줄을 나눠 쓰는 것도 방법이다:

\`\`\`
pairs = [
    (a, b)
    for a in xs
    for b in ys
    if a != b
]
\`\`\``,
    },
    {
      kind: "pitfall",
      title: "[[0] * n] * m 대신 컴프리헨션",
      md: `2차원 리스트 초기화는 \`[[0] * n for _ in range(m)]\`. \`[[0] * n] * m\` 은 같은 행을 m 번 가리켜서 한 행을 바꾸면 전부 바뀐다 (Part 3 첫 레슨). \`_\` 는 "이 변수는 안 쓴다"는 관례.`,
    },
    {
      kind: "quiz",
      question: "`[(a, b) for a in [1, 2] for b in [\"x\", \"y\"]]` 의 결과는?",
      choices: [
        { text: "`[(1, 'x'), (1, 'y'), (2, 'x'), (2, 'y')]`", correct: true, why: "a 가 바깥. a=1 일 때 b 가 x, y 를 돌고, 그다음 a=2." },
        { text: "`[(1, 'x'), (2, 'x'), (1, 'y'), (2, 'y')]`", why: "이건 b 가 바깥일 때의 순서다. 왼쪽 for 가 바깥이다." },
        { text: "`[(1, 'x'), (2, 'y')]`", why: "zip 이 아니다. 모든 조합이 나온다 (2 × 2 = 4개)." },
      ],
    },
    {
      kind: "summary",
      items: [
        "for 가 여럿이면 **왼쪽이 바깥.** 풀어 쓴 중첩 for 문과 같은 순서.",
        "`[x for row in grid for x in row]` 는 펼치기(1차원), `[[...] for ...]` 는 표(2차원).",
        "for 셋 이상·조건 둘 이상이면 for 문으로. 길면 줄을 나눈다.",
      ],
    },
  ],
};
