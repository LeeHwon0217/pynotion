import type { Lesson } from "@/lib/types";

export const dynamicArray: Lesson = {
  part: 3,
  slug: "dynamic-array",
  blocks: [
    {
      kind: "viz", component: "DynArrayScene", title: "append 가 빠른 이유 — 여유 칸",
      caption: "리스트는 필요한 것보다 조금 많은 칸을 미리 잡아 둔다. 꽉 차면 더 큰 묶음으로 이사(복사)하지만, 그 사이의 append 는 빈 칸에 넣기만 한다.",
    },
    {
      kind: "text",
      md: `리스트가 "끝없이 늘어나는" 것처럼 보이지만, 메모리는 이어진 칸 묶음이라 마음대로 늘릴 수 없다. CPython 은 이렇게 해결한다:

1. 처음엔 필요한 만큼보다 **조금 더** 잡는다 (0 → 4 → 8 → 16 → 24 → 32 …).
2. 빈 칸이 있으면 \`append\` 는 그냥 넣는다. **O(1).**
3. 꽉 차면 더 큰 묶음을 새로 잡고 **전부 복사**한다. **O(n).** 하지만 드물다.

복사 비용을 그 사이의 싼 append 들에 나눠 부담시키면 평균은 상수다. 이걸 **상각 O(1)** (amortized) 이라 한다.`,
    },
    {
      kind: "trace", traceId: "p3-getsizeof", title: "sys.getsizeof 로 직접 보기",
      caption: "len 은 1씩 늘지만 getsizeof 는 껑충껑충 뛴다. 뛰는 순간이 재할당이다.",
    },
    {
      kind: "heading", text: "그래서 연산마다 비용이 다르다",
    },
    {
      kind: "table",
      head: ["연산", "비용", "이유"],
      rows: [
        ["`lst[i]`, `lst[i] = x`", "O(1)", "시작 주소 + i × 칸 크기로 바로 계산"],
        ["`lst.append(x)`", "O(1) 상각", "빈 칸에 넣기. 가끔 이사"],
        ["`lst.pop()`", "O(1)", "마지막 칸 비우기"],
        ["`lst.insert(0, x)`, `lst.pop(0)`", "**O(n)**", "뒤 항목 전부를 한 칸씩 밀거나 당김"],
        ["`x in lst`", "**O(n)**", "앞에서부터 하나씩 비교"],
        ["`lst.remove(x)`", "O(n)", "찾기 + 밀기"],
        ["`len(lst)`", "O(1)", "길이를 따로 저장해 둔다"],
      ],
      caption: "앞에서 넣고 빼는 큐가 필요하면 collections.deque (양쪽 O(1)). 포함 검사를 자주 하면 set.",
    },
    {
      kind: "pitfall",
      title: "리스트 앞에서 pop(0) 을 반복하기",
      md: `큐(먼저 넣은 것 먼저 꺼내기)를 리스트로 만들어 \`pop(0)\` 을 쓰면 매번 전체가 한 칸씩 당겨진다. 10만 개면 10만 × 10만 / 2 번의 이동. \`collections.deque\` 의 \`popleft()\` 는 O(1) 이다.`,
      code: `from collections import deque
q = deque([1, 2, 3])
q.append(4)        # 뒤에 넣기 O(1)
q.popleft()        # 앞에서 빼기 O(1)  ← 리스트의 pop(0) 은 O(n)`,
    },
    {
      kind: "callout", tone: "deep", title: "칸에는 참조가 든다",
      md: `칸 하나의 크기는 항목의 종류와 무관하게 **참조 하나(8바이트)** 다. 그래서 \`[1, "긴 문자열", [1,2,3]]\` 도 칸 3개일 뿐이고, \`sys.getsizeof(lst)\` 는 **안의 객체 크기를 포함하지 않는다.** 리스트가 차지하는 진짜 메모리를 알려면 항목까지 따로 더해야 한다.`,
    },
    {
      kind: "quiz",
      question: "빈 리스트에 append 를 1,000 번 하면 재할당(이사)은 대략 몇 번 일어날까?",
      choices: [
        { text: "약 1,000번", why: "매번 이사하면 append 가 O(n) 이 된다. 여유 칸이 있는 이유가 그것을 피하기 위해서다." },
        { text: "약 10~15번", correct: true, why: "묶음 크기가 4, 8, 16, 24, 32, 40, 52, 64, 76, 92, 108… 처럼 커진다 (대략 12.5% 씩 + 상수). 1,000 에 도달할 때까지 이사는 십여 번뿐이다." },
        { text: "1번", why: "처음부터 1,000 칸을 잡지는 않는다. 얼마나 커질지 모르니까." },
      ],
    },
    {
      kind: "summary",
      items: [
        "리스트는 **여유 칸을 미리 잡는 동적 배열.** 꽉 차면 더 큰 묶음으로 복사.",
        "`append`/`pop`/인덱싱은 O(1), **앞에 넣고 빼기와 `in` 은 O(n).**",
        "복사 비용은 드물게 발생 → 평균 O(1) (상각).",
        "앞에서 빼는 큐는 `deque`, 포함 검사는 `set`.",
      ],
    },
  ],
};
