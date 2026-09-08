import type { Lesson } from "@/lib/types";

export const argsLesson: Lesson = {
  part: 4,
  slug: "args",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "위치로 넘길까, 이름으로 넘길까",
      props: {
        stack: {
          code: ['def order(item, qty=1, note=""):', "    ...", "", 'order("커피")', 'order("커피", 2)', 'order("커피", note="샷 추가")', 'order(qty=3, item="라떼")'],
          steps: [
            { chapter: "기본값", say: "매개변수 셋. `qty` 와 `note` 에는 **기본값**이 있어 생략할 수 있다. `item` 은 반드시 넘겨야 한다.", ops: [{ line: 0 }] },
            { chapter: "위치 인자", say: "`order(\"커피\")` — 인자 하나. **순서대로** 첫 매개변수 `item` 에 붙는다. 나머지는 기본값.", ops: [{ line: 3 }, { push: 'order("커피")', locals: { item: '"커피"', qty: "1", note: '""' } }] },
            { say: "`order(\"커피\", 2)` — 둘째 인자는 둘째 매개변수 `qty` 로. 위치가 곧 이름이다.", ops: [{ pop: true }, { line: 4 }, { push: 'order("커피", 2)', locals: { item: '"커피"', qty: "2", note: '""' } }] },
            { chapter: "키워드 인자", say: "`note=\"샷 추가\"` — 이름을 붙여 넘기면 **순서를 건너뛸 수 있다.** qty 는 기본값 그대로 두고 note 만 지정.", ops: [{ pop: true }, { line: 5 }, { push: 'order("커피", note=…)', locals: { item: '"커피"', qty: "1", note: '"샷 추가"' } }] },
            { say: "키워드로 넘기면 **순서를 바꿔도** 된다. 읽는 사람에게도 무엇이 무엇인지 분명하다.", ops: [{ pop: true }, { line: 6 }, { push: 'order(qty=3, item=…)', locals: { item: '"라떼"', qty: "3", note: '""' } }] },
            { chapter: "규칙", say: "위치 인자는 **앞에**, 키워드 인자는 **뒤에.** `order(qty=2, \"커피\")` 처럼 섞어 쓰면 문법 오류다.", ops: [{ pop: true }, { note: "위치 → 키워드 순서" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `함수를 부를 때 인자를 넘기는 방법은 둘이다.

- **위치 인자** — \`f(1, 2)\`. 순서대로 매개변수에 붙는다.
- **키워드 인자** — \`f(b=2, a=1)\`. 이름으로 붙는다. 순서 무관.

정의할 때 \`def f(a, b=0)\` 처럼 **기본값**을 주면 그 인자는 생략할 수 있다. 기본값 있는 매개변수는 없는 것 **뒤에** 와야 한다 (\`def f(a=0, b)\` 는 오류).`,
    },
    {
      kind: "trace", traceId: "p4-args", title: "네 가지 호출",
      caption: "각 호출에서 프레임의 item, qty, note 에 무엇이 붙는지 보라.",
    },
    {
      kind: "pitfall",
      title: "키워드 인자 뒤에 위치 인자",
      md: `\`order(qty=2, "커피")\` 는 \`SyntaxError: positional argument follows keyword argument\`. 파이썬은 "커피"를 어디에 붙여야 할지 정할 수 없다. 위치 인자를 전부 먼저 쓰고, 키워드 인자는 뒤에.`,
      traceId: "p4-args-error",
    },
    {
      kind: "callout", tone: "tip", title: "언제 키워드로 넘기나",
      md: `인자가 셋 이상이거나, 값만 봐서는 뜻을 알기 어려울 때. \`resize(img, 800, 600, True)\` 보다 \`resize(img, width=800, height=600, keep_ratio=True)\` 가 낫다. 특히 \`True\`/\`False\` 같은 플래그는 항상 키워드로.`,
    },
    {
      kind: "quiz",
      question: "`def f(a, b=2, c=3)` 일 때 **오류가 나는** 호출은?",
      choices: [
        { text: "`f(1, c=5)`", why: "a=1 위치, c=5 키워드, b 는 기본값. 정상." },
        { text: "`f(b=4, 1)`", correct: true, why: "키워드 인자(b=4) 뒤에 위치 인자(1)가 왔다. SyntaxError." },
        { text: "`f(c=1, b=2, a=3)`", why: "전부 키워드라 순서가 자유롭다. 정상." },
      ],
    },
    {
      kind: "summary",
      items: [
        "위치 인자는 **순서**로, 키워드 인자는 **이름**으로 붙는다.",
        "기본값 있는 매개변수는 생략 가능. 정의할 때 기본값 있는 것은 **뒤에.**",
        "호출할 때 **위치 인자 먼저, 키워드 인자 나중.**",
        "뜻이 안 보이는 값(숫자, True/False)은 키워드로 넘긴다.",
      ],
    },
  ],
};
