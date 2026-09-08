import type { Lesson } from "@/lib/types";

export const starArgs: Lesson = {
  part: 4,
  slug: "star-args",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "*args 는 튜플로, **kwargs 는 딕셔너리로",
      props: {
        stack: {
          code: ["def total(*nums):", "    return sum(nums)", "", "def show(**opts):", "    ...", "", "total(1, 2, 3)", 'show(color="red", size=3)', "total(*[4, 5, 6])"],
          steps: [
            { chapter: "*args", say: "`*nums` — 위치 인자를 **몇 개든** 받아 **튜플** `nums` 에 담는다. 이름은 관례상 `args` 지만 아무거나 된다.", ops: [{ line: 0 }] },
            { say: "`total(1, 2, 3)` — 세 개가 튜플 `(1, 2, 3)` 으로 묶여 `nums` 에 붙는다.", ops: [{ line: 6 }, { push: "total(1, 2, 3)", locals: { nums: "(1, 2, 3)" } }] },
            { say: "", dur: 1600, ops: [{ line: 1 }, { pop: true, ret: "6" }] },
            { chapter: "**kwargs", say: "`**opts` — 키워드 인자를 몇 개든 받아 **딕셔너리** `opts` 에 담는다.", ops: [{ line: 3 }] },
            { say: "`show(color=\"red\", size=3)` — `{\"color\": \"red\", \"size\": 3}`.", ops: [{ line: 7 }, { push: "show(color=…, size=…)", locals: { opts: '{"color": "red", "size": 3}' } }] },
            { say: "", dur: 1400, ops: [{ pop: true }] },
            { chapter: "호출 쪽 *", say: "호출할 때 `*` 는 **반대**로 동작한다 — 리스트 `[4, 5, 6]` 을 **풀어서** 세 개의 위치 인자로 넘긴다. `total(4, 5, 6)` 과 같다.", ops: [{ line: 8 }, { push: "total(4, 5, 6)", locals: { nums: "(4, 5, 6)" } }] },
            { say: "", dur: 1600, ops: [{ line: 1 }, { pop: true, ret: "15" }] },
            { chapter: "정리", say: "정의에서 `*`/`**` 는 **모으기**(pack), 호출에서 `*`/`**` 는 **풀기**(unpack). 같은 기호, 반대 방향.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `인자 개수를 미리 정할 수 없을 때 쓴다.

- \`def f(*args)\` — 남는 위치 인자를 **튜플**로 모은다.
- \`def f(**kwargs)\` — 남는 키워드 인자를 **딕셔너리**로 모은다.
- 호출에서 \`f(*lst)\`, \`f(**d)\` — 반대로 **풀어서** 넘긴다.

\`print("a", "b", "c")\` 가 되는 이유가 \`print\` 의 정의가 \`def print(*objects, sep=" ", end="\\n", ...)\` 이기 때문이다.`,
    },
    {
      kind: "trace", traceId: "p4-star-args", title: "모으기와 풀기",
      caption: "정의 쪽 *nums 가 튜플을 만드는 것, 호출 쪽 *values 가 리스트를 풀어 넘기는 것. show(**config) 도 같은 원리.",
    },
    {
      kind: "heading", text: "매개변수 순서 규칙",
    },
    {
      kind: "code",
      code: `def f(a, b=1, *args, c, d=2, **kwargs):
#     ─┬─  ─┬─   ─┬─   ─┬─────  ─┬─
#      │    │     │     │        └ 나머지 키워드 인자 (dict)
#      │    │     │     └ *args 뒤는 키워드 전용 (다음 레슨)
#      │    │     └ 나머지 위치 인자 (tuple)
#      │    └ 기본값 있는 위치 매개변수
#      └ 일반 위치 매개변수
f(1, 2, 3, 4, c=5, e=6)   # a=1 b=2 args=(3,4) c=5 d=2 kwargs={'e':6}`,
      caption: "전부 쓸 일은 드물다. 흔한 건 def f(*args, **kwargs) — '무엇이든 받아 그대로 넘기는' 래퍼 함수 (Part 9 데코레이터).",
    },
    {
      kind: "pitfall",
      title: "*args 는 리스트가 아니라 튜플",
      md: `\`args.append(x)\` 는 \`AttributeError\`. 튜플이라 바꿀 수 없다. 바꿔야 하면 \`list(args)\`. 그리고 \`*args\` 만 있는 함수에 키워드로 넘기면(\`f(x=1)\`) \`TypeError\` — 키워드는 \`**kwargs\` 로만 받는다.`,
    },
    {
      kind: "quiz",
      question: "`def f(*a, **k): print(a, k)` 에 `f(1, 2, x=3)` 을 호출하면?",
      choices: [
        { text: "`(1, 2) {'x': 3}`", correct: true, why: "위치 인자 1, 2 는 튜플 a 로, 키워드 x=3 은 딕셔너리 k 로." },
        { text: "`[1, 2] {'x': 3}`", why: "*a 는 튜플로 모은다. 리스트가 아니다." },
        { text: "`(1, 2, 3) {}`", why: "x=3 은 키워드 인자이므로 **k 로 간다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`*args` → 남는 위치 인자를 **튜플**로, `**kwargs` → 남는 키워드 인자를 **딕셔너리**로.",
        "호출에서 `*lst`, `**d` 는 반대로 **풀어서** 넘긴다.",
        "순서: 일반 → 기본값 → `*args` → 키워드 전용 → `**kwargs`.",
        "`def f(*args, **kwargs)` 는 '뭐든 받아 그대로 넘기는' 래퍼의 표준.",
      ],
    },
  ],
};
