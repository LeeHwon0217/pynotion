import type { Lesson } from "@/lib/types";

export const exceptionFlow: Lesson = {
  part: 6,
  slug: "exception-flow",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "예외는 프레임을 거슬러 올라가며 except 를 찾는다",
      props: {
        stack: {
          code: ["def load(path):", "    return open(path).read()", "", "def run():", '    data = load("없음.txt")', "    print(len(data))", "", "run()", 'print("끝")'],
          steps: [
            { chapter: "호출", say: "`run()` → `load()` — 프레임이 두 개 쌓인다. 지금까지는 평범한 함수 호출.", ops: [{ line: 7 }, { push: "run()" }, { line: 4 }, { push: 'load("없음.txt")', locals: { path: '"없음.txt"' } }, { line: 1 }] },
            { chapter: "발생", say: "`open()` 이 파일을 못 찾는다. **`FileNotFoundError` 발생.** 이 순간 load 의 나머지 코드는 버려지고, 파이썬은 묻는다 — \"이 프레임에 이걸 잡을 `except` 가 있나?\"", ops: [{ raise: "FileNotFoundError" }] },
            { chapter: "전파", say: "load 에는 없다. **load 프레임이 통째로 버려지고**, 예외는 호출한 곳(run 의 5번 줄)으로 올라간다. `return` 도 없이 — 반환값 같은 건 없다.", ops: [{ pop: true }, { line: 4 }] },
            { say: "run 에도 `except` 가 없다. run 프레임도 버려진다. `print(len(data))` 는 영영 실행되지 않는다.", ops: [{ pop: true }, { line: 7 }] },
            { chapter: "끝", say: "모듈 수준에도 없다. 더 올라갈 프레임이 없으면 **프로그램이 종료**되고, 지나온 프레임들이 **트레이스백**으로 출력된다. `print(\"끝\")` 도 실행되지 않는다.", ops: [{ uncaught: true }, { output: "Traceback (most recent call last):\n  line 8, in <module>\n  line 5, in run\n  line 2, in load\nFileNotFoundError: …\n" }] },
            { chapter: "정리", say: "예외는 **아래(발생 지점)에서 위(호출한 곳)로** 프레임을 하나씩 버리며 올라간다. 어느 프레임이든 `try/except` 로 받으면 거기서 멈추고 정상 흐름으로 돌아온다 — 다음 레슨.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `오류가 나면 파이썬은 **예외 객체**를 만들어 던진다(raise). 던져진 예외는 콜스택을 **위로** 거슬러 올라간다.

1. 지금 프레임에 이 예외를 받는 \`except\` 가 있나? 있으면 거기로 점프.
2. 없으면 이 프레임을 **버리고** 호출한 곳으로 올라가 1번 반복.
3. 맨 위(모듈)까지 없으면 프로그램 종료 + 트레이스백 출력.

그래서 Part 0 의 트레이스백이 "호출의 사슬"이었던 것이다 — 예외가 지나온 프레임들의 기록이다. 그리고 예외가 지나간 프레임의 **남은 코드는 실행되지 않는다.**`,
    },
    {
      kind: "trace", traceId: "p6-propagate", title: "한 줄씩 — 프레임이 하나씩 사라진다",
      caption: "2번 줄에서 발생한 예외가 5번, 8번 줄을 거쳐 올라가며 프레임을 버린다. 마지막 print 는 실행되지 않는다.",
    },
    {
      kind: "callout", tone: "deep", title: "예외는 '값'이다",
      md: `\`raise ValueError("잘못됨")\` 은 \`ValueError\` 클래스의 **인스턴스**(객체)를 만들어 던지는 것이다. \`except ValueError as e:\` 로 받으면 \`e\` 가 그 객체다 — 메시지(\`str(e)\`), 발생 위치(\`e.__traceback__\`), 원인(\`e.__cause__\`)을 갖는다. 예외가 객체이기 때문에 클래스 계층(상속)을 이용해 "이런 종류의 오류 전부"를 한 번에 잡을 수 있다 (「예외 계층 구조」).`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `def a():
    print("a 시작")
    b()
    print("a 끝")
def b():
    print("b 시작")
    1 / 0
    print("b 끝")
a()`,
      choices: [
        { text: "`a 시작`, `b 시작`, `b 끝`, `a 끝`", why: "1 / 0 에서 ZeroDivisionError 가 나면 그 아래 줄은 실행되지 않는다." },
        { text: "`a 시작`, `b 시작` 그리고 오류", correct: true, why: "b 의 1 / 0 에서 예외 발생 → b 의 나머지 버림 → a 로 올라감, a 에도 except 없음 → a 의 나머지 버림 → 모듈 → 종료." },
        { text: "`a 시작`, `b 시작`, `a 끝` 그리고 오류", why: "예외는 a 의 print(\"a 끝\") 도 건너뛴다. a 프레임 자체가 버려진다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "예외는 **발생 지점에서 호출한 곳으로** 프레임을 버리며 올라간다.",
        "지나간 프레임의 **남은 코드는 실행되지 않는다.**",
        "어느 프레임에서도 안 잡히면 프로그램 종료 + 트레이스백.",
        "예외는 클래스의 인스턴스 — 값이다.",
      ],
    },
  ],
};
