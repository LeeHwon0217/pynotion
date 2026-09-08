import type { Lesson } from "@/lib/types";

export const copyLesson: Lesson = {
  part: 3,
  slug: "copy",
  blocks: [
    {
      kind: "viz", component: "Story", title: "얕은 복사는 바깥만, 깊은 복사는 안까지",
      props: {
        story: {
          twoCols: true,
          code: ["a = [[1, 2], [3]]", "b = a", "c = a[:]", "d = deepcopy(a)", "a[0].append(9)", "a.append([5])"],
          steps: [
            { chapter: "원본", say: "바깥 리스트 하나가 안쪽 리스트 두 개를 **가리킨다.** 칸에 든 건 참조다.", ops: [{ line: 0 }, { obj: "A", type: "list", refs: ["I0", "I1"] }, { obj: "I0", type: "list", items: ["1", "2"] }, { obj: "I1", type: "list", items: ["3"] }, { bind: "a", to: "A" }] },
            { chapter: "b = a", say: "복사가 아니다. 같은 바깥 리스트에 이름 하나 더.", ops: [{ line: 1 }, { bind: "b", to: "A" }] },
            { chapter: "얕은 복사", say: "`a[:]` — **바깥 리스트만** 새로 만든다. 새 리스트의 칸은 **같은 안쪽 리스트들**을 가리킨다. 참조를 복사한 것이지 객체를 복사한 게 아니다.", ops: [{ line: 2 }, { obj: "Cc", type: "list", refs: ["I0", "I1"] }, { bind: "c", to: "Cc" }, { badge: "Cc", text: "안쪽은 공유", color: "warn" }] },
            { chapter: "깊은 복사", say: "`deepcopy(a)` — 바깥도, **안쪽도 전부** 새 객체. 완전히 독립된 사본.", ops: [{ line: 3 }, { unbadge: "Cc" }, { obj: "Dd", type: "list", refs: ["J0", "J1"] }, { obj: "J0", type: "list", items: ["1", "2"] }, { obj: "J1", type: "list", items: ["3"] }, { bind: "d", to: "Dd" }, { badge: "Dd", text: "전부 독립", color: "fresh" }] },
            { chapter: "안쪽을 바꾸면", say: "`a[0].append(9)` — 안쪽 리스트 하나를 바꿨다. 이 객체를 가리키는 건 `a`, `b`, **그리고 `c`**. 셋 다 9 를 본다. `d` 만 무관.", ops: [{ line: 4 }, { unbadge: "Dd" }, { mutate: "I0", items: ["1", "2", "9"] }, { pulse: "I0" }] },
            { chapter: "바깥을 바꾸면", say: "`a.append([5])` — 바깥 리스트를 바꿨다. 같은 바깥을 가리키는 건 `a` 와 `b` 뿐. `c` 의 바깥은 별개다.", ops: [{ line: 5 }, { obj: "I2", type: "list", items: ["5"] }, { mutate: "A", refs: ["I0", "I1", "I2"] }, { pulse: "A" }] },
            { say: "정리: **얕은 복사는 한 겹**만 새로 만든다. 안에 바꿀 수 있는 객체가 들어 있으면 그건 공유된다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `"복사했는데 왜 같이 바뀌나"는 파이썬에서 가장 많이 나오는 질문이고, 답은 세 단계로 나뉜다.

1. \`b = a\` — 복사가 **아니다.** 이름 하나 더 (Part 1).
2. \`a[:]\`, \`a.copy()\`, \`list(a)\`, \`dict(d)\` — **얕은 복사.** 바깥 컨테이너만 새로 만들고 안의 참조는 그대로 복사한다. 안에 리스트·딕셔너리가 있으면 공유된다.
3. \`copy.deepcopy(a)\` — **깊은 복사.** 재귀적으로 안까지 전부 새로 만든다.

안에 든 게 전부 불변(숫자, 문자열, 튜플)이면 얕은 복사로 충분하다. 공유되어도 바꿀 수 없으니까.`,
    },
    {
      kind: "trace", traceId: "p3-copy", title: "한 줄씩",
      caption: "a[0].append(99) 뒤 b[0], c[0] 은 바뀌고 d[0] 만 그대로. a.append 뒤에는 b 만 길이가 는다.",
    },
    {
      kind: "table",
      head: ["", "`b = a`", "얕은 복사 `a[:]`", "깊은 복사 `deepcopy(a)`"],
      rows: [
        ["바깥 객체", "같음", "**새로**", "**새로**"],
        ["안쪽 객체", "같음", "같음 (공유)", "**새로**"],
        ["`a[0].append()` 영향", "받음", "**받음**", "안 받음"],
        ["`a.append()` 영향", "받음", "안 받음", "안 받음"],
        ["비용", "0", "한 겹", "전체"],
      ],
    },
    {
      kind: "pitfall",
      title: "함수에 리스트를 넘겼더니 원본이 바뀐다",
      md: `함수 인자 전달도 \`b = a\` 와 같다 — 같은 객체에 이름을 붙이는 것 (Part 4에서 자세히). 함수 안에서 \`lst.append()\` 하면 호출한 쪽의 리스트가 바뀐다. 원본을 보호하려면 함수 안에서 \`lst = lst[:]\` 로 복사본을 만들어 쓴다.`,
    },
    {
      kind: "quiz",
      question: "`a = [1, [2, 3]]; b = a.copy(); b[1].append(4); b.append(5)` 후 `a` 는?",
      choices: [
        { text: "`[1, [2, 3]]`", why: "copy() 는 얕은 복사. 안쪽 리스트 [2, 3] 은 공유되므로 append(4) 가 a 에도 보인다." },
        { text: "`[1, [2, 3, 4]]`", correct: true, why: "b[1] 은 a[1] 과 같은 객체 → 4 가 들어간다. b.append(5) 는 b 의 바깥(새 객체)에만 → a 에는 없다." },
        { text: "`[1, [2, 3, 4], 5]`", why: "바깥 리스트는 얕은 복사로 새 객체가 됐으므로 b.append(5) 는 a 에 영향 없다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`b = a` 는 복사 아님. `a[:]`/`copy()` 는 **얕은** 복사(한 겹). `deepcopy` 는 **깊은** 복사(전부).",
        "얕은 복사는 안의 참조를 그대로 복사한다 → 안의 가변 객체는 **공유**된다.",
        "안에 든 게 전부 불변이면 얕은 복사면 충분하다.",
        "함수 인자도 `b = a` 와 같다. 원본 보호는 함수 안에서 복사.",
      ],
    },
  ],
};
