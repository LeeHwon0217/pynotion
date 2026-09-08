import type { Lesson } from "@/lib/types";

export const firstProgram: Lesson = {
  part: 0,
  slug: "first-program",
  blocks: [
    {
      kind: "trace", traceId: "p0-print", title: "print 의 여러 모습",
      caption: "print 는 받은 것들을 공백으로 이어 한 줄로 내보낸다. sep 과 end 로 그 규칙을 바꿀 수 있다. 출력 패널이 어떻게 쌓이는지 보라.",
    },
    {
      kind: "text",
      md: `\`print()\`는 괄호 안의 것들을 화면에 쓴다. 규칙은 세 가지뿐이다.

- 여러 개를 쉼표로 넘기면 **공백 하나**로 이어 붙인다. \`sep=\`으로 바꿀 수 있다.
- 끝에 **줄바꿈**을 붙인다. \`end=\`로 바꿀 수 있다.
- 무엇을 넘기든 문자열로 바꿔서 쓴다. 숫자도, 리스트도.`,
    },
    {
      kind: "heading", text: "주석",
    },
    {
      kind: "code",
      code: `# 이 줄은 주석이다. 파이썬은 # 뒤를 무시한다.
print("실행됨")  # 줄 끝에 붙여도 된다

"""
따옴표 세 개는 여러 줄 문자열이다.
주석처럼 쓰기도 하지만, 정확히는 '값이 쓰이지 않는 문자열'이다.
"""`,
    },
    {
      kind: "heading", text: "들여쓰기가 곧 문법이다",
    },
    {
      kind: "text",
      md: `다른 언어의 중괄호를 파이썬은 **들여쓰기**로 대신한다. 같은 깊이로 들여쓴 줄들이 하나의 블록이다. 관례는 **공백 4칸**이고, 탭과 공백을 섞으면 오류가 난다. 편집기가 Tab 키를 공백 4칸으로 바꿔주도록 설정해 두면 신경 쓸 일이 없다.`,
    },
    {
      kind: "trace", traceId: "p0-indent", title: "블록은 들여쓰기로 정해진다",
      caption: "if 아래 들여쓴 두 줄만 조건에 묶인다. 들여쓰기를 되돌린 마지막 print 는 조건과 무관하게 실행된다.",
    },
    {
      kind: "trace", traceId: "p0-indent-error", title: "들여쓰기가 틀리면",
      caption: "if 다음 줄을 들여쓰지 않았다. 문법 오류라 아무것도 실행되지 않는다.",
    },
    {
      kind: "pitfall",
      title: "따옴표 안의 따옴표",
      md: `\`print("그는 "안녕"이라고 했다")\` 는 오류다. 바깥 따옴표가 첫 번째 안쪽 따옴표에서 닫혀 버린다. 바깥을 작은따옴표로 바꾸거나(\`'그는 "안녕"이라고 했다'\`), 백슬래시로 탈출시킨다(\`"그는 \\"안녕\\"이라고 했다"\`).`,
    },
    {
      kind: "try",
      title: "직접 해보기",
      starter: `print("이름:", "지기", sep=" → ")
print("한 줄에", end=" ")
print("이어서 쓰기")
print(1, 2, 3, sep="")`,
      hint: "sep 은 항목 사이, end 는 맨 끝에 붙는다. 출력이 어떻게 달라질지 먼저 예상해 보자.",
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `print("a", "b", sep="-", end="!")
print("c")`,
      choices: [
        { text: "`a-b!c`", correct: true, why: "sep=\"-\" 로 a 와 b 사이가 - 가 되고, end=\"!\" 라 줄바꿈 대신 ! 가 붙는다. 다음 print 가 바로 이어진다." },
        { text: "`a-b!` 다음 줄에 `c`", why: "end 를 \"!\" 로 바꿨으므로 줄바꿈이 없다. c 가 같은 줄에 이어진다." },
        { text: "`a b!c`", why: "sep 이 \"-\" 이므로 공백이 아니라 - 로 이어진다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`print(a, b)` 는 공백으로 이어 한 줄로. `sep=` 과 `end=` 로 바꾼다.",
        "`#` 뒤는 주석. 실행되지 않는다.",
        "**들여쓰기가 블록이다.** 공백 4칸, 탭과 섞지 말 것.",
      ],
    },
  ],
};
