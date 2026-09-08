import type { Lesson } from "@/lib/types";

export const inputFormat: Lesson = {
  part: 1,
  slug: "input-format",
  blocks: [
    {
      kind: "viz", component: "Story", title: "input 은 문자열을 준다",
      props: {
        story: {
          code: ['raw = input("나이: ")', "age = int(raw)", "print(age + 1)"],
          steps: [
            { chapter: "input()", say: "`input(\"나이: \")` — 프롬프트를 띄우고 사용자가 엔터를 칠 때까지 **기다린다.**", ops: [{ line: 0 }, { output: "나이: " }] },
            { say: "사용자가 `29` 를 쳤다. `input` 이 돌려주는 건 정수가 아니라 **문자열 `\"29\"`** 다. 키보드로 친 건 전부 글자니까.", ops: [{ obj: "s", type: "str", value: '"29"' }, { bind: "raw", to: "s" }, { output: "29\n" }, { badge: "s", text: "str! 숫자가 아님", color: "warn" }] },
            { chapter: "int()", say: "`int(raw)` 로 정수 객체를 새로 만든다. 이걸 빼먹으면 `raw + 1` 에서 `TypeError`.", ops: [{ line: 1 }, { obj: "i", type: "int", value: "29" }, { bind: "age", to: "i" }, { unbadge: "s" }] },
            { say: "이제 계산할 수 있다. `age + 1` → `30`.", ops: [{ line: 2 }, { pulse: "age" }, { output: "30\n" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`input()\` 은 사용자가 키보드로 친 한 줄을 **문자열**로 돌려준다. 숫자로 쓰려면 \`int()\` 나 \`float()\` 로 바꿔야 한다. (참고: 이 사이트의 실행 추적기는 키보드 입력을 받을 수 없어서 \`input\` 예제는 애니메이션으로만 보여준다.)`,
    },
    {
      kind: "code",
      code: `name = input("이름: ")           # 문자열 그대로
age = int(input("나이: "))       # 정수로
height = float(input("키(cm): "))  # 실수로
print(f"{name}({age}세, {height:.1f}cm)")`,
    },
    {
      kind: "heading", text: "출력 다듬기 — 포맷 지정자",
    },
    {
      kind: "text",
      md: `f-string 의 중괄호 안에서 콜론 뒤에 **포맷 지정자**를 쓰면 숫자와 문자열의 모양을 정할 수 있다. \`{값:지정자}\` 꼴이다.`,
    },
    {
      kind: "trace", traceId: "p1-format", title: "자주 쓰는 포맷 다섯 가지",
      caption: "천 단위 콤마, 백분율, 소수 자릿수, 정렬, 그리고 디버깅용 = 표기.",
    },
    {
      kind: "table",
      head: ["지정자", "뜻", "예 → 결과"],
      rows: [
        ["`,`", "천 단위 구분", "`f\"{1234567:,}\"` → `1,234,567`"],
        ["`.2f`", "소수 둘째 자리까지 (반올림)", "`f\"{3.14159:.2f}\"` → `3.14`"],
        ["`.1%`", "백분율", "`f\"{0.873:.1%}\"` → `87.3%`"],
        ["`>8`, `<8`, `^8`", "폭 8 로 오른쪽/왼쪽/가운데 정렬", "`f\"{'abc':>6}\"` → `'   abc'`"],
        ["`08.2f`", "폭 8, 빈자리 0, 소수 2자리", "`f\"{3.14159:08.2f}\"` → `00003.14`"],
        ["`e`", "지수 표기", "`f\"{12345.678:.2e}\"` → `1.23e+04`"],
        ["`=`", "이름=값 (디버깅)", "`f\"{x=}\"` → `x=42`"],
        ["`!r`", "repr 로 (따옴표 포함)", "`f\"{name!r}\"` → `'지기'`"],
      ],
    },
    {
      kind: "pitfall",
      title: "입력이 숫자가 아니면 프로그램이 죽는다",
      md: `\`int(input())\` 에 사용자가 "스물아홉" 을 치면 \`ValueError\` 로 프로그램이 멈춘다. 실제 프로그램에서는 \`try/except\` 로 감싸서 다시 물어봐야 한다 (Part 6). 지금은 "input 은 문자열, 변환은 실패할 수 있다" 만 기억하면 된다.`,
    },
    {
      kind: "try",
      title: "직접 해보기",
      starter: `price = 48500
qty = 3
total = price * qty
print(f"{'상품':<8}{'수량':>4}{'금액':>12}")
print(f"{'키보드':<8}{qty:>4}{total:>12,}원")
print(f"할인율 {0.15:.0%} 적용 → {total * 0.85:,.0f}원")`,
      hint: "정렬 지정자(<, >)로 표처럼 맞추고, 콤마와 소수 자릿수를 조합할 수 있다: {total:,.0f}",
    },
    {
      kind: "quiz",
      question: "`f\"{0.5:.0%}\"` 의 결과는?",
      choices: [
        { text: "`0.5%`", why: "% 지정자는 값에 100 을 곱한다." },
        { text: "`50%`", correct: true, why: "% 는 100 을 곱하고 % 기호를 붙인다. .0 은 소수점 아래 0 자리." },
        { text: "`50.0%`", why: ".0 이므로 소수점 아래는 표시하지 않는다. .1 이었다면 50.0%." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`input()` 은 항상 **문자열**. 숫자는 `int()` / `float()` 로 변환. 변환은 실패할 수 있다.",
        "포맷 지정자 `{값:지정자}`: `,` 콤마, `.2f` 소수 자릿수, `.1%` 백분율, `<>^` 정렬.",
        "디버깅엔 `f\"{x=}\"`.",
      ],
    },
  ],
};
