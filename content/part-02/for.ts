import type { Lesson } from "@/lib/types";

export const forLesson: Lesson = {
  part: 2,
  slug: "for",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "for — 꺼낼 것이 있는 동안 하나씩",
      props: {
        flow: {
          code: ['fruits = ["사과", "배", "귤"]', "for fruit in fruits:", "    print(fruit)", 'print("끝")'],
          nodes: [
            { id: "c", kind: "cond", label: "다음 항목이 있나?", x: 640, y: 190 },
            { id: "b", kind: "step", label: "fruit = 그 항목", x: 640, y: 300 },
            { id: "p", kind: "io", label: "print(fruit)", x: 640, y: 380 },
            { id: "e", kind: "io", label: 'print("끝")', x: 640, y: 480 },
          ],
          edges: [
            { from: "c", to: "b", label: "있음" },
            { from: "b", to: "p" },
            { from: "p", to: "c", via: [[820, 380], [820, 190]] },
            { from: "c", to: "e", label: "없음", via: [[450, 190], [450, 480]] },
          ],
          steps: [
            { chapter: "이터러블", say: "`for` 는 **이터러블**(순회 가능한 것)에서 항목을 하나씩 꺼낸다. 리스트가 대표적이다.", line: 0, vars: { fruits: '["사과", "배", "귤"]' }, seq: { items: ['"사과"', '"배"', '"귤"'], index: -1, label: "fruits" } },
            { chapter: "1회", say: "꺼낼 게 있나? 있다 — `\"사과\"`. 이름 `fruit` 를 거기에 붙인다.", at: "c", line: 1, seq: { items: ['"사과"', '"배"', '"귤"'], index: 0, label: "fruits" } },
            { say: "", dur: 1400, at: "b", line: 1, vars: { fruits: '["사과", "배", "귤"]', fruit: '"사과"' } },
            { say: "블록 실행. 끝나면 **다음 항목**을 찾으러 돌아간다.", at: "p", line: 2, output: "사과\n" },
            { chapter: "2회", say: "`\"배\"` 가 있다. `fruit` 를 **다시 붙인다** (재바인딩).", at: "c", line: 1, seq: { items: ['"사과"', '"배"', '"귤"'], index: 1, label: "fruits" } },
            { say: "", dur: 1300, at: "b", line: 1, vars: { fruits: '["사과", "배", "귤"]', fruit: '"배"' } },
            { say: "", dur: 1300, at: "p", line: 2, output: "배\n" },
            { chapter: "3회", say: "`\"귤\"`.", at: "c", line: 1, seq: { items: ['"사과"', '"배"', '"귤"'], index: 2, label: "fruits" } },
            { say: "", dur: 1300, at: "b", line: 1, vars: { fruits: '["사과", "배", "귤"]', fruit: '"귤"' } },
            { say: "", dur: 1300, at: "p", line: 2, output: "귤\n" },
            { chapter: "종료", say: "더 꺼낼 게 없다. 반복 종료. `fruit` 는 마지막 값 `\"귤\"` 에 붙은 채 남는다.", at: "c", line: 1, seq: { items: ['"사과"', '"배"', '"귤"'], index: 3, label: "fruits" } },
            { say: "`for` 는 \"몇 번 돌지\" 가 아니라 \"**무엇을 하나씩**\" 이라고 읽는 게 정확하다. 횟수는 결과일 뿐.", at: "e", line: 3, output: "끝\n" },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`for 이름 in 이터러블:\` — 이터러블에서 항목을 하나 꺼내 이름에 붙이고 블록을 실행, 다음 항목으로 반복. 꺼낼 것이 없으면 끝난다.

**이터러블**은 "하나씩 꺼낼 수 있는 것" 전부다: 리스트, 튜플, 문자열(글자 하나씩), 딕셔너리(키 하나씩), \`range\`, 파일(줄 하나씩)… 정확한 정의는 Part 8에서 다루지만, 지금은 "for 에 넣을 수 있는 것"으로 충분하다.`,
    },
    {
      kind: "trace", traceId: "p2-for", title: "리스트, enumerate, 문자열",
      caption: "fruit 가 매번 다른 객체로 재바인딩되는 것을 오른쪽 화살표에서 보라. enumerate 는 (번호, 항목) 쌍을 준다.",
    },
    {
      kind: "heading", text: "자주 쓰는 형태",
    },
    {
      kind: "code",
      code: `for i in range(5):                 # 0 1 2 3 4 — 횟수 반복 (다음 레슨)
for i, item in enumerate(items):   # 번호와 항목을 같이
for a, b in zip(list1, list2):     # 두 리스트를 나란히
for key in d:                      # 딕셔너리는 키를 준다
for key, value in d.items():       # 키와 값을 같이
for ch in "hello":                 # 글자 하나씩
for line in open("data.txt"):      # 파일은 줄 하나씩`,
    },
    {
      kind: "pitfall",
      title: "인덱스로 돌리는 C 스타일",
      md: `\`for i in range(len(fruits)): print(fruits[i])\` 는 동작하지만 파이썬답지 않다. 항목이 필요하면 \`for fruit in fruits:\`, 번호도 필요하면 \`for i, fruit in enumerate(fruits):\`. 인덱스 계산이 사라지면 오류도 사라진다.`,
    },
    {
      kind: "pitfall",
      title: "돌면서 그 리스트를 바꾸기",
      md: `\`for x in lst: lst.remove(x)\` 처럼 순회 중인 리스트를 수정하면 항목을 건너뛰거나 이상하게 동작한다. 새 리스트를 만들거나(\`[x for x in lst if ...]\`), 복사본을 돌린다(\`for x in lst[:]:\`).`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `for ch in "ab":
    for n in [1, 2]:
        print(ch, n)`,
      choices: [
        { text: "`a 1`, `b 2`", why: "두 반복이 나란히 가는 게 아니다. 바깥이 하나 정해지면 안쪽이 전부 돈다." },
        { text: "`a 1`, `a 2`, `b 1`, `b 2`", correct: true, why: "바깥 for 가 'a' 를 잡은 동안 안쪽이 1, 2 를 다 돌고, 그다음 'b' 에 대해 다시 1, 2. (나란히 가려면 zip 을 쓴다.)" },
        { text: "`a 1`, `b 1`, `a 2`, `b 2`", why: "안쪽 반복이 먼저 끝난다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`for 이름 in 이터러블:` — 항목을 하나씩 꺼내 이름에 **재바인딩**하며 블록 실행.",
        "'몇 번' 이 아니라 '**무엇을 하나씩**'. 리스트·문자열·딕셔너리·range·파일 전부 이터러블.",
        "번호가 필요하면 `enumerate`, 두 개를 나란히 가려면 `zip`.",
        "순회 중인 리스트를 수정하지 말 것.",
      ],
    },
  ],
};
