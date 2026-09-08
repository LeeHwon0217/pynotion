import type { Lesson } from "@/lib/types";

export const isVsEq: Lesson = {
  part: 1,
  slug: "is-vs-eq",
  blocks: [
    {
      kind: "viz", component: "Story", title: "같은 값 vs 같은 객체",
      props: {
        story: {
          code: ["a = 256", "b = 256", "c = int(\"257\")", "d = int(\"257\")", "x = [1, 2]", "y = [1, 2]"],
          steps: [
            { chapter: "작은 정수 캐시", say: "파이썬은 시작할 때 **-5 부터 256 까지**의 정수 객체를 미리 만들어 둔다. 너무 자주 쓰여서.", ops: [{ label: "cache", text: "미리 만들어 둔 정수: -5 … 256" }] },
            { say: "`a = 256` — 새로 만들지 않고 **미리 있던 256** 에 이름을 붙인다.", ops: [{ line: 0 }, { obj: "i256", type: "int", value: "256" }, { bind: "a", to: "i256" }] },
            { say: "`b = 256` — 역시 그 객체. 그래서 `a is b` 는 `True`.", ops: [{ line: 1 }, { bind: "b", to: "i256" }, { badge: "i256", text: "a is b → True", color: "fresh" }] },
            { chapter: "캐시 밖", say: "257 은 캐시 밖이다. `int(\"257\")` 은 문자열을 읽어 **새 객체**를 만든다.", ops: [{ line: 2 }, { unlabel: "cache" }, { unbadge: "i256" }, { obj: "c257", type: "int", value: "257" }, { bind: "c", to: "c257" }] },
            { say: "한 번 더 하면 **또 새 객체.** 값은 같지만 메모리의 다른 곳에 있다.", ops: [{ line: 3 }, { obj: "d257", type: "int", value: "257" }, { bind: "d", to: "d257" }] },
            { say: "`c == d` 는 **값**을 비교하니 `True`. `c is d` 는 **같은 객체냐**를 물으니 `False`.", ops: [{ badge: "c257", text: "c == d → True", color: "fresh" }, { badge: "d257", text: "c is d → False", color: "dead" }] },
            { chapter: "리스트", say: "리스트 리터럴 `[1, 2]` 는 쓸 때마다 **새 객체**다. 캐시 같은 건 없다.", ops: [{ line: 4 }, { unbadge: "c257" }, { unbadge: "d257" }, { obj: "L1", type: "list", items: ["1", "2"] }, { bind: "x", to: "L1" }] },
            { say: "`y = [1, 2]` — 또 하나. 내용은 같아도 서로 다른 객체. `x == y` 는 `True`, `x is y` 는 `False`.", ops: [{ line: 5 }, { obj: "L2", type: "list", items: ["1", "2"] }, { bind: "y", to: "L2" }, { badge: "L1", text: "x == y → True", color: "fresh" }, { badge: "L2", text: "x is y → False", color: "dead" }] },
            { chapter: "규칙", say: "`==` 는 '값이 같은가' — 거의 항상 이걸 쓴다. `is` 는 '**바로 그 객체**인가' — `None`, `True`, `False` 를 확인할 때만 쓴다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `Part 1 첫 레슨의 이름표 모델을 알면 이 레슨은 자동으로 이해된다.

- \`==\` 는 두 객체의 **값**이 같은지 묻는다. \`__eq__\` 메서드를 호출한다 (Part 7).
- \`is\` 는 두 이름이 **같은 객체**를 가리키는지 묻는다. \`id(a) == id(b)\` 와 같다.

값이 같은 객체가 여럿 있을 수 있으므로 \`==\` 가 \`True\` 여도 \`is\` 는 \`False\` 일 수 있다. 반대로 \`is\` 가 \`True\` 면 \`==\` 는 (거의) 항상 \`True\` 다 — 자기 자신이니까.`,
    },
    {
      kind: "trace", traceId: "p1-is-eq", title: "실제로 확인",
      caption: "256 은 같은 객체, int(\"257\") 두 번은 다른 객체, 리스트 리터럴은 언제나 다른 객체. 오른쪽 메모리 그림에서 화살표가 어디로 가는지 보라.",
    },
    {
      kind: "heading", text: "작은 정수 캐시와 인터닝",
    },
    {
      kind: "text",
      md: `CPython 은 \`-5 ~ 256\` 정수를 미리 만들어 재사용한다. 짧은 문자열과 식별자처럼 생긴 문자열도 **인터닝**해서 재사용하는 경우가 많다. 그래서 \`a = "hi"; b = "hi"; a is b\` 가 \`True\` 로 나온다.

**이건 구현 세부사항이다.** 파이썬 언어의 약속이 아니라 CPython 이 그렇게 최적화했을 뿐이고, 버전이나 상황(REPL vs 스크립트, 상수 폴딩 등)에 따라 달라진다. 그러니 \`is\` 로 숫자나 문자열을 비교하는 코드는 **어떤 날은 맞고 어떤 날은 틀린다.** 절대 쓰지 말 것. 파이썬 3.8부터는 \`x is 5\` 라고 쓰면 \`SyntaxWarning\` 을 띄운다.`,
    },
    {
      kind: "pitfall",
      title: "is 를 == 대신 쓰기",
      md: `\`if count is 0:\` — 캐시 덕에 우연히 동작하지만 잘못된 코드다. \`if name is "admin":\` — 인터닝 덕에 우연히 동작하다가 사용자 입력에서 깨진다. \`is\` 는 **\`None\`, \`True\`, \`False\`** 그리고 "정말 그 객체인지" 를 확인할 때만.`,
      code: `if x is None:        # 맞음 — None 은 하나뿐
if x == 0:           # 맞음 — 값 비교
if x is 0:           # 틀림 (SyntaxWarning)
if s is "admin":     # 틀림`,
    },
    {
      kind: "quiz",
      question: "다음 중 `is` 를 쓰는 것이 올바른 경우는?",
      choices: [
        { text: "`if score is 100:`", why: "정수 비교는 ==. 100 은 캐시 밖이라 대부분 False 가 나온다." },
        { text: "`if result is None:`", correct: true, why: "None 은 프로그램에 하나뿐인 객체이므로 '그 객체인가' 를 묻는 is 가 정확하다." },
        { text: "`if name is \"guest\":`", why: "문자열 비교는 ==. 인터닝은 보장되지 않는다." },
      ],
    },
    {
      kind: "quiz",
      question: "`a = [1, 2, 3]; b = a; c = list(a)` 일 때 `a is b`, `a is c`, `a == c` 는?",
      choices: [
        { text: "`True, True, True`", why: "list(a) 는 새 리스트 객체를 만든다. a is c 는 False." },
        { text: "`True, False, True`", correct: true, why: "b = a 는 같은 객체에 이름을 하나 더 붙인 것 (is True). list(a) 는 내용을 복사한 새 객체 (is False, == True)." },
        { text: "`False, False, True`", why: "b = a 는 복사가 아니다. 같은 객체를 가리키므로 a is b 는 True." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`==` 는 **값** 비교, `is` 는 **같은 객체** 비교 (`id()` 가 같은가).",
        "`is` 는 `None` / `True` / `False` 확인에만 쓴다.",
        "`-5 ~ 256` 정수 캐시와 문자열 인터닝은 **CPython 의 최적화**일 뿐. 여기에 기대는 코드는 버그다.",
        "리스트 리터럴 `[...]` 은 쓸 때마다 새 객체.",
      ],
    },
  ],
};
