import type { Lesson } from "@/lib/types";

export const ifLesson: Lesson = {
  part: 2,
  slug: "if",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "if / elif / else — 갈림길에서 정확히 하나",
      props: {
        flow: {
          code: ["score = 85", "if score >= 90:", '    grade = "A"', "elif score >= 80:", '    grade = "B"', "else:", '    grade = "C"', "print(grade)"],
          nodes: [
            { id: "s", kind: "start", label: "시작", x: 640, y: 60 },
            { id: "c1", kind: "cond", label: "score >= 90 ?", x: 640, y: 150 },
            { id: "a", kind: "step", label: 'grade = "A"', x: 470, y: 250 },
            { id: "c2", kind: "cond", label: "score >= 80 ?", x: 640, y: 265 },
            { id: "b", kind: "step", label: 'grade = "B"', x: 470, y: 370 },
            { id: "c", kind: "step", label: 'grade = "C"', x: 810, y: 370 },
            { id: "p", kind: "io", label: "print(grade)", x: 640, y: 450 },
          ],
          edges: [
            { from: "s", to: "c1" },
            { from: "c1", to: "a", label: "참", via: [[470, 150]] },
            { from: "c1", to: "c2", label: "거짓" },
            { from: "c2", to: "b", label: "참", via: [[470, 265]] },
            { from: "c2", to: "c", label: "거짓", via: [[810, 265]] },
            { from: "a", to: "p", via: [[470, 450]] },
            { from: "b", to: "p", via: [[470, 450]] },
            { from: "c", to: "p", via: [[810, 450]] },
          ],
          steps: [
            { chapter: "시작", say: "`score` 는 85. 이제 갈림길 세 개를 **위에서부터** 하나씩 검사한다.", at: "s", line: 0, vars: { score: "85" } },
            { say: "첫 조건 `score >= 90`. 85 는 90 보다 작으니 **거짓**. 이 블록은 건너뛴다.", at: "c1", line: 1, badge: { at: "c1", text: "85 >= 90 → False", color: "dead" } },
            { chapter: "elif", say: "`elif` 는 '앞의 조건이 거짓이었다면 이걸 봐라'. `score >= 80` — 85 는 80 이상, **참**.", at: "c2", line: 3, badge: { at: "c2", text: "85 >= 80 → True", color: "fresh" } },
            { say: "참인 블록으로 들어간다. `grade = \"B\"`.", at: "b", line: 4, vars: { score: "85", grade: '"B"' } },
            { chapter: "하나만", say: "여기서 중요한 것 — `else` 는 **보지도 않는다.** if/elif/else 사슬에서는 위에서부터 **처음 참인 하나**의 블록만 실행되고 나머지는 전부 건너뛴다.", at: "b", line: 4 },
            { say: "사슬을 빠져나와 `print(grade)`. 출력은 `B`.", at: "p", line: 7, output: "B\n" },
            { say: "만약 `score` 가 95 였다면 첫 조건에서 바로 A 블록으로 가고, 70 이었다면 둘 다 거짓이라 `else` 의 C 블록으로 갔을 것이다.", at: "p", line: 7 },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`if\`는 조건이 참일 때만 블록을 실행한다. \`elif\`(else if)는 앞 조건이 거짓일 때 다음 조건을 검사하고, \`else\`는 모든 조건이 거짓일 때 실행된다. 셋을 이어 쓴 사슬에서는 **정확히 하나의 블록만** 실행된다.

문법 규칙 세 가지:

- 조건 뒤에 **콜론 \`:\`** — 가장 자주 빠뜨리는 것
- 블록은 **들여쓰기**로
- \`elif\`와 \`else\`는 선택. \`if\` 하나만 써도 되고, \`elif\`를 여러 개 이어도 된다`,
    },
    {
      kind: "trace", traceId: "p2-if", title: "한 줄씩 — 어느 줄이 건너뛰어지나",
      caption: "2번 줄(if)에서 3번 줄로 가지 않고 4번 줄(elif)로 점프하는 것, 그리고 5번 줄 뒤 6·7번 줄을 건너뛰고 8번 줄로 가는 것을 보라.",
    },
    {
      kind: "heading", text: "if 를 여러 개 vs elif 로 잇기",
    },
    {
      kind: "code",
      code: `# 독립된 if 세 개 — 셋 다 검사한다. 여러 개가 참일 수 있다
if score >= 60: print("합격")
if score >= 80: print("우수")
if score >= 90: print("최우수")
# 85 → 합격, 우수 (두 줄 출력)

# elif 사슬 — 위에서부터 처음 참인 것 하나만
if score >= 90:   print("최우수")
elif score >= 80: print("우수")
elif score >= 60: print("합격")
# 85 → 우수 (한 줄 출력)`,
      caption: "'하나만 골라야 하는' 분류에는 elif. 조건 순서를 큰 것부터 쓰는 이유도 여기 있다 — 작은 것부터 쓰면 60 이상에서 전부 걸려 버린다.",
    },
    {
      kind: "heading", text: "조건부 표현식 (한 줄 if)",
    },
    {
      kind: "code",
      code: `label = "성인" if age >= 19 else "미성년"
# 읽는 법: age >= 19 이면 "성인", 아니면 "미성년"
# 값을 고르는 '식'이라 대입·인자·f-string 안에 들어간다
print(f"{'짝수' if n % 2 == 0 else '홀수'}")`,
    },
    {
      kind: "pitfall",
      title: "조건 순서가 틀리면 조용히 잘못된다",
      md: `\`if score >= 60: ... elif score >= 80: ...\` 처럼 **작은 조건을 먼저** 쓰면 85 도 첫 조건에 걸려 "합격"만 나온다. 오류가 나지 않아서 더 위험하다. elif 사슬은 **가장 엄격한 조건부터** 쓴다.`,
    },
    {
      kind: "quiz",
      question: "`x = 15` 일 때 출력은?",
      code: `if x > 10:
    print("A")
elif x > 5:
    print("B")
if x > 5:
    print("C")`,
      choices: [
        { text: "`A` 만", why: "마지막 if 는 elif 사슬과 별개의 독립된 if 다. x > 5 도 참이므로 C 도 출력된다." },
        { text: "`A` 와 `C`", correct: true, why: "첫 사슬(if/elif)에서는 A 하나만. 그 아래 if x > 5 는 새로운 독립 조건이라 따로 검사되어 C 출력." },
        { text: "`A`, `B`, `C`", why: "elif 는 앞 조건이 참이면 검사하지 않는다. B 는 출력되지 않는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`if` / `elif` / `else` 사슬에서는 **처음 참인 블록 하나만** 실행된다.",
        "조건 뒤 콜론 `:`, 블록은 들여쓰기.",
        "독립된 `if` 여러 개는 전부 검사된다 — 하나만 골라야 하면 `elif`.",
        "elif 사슬은 **엄격한 조건부터.** 순서가 틀리면 오류 없이 잘못된다.",
        "값을 고를 땐 조건부 표현식 `a if 조건 else b`.",
      ],
    },
  ],
};
