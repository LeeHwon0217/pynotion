import type { Lesson } from "@/lib/types";

export const indexing: Lesson = {
  part: 3,
  slug: "indexing",
  blocks: [
    {
      kind: "viz", component: "SliceScene", title: "인덱스는 칸의 번호, 음수는 뒤에서",
      props: {
        items: ["a", "b", "c", "d", "e"], name: "s",
        examples: [
          { expr: "s[0]", index: 0, say: ["`s[0]` — 첫 칸. **0 부터** 센다. 대부분의 언어가 그렇고, 이유는 '앞에서 몇 칸 떨어져 있나' 를 뜻하기 때문이다."] },
          { expr: "s[3]", index: 3, say: ["`s[3]` — 앞에서 3칸 떨어진 칸, 즉 네 번째. `\"d\"`."] },
          { expr: "s[-1]", index: -1, say: ["`s[-1]` — 음수는 **뒤에서** 센다. -1 이 마지막. `len(s) - 1` 을 쓸 필요가 없다.", "파이썬은 음수 인덱스에 `len(s)` 를 더해 해석한다. `-1 + 5 = 4`."] },
          { expr: "s[-3]", index: -3, say: ["`s[-3]` — 뒤에서 세 번째. `-3 + 5 = 2` 번 칸, `\"c\"`."] },
          { expr: "s[5]", index: 5, say: ["`s[5]` — 칸은 0~4 뿐. 5 는 없다. **`IndexError`.** '마지막 = 길이 - 1' 을 잊으면 여기서 걸린다."] },
        ],
      },
    },
    {
      kind: "text",
      md: `인덱스는 **0 부터** 시작한다. 길이가 5 면 유효한 인덱스는 0, 1, 2, 3, 4. \`s[len(s)]\` 는 항상 \`IndexError\`다.

음수 인덱스는 뒤에서 센다. \`-1\`이 마지막, \`-2\`가 그 앞. 내부적으로는 \`len(s)\`를 더해서 해석한다 — \`s[-1]\` 은 \`s[len(s) - 1]\`.

인덱싱은 리스트·튜플·문자열·range 전부 같은 규칙이다.`,
    },
    {
      kind: "trace", traceId: "p3-index", title: "앞에서, 뒤에서, 그리고 범위 밖",
      caption: "마지막 줄은 일부러 IndexError 를 낸다. 오류 메시지 'list index out of range' 를 기억해 두자.",
    },
    {
      kind: "table",
      head: ["인덱스", "0", "1", "2", "3", "4"],
      rows: [
        ["음수", "-5", "-4", "-3", "-2", "-1"],
        ["항목", "a", "b", "c", "d", "e"],
      ],
      caption: "같은 칸을 앞에서 세면 i, 뒤에서 세면 i - len(s).",
    },
    {
      kind: "callout", tone: "deep", title: "왜 0 부터인가",
      md: `인덱스를 "몇 번째"가 아니라 "**시작에서 얼마나 떨어져 있나**(offset)"로 보면 첫 항목은 0 만큼 떨어져 있다. 이렇게 정하면 \`range(len(s))\` 가 딱 맞고, 슬라이스 \`s[a:b]\` 의 길이가 \`b - a\` 가 되며, \`s[:n]\` 과 \`s[n:]\` 이 정확히 나뉜다. 다익스트라가 1982년에 이 규칙을 옹호한 짧은 글이 유명하다.`,
    },
    {
      kind: "pitfall",
      title: "빈 리스트의 s[0]",
      md: `\`s = []\` 일 때 \`s[0]\` 도, \`s[-1]\` 도 \`IndexError\`다. "마지막 항목"을 꺼내기 전에 \`if s:\` 로 비어 있지 않은지 확인하는 습관.`,
    },
    {
      kind: "quiz",
      question: "`s = [10, 20, 30, 40]` 일 때 `s[-4]` 는?",
      choices: [
        { text: "`40`", why: "-1 이 마지막(40). -4 는 뒤에서 네 번째." },
        { text: "`10`", correct: true, why: "-4 + 4 = 0 번 칸. 길이가 4 인 리스트에서 -4 는 첫 항목이다." },
        { text: "`IndexError`", why: "-4 는 유효하다. -5 부터 오류." },
      ],
    },
    {
      kind: "summary",
      items: [
        "인덱스는 **0 부터.** 마지막은 `len(s) - 1`.",
        "음수는 **뒤에서.** `-1` 이 마지막. 내부적으로 `len(s)` 를 더한다.",
        "범위 밖은 `IndexError`. 빈 리스트는 `s[0]` 도 오류.",
      ],
    },
  ],
};
