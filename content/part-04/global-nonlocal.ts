import type { Lesson } from "@/lib/types";

export const globalNonlocal: Lesson = {
  part: 4,
  slug: "global-nonlocal",
  blocks: [
    {
      kind: "viz", component: "Scope", title: "대입은 지역을 만든다 — global 로 막는다",
      props: {
        scope: {
          code: ["count = 0", "", "def bump_wrong():", "    count = count + 1", "", "def bump():", "    global count", "    count = count + 1"],
          labels: { L: "Local — 실행 중인 함수", G: "Global — 모듈" },
          steps: [
            { chapter: "전역 count", say: "전역에 `count = 0`. 함수 안에서 이걸 1 늘리고 싶다.", line: 0, scopes: { G: { count: "0" }, B: { print: "…" } }, active: "G" },
            { chapter: "함정", say: "`bump_wrong` 은 `count = count + 1`. 파이썬은 함수를 **컴파일할 때** '이 함수 안에 count 에 대입하는 줄이 있다' 를 보고 count 를 **지역 이름**으로 분류한다.", line: 3, scopes: { L: {}, G: { count: "0" }, B: { print: "…" } }, active: "L", badge: "count 는 이 함수의 지역 이름으로 예약됨" },
            { say: "실행. 오른쪽 `count + 1` 을 계산하려고 count 를 읽는다 — **지역** count 인데 아직 값이 없다. `UnboundLocalError`. 전역까지 가지 않는다.", line: 3, scopes: { L: { count: "(아직 없음)" }, G: { count: "0" }, B: { print: "…" } }, active: "L", lookup: { name: "count", from: "L", found: "L" } },
            { chapter: "global", say: "`global count` — '이 함수에서 count 는 **전역의 것**이다' 라고 선언. 이제 대입해도 지역이 만들어지지 않는다.", line: 6, scopes: { L: {}, G: { count: "0" }, B: { print: "…" } }, active: "L", badge: "count → 전역에 연결" },
            { say: "`count = count + 1` — 읽기도 쓰기도 전역 count. 0 → 1.", line: 7, scopes: { L: {}, G: { count: "1" }, B: { print: "…" } }, active: "L", lookup: { name: "count", from: "L", found: "G" } },
            { chapter: "nonlocal", say: "감싸는 함수(Enclosing)의 변수를 바꿀 때는 `nonlocal`. 규칙은 같다 — 선언 없이 대입하면 새 지역이 생긴다.", scopes: { L: {}, E: { n: "0" }, G: { count: "1" }, B: { print: "…" } }, active: "L", badge: "nonlocal n  →  outer 의 n 에 연결" },
            { chapter: "그런데", say: "`global` 은 **가능한 한 쓰지 않는다.** 어디서 값이 바뀌는지 추적이 안 되기 때문. 값을 `return` 으로 돌려주고 바깥에서 대입하는 게 정석이다.", scopes: { G: { count: "1" }, B: { print: "…" } }, active: "G" },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `함수 안에서 이름에 대입하면 그 이름은 **그 함수의 지역**이 된다 — 함수 전체에서, 대입 줄 이전이라도. 이게 \`UnboundLocalError\` 의 원인이다. 바깥 변수를 함수 안에서 **바꾸려면** 선언이 필요하다.

- \`global 이름\` — 모듈 수준의 이름을 쓰겠다
- \`nonlocal 이름\` — 감싸는 함수의 이름을 쓰겠다

읽기만 할 때는 선언이 필요 없다 (LEGB 로 찾아진다). **대입할 때만** 문제가 된다.`,
    },
    {
      kind: "trace", traceId: "p4-global-nonlocal", title: "global — 그리고 선언 없이 대입하면",
      caption: "bump() 는 전역 count 를 2 로 만든다. 마지막 bump_wrong() 은 UnboundLocalError 로 끝난다.",
    },
    {
      kind: "trace", traceId: "p4-nonlocal", title: "nonlocal — 감싸는 함수의 변수",
      caption: "counter() 가 끝난 뒤에도 inc() 가 n 을 기억하고 늘린다. 이 구조가 클로저다 (Part 9).",
    },
    {
      kind: "pitfall",
      title: "리스트를 append 하는 건 대입이 아니다",
      md: `\`def f(): items.append(1)\` 은 \`global\` 없이도 전역 \`items\` 를 바꾼다. \`append\` 는 **대입이 아니라 객체 변경**이기 때문 — \`items\` 라는 이름에 새 객체를 붙이는 게 아니다. 반면 \`items = items + [1]\` 은 대입이라 UnboundLocalError. Part 1 의 재바인딩 vs 객체 변경 구분이 여기서 또 나온다.`,
    },
    {
      kind: "callout", tone: "warn", title: "global 은 거의 항상 나쁜 신호다",
      md: `전역 변수를 여기저기서 바꾸면 프로그램의 상태가 어디서 변했는지 알 수 없게 된다. 대안: (1) 값을 \`return\` 하고 바깥에서 대입, (2) 상태를 딕셔너리나 객체(Part 7)에 담아 인자로 넘김. \`global\` 이 정당한 경우는 모듈 수준의 설정값·캐시 정도다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드를 실행하면?",
      code: `total = 0
def add(n):
    total += n
add(5)`,
      choices: [
        { text: "`total` 이 5 가 된다", why: "total += n 은 total = total + n. 함수 안 대입이므로 total 은 지역이 되고, 읽을 때 값이 없다." },
        { text: "`UnboundLocalError`", correct: true, why: "+= 도 대입이다. total 이 지역으로 분류되고, 아직 값이 없는 상태에서 읽으려 해 오류. global total 을 선언하거나 return 을 써야 한다." },
        { text: "`NameError`", why: "이름이 아예 없는 게 아니라 '지역인데 아직 값이 없음' 이라 UnboundLocalError 다 (NameError 의 하위 클래스)." },
      ],
    },
    {
      kind: "summary",
      items: [
        "함수 안 **대입**(`=`, `+=`)은 그 이름을 지역으로 만든다 → 바깥을 읽으려다 `UnboundLocalError`.",
        "바깥을 바꾸려면 `global` (모듈) / `nonlocal` (감싸는 함수).",
        "`append` 같은 **객체 변경**은 선언 없이도 된다 (대입이 아니니까).",
        "`global` 은 피하고 `return` 으로.",
      ],
    },
  ],
};
