import type { Lesson } from "@/lib/types";

export const setup: Lesson = {
  part: 0,
  slug: "setup",
  blocks: [
    {
      kind: "viz", component: "Story", title: "REPL과 스크립트, 두 가지 실행 방식",
      props: {
        story: {
          code: [">>> 3 + 4", "7", ">>> x = 10", ">>> x * 2", "20"],
          codeTitle: "REPL (대화형)",
          steps: [
            { chapter: "REPL", say: "터미널에 `python` 만 치면 **REPL** 이 열린다. Read-Eval-Print-Loop: 읽고, 계산하고, 보여주고, 반복.", ops: [] },
            { say: "`3 + 4` 를 치면 즉시 `7` 이 나온다. `print` 를 안 써도 결과를 보여주는 게 REPL 의 특징.", ops: [{ line: 0 }, { output: "7\n" }] },
            { say: "`x = 10` — 이름을 하나 만들었다. 대입은 값을 돌려주지 않으니 아무것도 안 찍힌다.", ops: [{ line: 2 }, { obj: "ten", type: "int", value: "10" }, { bind: "x", to: "ten" }] },
            { say: "`x * 2` — 방금 만든 이름을 바로 쓸 수 있다. 실험하고 확인하는 데 REPL 만 한 게 없다.", ops: [{ line: 3 }, { pulse: "x" }, { obj: "twenty", type: "int", value: "20", note: "결과는 이름 없이 출력되고 사라진다" }, { output: "20\n" }] },
            { chapter: "스크립트", say: "반면 `.py` 파일에 코드를 적고 `python 파일.py` 로 실행하는 게 **스크립트** 방식. 결과는 `print` 한 것만 보인다.", ops: [{ clear: true }] },
            { say: "REPL 은 **실험**, 스크립트는 **프로그램**. 이 사이트의 실행 추적기는 스크립트를 한 줄씩 보여주는 것이다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "heading", text: "설치",
    },
    {
      kind: "text",
      md: `1. **python.org/downloads** 에서 최신 버전(3.12 이상)을 받는다. Windows 라면 설치 첫 화면의 **"Add python.exe to PATH"** 체크박스를 반드시 켠다. 이걸 빼먹으면 터미널에서 \`python\`이 안 먹는다.
2. 설치 후 터미널(Windows: PowerShell, Mac: 터미널)에서 확인한다.`,
    },
    {
      kind: "code", lang: "text", title: "터미널",
      code: `> python --version
Python 3.12.10`,
    },
    {
      kind: "text",
      md: `3. 편집기는 **VS Code** + Python 확장을 권한다. 무료고, 자동완성과 오류 표시가 좋다.

Mac에는 옛날 파이썬 2가 \`python\`이라는 이름으로 남아 있을 수 있다. \`python3\`로 실행하면 된다.`,
    },
    {
      kind: "heading", text: "두 가지 실행 방식",
    },
    {
      kind: "table",
      head: ["", "REPL (대화형)", "스크립트 (파일)"],
      rows: [
        ["시작", "터미널에 `python`", "`python hello.py`"],
        ["결과 표시", "식의 값을 **자동으로** 보여줌", "`print()` 한 것만 보임"],
        ["쓰임", "실험, 계산기, 함수 동작 확인", "실제 프로그램"],
        ["종료", "`exit()` 또는 Ctrl+Z(Win) / Ctrl+D(Mac)", "코드 끝나면 자동 종료"],
      ],
    },
    {
      kind: "code", title: "hello.py",
      code: `# 파일에 이렇게 저장하고
message = "안녕, 파이썬"
print(message)

# 터미널에서:  python hello.py
# 출력:        안녕, 파이썬`,
    },
    {
      kind: "pitfall",
      title: "REPL에서는 보였는데 스크립트에서는 아무것도 안 나온다",
      md: `REPL은 \`3 + 4\` 처럼 값을 내는 식을 치면 알아서 보여준다. 스크립트에서는 **print() 를 명시해야** 화면에 나온다. \`3 + 4\` 만 적어두면 계산은 되지만 어디에도 표시되지 않는다.`,
      code: `# hello.py
3 + 4          # 계산은 되지만 아무것도 안 보인다
print(3 + 4)   # 7`,
    },
    {
      kind: "callout", tone: "tip", title: "Jupyter / Colab",
      md: `데이터 분석 쪽에서는 **Jupyter 노트북**(브라우저에서 셀 단위로 실행)을 많이 쓴다. REPL과 스크립트의 중간쯤이다. 구글 **Colab**을 쓰면 설치 없이 브라우저에서 바로 파이썬을 돌릴 수 있다. 이 사이트의 「직접 해보기」도 곧 브라우저 안에서 실행된다.`,
    },
    {
      kind: "quiz",
      question: "스크립트 파일 `a.py` 에 `2 * 5` 한 줄만 적고 `python a.py` 를 실행하면?",
      choices: [
        { text: "`10` 이 출력된다", why: "REPL 이었다면 그렇다. 스크립트는 print 하지 않은 값을 보여주지 않는다." },
        { text: "아무것도 출력되지 않는다", correct: true, why: "계산은 일어나지만 결과를 아무 데도 쓰지 않았으므로 화면에 나오지 않는다. print(2 * 5) 라고 써야 한다." },
        { text: "오류가 난다", why: "문법적으로 완전히 정상인 코드다. 값이 쓰이지 않을 뿐이다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "설치 시 **PATH 추가** 체크. `python --version` 으로 확인.",
        "**REPL** 은 식의 값을 자동으로 보여주는 실험 환경, **스크립트** 는 `print()` 한 것만 보이는 실제 프로그램.",
        "편집기는 VS Code + Python 확장.",
      ],
    },
  ],
};
