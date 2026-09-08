import type { Lesson } from "@/lib/types";

export const docstringHints: Lesson = {
  part: 4,
  slug: "docstring-hints",
  blocks: [
    {
      kind: "viz", component: "Story", title: "함수 객체에 붙어 있는 설명서",
      props: {
        story: {
          code: ["def area(w: float, h: float) -> float:", '    """직사각형 넓이."""', "    return w * h", "", "area.__doc__", "area.__annotations__", 'area("a", 3)'],
          steps: [
            { chapter: "함수 객체", say: "함수 객체에는 코드 말고도 **속성**이 붙어 있다. 독스트링과 타입 힌트가 그중 둘.", ops: [{ line: 0 }, { obj: "F", type: "function", fields: [["__name__", '"area"'], ["__doc__", '"직사각형 넓이."'], ["__annotations__", "{w: float, h: float, return: float}"]] }, { bind: "area", to: "F" }] },
            { chapter: "독스트링", say: "본문 첫 줄의 문자열이 `__doc__` 에 저장된다. `help(area)` 와 편집기의 팝업이 이걸 보여준다. **사람을 위한 설명.**", ops: [{ line: 1 }, { badge: "F", text: "help(area) 가 읽는 곳", color: "name" }] },
            { chapter: "타입 힌트", say: "`w: float` 와 `-> float` 는 `__annotations__` 에 저장된다. 편집기와 검사 도구(mypy)가 읽는다. **파이썬 자체는 검사하지 않는다.**", ops: [{ line: 5 }, { unbadge: "F" }, { badge: "F", text: "저장만 될 뿐 강제하지 않음", color: "warn" }] },
            { say: "`area(\"a\", 3)` — 힌트는 float 인데 문자열을 넘겼다. 오류? **아니다.** `\"a\" * 3` = `\"aaa\"` 가 나온다. 힌트는 약속이지 자물쇠가 아니다.", ops: [{ line: 6 }, { output: "aaa\n" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `함수를 만들었으면 두 가지를 더 적는 습관을 들인다.

**독스트링** — 본문 첫 줄에 \`"""설명"""\`. 무엇을 하는지, 인자가 무엇인지, 무엇을 돌려주는지. \`help()\` 와 편집기가 보여준다.

**타입 힌트** — \`def f(x: int) -> str:\`. 인자와 반환값의 타입을 적는다. 파이썬은 실행할 때 검사하지 않지만, 편집기가 자동완성과 오류 표시를 해 주고, \`mypy\` 같은 도구가 실행 전에 타입 오류를 잡아 준다. 읽는 사람에게는 가장 좋은 문서다.`,
    },
    {
      kind: "trace", traceId: "p4-docstring", title: "__doc__, __annotations__, 그리고 검사하지 않음",
      caption: "마지막 줄 — float 힌트에 문자열을 넘겨도 실행된다.",
    },
    {
      kind: "code", title: "독스트링 관례",
      code: `def parse_date(text: str, fmt: str = "%Y-%m-%d") -> date | None:
    """문자열을 날짜로 바꾼다.

    Args:
        text: "2026-09-08" 같은 날짜 문자열.
        fmt: strptime 형식. 기본은 ISO.

    Returns:
        date 객체. 형식이 안 맞으면 None.
    """
    ...`,
      caption: "한 줄 요약 → 빈 줄 → 자세한 설명. Google 스타일(Args/Returns)이 가장 널리 쓰인다.",
    },
    {
      kind: "table",
      head: ["힌트", "뜻"],
      rows: [
        ["`x: int`, `s: str`, `f: float`, `b: bool`", "기본 타입"],
        ["`items: list[int]`", "정수 리스트 (3.9+)"],
        ["`d: dict[str, int]`", "문자열 → 정수 딕셔너리"],
        ["`x: int | None`", "정수 또는 None (3.10+). 옛 표기 `Optional[int]`"],
        ["`-> None`", "아무것도 돌려주지 않음"],
        ["`f: Callable[[int], str]`", "int 를 받아 str 을 돌려주는 함수"],
      ],
      caption: "제네릭·Protocol·TypedDict 같은 심화 힌트는 Part 9.",
    },
    {
      kind: "pitfall",
      title: "힌트를 검사라고 믿기",
      md: `\`def f(n: int)\` 에 문자열을 넘겨도 파이썬은 아무 말 없이 실행한다. 힌트는 **문서 + 도구용**이다. 실행 시 검사가 필요하면 \`isinstance\` 로 직접 하거나 pydantic 같은 라이브러리를 쓴다. 대신 편집기에 mypy/pyright 를 켜 두면 실행 전에 빨간 줄로 잡아 준다 — 그게 힌트의 진짜 가치다.`,
    },
    {
      kind: "quiz",
      question: "`def f(x: int) -> int: return x` 에 `f(\"3\")` 을 호출하면?",
      choices: [
        { text: "`TypeError`", why: "파이썬은 타입 힌트를 실행 시 검사하지 않는다." },
        { text: "`\"3\"` 을 그대로 돌려준다", correct: true, why: "힌트는 저장만 된다. 실행에 영향이 없다. mypy 같은 정적 검사 도구만 경고한다." },
        { text: "`3` 으로 변환해서 돌려준다", why: "힌트는 변환도 하지 않는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "독스트링 `\"\"\"...\"\"\"` 은 `__doc__` 에, 힌트는 `__annotations__` 에 저장된다.",
        "타입 힌트는 **검사하지 않는다.** 문서 + 편집기/mypy 용.",
        "`list[int]`, `dict[str, int]`, `int | None`, `-> None`.",
        "한 줄 요약 → 빈 줄 → Args/Returns.",
      ],
    },
  ],
};
