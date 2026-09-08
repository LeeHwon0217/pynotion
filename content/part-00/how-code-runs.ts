import type { Lesson } from "@/lib/types";

export const howCodeRuns: Lesson = {
  part: 0,
  slug: "how-code-runs",
  blocks: [
    {
      kind: "viz", component: "PipelineScene", title: "글자에서 실행까지, 4단계",
      caption: "파이썬 파일은 글자다. 인터프리터가 토큰 → 구문 트리 → 바이트코드 → 가상 머신 순으로 가공해서 실행한다. 오류가 어느 단계에서 나는지가 여기서 갈린다.",
    },
    {
      kind: "text",
      md: `"파이썬은 인터프리터 언어다"라는 말을 많이 듣는다. 정확히 무슨 뜻인지 애니메이션으로 봤으니 말로 정리한다.

\`python hello.py\`를 실행하면 파이썬 인터프리터(정확히는 **CPython**, C로 만든 표준 구현)가 이 순서로 일한다.

1. **토큰화** — 글자 뭉치를 단어 단위로 자른다. \`total\`, \`=\`, \`price\`, \`*\`… 이 단계에서 따옴표가 안 닫혔거나 들여쓰기가 이상하면 걸린다.
2. **파싱** — 토큰을 문법 규칙대로 **트리**로 조립한다. 연산 순서가 여기서 결정된다. 문법이 틀리면 \`SyntaxError\`. **아직 코드는 한 줄도 실행되지 않았다.**
3. **컴파일** — 트리를 **바이트코드**로 바꾼다. 바이트코드는 파이썬 가상 머신 전용의 단순한 명령어다. \`__pycache__\` 폴더의 \`.pyc\` 파일이 이것이다 (다음에 실행할 때 1~3단계를 건너뛰려고 저장해 둔다).
4. **실행** — 가상 머신(VM)이 바이트코드를 한 줄씩 실행한다. \`NameError\`, \`TypeError\`, \`ZeroDivisionError\` 같은 대부분의 오류는 **여기서** 난다.`,
    },
    {
      kind: "callout", tone: "deep", title: "그래서 '컴파일 언어 vs 인터프리터 언어'는 반쯤 틀린 구분이다",
      md: `파이썬도 컴파일한다 — 다만 기계어가 아니라 **바이트코드**로, 그리고 실행 직전에 자동으로. C는 기계어로 미리 컴파일해서 CPU가 직접 실행하고, 파이썬은 바이트코드를 VM이라는 프로그램이 해석하며 실행한다. 이 "한 겹"이 파이썬이 느린 이유이자, 타입 선언 없이 유연하게 돌아가는 이유다. Part 11에서 \`dis\` 모듈로 바이트코드를 직접 뜯어본다.`,
    },
    {
      kind: "heading", text: "오류가 나는 시점이 다르다",
    },
    {
      kind: "trace", traceId: "p0-syntax-error", title: "SyntaxError — 실행 전에 멈춤",
      caption: "괄호를 안 닫았다. 파서가 트리를 못 만들어서 첫 줄의 print 조차 실행되지 않는다. 출력이 비어 있는 것을 보라.",
    },
    {
      kind: "trace", traceId: "p0-runtime-error", title: "NameError — 실행 중에 멈춤",
      caption: "이번엔 문법은 완벽하다. 1번 줄이 실행되어 출력이 나온 뒤, 2번 줄에서 없는 이름을 찾다가 멈춘다.",
    },
    {
      kind: "table",
      head: ["단계", "걸리는 오류", "실행됐나?"],
      rows: [
        ["토큰화 / 파싱", "`SyntaxError`, `IndentationError`", "**아니오** — 한 줄도 실행 안 됨"],
        ["실행", "`NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `IndexError`, `KeyError` …", "**예** — 오류 줄 직전까지 실행됨"],
      ],
      caption: "오류 메시지를 봤을 때 '내 코드가 얼마나 돌았나'를 먼저 판단하는 기준이 된다.",
    },
    {
      kind: "quiz",
      question: "다음 파일을 실행하면 무슨 일이 일어날까?",
      code: `print("시작")
print("중간"
print("끝")`,
      choices: [
        { text: "`시작` 이 출력된 뒤 오류", why: "괄호가 안 닫혀 SyntaxError 다. 문법 오류는 실행 전 파싱 단계에서 나므로 첫 줄도 실행되지 않는다." },
        { text: "아무것도 출력되지 않고 오류", correct: true, why: "2번 줄의 괄호가 안 닫혀 파서가 실패한다. 파싱은 실행 전에 파일 전체에 대해 일어나므로 print(\"시작\") 도 실행되지 않는다." },
        { text: "`시작`, `중간` 출력 뒤 오류", why: "파이썬은 한 줄씩 읽으며 실행하지 않는다. 파일 전체를 먼저 파싱한다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "소스(글자) → **토큰** → **구문 트리** → **바이트코드** → **VM 실행**.",
        "`SyntaxError` 는 실행 **전**에, 나머지 대부분의 오류는 실행 **중**에 난다.",
        "파이썬도 컴파일한다 — 기계어가 아닌 바이트코드로, 실행 직전에 자동으로. `.pyc` 가 그 결과물.",
      ],
    },
  ],
};
