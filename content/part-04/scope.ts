import type { Lesson } from "@/lib/types";

export const scopeLesson: Lesson = {
  part: 4,
  slug: "scope",
  blocks: [
    {
      kind: "viz", component: "Scope", title: "이름을 찾는 네 단계 — L·E·G·B",
      props: {
        scope: {
          code: ['x = "전역"', "", "def outer():", '    x = "감싸는"', "    def inner():", "        print(x)", "    inner()", "", "def solo():", "    print(x)", "", "outer()", "solo()", "print(len)"],
          labels: { L: "Local — inner()", E: "Enclosing — outer()", G: "Global — 모듈" },
          steps: [
            { chapter: "네 겹", say: "이름을 찾는 곳은 안에서 바깥으로 네 겹이다. **L**ocal(지금 함수) → **E**nclosing(감싸는 함수) → **G**lobal(모듈) → **B**uilt-in(내장). 처음 찾은 곳에서 멈춘다.", line: 0, scopes: { G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "G" },
            { chapter: "inner() 의 x", say: "`outer()` 가 실행되면 outer 프레임에 지역 `x = \"감싸는\"` 이 생긴다. 그 안에서 `inner()` 를 부른다.", line: 11, scopes: { E: { x: '"감싸는"' }, G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "E" },
            { say: "`inner` 안에서 `print(x)`. inner 의 **Local** 에 x 가 있나? 없다.", line: 5, scopes: { L: {}, E: { x: '"감싸는"' }, G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "L", lookup: { name: "x", from: "L", found: "E" } },
            { say: "한 겹 밖, **Enclosing**(outer) 에 x 가 있다. `\"감싸는\"` — 여기서 멈춘다. 전역의 x 는 보지도 않는다.", scopes: { L: {}, E: { x: '"감싸는"' }, G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "L" },
            { chapter: "solo() 의 x", say: "`solo()` 는 감싸는 함수가 없다. Local 에 x 없음 → Enclosing 없음 → **Global** 에서 `\"전역\"` 을 찾는다.", line: 9, scopes: { L: {}, G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "L", lookup: { name: "x", from: "L", found: "G" } },
            { chapter: "len", say: "`len` 은 어디에도 없다 → 마지막 **Built-in** 에서 찾는다. `print`, `len`, `int` 가 어디서나 되는 이유.", line: 13, scopes: { G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "G", lookup: { name: "len", from: "G", found: "B" } },
            { chapter: "없으면", say: "네 겹 어디에도 없으면 **`NameError`.** 오타 났을 때 보는 바로 그 오류.", scopes: { G: { x: '"전역"' }, B: { print: "…", len: "…" } }, active: "G", lookup: { name: "lenn", from: "G", found: null } },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `변수 이름을 만나면 파이썬은 정해진 순서로 찾는다 — **LEGB**.

1. **L**ocal — 지금 실행 중인 함수의 프레임
2. **E**nclosing — 이 함수를 감싸고 있는 함수(들)의 프레임, 안쪽부터
3. **G**lobal — 모듈(파일) 수준
4. **B**uilt-in — \`print\`, \`len\`, \`int\` 같은 내장 이름

처음 찾은 곳에서 멈춘다. 그래서 함수 안에서 \`x\` 를 만들면 같은 이름의 전역 \`x\` 가 **가려진다**(shadowing). 함수 안에서 \`list = [1, 2]\` 라고 쓰면 그 함수 안에서는 내장 \`list()\` 를 못 쓰게 되는 것도 같은 이유.`,
    },
    {
      kind: "trace", traceId: "p4-scope", title: "한 줄씩 — 프레임별 이름 패널",
      caption: "inner() 안에서 print(x) 가 outer 의 x 를, solo() 가 전역 x 를 쓰는 것을 보라. 오른쪽 이름 패널이 프레임별로 나뉜다.",
    },
    {
      kind: "heading", text: "읽기는 밖까지, 쓰기는 안에서만",
    },
    {
      kind: "text",
      md: `LEGB 는 **읽을 때**의 규칙이다. 함수 안에서 이름에 **대입**하면 그 이름은 무조건 **그 함수의 지역**이 된다. 바깥 것을 바꾸는 게 아니라 새 지역 이름을 만드는 것이다. 바깥 것을 바꾸려면 \`global\` / \`nonlocal\` 선언이 필요하다 — 다음 레슨.`,
    },
    {
      kind: "pitfall",
      title: "내장 이름을 덮어쓰기",
      md: `\`list = [1, 2, 3]\`, \`str = "hi"\`, \`max = 10\`, \`id = 5\`, \`input = ...\`. 전부 흔하다. 그 순간부터 \`list(x)\`, \`max(a, b)\` 가 \`TypeError: 'list' object is not callable\` 로 죽는다. 변수 이름을 지을 때 내장 함수 이름은 피한다. 편집기가 색을 다르게 칠해 준다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `x = 1
def f():
    x = 2
    def g():
        print(x)
    g()
f()`,
      choices: [
        { text: "`1`", why: "g 의 Enclosing 인 f 에 x = 2 가 있다. 거기서 멈추므로 전역 x 는 보지 않는다." },
        { text: "`2`", correct: true, why: "g 의 Local 에 x 없음 → Enclosing(f) 에 x = 2 있음. 찾았으니 멈춘다." },
        { text: "`NameError`", why: "g 안에 x 가 없어도 바깥 겹에서 찾는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "이름 찾기: **L → E → G → B**, 처음 찾은 곳에서 멈춤. 없으면 `NameError`.",
        "안쪽 이름이 바깥 이름을 **가린다**(shadowing).",
        "함수 안의 **대입**은 항상 새 지역 이름을 만든다 (바깥을 바꾸지 않는다).",
        "내장 이름(`list`, `str`, `max`, `id`)을 변수명으로 쓰지 말 것.",
      ],
    },
  ],
};
