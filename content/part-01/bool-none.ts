import type { Lesson } from "@/lib/types";

export const boolNone: Lesson = {
  part: 1,
  slug: "bool-none",
  blocks: [
    {
      kind: "viz", component: "Story", title: "True, False, None — 세 개뿐인 객체",
      props: {
        story: {
          code: ["a = True", "b = 3 > 1", "c = None", "d = None", "print(c is d)"],
          steps: [
            { chapter: "True 는 하나다", say: "`a = True`. 정수와 달리 `True` 는 파이썬이 시작할 때 **딱 하나** 만들어 두는 객체다.", ops: [{ line: 0 }, { obj: "T", type: "bool", value: "True" }, { bind: "a", to: "T" }] },
            { say: "`3 > 1` 의 결과도 **그 True** 다. 새로 만들지 않는다. 프로그램의 모든 True 는 같은 객체 하나를 가리킨다.", ops: [{ line: 1 }, { bind: "b", to: "T" }, { badge: "T", text: "a is b → True", color: "fresh" }] },
            { chapter: "None 도 하나다", say: "`None` 은 '값이 없음' 을 뜻하는 객체. 역시 프로그램 전체에 **하나뿐**이다.", ops: [{ line: 2 }, { obj: "N", type: "NoneType", value: "None" }, { bind: "c", to: "N" }, { unbadge: "T" }] },
            { say: "`d = None` 도 같은 객체를 가리킨다. 그래서 None 은 `==` 가 아니라 **`is`** 로 비교한다 — '그 객체냐' 를 묻는 게 정확하니까.", ops: [{ line: 3 }, { bind: "d", to: "N" }, { badge: "N", text: "c is d → True", color: "fresh" }] },
            { say: "`print(c is d)` → `True`. 이런 '하나뿐인 객체' 를 **싱글턴**이라 부른다. True, False, None 이 그렇다.", ops: [{ line: 4 }, { output: "True\n" }] },
            { chapter: "bool 은 int 다", say: "한 가지 더. `bool` 은 `int` 의 자식 타입이라 `True + True` 는 `2` 다. 리스트에서 참인 것의 개수를 `sum()` 으로 세는 트릭이 여기서 나온다.", ops: [{ badge: "T", text: "True + True == 2", color: "name" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`bool\`은 \`True\`와 \`False\` 두 값뿐이다. 비교 연산(\`>\`, \`==\`, \`in\` …)의 결과가 bool 이고, \`if\`와 \`while\`이 이 값을 보고 갈 길을 정한다.

\`None\`은 "값이 없음"을 나타내는 특별한 객체다. 아직 정해지지 않은 값, 찾지 못한 결과, 아무것도 돌려주지 않는 함수의 반환값이 전부 \`None\`이다.`,
    },
    {
      kind: "trace", traceId: "p1-bool-none", title: "bool 과 None 의 성질",
      caption: "True + True 가 2 인 것, None 을 is 로 비교하는 것, 그리고 bool() 이 무엇을 거짓으로 보는지.",
    },
    {
      kind: "heading", text: "bool() 이 거짓으로 보는 것",
    },
    {
      kind: "table",
      head: ["거짓 (Falsy)", "참 (Truthy)"],
      rows: [
        ["`False`, `None`", "`True`"],
        ["`0`, `0.0`", "`0` 이 아닌 모든 숫자 (음수 포함)"],
        ["`\"\"` (빈 문자열)", "`\"0\"`, `\" \"` — 글자가 하나라도 있으면"],
        ["`[]`, `()`, `{}`, `set()` (빈 컨테이너)", "`[0]`, `[None]` — 원소가 하나라도 있으면"],
      ],
      caption: "규칙: '비어 있거나 0 이면 거짓, 그 외는 참'. Part 2 「진리값」에서 이걸 조건문에 활용한다.",
    },
    {
      kind: "pitfall",
      title: "None 을 == 로 비교하기",
      md: `\`if x == None:\` 은 동작은 하지만 파이썬 스타일 가이드(PEP 8)가 금지한다. \`None\`은 하나뿐인 객체이므로 \`is None\` / \`is not None\`이 정확하고 빠르다. 또 \`==\`는 클래스가 마음대로 재정의할 수 있어 예상 밖의 결과가 나올 수 있다.`,
      code: `if result is None:       # 좋음
    ...
if result == None:       # 동작하지만 피할 것
    ...
if not result:           # 주의: 0, "", [] 도 여기 걸린다
    ...`,
    },
    {
      kind: "callout", tone: "deep", title: "함수는 아무것도 안 돌려줘도 None 을 돌려준다",
      md: `\`return\` 이 없는 함수, 또는 \`return\` 만 덜렁 있는 함수는 \`None\` 을 돌려준다. \`print()\` 도 그렇다 — \`x = print("hi")\` 를 하면 \`x\` 는 \`None\` 이다. 초보자가 \`result = lst.sort()\` 를 하고 \`result\` 가 \`None\` 이라 당황하는 이유도 이것이다 (\`sort()\` 는 리스트를 제자리에서 정렬하고 \`None\` 을 돌려준다). Part 4에서 다시 본다.`,
    },
    {
      kind: "quiz",
      question: "`bool(\"False\")` 의 값은?",
      choices: [
        { text: "`False`", why: "글자 'False' 가 들어 있는 문자열이다. 비어 있지 않으므로 참이다." },
        { text: "`True`", correct: true, why: "문자열의 참/거짓은 내용이 아니라 '비어 있느냐' 로 정해진다. \"False\" 는 5글자짜리 비어 있지 않은 문자열이므로 True." },
        { text: "오류", why: "bool() 은 어떤 객체든 받는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`True`, `False`, `None` 은 각각 **하나뿐인 객체**(싱글턴). 그래서 `None` 은 `is` 로 비교한다.",
        "`bool` 은 `int` 의 자식. `True == 1`, `True + True == 2`.",
        "**비어 있거나 0** 이면 거짓, 그 외는 참. `\"0\"` 과 `[0]` 은 참.",
        "반환값 없는 함수는 `None` 을 돌려준다.",
      ],
    },
  ],
};
