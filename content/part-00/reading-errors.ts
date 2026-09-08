import type { Lesson } from "@/lib/types";

export const readingErrors: Lesson = {
  part: 0,
  slug: "reading-errors",
  blocks: [
    {
      kind: "text",
      md: `프로그래밍의 절반은 오류 메시지를 읽는 일이다. 파이썬의 오류 메시지(**트레이스백**)는 친절한 편인데, 처음엔 어디를 봐야 할지 몰라 겁부터 난다. 규칙은 하나다 — **맨 아랫줄부터 읽는다.**`,
    },
    {
      kind: "code", lang: "text", title: "트레이스백 예시",
      code: `Traceback (most recent call last):
  File "app.py", line 8, in <module>
    total = calc(price, qty)
  File "app.py", line 4, in calc
    return p * q + fee
NameError: name 'fee' is not defined`,
    },
    {
      kind: "text",
      md: `읽는 순서:

1. **맨 아랫줄** — \`NameError: name 'fee' is not defined\`. 오류의 **종류**와 **이유**. 이것만 읽어도 절반은 해결된다.
2. **바로 위** — \`File "app.py", line 4, in calc\` / \`return p * q + fee\`. 오류가 **실제로 난 줄**. 파일명, 줄 번호, 함수 이름, 그리고 그 줄의 코드.
3. **더 위로** — 그 함수를 **누가 불렀는지**의 기록. 8번 줄에서 \`calc\`를 불렀고, 그 안에서 터진 것이다. "most recent call last" = 가장 최근 호출이 맨 아래.

즉 트레이스백은 **호출의 사슬**이다. 위에서 아래로 갈수록 안쪽으로 들어간다. (이 사슬이 콜스택이다 — Part 4에서 애니메이션으로 본다.)`,
    },
    {
      kind: "trace", traceId: "p0-traceback", title: "오류가 나는 순간을 한 줄씩",
      caption: "3번 줄까지 정상 실행되어 출력이 나온 뒤, 4번 줄에서 없는 이름을 찾다 멈춘다. 오류 직전까지의 출력은 살아 있다는 점이 중요하다.",
    },
    {
      kind: "heading", text: "자주 만나는 오류 여섯 가지",
    },
    {
      kind: "table",
      head: ["오류", "뜻", "흔한 원인"],
      rows: [
        ["`SyntaxError`", "문법이 틀림", "괄호·따옴표 안 닫음, 콜론 `:` 빠뜨림. **실행 전**에 남"],
        ["`IndentationError`", "들여쓰기가 틀림", "블록 첫 줄 안 들여쓰기, 탭/공백 혼용"],
        ["`NameError`", "그런 이름이 없음", "오타, 변수 만들기 전에 사용, 대소문자"],
        ["`TypeError`", "타입이 안 맞음", "`\"나이: \" + 29` (문자열 + 정수), 인자 개수 틀림"],
        ["`ValueError`", "타입은 맞는데 값이 이상함", "`int(\"abc\")`, `int(\"3.5\")`"],
        ["`IndexError` / `KeyError`", "없는 위치·키", "`lst[10]` (길이 3인 리스트), `d[\"없는키\"]`"],
      ],
    },
    {
      kind: "trace", traceId: "p0-typeerror", title: "TypeError — 문자열과 숫자를 더하려 함",
      caption: "파이썬은 \"나이: \" + 29 를 어떻게 해야 할지 모른다. 문자열끼리 붙이려는 건지 숫자를 더하려는 건지 결정하지 않고 오류를 낸다. str(29) 로 바꿔 주면 된다.",
    },
    {
      kind: "callout", tone: "tip", title: "오류 메시지를 그대로 검색하라",
      md: `맨 아랫줄(예: \`TypeError: can only concatenate str (not "int") to str\`)을 통째로 검색하면 거의 항상 같은 문제를 겪은 사람이 있다. 파이썬 3.10부터는 메시지 자체에 힌트가 붙는 경우도 많다 — \`Did you mean: 'print'?\` 처럼.`,
    },
    {
      kind: "quiz",
      question: "트레이스백에서 가장 먼저 읽어야 할 곳은?",
      choices: [
        { text: "첫 줄 `Traceback (most recent call last):`", why: "이 줄은 항상 같다. 정보가 없다." },
        { text: "맨 아랫줄 — 오류 종류와 메시지", correct: true, why: "무슨 오류인지, 왜인지가 여기 있다. 그 다음 바로 위의 파일명·줄 번호로 위치를 찾는다." },
        { text: "가운데 아무 줄", why: "가운데는 호출 경로다. 종류를 먼저 알고 나서 보는 게 빠르다." },
      ],
    },
    {
      kind: "quiz",
      question: "`age = int(\"스물아홉\")` 을 실행하면 어떤 오류가 날까?",
      choices: [
        { text: "`TypeError`", why: "int() 에 문자열을 넘기는 것 자체는 허용된다 (int(\"29\") 는 됨). 타입 문제가 아니다." },
        { text: "`ValueError`", correct: true, why: "타입(str)은 맞지만 그 값을 정수로 해석할 수 없다. 이런 경우가 ValueError 다." },
        { text: "`NameError`", why: "없는 이름을 쓴 게 아니다. int 도 있고 문자열도 있다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "트레이스백은 **맨 아래부터** 읽는다: 오류 종류 → 줄 번호 → 호출 경로.",
        "`SyntaxError`/`IndentationError` 는 실행 전, 나머지는 실행 중. 오류 직전까지의 출력은 유효하다.",
        "`TypeError` 는 타입이 안 맞음, `ValueError` 는 타입은 맞는데 값이 이상함.",
        "메시지 맨 아랫줄을 그대로 검색하라.",
      ],
    },
  ],
};
