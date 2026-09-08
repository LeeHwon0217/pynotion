import type { Lesson } from "@/lib/types";

export const lambdaLesson: Lesson = {
  part: 4,
  slug: "lambda",
  blocks: [
    {
      kind: "viz", component: "Story", title: "함수는 객체다 — 이름을 붙이고, 담고, 넘긴다",
      props: {
        story: {
          code: ["def square(x):", "    return x * x", "sq = lambda x: x * x", "f = square", 'ops = {"곱": sq}', "sorted(w, key=len)"],
          steps: [
            { chapter: "def 도 객체", say: "`def square` — 함수 **객체**가 만들어지고 `square` 라는 이름이 붙는다. 정수·문자열과 똑같은 '객체 + 이름표' 구조.", ops: [{ line: 0 }, { obj: "F1", type: "function", value: "square" }, { bind: "square", to: "F1" }] },
            { chapter: "lambda", say: "`lambda x: x * x` — **이름 없이** 함수 객체만 만드는 식. 여기선 `sq` 에 붙였지만, 붙이지 않고 바로 넘길 수도 있다.", ops: [{ line: 2 }, { obj: "F2", type: "function", value: "<lambda>" }, { bind: "sq", to: "F2" }] },
            { chapter: "이름 하나 더", say: "`f = square` — 함수 객체에 이름을 하나 더. `f(3)` 과 `square(3)` 은 같은 함수를 부른다. 괄호 없이 쓰면 '호출' 이 아니라 '객체 자체' 다.", ops: [{ line: 3 }, { bind: "f", to: "F1" }] },
            { chapter: "담기", say: "딕셔너리 값으로 함수를 담을 수 있다. `ops[\"곱\"](3, 4)` — 꺼내서 바로 호출.", ops: [{ line: 4 }, { obj: "D", type: "dict", entries: [['"곱"', "<function>"]] }, { bind: "ops", to: "D" }] },
            { chapter: "넘기기", say: "`sorted(w, key=len)` — 함수 `len` 을 **인자로** 넘긴다. sorted 가 안에서 `len(항목)` 을 호출해 기준값을 얻는다. 이것이 lambda 의 주 용도.", ops: [{ line: 5 }, { obj: "F3", type: "builtin", value: "len" }, { bind: "key", to: "F3", frame: "sorted()" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `파이썬에서 함수는 **일급 객체**(first-class)다. 정수나 문자열처럼 변수에 붙이고, 리스트·딕셔너리에 담고, 다른 함수에 인자로 넘기고, 함수에서 돌려줄 수 있다.

\`lambda 인자: 식\` 은 이름 없는 함수를 만드는 **식**이다. 본문은 식 하나뿐 — \`return\` 도 여러 줄도 없다. \`lambda x: x * 2\` 는 \`def f(x): return x * 2\` 와 같은 함수 객체를 만든다.`,
    },
    {
      kind: "trace", traceId: "p4-lambda", title: "한 줄씩",
      caption: "sq 와 square 가 서로 다른 함수 객체인 것, f 가 square 와 같은 객체인 것, 딕셔너리에 담긴 lambda 를 꺼내 호출하는 것.",
    },
    {
      kind: "heading", text: "lambda 를 쓰는 곳 — 거의 전부 '기준 함수'",
    },
    {
      kind: "code",
      code: `sorted(people, key=lambda p: p["age"])       # 정렬 기준
max(words, key=lambda w: len(w))              # 최댓값 기준
list(map(lambda x: x * 2, nums))              # 변환 (컴프리헨션이 더 낫다)
list(filter(lambda x: x > 0, nums))           # 거르기 (역시 컴프리헨션)
button.on_click(lambda: print("눌림"))         # 콜백`,
      caption: "한 줄로 끝나고 한 번만 쓰는 함수. 두 번 이상 쓰거나 한 줄을 넘으면 def 로.",
    },
    {
      kind: "pitfall",
      title: "lambda 에 이름을 붙여 저장하기",
      md: `\`sq = lambda x: x * x\` 는 스타일 가이드(PEP 8)가 말리는 패턴이다. 이름을 붙일 거면 \`def sq(x): return x * x\` — 오류 메시지에 함수 이름이 나오고, 독스트링을 달 수 있고, 여러 줄로 늘릴 수 있다. lambda 는 **이름 없이 그 자리에서 넘길 때** 쓴다.`,
    },
    {
      kind: "quiz",
      question: "`f = lambda a, b=2: a ** b` 일 때 `f(3)` 은?",
      choices: [
        { text: "`9`", correct: true, why: "lambda 도 기본값을 가질 수 있다. b=2 이므로 3 ** 2 = 9." },
        { text: "`TypeError`", why: "b 에 기본값이 있어 생략 가능하다." },
        { text: "`6`", why: "** 는 거듭제곱이다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "함수는 **객체**다. 이름을 붙이고, 담고, 넘기고, 돌려줄 수 있다. `f` 는 객체, `f()` 는 호출.",
        "`lambda 인자: 식` — 이름 없는 한 줄 함수를 만드는 **식.**",
        "쓰임은 거의 `key=`, `map`, `filter`, 콜백. 이름 붙여 저장할 거면 `def`.",
      ],
    },
  ],
};
