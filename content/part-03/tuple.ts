import type { Lesson } from "@/lib/types";

export const tupleLesson: Lesson = {
  part: 3,
  slug: "tuple",
  blocks: [
    {
      kind: "viz", component: "Story", title: "튜플은 참조를 고정한다 — 객체를 고정하는 게 아니다",
      props: {
        story: {
          code: ["point = (3, 4)", "x, y = point", "box = ([1, 2], \"고정\")", "box[0].append(3)", "box[0] = []"],
          steps: [
            { chapter: "튜플", say: "`(3, 4)` — 리스트와 비슷하지만 **바꿀 수 없다.** 칸의 참조가 고정된다.", ops: [{ line: 0 }, { obj: "T", type: "tuple", items: ["3", "4"] }, { bind: "point", to: "T" }] },
            { chapter: "언패킹", say: "`x, y = point` — 칸 개수만큼의 이름에 한꺼번에 붙인다. 함수가 여러 값을 돌려줄 때 이 문법을 쓴다.", ops: [{ line: 1 }, { obj: "i3", type: "int", value: "3" }, { obj: "i4", type: "int", value: "4" }, { bind: "x", to: "i3" }, { bind: "y", to: "i4" }] },
            { chapter: "안의 리스트", say: "튜플 안에 리스트를 넣었다. 튜플의 0 번 칸은 이 리스트 객체를 **가리킨다.**", ops: [{ line: 2 }, { obj: "B", type: "tuple", refs: ["IN", "S"] }, { obj: "IN", type: "list", items: ["1", "2"] }, { obj: "S", type: "str", value: '"고정"' }, { bind: "box", to: "B" }] },
            { say: "`box[0].append(3)` — 튜플의 칸을 바꾸는 게 아니라 **칸이 가리키는 리스트 객체**를 바꾸는 것. 이건 된다.", ops: [{ line: 3 }, { mutate: "IN", items: ["1", "2", "3"] }, { badge: "IN", text: "리스트는 여전히 바꿀 수 있다", color: "fresh" }] },
            { say: "`box[0] = []` — 이건 튜플의 **칸 자체**를 다른 객체로 바꾸려는 것. **`TypeError`.** 튜플이 고정하는 건 '무엇을 가리키는가' 뿐이다.", ops: [{ line: 4 }, { unbadge: "IN" }, { badge: "B", text: "TypeError — 칸은 못 바꾼다", color: "dead" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `튜플(\`tuple\`)은 바꿀 수 없는 리스트다. 만드는 법은 괄호 — 사실 괄호가 아니라 **쉼표**가 튜플을 만든다. \`3, 4\` 만 써도 튜플이고, \`(5,)\` 처럼 항목 하나짜리는 쉼표가 필수다 (\`(5)\` 는 그냥 5).

바꿀 수 없어서 얻는 것:

- **딕셔너리 키, 집합 원소**가 될 수 있다 (해시 가능). 리스트는 안 된다.
- "이건 바뀌면 안 되는 묶음이다"라는 **의도**를 코드로 표현한다 — 좌표, 날짜, 함수의 여러 반환값.
- 리스트보다 약간 가볍고 빠르다.`,
    },
    {
      kind: "trace", traceId: "p3-tuple", title: "언패킹, *rest, 한 항목 튜플, 그리고 오류",
      caption: "마지막 줄에서 튜플의 칸에 대입하려다 TypeError. 그 직전 줄에서 안의 리스트는 잘 바뀌는 것과 대비된다.",
    },
    {
      kind: "heading", text: "언패킹은 어디에나",
    },
    {
      kind: "code",
      code: `x, y = 3, 4                    # 오른쪽이 튜플 (3, 4)
x, y = y, x                    # 교환 — Part 1 에서 본 것
first, *middle, last = [1, 2, 3, 4, 5]   # first=1, middle=[2,3,4], last=5
for name, age in [("지기", 29), ("영희", 25)]:   # 반복문에서
    print(name, age)
def min_max(nums):
    return min(nums), max(nums)   # 여러 값 반환 = 튜플 하나 반환
lo, hi = min_max([3, 1, 2])`,
    },
    {
      kind: "pitfall",
      title: "튜플은 '불변'이지만 '안의 것'까지 불변은 아니다",
      md: `\`t = ([1], [2])\` 에서 \`t[0].append(9)\` 는 된다. 튜플이 고정하는 건 칸의 **참조**다. 그래서 리스트를 담은 튜플은 딕셔너리 키로 쓸 수 없다 — \`hash(([1],))\` 은 \`TypeError\`. 안의 것까지 전부 불변이어야 해시할 수 있다.`,
    },
    {
      kind: "quiz",
      question: "`a = (1, 2); b = a + (3,)` 을 실행하면?",
      choices: [
        { text: "`a` 가 `(1, 2, 3)` 으로 바뀐다", why: "튜플은 바꿀 수 없다. + 는 새 튜플을 만든다." },
        { text: "`b` 는 `(1, 2, 3)`, `a` 는 그대로 `(1, 2)`", correct: true, why: "+ 는 두 튜플을 이어 붙인 새 객체를 만든다. a 는 건드리지 않는다. 문자열 + 와 같은 원리." },
        { text: "`TypeError`", why: "튜플끼리의 + 는 허용된다. (3,) 이 튜플이므로 정상." },
      ],
    },
    {
      kind: "summary",
      items: [
        "튜플은 **바꿀 수 없는** 시퀀스. 쉼표가 튜플을 만든다. `(5,)` 에 쉼표 필수.",
        "고정되는 건 **칸의 참조.** 안의 리스트는 바꿀 수 있다.",
        "해시 가능 → 딕셔너리 키·집합 원소로 쓸 수 있다 (안의 것도 전부 불변일 때).",
        "**언패킹** `a, b = t`, `first, *rest = lst`, 여러 값 반환.",
      ],
    },
  ],
};
