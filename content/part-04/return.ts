import type { Lesson } from "@/lib/types";

export const returnLesson: Lesson = {
  part: 4,
  slug: "return",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "return 이 없으면 None, 여러 개면 튜플",
      props: {
        stack: {
          code: ["def greet(name):", '    print("안녕,", name)', "", "def min_max(nums):", "    return min(nums), max(nums)", "", 'r = greet("지기")', "lo, hi = min_max([3, 1, 2])"],
          steps: [
            { chapter: "return 없음", say: "`greet` 은 출력만 하고 `return` 이 없다. 호출해 보자.", ops: [{ line: 6 }, { push: 'greet("지기")', locals: { name: '"지기"' } }] },
            { say: "본문 실행 — 화면에 인사가 찍힌다. 그리고 본문이 끝났다. return 이 없어도 함수는 **반드시 뭔가를 돌려준다** — `None`.", ops: [{ line: 1 }, { output: "안녕, 지기\n" }] },
            { say: "`r` 에 `None` 이 붙는다. \"출력했으니 값이 있겠지\" 는 착각 — **출력과 반환은 다른 일**이다.", ops: [{ pop: true, ret: "None" }, { note: "r = None" }] },
            { chapter: "여러 값", say: "`min_max` 는 `return a, b` — 쉼표로 두 값. 실제로는 **튜플 하나** `(1, 3)` 을 돌려준다.", ops: [{ line: 7 }, { push: "min_max([3, 1, 2])", locals: { nums: "[3, 1, 2]" } }] },
            { say: "", dur: 1800, ops: [{ line: 4 }, { pop: true, ret: "(1, 3)" }] },
            { say: "받는 쪽에서 `lo, hi = ` 로 **언패킹**하면 두 이름에 나뉘어 붙는다. 여러 값 반환의 정체는 '튜플 + 언패킹'.", ops: [{ note: "lo = 1, hi = 3" }] },
            { chapter: "return 의 역할", say: "`return` 은 두 가지를 한다: **값을 돌려주고**, 그 즉시 **함수를 끝낸다.** return 아래 줄은 실행되지 않는다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`return 값\` 은 값을 호출한 곳으로 돌려주고 함수를 **즉시** 끝낸다. 알아야 할 것 세 가지:

- \`return\` 이 없거나 \`return\` 만 있으면 \`None\` 을 돌려준다. \`print\` 는 반환이 아니다.
- \`return a, b\` 는 튜플 \`(a, b)\` 하나를 돌려준다. \`x, y = f()\` 로 받는다.
- \`return\` 은 어디서든 함수를 끝낸다. 반복문 한가운데서도.`,
    },
    {
      kind: "trace", traceId: "p4-return", title: "None 과 튜플",
      caption: "greet() 의 반환값이 None 인 것과, min_max() 가 튜플을 돌려주고 lo, hi 로 나뉘는 것.",
    },
    {
      kind: "heading", text: "조기 반환 (early return)",
    },
    {
      kind: "code",
      code: `def find(items, target):
    for i, x in enumerate(items):
        if x == target:
            return i          # 찾는 순간 끝 — 나머지는 보지 않는다
    return None               # 끝까지 못 찾으면

def safe_div(a, b):
    if b == 0:
        return None           # 예외 상황을 먼저 처리하고 빠져나간다
    return a / b              # 정상 경로는 들여쓰기 없이 깔끔하게`,
      caption: "조건이 맞으면 바로 return 하는 습관은 if/else 중첩을 줄인다.",
    },
    {
      kind: "pitfall",
      title: "print 와 return 을 헷갈리기",
      md: `\`def double(x): print(x * 2)\` 를 만들고 \`y = double(3)\` 하면 화면엔 6 이 찍히지만 \`y\` 는 \`None\`. 함수가 **값을 만들어 주는** 거라면 \`return\`, 사람에게 **보여주는** 거라면 \`print\`. 대부분의 함수는 return 을 쓰고, print 는 맨 바깥에서 한 번.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `def f(n):
    if n > 0:
        return "양수"
    print("음수 또는 0")
print(f(5))`,
      choices: [
        { text: "`양수`", correct: true, why: "n > 0 이므로 return \"양수\" 에서 함수가 끝난다. 아래 print 는 실행되지 않고, 바깥 print 가 반환값을 출력한다." },
        { text: "`음수 또는 0` 다음 줄에 `None`", why: "return 을 만나면 함수는 즉시 끝난다. 그 아래는 실행되지 않는다." },
        { text: "`양수` 다음 줄에 `None`", why: "return 뒤의 코드는 실행되지 않으므로 None 이 출력될 일이 없다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`return` = 값 돌려주기 + **즉시 종료.**",
        "return 없으면 `None`. **print 는 반환이 아니다.**",
        "`return a, b` 는 튜플. `x, y = f()` 로 언패킹.",
        "조건이 맞으면 바로 return 하는 조기 반환으로 중첩을 줄인다.",
      ],
    },
  ],
};
