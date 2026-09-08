import type { Lesson } from "@/lib/types";

export const stringBasics: Lesson = {
  part: 1,
  slug: "string-basics",
  blocks: [
    {
      kind: "viz", component: "Story", title: "f-string 은 새 문자열을 만든다",
      props: {
        story: {
          code: ['name = "지기"', "n = 3", 'msg = f"{name}, {n}개"', "name = \"영희\"", "print(msg)"],
          steps: [
            { chapter: "재료", say: "문자열 `\"지기\"` 와 정수 `3`. 각각 객체다.", ops: [{ line: 0 }, { obj: "s1", type: "str", value: '"지기"' }, { bind: "name", to: "s1" }] },
            { say: "", dur: 1400, ops: [{ line: 1 }, { obj: "n3", type: "int", value: "3" }, { bind: "n", to: "n3" }] },
            { chapter: "f-string", say: "`f\"{name}, {n}개\"` — 중괄호 안의 식을 **지금 이 순간** 계산해서 글자로 바꾸고, 하나로 이어 **새 문자열 객체**를 만든다.", ops: [{ line: 2 }, { pulse: "name" }, { pulse: "n" }, { obj: "s2", type: "str", value: '"지기, 3개"' }, { bind: "msg", to: "s2" }] },
            { say: "중요한 건 `msg` 가 `name` 을 **참조하는 게 아니라** 그 시점의 값을 **복사해 넣었다**는 것.", ops: [{ badge: "s2", text: "완성된 별개의 문자열", color: "fresh" }] },
            { chapter: "나중에 바꾸면?", say: "`name` 을 `\"영희\"` 로 바꿔 보자. 새 문자열이 생기고 이름표만 옮겨 간다.", ops: [{ line: 3 }, { obj: "s3", type: "str", value: '"영희"' }, { bind: "name", to: "s3" }, { unbadge: "s2" }] },
            { say: "`msg` 는 여전히 `\"지기, 3개\"` 다. f-string 은 **만들어질 때 한 번** 값을 읽을 뿐, 이후 변화를 따라가지 않는다.", ops: [{ line: 4 }, { pulse: "msg" }, { output: "지기, 3개\n" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `문자열(\`str\`)은 글자의 나열이다. 따옴표로 만든다 — 작은따옴표와 큰따옴표는 완전히 같다. 안에 따옴표가 들어가야 할 때 반대쪽을 바깥에 쓰면 편하다.

\`\`\`
'파이썬'   "파이썬"   '그는 "안녕" 이라고 했다'   "It's fine"
\`\`\`

여러 줄은 따옴표 세 개(\`"""\`)로 감싼다. 줄바꿈이 그대로 들어간다.`,
    },
    {
      kind: "trace", traceId: "p1-fstring", title: "f-string, 이스케이프, 인덱싱",
      caption: "f 접두사, 백슬래시 탈출 문자, 그리고 문자열이 '글자의 나열' 이라는 것 — len 과 [0] 이 되는 이유.",
    },
    {
      kind: "heading", text: "이스케이프 문자",
    },
    {
      kind: "table",
      head: ["쓰기", "뜻"],
      rows: [
        ["`\\n`", "줄바꿈"],
        ["`\\t`", "탭"],
        ["`\\\"` , `\\'`", "따옴표 자체"],
        ["`\\\\`", "백슬래시 자체"],
        ["`r\"C:\\new\\folder\"`", "**raw 문자열** — 백슬래시를 해석하지 않는다. 윈도우 경로·정규식에 쓴다"],
      ],
    },
    {
      kind: "heading", text: "f-string 이 표준이다",
    },
    {
      kind: "text",
      md: `문자열에 값을 끼워 넣는 방법은 역사적으로 세 가지가 있었다. 지금은 **f-string 하나만 쓰면 된다.**

- \`"이름: " + name + ", 나이: " + str(age)\` — 옛날 방식. 숫자를 \`str()\` 로 바꿔야 하고 지저분하다.
- \`"이름: {}, 나이: {}".format(name, age)\` — 파이썬 3.0~3.5 시대.
- \`f"이름: {name}, 나이: {age}"\` — 3.6부터. 읽기 쉽고 빠르다. 중괄호 안에 \`{age + 1}\`, \`{name.upper()}\` 같은 **식**도 들어간다.

숫자 포맷(\`{price:,}\`, \`{x:.2f}\`)은 이 파트 마지막 「input과 포매팅」에서.`,
    },
    {
      kind: "pitfall",
      title: "문자열과 숫자를 + 로 이으려다 TypeError",
      md: `\`"나이: " + 29\` 는 오류다. 파이썬은 문자열과 정수를 자동으로 합치지 않는다 (JavaScript 는 합친다). f-string 을 쓰면 이 문제가 아예 안 생긴다 — \`f"나이: {29}"\`.`,
    },
    {
      kind: "try",
      title: "직접 해보기",
      starter: `name = "지기"
lang = "파이썬"
print(f"{name}는 {lang}을 배운다")
print(f"{lang * 2}")          # 문자열 * 정수 = 반복
print(f"글자 수: {len(name)}")
print(f"{name!r}")            # !r 은 repr — 따옴표가 붙어 나온다`,
      hint: "중괄호 안에는 식이 들어간다. lang * 2 처럼 계산도 된다.",
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `x = 5
s = f"x = {x}"
x = 10
print(s)`,
      choices: [
        { text: "`x = 10`", why: "f-string 은 만들어지는 순간의 값을 읽는다. 이후 x 가 바뀌어도 s 는 변하지 않는다." },
        { text: "`x = 5`", correct: true, why: "s 는 2번 줄에서 \"x = 5\" 라는 완성된 문자열이 됐다. x 를 재바인딩해도 s 는 그대로다." },
        { text: "`x = {x}`", why: "f 접두사가 있으므로 중괄호는 식으로 계산된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "따옴표 종류는 상관없다. 여러 줄은 `\"\"\"`.",
        "`\\n`, `\\t`, `\\\"` 로 특수 문자. 경로·정규식은 `r\"...\"` (raw).",
        "값 끼워 넣기는 **f-string** 하나로. 중괄호 안에 식이 들어간다.",
        "f-string 은 **만들어지는 순간** 값을 읽어 **새 문자열**을 만든다. 이후 변화와 무관.",
      ],
    },
  ],
};
