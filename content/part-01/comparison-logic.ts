import type { Lesson } from "@/lib/types";

export const comparisonLogic: Lesson = {
  part: 1,
  slug: "comparison-logic",
  blocks: [
    {
      kind: "viz", component: "Story", title: "and / or 는 True·False 를 돌려주지 않는다",
      props: {
        story: {
          code: ['nick = ""', 'shown = nick or "익명"', "user = None", "name = user and user.upper()"],
          steps: [
            { chapter: "or", say: "`nick` 은 빈 문자열 — 거짓이다.", ops: [{ line: 0 }, { obj: "e", type: "str", value: '""' }, { bind: "nick", to: "e" }] },
            { say: "`nick or \"익명\"`. `or` 는 왼쪽이 거짓이면 **오른쪽 값 자체**를 돌려준다. `True`/`False` 로 바꾸지 않는다.", ops: [{ line: 1 }, { pulse: "nick" }, { obj: "d", type: "str", value: '"익명"' }, { bind: "shown", to: "d" }, { badge: "d", text: "빈 값이면 기본값 — 흔한 관용구", color: "fresh" }] },
            { say: "왼쪽이 참이었다면 `or` 는 오른쪽을 **보지도 않고** 왼쪽 값을 돌려준다. 이것이 **단축 평가**(short-circuit).", ops: [] },
            { chapter: "and", say: "`user` 는 `None`. 거짓이다.", ops: [{ line: 2 }, { obj: "N", type: "NoneType", value: "None" }, { bind: "user", to: "N" }, { unbadge: "d" }] },
            { say: "`user and user.upper()`. `and` 는 왼쪽이 거짓이면 **거기서 멈춘다.** `user.upper()` 는 실행되지 않는다 — 실행됐다면 None 에 upper 가 없어 오류가 났을 것이다.", ops: [{ line: 3 }, { bind: "name", to: "N" }, { badge: "N", text: "user.upper() 는 실행 안 됨", color: "warn" }] },
            { say: "`name` 은 왼쪽 값인 `None` 을 그대로 받는다. `and` 는 '둘 다 참이면 오른쪽, 아니면 처음 만난 거짓' 을 돌려준다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "heading", text: "비교 연산자",
    },
    {
      kind: "table",
      head: ["연산자", "뜻", "예"],
      rows: [
        ["`==`, `!=`", "값이 같다 / 다르다", "`3 == 3.0` → `True`"],
        ["`<`, `<=`, `>`, `>=`", "크기 비교", "`\"apple\" < \"banana\"` → `True` (사전순)"],
        ["`is`, `is not`", "**같은 객체**인가 (다음 레슨)", "`x is None`"],
        ["`in`, `not in`", "포함하는가", "`\"a\" in \"apple\"`, `3 in [1, 2, 3]`"],
      ],
    },
    {
      kind: "text",
      md: `비교는 이어 쓸 수 있다. \`0 < x < 10\` 은 \`0 < x and x < 10\` 과 같다. 수학 표기 그대로라 읽기 좋다.`,
    },
    {
      kind: "trace", traceId: "p1-logic", title: "단축 평가와 연쇄 비교",
      caption: "or 가 값을 돌려주는 것, and 가 오른쪽을 건너뛰는 것, 비교를 이어 쓰는 것, not 만 항상 bool 을 돌려주는 것.",
    },
    {
      kind: "heading", text: "and / or / not 의 정확한 규칙",
    },
    {
      kind: "table",
      head: ["식", "돌려주는 것"],
      rows: [
        ["`a or b`", "`a` 가 참이면 `a`, 아니면 `b`. (`b` 는 필요할 때만 평가)"],
        ["`a and b`", "`a` 가 거짓이면 `a`, 아니면 `b`. (`b` 는 필요할 때만 평가)"],
        ["`not a`", "항상 `True` 또는 `False`"],
      ],
      caption: "돌려주는 게 '값' 이라는 것만 기억하면 `x = a or 기본값` 같은 관용구가 자연스럽게 읽힌다.",
    },
    {
      kind: "pitfall",
      title: "== 와 = 를 헷갈리기",
      md: `\`if x = 5:\` 는 \`SyntaxError\`다. \`=\`는 대입, \`==\`는 비교. 파이썬은 조건문 안에서의 대입을 문법적으로 막아 두어서 C 계열 언어의 유명한 버그(\`if (x = 5)\`)가 아예 생기지 않는다.`,
    },
    {
      kind: "pitfall",
      title: "`x == 1 or 2` 는 항상 참이다",
      md: `"x 가 1 이거나 2" 를 \`x == 1 or 2\` 로 쓰면, 이건 \`(x == 1) or (2)\` 다. \`2\` 는 참이므로 전체가 항상 참. 올바른 표현은 \`x == 1 or x == 2\` 또는 \`x in (1, 2)\`.`,
    },
    {
      kind: "quiz",
      question: "`print(0 or \"\" or [] or \"끝\")` 의 출력은?",
      choices: [
        { text: "`True`", why: "or 는 bool 을 만들지 않는다. 처음 만난 참인 값 자체를 돌려준다." },
        { text: "`끝`", correct: true, why: "0, \"\", [] 는 전부 거짓이므로 계속 오른쪽으로 간다. \"끝\" 이 참이라 그것을 돌려준다." },
        { text: "`0`", why: "0 은 거짓이므로 or 는 다음 값을 본다." },
      ],
    },
    {
      kind: "quiz",
      question: "`x = 5` 일 때 `1 < x < 3` 의 값은?",
      choices: [
        { text: "`True`", why: "(1 < x) 가 True 이고 True < 3 도 True 라고 생각할 수 있지만, 파이썬의 연쇄 비교는 그렇게 동작하지 않는다." },
        { text: "`False`", correct: true, why: "1 < x and x < 3 으로 해석된다. 5 < 3 이 거짓이므로 False." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`and` / `or` 는 **값**을 돌려준다. `not` 만 bool 을 돌려준다.",
        "**단축 평가**: 결과가 정해지면 오른쪽은 평가하지 않는다. `x = a or 기본값` 관용구의 근거.",
        "비교는 이어 쓸 수 있다: `0 < x < 10`.",
        "`x == 1 or 2` 는 버그. `x in (1, 2)` 로.",
      ],
    },
  ],
};
