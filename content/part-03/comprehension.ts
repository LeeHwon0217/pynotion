import type { Lesson } from "@/lib/types";

export const comprehension: Lesson = {
  part: 3,
  slug: "comprehension",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "컴프리헨션 — 반복문을 한 줄에 접은 것",
      props: {
        flow: {
          code: ["nums = [1, 2, 3, 4]", "sq = [n * n for n in nums if n % 2 == 0]"],
          nodes: [
            { id: "c", kind: "cond", label: "다음 n 이 있나?", x: 640, y: 120 },
            { id: "f", kind: "cond", label: "n % 2 == 0 ?", x: 640, y: 240 },
            { id: "e", kind: "step", label: "n * n 계산", x: 640, y: 350 },
            { id: "a", kind: "step", label: "결과 리스트에 추가", x: 640, y: 430 },
            { id: "d", kind: "end", label: "완성", x: 940, y: 120 },
          ],
          edges: [
            { from: "c", to: "f", label: "있음" },
            { from: "f", to: "c", label: "거짓 → 건너뜀", via: [[450, 240], [450, 120]] },
            { from: "f", to: "e", label: "참" },
            { from: "e", to: "a" },
            { from: "a", to: "c", via: [[830, 430], [830, 120]] },
            { from: "c", to: "d", label: "없음" },
          ],
          steps: [
            { chapter: "읽는 순서", say: "`[식 for n in nums if 조건]` 은 **뒤에서부터** 읽는다: nums 에서 n 을 하나씩 → 조건이 참이면 → 식을 계산해 담는다.", line: 1, vars: { sq: "[]" }, seq: { items: ["1", "2", "3", "4"], index: -1, label: "nums" } },
            { chapter: "n = 1", say: "1 — 홀수. 조건이 거짓이라 **건너뛴다.** 결과에 아무것도 안 들어간다.", at: "c", line: 1, seq: { items: ["1", "2", "3", "4"], index: 0, label: "nums" } },
            { say: "", dur: 1300, at: "f", badge: { at: "f", text: "1 % 2 == 0 → False", color: "dead" } },
            { chapter: "n = 2", say: "2 — 짝수. 조건 참. `n * n` = 4 를 계산해 결과에 넣는다.", at: "c", seq: { items: ["1", "2", "3", "4"], index: 1, label: "nums" } },
            { say: "", dur: 1200, at: "f", badge: { at: "f", text: "True", color: "fresh" } },
            { say: "", dur: 1200, at: "e" },
            { say: "", dur: 1400, at: "a", vars: { sq: "[4]" } },
            { chapter: "n = 3", say: "3 — 건너뜀.", at: "c", seq: { items: ["1", "2", "3", "4"], index: 2, label: "nums" } },
            { say: "", dur: 1200, at: "f", badge: { at: "f", text: "False", color: "dead" } },
            { chapter: "n = 4", say: "4 — 16 을 넣는다.", at: "c", seq: { items: ["1", "2", "3", "4"], index: 3, label: "nums" } },
            { say: "", dur: 1100, at: "f", badge: { at: "f", text: "True", color: "fresh" } },
            { say: "", dur: 1100, at: "e" },
            { say: "", dur: 1300, at: "a", vars: { sq: "[4, 16]" } },
            { chapter: "완성", say: "더 없다. `sq = [4, 16]`. **for 문 + append** 를 한 줄에 쓴 것일 뿐, 새로운 개념이 아니다.", at: "d", seq: { items: ["1", "2", "3", "4"], index: 4, label: "nums" } },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `컴프리헨션은 "반복하면서 새 컨테이너를 만드는" 흔한 패턴을 한 줄로 쓰는 문법이다. 세 종류:

- 리스트: \`[식 for x in iter if 조건]\`
- 딕셔너리: \`{키식: 값식 for x in iter if 조건}\`
- 집합: \`{식 for x in iter if 조건}\`

\`if 조건\` 은 선택. 결과는 언제나 **새 객체**다.`,
    },
    {
      kind: "code", title: "같은 일, 두 가지 쓰기",
      code: `# for + append
squares = []
for n in nums:
    if n % 2 == 0:
        squares.append(n * n)

# 컴프리헨션 — 위와 완전히 같다
squares = [n * n for n in nums if n % 2 == 0]`,
      caption: "'무엇을 담는가(식)'가 맨 앞에 와서, 결과가 어떤 모양인지 먼저 읽힌다.",
    },
    {
      kind: "trace", traceId: "p3-comp", title: "리스트·딕셔너리·셋 컴프리헨션",
      caption: "각 줄이 새 객체를 만든다. 셋 컴프리헨션에서 중복(2, 2)이 하나로 합쳐지는 것도 보라.",
    },
    {
      kind: "heading", text: "if-else 는 앞에, if 는 뒤에",
    },
    {
      kind: "code",
      code: `# 거르기(filter): 뒤의 if — 조건 거짓이면 항목이 빠진다
evens = [n for n in nums if n % 2 == 0]

# 바꾸기(map): 앞의 조건부 표현식 — 모든 항목이 들어가되 값이 달라진다
labels = ["짝" if n % 2 == 0 else "홀" for n in nums]

# 둘 다
[n * 10 if n > 2 else n for n in nums if n != 3]`,
    },
    {
      kind: "pitfall",
      title: "부수 효과를 위해 컴프리헨션을 쓰기",
      md: `\`[print(x) for x in lst]\` 처럼 결과 리스트가 필요 없는데 컴프리헨션을 쓰면 \`None\` 이 가득한 리스트가 만들어졌다 버려진다. 뭔가를 **만드는** 게 아니라 **하는** 거라면 그냥 for 문.`,
    },
    {
      kind: "quiz",
      question: "`[x for x in \"hello\" if x not in \"aeiou\"]` 의 결과는?",
      choices: [
        { text: "`['h', 'l', 'l']`", correct: true, why: "글자 하나씩 꺼내 모음이 아닌 것만 담는다. e 와 o 가 빠진다." },
        { text: "`\"hll\"`", why: "리스트 컴프리헨션은 리스트를 만든다. 문자열로 합치려면 \"\".join(...)." },
        { text: "`['e', 'o']`", why: "not in 이므로 모음이 아닌 것을 고른다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`[식 for x in iter if 조건]` = for + append. **뒤에서부터** 읽는다.",
        "딕셔너리 `{k: v for ...}`, 집합 `{x for ...}` 도 같은 꼴.",
        "뒤의 `if` 는 거르기, 앞의 `a if c else b` 는 값 바꾸기.",
        "결과가 필요 없으면 for 문을 쓴다.",
      ],
    },
  ],
};
