import type { Lesson } from "@/lib/types";

export const elseFinally: Lesson = {
  part: 6,
  slug: "else-finally",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "try / except / else / finally — 누가 언제 실행되나",
      props: {
        flow: {
          code: ["try:", "    r = a / b", "except ZeroDivisionError:", '    print("0으로 나눔")', "else:", '    print("성공")', "finally:", '    print("정리")'],
          nodes: [
            { id: "t", kind: "step", label: "try: r = a / b", x: 640, y: 70 },
            { id: "q", kind: "cond", label: "예외가 났나?", x: 640, y: 170 },
            { id: "ex", kind: "io", label: "except 블록", x: 440, y: 290 },
            { id: "el", kind: "io", label: "else 블록", x: 840, y: 290 },
            { id: "fi", kind: "step", label: "finally 블록 — 항상", x: 640, y: 400 },
            { id: "e", kind: "end", label: "다음 코드", x: 640, y: 480 },
          ],
          edges: [
            { from: "t", to: "q" },
            { from: "q", to: "ex", label: "예", via: [[440, 170]] },
            { from: "q", to: "el", label: "아니오", via: [[840, 170]] },
            { from: "ex", to: "fi", via: [[440, 400]] },
            { from: "el", to: "fi", via: [[840, 400]] },
            { from: "fi", to: "e" },
          ],
          steps: [
            { chapter: "성공 경로", say: "`a = 6, b = 3`. try 블록 실행 — 예외 없음.", at: "t", line: 1, vars: { a: "6", b: "3", r: "2.0" } },
            { say: "예외가 안 났으니 **`else`** 로. `else` 는 'try 가 성공했을 때만' 이다.", at: "q", line: 4, badge: { at: "q", text: "예외 없음", color: "fresh" } },
            { say: "", dur: 1500, at: "el", line: 5, output: "성공\n" },
            { say: "그리고 **`finally`** — 성공이든 실패든 **항상** 실행된다.", at: "fi", line: 7, output: "정리\n" },
            { say: "", dur: 1200, at: "e" },
            { chapter: "실패 경로", say: "`a = 6, b = 0`. `6 / 0` → `ZeroDivisionError`.", at: "t", line: 1, vars: { a: "6", b: "0" }, reset: true },
            { say: "예외가 났다 → **`except`** 로. else 는 건너뛴다.", at: "q", line: 2, badge: { at: "q", text: "ZeroDivisionError", color: "dead" } },
            { say: "", dur: 1500, at: "ex", line: 3, output: "0으로 나눔\n" },
            { say: "이번에도 **`finally`.** except 안에 `return` 이 있어도, 심지어 잡히지 않은 예외가 지나가는 중이어도 finally 는 실행된다.", at: "fi", line: 7, output: "정리\n" },
            { say: "", dur: 1200, at: "e" },
            { chapter: "왜 else 인가", say: "'성공했을 때 할 일' 을 try 안에 넣지 않고 `else` 에 두는 이유: try 는 **최소한**만 감싸야 except 가 엉뚱한 오류까지 잡지 않는다.", at: "e" },
          ],
        },
      },
    },
    {
      kind: "table",
      head: ["블록", "실행되는 때", "용도"],
      rows: [
        ["`try`", "항상 (시도)", "예외가 날 수 있는 **최소한의** 코드"],
        ["`except X`", "try 에서 X 가 났을 때", "복구, 기본값, 로그"],
        ["`else`", "try 에서 예외가 **안 났을 때**", "성공 후 할 일 — try 밖으로 빼서 except 의 범위를 좁힌다"],
        ["`finally`", "**항상** — 예외 여부, return, 전파 중이어도", "정리: 파일 닫기, 잠금 해제, 연결 종료"],
      ],
    },
    {
      kind: "trace", traceId: "p6-else-finally", title: "한 줄씩 — return 이 있어도 finally 가 먼저",
      caption: "divide(6, 3) 은 else → finally → 반환. divide(6, 0) 은 except → finally → 반환. finally 의 '정리' 가 return 보다 먼저 찍힌다.",
    },
    {
      kind: "pitfall",
      title: "finally 안의 return",
      md: `\`finally\` 에 \`return\` 을 쓰면 try/except 의 반환값과 **전파 중이던 예외까지** 덮어쓴다. 예외가 조용히 사라지는 버그. finally 에는 정리만 넣고 return 은 쓰지 않는다.`,
      code: `def f():
    try:
        return 1
    finally:
        return 2        # f() 는 2 — try 의 return 1 이 버려진다
def g():
    try:
        raise ValueError
    finally:
        return 0        # 예외가 사라진다! g() 는 0`,
    },
    {
      kind: "callout", tone: "tip", title: "finally 대신 with",
      md: `"열었으면 닫는다" 류의 정리는 \`try/finally\` 보다 \`with\` 문이 짧고 안전하다 (「with와 컨텍스트 매니저」). \`try/finally\` 는 with 로 감쌀 수 없는 정리 작업에 쓴다.`,
    },
    {
      kind: "quiz",
      question: "다음 함수를 호출하면 무엇이 출력되고 무엇이 반환될까?",
      code: `def f():
    try:
        print("try")
        return "A"
    except:
        print("except")
    else:
        print("else")
    finally:
        print("finally")`,
      choices: [
        { text: "`try`, `else`, `finally` 출력, `\"A\"` 반환", why: "try 안에서 return 하면 else 는 실행되지 않는다. else 는 try 블록이 '끝까지 정상 실행' 됐을 때만." },
        { text: "`try`, `finally` 출력, `\"A\"` 반환", correct: true, why: "return 을 만나면 try 를 빠져나가므로 else 는 건너뛴다. 하지만 finally 는 return 직전에 반드시 실행된다." },
        { text: "`try` 출력, `\"A\"` 반환", why: "finally 는 return 이 있어도 실행된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`else` = try 가 **성공했을 때만.** try 를 최소한으로 감싸기 위해 쓴다.",
        "`finally` = **항상.** return·예외 전파 중에도 실행. 정리 작업용.",
        "`finally` 에 `return` 을 쓰지 말 것 — 예외를 삼킨다.",
        "순서: try → (except | else) → finally → 다음.",
      ],
    },
  ],
};
