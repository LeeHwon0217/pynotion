import type { Lesson } from "@/lib/types";

export const listBasics: Lesson = {
  part: 3,
  slug: "list-basics",
  blocks: [
    {
      kind: "viz", component: "Story", title: "리스트는 참조를 담는 칸의 나열",
      props: {
        story: {
          code: ["nums = [10, 20, 30]", "nums[1] = 25", "nums.append(40)", "first = nums[0]"],
          steps: [
            { chapter: "만들기", say: "`[10, 20, 30]` — 리스트 객체 하나가 생긴다. 칸 3개. 각 칸에는 값이 아니라 **정수 객체를 가리키는 참조**가 든다.", ops: [{ line: 0 }, { obj: "L", type: "list", items: ["10", "20", "30"] }, { bind: "nums", to: "L" }] },
            { say: "칸 번호(인덱스)는 **0 부터.** 첫 칸이 0, 마지막이 2. 왜 0 부터인지는 다음 레슨에서.", ops: [{ badge: "L", text: "인덱스 0, 1, 2", color: "name" }] },
            { chapter: "바꾸기", say: "`nums[1] = 25` — 1 번 칸의 참조를 새 객체 25 로 바꾼다. **리스트 객체 자체가 바뀐다.** 이름 `nums` 는 그대로.", ops: [{ line: 1 }, { unbadge: "L" }, { mutate: "L", items: ["10", "25", "30"] }] },
            { say: "`append(40)` — 칸이 하나 늘고 40 이 들어간다. 역시 같은 객체를 바꾼 것.", ops: [{ line: 2 }, { mutate: "L", items: ["10", "25", "30", "40"] }] },
            { chapter: "읽기", say: "`nums[0]` — 0 번 칸의 참조를 따라가 그 객체에 `first` 라는 이름을 하나 더 붙인다. 복사가 아니다.", ops: [{ line: 3 }, { obj: "ten", type: "int", value: "10", note: "nums[0] 이 가리키는 객체" }, { bind: "first", to: "ten" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `리스트(\`list\`)는 파이썬에서 가장 많이 쓰는 자료구조다. 순서가 있고, 바꿀 수 있고(mutable), 아무 타입이나 섞어 담을 수 있다.

- 만들기: \`[]\`, \`[1, 2, 3]\`, \`list("abc")\` → \`['a', 'b', 'c']\`, \`list(range(5))\`
- 읽기: \`nums[0]\`, 길이: \`len(nums)\`
- 바꾸기: \`nums[0] = 99\`, \`nums.append(x)\`
- 포함 검사: \`3 in nums\``,
    },
    {
      kind: "trace", traceId: "p3-list-basics", title: "한 줄씩",
      caption: "nums[1] = 25 에서 리스트 객체가 제자리에서 바뀌는 것, 그리고 안쪽 리스트를 mixed[3][0] 으로 파고드는 것.",
    },
    {
      kind: "callout", tone: "deep", title: "리스트에는 값이 '들어 있지' 않다",
      md: `애니메이션에서 본 것처럼 리스트의 칸은 **참조**를 담는다. \`[10, 20, 30]\` 은 "정수 세 개가 든 상자"가 아니라 "정수 객체 세 개를 가리키는 화살표 세 개"다. 그래서 \`[1, "a", [2]]\` 처럼 타입이 섞여도 되고(칸 크기는 항상 참조 하나), 리스트 안에 리스트를 넣으면 **그 리스트를 공유**하게 된다. Part 3 「얕은 복사 vs 깊은 복사」의 함정이 전부 여기서 나온다.`,
    },
    {
      kind: "pitfall",
      title: "[[0] * 3] * 3 — 같은 행이 세 번",
      md: `2차원 리스트를 만들려고 \`[[0] * 3] * 3\` 을 쓰면, 안쪽 리스트 **하나**를 세 번 가리키는 리스트가 된다. 한 행을 바꾸면 세 행이 같이 바뀐다. 행마다 새 리스트를 만들려면 \`[[0] * 3 for _ in range(3)]\`.`,
      code: `grid = [[0] * 3] * 3
grid[0][0] = 1
print(grid)   # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]  ← 전부 바뀜

grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)   # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `a = [1, 2, 3]
b = a[0]
a[0] = 100
print(b)`,
      choices: [
        { text: "`100`", why: "b = a[0] 은 정수 객체 1 에 b 를 붙인 것. a[0] = 100 은 리스트의 0번 칸이 다른 객체를 가리키게 한 것. b 는 여전히 1." },
        { text: "`1`", correct: true, why: "b 는 리스트의 칸이 아니라 '그 칸이 가리키던 객체 1' 에 붙은 이름이다. 칸의 참조를 바꿔도 b 는 영향 없다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "리스트는 **참조를 담는 칸**의 나열. 순서 있음, 바꿀 수 있음, 타입 섞기 가능.",
        "`nums[i]` 읽기·쓰기, `len()`, `append()`, `in`.",
        "`nums[i] = x` 와 `append` 는 **리스트 객체를 제자리에서 바꾼다** (이름은 그대로).",
        "`[[0] * 3] * 3` 은 같은 행을 공유한다. 컴프리헨션으로 만들 것.",
      ],
    },
  ],
};
