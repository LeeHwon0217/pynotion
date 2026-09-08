import type { Lesson } from "@/lib/types";

export const rangeLesson: Lesson = {
  part: 2,
  slug: "range",
  blocks: [
    {
      kind: "viz", component: "Story", title: "range 는 숫자를 미리 만들지 않는다",
      props: {
        story: {
          code: ["r = range(2, 10, 3)", "nums = list(r)", "big = range(1_000_000)", "print(len(big))"],
          steps: [
            { chapter: "세 숫자", say: "`range(2, 10, 3)` — 2 부터 10 **직전**까지 3 씩. 그런데 만들어지는 건 숫자 세 개가 아니라 **작은 객체 하나**다.", ops: [{ line: 0 }, { obj: "R", type: "range", fields: [["start", "2"], ["stop", "10"], ["step", "3"]] }, { bind: "r", to: "R" }] },
            { say: "range 객체는 시작·끝·간격 **세 값만** 기억한다. 실제 숫자 2, 5, 8 은 아직 어디에도 없다. `for` 가 꺼낼 때마다 그 자리에서 계산한다.", ops: [{ badge: "R", text: "숫자는 꺼낼 때 계산", color: "fresh" }] },
            { chapter: "list() 로 꺼내면", say: "`list(r)` 은 range 에서 숫자를 **끝까지 꺼내** 리스트에 담는다. 이제야 2, 5, 8 이 메모리에 생긴다.", ops: [{ line: 1 }, { unbadge: "R" }, { obj: "L", type: "list", items: ["2", "5", "8"] }, { bind: "nums", to: "L" }, { badge: "L", text: "10 은 포함 안 됨", color: "warn" }] },
            { chapter: "백만이어도", say: "`range(1_000_000)`. 백만 개의 숫자? 아니다. 역시 **세 값**만 — 0, 1000000, 1. 메모리 크기는 `range(3)` 과 똑같다.", ops: [{ line: 2 }, { unbadge: "L" }, { obj: "B", type: "range", fields: [["start", "0"], ["stop", "1000000"], ["step", "1"]] }, { bind: "big", to: "B" }, { badge: "B", text: "메모리: range(3) 과 동일", color: "fresh" }] },
            { say: "`len(big)` 은 세 값으로 **계산**해서 바로 답한다. `999_999 in big` 도 마찬가지 — 하나씩 세지 않는다.", ops: [{ line: 3 }, { output: "1000000\n" }] },
            { chapter: "왜 이렇게", say: "`for i in range(1_000_000)` 을 돌릴 때 숫자 백만 개를 먼저 만들 이유가 없다. **필요할 때 하나씩** 만드는 이 방식을 '게으른(lazy) 평가' 라 하고, Part 8 제너레이터에서 본격적으로 다룬다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`range\`는 정수 수열을 나타낸다. 세 가지 형태:

- \`range(stop)\` — 0 부터 stop **직전**까지. \`range(5)\` → 0 1 2 3 4
- \`range(start, stop)\` — \`range(2, 5)\` → 2 3 4
- \`range(start, stop, step)\` — \`range(0, 10, 3)\` → 0 3 6 9. step 이 음수면 거꾸로: \`range(5, 0, -1)\` → 5 4 3 2 1

**끝 값은 포함하지 않는다.** \`range(5)\` 가 5 개(0~4)인 것은 리스트 인덱스(0~4)와 맞추기 위해서다. \`for i in range(len(lst))\` 가 딱 맞는 이유.`,
    },
    {
      kind: "trace", traceId: "p2-range", title: "range 객체 vs 실제 숫자",
      caption: "print(r) 은 range(2, 10, 3) 이라고만 나온다. list(r) 로 감싸야 숫자가 보인다. 백만짜리 range 의 len 이 즉시 나오는 것도 보라.",
    },
    {
      kind: "table",
      head: ["식", "결과"],
      rows: [
        ["`range(4)`", "0, 1, 2, 3"],
        ["`range(1, 4)`", "1, 2, 3"],
        ["`range(0, 10, 2)`", "0, 2, 4, 6, 8"],
        ["`range(10, 0, -2)`", "10, 8, 6, 4, 2"],
        ["`range(3, 3)`", "(비어 있음)"],
        ["`range(5, 0)`", "(비어 있음 — step 이 양수인데 시작이 끝보다 크다)"],
      ],
    },
    {
      kind: "pitfall",
      title: "range 는 리스트가 아니다",
      md: `\`r = range(5); r.append(5)\` 는 오류다. range 는 바꿀 수 없고, 인덱싱과 슬라이싱은 되지만(\`range(10)[2:5]\` → \`range(2, 5)\`) 리스트 메서드는 없다. 리스트가 필요하면 \`list(range(5))\`.`,
    },
    {
      kind: "quiz",
      question: "`list(range(10, 0, -3))` 의 결과는?",
      choices: [
        { text: "`[10, 7, 4, 1]`", correct: true, why: "10 부터 3 씩 줄이며 0 직전까지: 10, 7, 4, 1. 다음인 -2 는 0 을 넘어가므로 포함되지 않는다." },
        { text: "`[10, 7, 4, 1, 0]`", why: "끝 값 0 은 포함하지 않는다. 게다가 1 에서 3 을 빼면 -2 이지 0 이 아니다." },
        { text: "`[]`", why: "step 이 음수이고 시작(10)이 끝(0)보다 크므로 정상적으로 숫자가 나온다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`range(start, stop, step)` — stop 은 **포함하지 않는다.** `range(5)` 는 0~4.",
        "range 는 **세 값만 저장하는 작은 객체.** 숫자는 꺼낼 때 계산된다 (게으른 평가). 백만이어도 메모리는 같다.",
        "실제 숫자 목록이 필요하면 `list(range(...))`.",
        "음수 step 으로 거꾸로 셀 수 있다.",
      ],
    },
  ],
};
