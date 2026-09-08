import type { Lesson } from "@/lib/types";

export const positionalOnly: Lesson = {
  part: 4,
  slug: "positional-only",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "/ 와 * — 넘기는 방식을 강제한다",
      props: {
        stack: {
          code: ["def f(a, b, /, c, *, d):", "    return a + b + c + d", "", "f(1, 2, 3, d=4)", "f(1, 2, c=3, d=4)", "f(1, 2, 3, 4)"],
          steps: [
            { chapter: "시그니처", say: "`/` **앞**의 a, b 는 **위치로만** 넘길 수 있다. `*` **뒤**의 d 는 **키워드로만.** 가운데 c 는 둘 다 된다.", ops: [{ line: 0 }] },
            { say: "`f(1, 2, 3, d=4)` — a, b 위치, c 위치, d 키워드. 정상.", ops: [{ line: 3 }, { push: "f(1, 2, 3, d=4)", locals: { a: "1", b: "2", c: "3", d: "4" } }] },
            { say: "", dur: 1400, ops: [{ pop: true, ret: "10" }] },
            { say: "`f(1, 2, c=3, d=4)` — c 는 키워드로도 된다. 정상.", ops: [{ line: 4 }, { push: "f(1, 2, c=3, d=4)", locals: { a: "1", b: "2", c: "3", d: "4" } }] },
            { say: "", dur: 1400, ops: [{ pop: true, ret: "10" }] },
            { say: "`f(1, 2, 3, 4)` — d 를 위치로 넘기려 했다. **`TypeError`** — d 는 키워드로만 받는다. `f(a=1, ...)` 도 마찬가지로 오류.", ops: [{ line: 5 }, { push: "f(1, 2, 3, 4)", locals: { a: "1", b: "2", c: "3" } }, { note: "TypeError: d 는 키워드 전용" }] },
            { chapter: "왜 쓰나", say: "키워드 전용(`*`)은 **플래그 인자를 명시하게** 만들고, 위치 전용(`/`)은 **매개변수 이름을 나중에 바꿔도** 호출 코드가 안 깨지게 한다.", ops: [{ pop: true }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `시그니처(매개변수 목록)에 두 특수 기호를 쓸 수 있다.

- \`/\` — 이 앞의 매개변수는 **위치 전용.** \`f(1, 2)\` 는 되고 \`f(a=1, b=2)\` 는 안 된다. (3.8+)
- \`*\` — 이 뒤의 매개변수는 **키워드 전용.** \`f(d=4)\` 는 되고 \`f(4)\` 는 안 된다.

\`*args\` 가 있으면 그 뒤가 자동으로 키워드 전용이 된다. \`*\` 만 덜렁 쓰는 건 "args 는 안 받지만 뒤는 키워드 전용"이라는 뜻.`,
    },
    {
      kind: "trace", traceId: "p4-positional-only", title: "세 가지 호출",
      caption: "마지막 호출이 TypeError 로 끝난다.",
    },
    {
      kind: "table",
      head: ["", "위치 전용 `/`", "키워드 전용 `*`"],
      rows: [
        ["쓰는 이유", "매개변수 이름이 API 의 일부가 되지 않게 (나중에 이름을 바꿔도 됨)", "호출할 때 이름을 **반드시** 쓰게 (가독성, 실수 방지)"],
        ["표준 라이브러리 예", "`len(obj, /)`, `pow(base, exp, mod=None, /)`", "`sorted(iterable, *, key=None, reverse=False)`"],
        ["흔한 실수", "`len(obj=lst)` → TypeError", "`sorted(lst, len)` → TypeError (key= 를 써야)"],
      ],
    },
    {
      kind: "callout", tone: "tip", title: "실전에서는 * 를 자주 쓴다",
      md: `\`def connect(host, port, *, timeout=30, retry=3)\` — 옵션 인자를 키워드 전용으로 두면 \`connect("db", 5432, 10, 5)\` 같은 알 수 없는 호출을 막고 \`connect("db", 5432, timeout=10)\` 처럼 쓰게 된다. 인자가 넷 이상인 함수는 옵션을 \`*\` 뒤로 보내는 게 좋은 습관이다.`,
    },
    {
      kind: "quiz",
      question: "`def g(x, /, y, *, z)` 에 대해 **정상인** 호출은?",
      choices: [
        { text: "`g(1, 2, 3)`", why: "z 는 키워드 전용. 위치로 넘기면 TypeError." },
        { text: "`g(1, y=2, z=3)`", correct: true, why: "x 는 위치, y 는 둘 다 가능, z 는 키워드. 전부 규칙에 맞다." },
        { text: "`g(x=1, y=2, z=3)`", why: "x 는 위치 전용. 키워드로 넘기면 TypeError." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`/` 앞은 **위치 전용**, `*` 뒤는 **키워드 전용.** 사이는 둘 다.",
        "`*args` 뒤는 자동으로 키워드 전용.",
        "옵션 인자는 `*` 뒤로 보내 이름을 쓰게 만드는 것이 좋은 API.",
      ],
    },
  ],
};
