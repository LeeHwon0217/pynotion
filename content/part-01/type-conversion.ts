import type { Lesson } from "@/lib/types";

export const typeConversion: Lesson = {
  part: 1,
  slug: "type-conversion",
  blocks: [
    {
      kind: "viz", component: "Story", title: "형변환은 '바꾸기' 가 아니라 '새로 만들기'",
      props: {
        story: {
          code: ['text = "42"', "n = int(text)", "total = n + 8", "print(text, total)"],
          steps: [
            { chapter: "문자열 42", say: "`\"42\"` 는 숫자가 아니다. **글자 4 와 글자 2** 가 나열된 문자열 객체다. 이걸로는 덧셈을 할 수 없다.", ops: [{ line: 0 }, { obj: "s", type: "str", value: '"42"' }, { bind: "text", to: "s" }] },
            { chapter: "int()", say: "`int(text)` — 문자열을 **읽어서** 새 정수 객체 `42` 를 만든다. 원래 문자열은 손대지 않는다. 형변환은 언제나 **새 객체 만들기**다.", ops: [{ line: 1 }, { pulse: "text" }, { obj: "i", type: "int", value: "42" }, { bind: "n", to: "i" }, { badge: "s", text: "그대로 남아 있음", color: "name" }] },
            { say: "이제 정수니까 계산이 된다. `n + 8` → `50`.", ops: [{ line: 2 }, { obj: "t", type: "int", value: "50" }, { bind: "total", to: "t" }, { unbadge: "s" }] },
            { say: "`text` 는 여전히 문자열 `\"42\"`, `total` 은 정수 `50`. 같은 '42' 라도 타입이 다르면 **완전히 다른 객체**다.", ops: [{ line: 3 }, { output: "42 50\n" }] },
            { chapter: "실패하면", say: "`int(\"3.5\")` 나 `int(\"abc\")` 처럼 정수 모양이 아니면 **`ValueError`**. 파이썬은 추측하지 않고 오류를 낸다.", ops: [{ badge: "i", text: "int(\"3.5\") → ValueError", color: "dead" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `파이썬은 **동적 타입** 언어다. 변수에 타입을 선언하지 않고, 타입은 객체가 갖는다. 그래서 같은 이름이 정수를 가리키다가 문자열을 가리켜도 된다. 하지만 **자동으로 타입을 바꿔 주지는 않는다.** \`"42" + 1\`은 오류다. 바꾸고 싶으면 명시적으로 함수를 부른다.`,
    },
    {
      kind: "table",
      head: ["함수", "하는 일", "예"],
      rows: [
        ["`int(x)`", "정수로. 문자열은 정수 모양이어야 함. float 는 **소수점 버림**", "`int(\"42\")` → 42, `int(3.9)` → 3, `int(-3.9)` → -3"],
        ["`float(x)`", "실수로", "`float(\"3.5\")` → 3.5, `float(2)` → 2.0"],
        ["`str(x)`", "문자열로. 뭐든 됨", "`str(42)` → `'42'`, `str([1, 2])` → `'[1, 2]'`"],
        ["`bool(x)`", "참/거짓으로", "`bool(0)` → False, `bool(\"0\")` → True"],
        ["`list(x)`, `tuple(x)`, `set(x)`", "컨테이너로 (Part 3)", "`list(\"abc\")` → `['a', 'b', 'c']`"],
        ["`type(x)`", "타입 확인", "`type(42)` → `<class 'int'>`"],
      ],
    },
    {
      kind: "trace", traceId: "p1-convert", title: "형변환 한 줄씩 — 마지막 줄은 일부러 실패한다",
      caption: "int() 가 소수점을 '버리는' 것(반올림 아님), 그리고 \"3.5\" 를 int() 에 넣으면 ValueError 가 나는 것.",
    },
    {
      kind: "pitfall",
      title: "int() 는 반올림이 아니다",
      md: `\`int(3.99)\` 는 \`3\`, \`int(-3.99)\` 는 \`-3\`. 소수점 아래를 **0 쪽으로 잘라 버린다.** 반올림은 \`round(3.99)\` → \`4\`. 그런데 \`round()\` 도 함정이 있다 — \`round(2.5)\` 는 \`2\`, \`round(3.5)\` 는 \`4\`. 파이썬은 "정확히 .5 일 때 짝수 쪽으로" 반올림한다(은행가 반올림). 통계적 편향을 없애기 위한 규칙이다.`,
    },
    {
      kind: "pitfall",
      title: "input() 은 언제나 문자열을 돌려준다",
      md: `\`age = input("나이: ")\` 에 29 를 입력해도 \`age\` 는 \`"29"\` 라는 **문자열**이다. \`age + 1\` 은 \`TypeError\`. \`int(input("나이: "))\` 로 감싸야 한다. 입력 관련 오류의 절반이 이것이다.`,
    },
    {
      kind: "callout", tone: "deep", title: "\"암시적 변환은 명시적 변환보다 나쁘다\"",
      md: `파이썬의 설계 철학(\`import this\` 로 볼 수 있는 "The Zen of Python")에 있는 말이다. JavaScript 는 \`"5" * 2\` 를 \`10\` 으로 알아서 바꾸지만, 그 '알아서' 가 \`"5" + 2\` 에서는 \`"52"\` 가 되는 식으로 예측 불가능해진다. 파이썬은 아예 오류를 내서 프로그래머가 **의도를 적게** 만든다. 단, 숫자끼리(int ↔ float)는 승격이 자동이다 — 정보 손실이 없기 때문.`,
    },
    {
      kind: "quiz",
      question: "`int(\"7\") + int(\"3\")` 과 `\"7\" + \"3\"` 의 결과는 각각?",
      choices: [
        { text: "`10` 과 `10`", why: "문자열끼리의 + 는 덧셈이 아니라 이어 붙이기다." },
        { text: "`10` 과 `\"73\"`", correct: true, why: "정수로 바꾼 뒤 더하면 10. 문자열끼리 + 는 이어 붙이기라 \"73\"." },
        { text: "`10` 과 오류", why: "문자열 + 문자열은 정상 동작한다 (이어 붙이기). 오류는 문자열 + 정수일 때 난다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "타입은 **객체**에 있고, 파이썬은 타입을 **자동으로 바꾸지 않는다** (숫자 승격 제외).",
        "형변환은 `int()`, `float()`, `str()` 로 **새 객체를 만드는** 것. 원본은 그대로.",
        "`int()` 는 소수점을 **버린다.** `int(\"3.5\")` 는 `ValueError`.",
        "`input()` 은 항상 **문자열**. 숫자로 쓰려면 `int(input())`.",
      ],
    },
  ],
};
