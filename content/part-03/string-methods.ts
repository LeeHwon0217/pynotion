import type { Lesson } from "@/lib/types";

export const stringMethods: Lesson = {
  part: 3,
  slug: "string-methods",
  blocks: [
    {
      kind: "viz", component: "Story", title: "문자열 메서드는 새 문자열을 돌려준다",
      props: {
        story: {
          code: ['s = "  Hi  "', "t = s.strip()", "u = t.upper()", "print(s)"],
          steps: [
            { chapter: "원본", say: "앞뒤에 공백이 있는 문자열.", ops: [{ line: 0 }, { obj: "S", type: "str", value: '"  Hi  "' }, { bind: "s", to: "S" }] },
            { say: "`s.strip()` — 공백을 뗀 **새 문자열**을 만들어 돌려준다. `s` 가 가리키는 객체는 **그대로.**", ops: [{ line: 1 }, { obj: "T", type: "str", value: '"Hi"' }, { bind: "t", to: "T" }, { badge: "S", text: "바뀌지 않음", color: "name" }] },
            { say: "`t.upper()` — 또 새 객체. 문자열은 **불변**이라 모든 메서드가 새 것을 만든다. 체이닝 `s.strip().upper()` 이 되는 이유.", ops: [{ line: 2 }, { obj: "U", type: "str", value: '"HI"' }, { bind: "u", to: "U" }] },
            { say: "`print(s)` — 여전히 공백이 붙어 있다. `s.strip()` 을 호출만 하고 결과를 안 받으면 **아무 일도 안 일어난 것**이다.", ops: [{ line: 3 }, { output: "  Hi  \n" }, { badge: "S", text: "s = s.strip() 이라고 써야 한다", color: "warn" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `문자열 메서드는 수십 개지만 자주 쓰는 건 한 줌이다. 공통 규칙 하나 — **원본을 바꾸지 않고 새 문자열을 돌려준다.** 결과를 변수에 받아야 한다.`,
    },
    {
      kind: "table",
      head: ["메서드", "하는 일", "예"],
      rows: [
        ["`strip()`, `lstrip()`, `rstrip()`", "양끝/왼쪽/오른쪽 공백 제거", "`\" a \".strip()` → `'a'`"],
        ["`split(sep)`", "sep 로 잘라 **리스트**로. sep 생략 시 공백 기준", "`\"a,b\".split(\",\")` → `['a', 'b']`"],
        ["`sep.join(iter)`", "리스트를 sep 로 이어 **문자열**로", "`\"-\".join([\"a\", \"b\"])` → `'a-b'`"],
        ["`replace(old, new)`", "전부 바꾸기", "`\"aXa\".replace(\"a\", \"o\")` → `'oXo'`"],
        ["`upper()`, `lower()`, `title()`", "대소문자", "`\"hi\".upper()` → `'HI'`"],
        ["`find(sub)` / `index(sub)`", "위치. 없으면 `-1` / `ValueError`", "`\"abc\".find(\"c\")` → `2`"],
        ["`count(sub)`", "개수", "`\"banana\".count(\"a\")` → `3`"],
        ["`startswith()`, `endswith()`", "접두/접미 검사", "`\"a.py\".endswith(\".py\")` → `True`"],
        ["`isdigit()`, `isalpha()`, `isspace()`", "종류 검사", "`\"42\".isdigit()` → `True`"],
        ["`in`", "포함 검사 (연산자)", "`\"an\" in \"banana\"` → `True`"],
        ["`len()`", "길이 (함수)", "`len(\"안녕\")` → `2`"],
      ],
    },
    {
      kind: "trace", traceId: "p3-str-methods", title: "한 줄씩",
      caption: "마지막 print(s) 에서 원본이 그대로인 것, split 에서 빈 문자열이 생기는 것(\",,\"), find 가 -1 을 돌려주는 것.",
    },
    {
      kind: "pitfall",
      title: "split() 과 split(\" \") 은 다르다",
      md: `\`"a  b".split()\` 은 연속 공백을 하나로 보고 \`['a', 'b']\`. \`"a  b".split(" ")\` 은 공백 하나마다 자르므로 \`['a', '', 'b']\`. 사용자 입력을 나눌 땐 인자 없는 \`split()\`.`,
    },
    {
      kind: "try",
      title: "직접 해보기",
      starter: `line = "  이름:지기, 나이:29  "
pairs = line.strip().split(",")
for p in pairs:
    key, value = p.split(":")
    print(key.strip(), "->", value.strip())`,
      hint: "strip → split → 다시 split. 메서드 결과가 새 값이라 이어서 부를 수 있다.",
    },
    {
      kind: "quiz",
      question: "`\" \".join(\"abc\")` 의 결과는?",
      choices: [
        { text: "`\"abc\"`", why: "join 은 이터러블의 각 항목 사이에 구분자를 넣는다. 문자열은 글자 하나씩이 항목이다." },
        { text: "`\"a b c\"`", correct: true, why: "문자열 \"abc\" 는 글자 세 개의 이터러블. 그 사이에 공백을 넣으면 \"a b c\"." },
        { text: "오류", why: "join 은 문자열의 이터러블이면 뭐든 받는다. 문자열 자체도 된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "문자열 메서드는 **원본을 바꾸지 않고 새 문자열을 돌려준다.** 결과를 받아야 한다.",
        "핵심 여섯: `strip`, `split`, `join`, `replace`, `find`, `in`.",
        "`split()` (공백 뭉치 기준) 과 `split(\" \")` (공백 하나 기준) 은 다르다.",
      ],
    },
  ],
};
