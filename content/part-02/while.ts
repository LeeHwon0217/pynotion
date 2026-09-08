import type { Lesson } from "@/lib/types";

export const whileLesson: Lesson = {
  part: 2,
  slug: "while",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "while — 조건이 참인 동안",
      props: {
        flow: {
          code: ["n = 3", "while n > 0:", "    print(n)", "    n -= 1", 'print("발사!")'],
          nodes: [
            { id: "s", kind: "step", label: "n = 3", x: 640, y: 60 },
            { id: "c", kind: "cond", label: "n > 0 ?", x: 640, y: 165 },
            { id: "p", kind: "io", label: "print(n)", x: 640, y: 270 },
            { id: "d", kind: "step", label: "n -= 1", x: 640, y: 350 },
            { id: "e", kind: "io", label: 'print("발사!")', x: 640, y: 460 },
          ],
          edges: [
            { from: "s", to: "c" },
            { from: "c", to: "p", label: "참" },
            { from: "p", to: "d" },
            { from: "d", to: "c", via: [[800, 350], [800, 165]] },
            { from: "c", to: "e", label: "거짓", via: [[470, 165], [470, 460]] },
          ],
          steps: [
            { chapter: "준비", say: "`n = 3`. 이제 `while` 로 들어간다.", at: "s", line: 0, vars: { n: "3" } },
            { chapter: "1회", say: "**조건 검사.** `n > 0` — 3 > 0 은 참. 블록으로 들어간다.", at: "c", line: 1, badge: { at: "c", text: "3 > 0 → True", color: "fresh" } },
            { say: "`print(n)` → 3", at: "p", line: 2, output: "3\n" },
            { say: "`n -= 1` → n 은 2. 블록 끝. **다시 조건으로 올라간다.** 이게 while 의 핵심이다.", at: "d", line: 3, vars: { n: "2" } },
            { chapter: "2회", say: "다시 검사. 2 > 0 참.", at: "c", line: 1, badge: { at: "c", text: "2 > 0 → True", color: "fresh" } },
            { say: "", dur: 1500, at: "p", line: 2, output: "2\n" },
            { say: "", dur: 1500, at: "d", line: 3, vars: { n: "1" } },
            { chapter: "3회", say: "1 > 0 참. 한 번 더.", at: "c", line: 1, badge: { at: "c", text: "1 > 0 → True", color: "fresh" } },
            { say: "", dur: 1500, at: "p", line: 2, output: "1\n" },
            { say: "", dur: 1500, at: "d", line: 3, vars: { n: "0" } },
            { chapter: "종료", say: "0 > 0 — **거짓.** 이제야 블록을 건너뛰고 while 다음 줄로 간다.", at: "c", line: 1, badge: { at: "c", text: "0 > 0 → False", color: "dead" } },
            { say: "`print(\"발사!\")`. 반복은 총 3번 돌았고, 조건 검사는 **4번** 했다 — 마지막 한 번은 나가기 위한 검사.", at: "e", line: 4, output: "발사!\n" },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`while 조건:\` 은 조건을 검사해서 참이면 블록을 실행하고, **블록이 끝나면 다시 조건으로 돌아간다.** 조건이 거짓이 될 때까지 반복한다. 조건이 처음부터 거짓이면 블록은 한 번도 실행되지 않는다.

\`for\`가 "정해진 것들을 하나씩"이라면 \`while\`은 "언제 끝날지 모르지만 조건이 만족될 때까지"다. 사용자 입력을 받을 때, 수렴할 때까지 계산할 때, 게임 루프 등에 쓴다.`,
    },
    {
      kind: "trace", traceId: "p2-while", title: "조건 → 블록 → 조건 → 블록…",
      caption: "2번 줄(조건)로 계속 되돌아오는 것을 보라. n 이 0 이 되면 4번 줄에서 5번 줄로 바로 간다.",
    },
    {
      kind: "pitfall",
      title: "무한 루프",
      md: `블록 안에서 조건을 바꾸는 코드(\`n -= 1\`)를 빠뜨리면 조건이 영원히 참이다. 프로그램이 멈춘 것처럼 보이면 대부분 이것이다. **Ctrl+C** 로 끊는다. while 을 쓸 때는 "이 조건이 언젠가 거짓이 되나?"를 먼저 확인하는 습관을 들인다.`,
      code: `n = 3
while n > 0:
    print(n)
    # n -= 1 을 빼먹음 → 3 이 무한히 출력된다`,
    },
    {
      kind: "heading", text: "while True 와 break",
    },
    {
      kind: "code",
      code: `while True:                    # 일부러 무한 루프로 시작하고
    answer = input("계속? (y/n) ")
    if answer == "n":
        break                  # 조건이 맞으면 안에서 끊는다
    print("계속합니다")`,
      caption: "'종료 조건이 블록 중간에 있는' 경우의 관용구. break 는 다음 레슨에서.",
    },
    {
      kind: "quiz",
      question: "다음 코드는 몇 줄을 출력할까?",
      code: `i = 0
while i < 5:
    i += 2
    print(i)`,
      choices: [
        { text: "2줄", why: "i 가 2, 4 가 되고 그다음 6 이 된다. 6 이 출력된 뒤에 조건 검사에서 거짓이 된다." },
        { text: "3줄 (2, 4, 6)", correct: true, why: "i=0 (참) → 2 출력, i=2 (참) → 4 출력, i=4 (참) → 6 출력, i=6 (거짓) 종료. 조건은 블록 시작 전에만 검사하므로 6 도 출력된다." },
        { text: "5줄", why: "i 는 2 씩 늘어난다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`while 조건:` — 조건 검사 → 참이면 블록 → 다시 검사. 거짓이 되면 다음 줄로.",
        "조건은 **블록 시작 전에만** 검사한다. 블록 중간에 거짓이 되어도 블록은 끝까지 실행된다.",
        "블록 안에서 조건이 바뀌지 않으면 **무한 루프.** Ctrl+C.",
        "`while True:` + `break` 는 종료 조건이 중간에 있을 때의 관용구.",
      ],
    },
  ],
};
