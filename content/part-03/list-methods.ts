import type { Lesson } from "@/lib/types";

export const listMethods: Lesson = {
  part: 3,
  slug: "list-methods",
  blocks: [
    {
      kind: "viz", component: "Story", title: "리스트 메서드는 객체를 제자리에서 바꾼다",
      props: {
        story: {
          code: ['todo = ["빨래"]', 'todo.append("청소")', 'todo.insert(0, "설거지")', "x = todo.pop()", "r = todo.sort()"],
          steps: [
            { chapter: "append", say: "리스트 하나. `append` 는 **끝에** 붙인다. 가장 싸고 가장 흔한 연산.", ops: [{ line: 0 }, { obj: "L", type: "list", items: ['"빨래"'] }, { bind: "todo", to: "L" }] },
            { say: "", dur: 1600, ops: [{ line: 1 }, { mutate: "L", items: ['"빨래"', '"청소"'] }] },
            { chapter: "insert", say: "`insert(0, …)` 는 **앞에** 끼운다. 뒤의 항목이 전부 한 칸씩 밀린다 — 항목이 많으면 느리다.", ops: [{ line: 2 }, { mutate: "L", items: ['"설거지"', '"빨래"', '"청소"'] }, { badge: "L", text: "뒤 항목 전부 이동", color: "warn" }] },
            { chapter: "pop", say: "`pop()` 은 마지막 항목을 **빼서 돌려준다.** 리스트에서 사라지고, 그 객체에 `x` 가 붙는다.", ops: [{ line: 3 }, { unbadge: "L" }, { mutate: "L", items: ['"설거지"', '"빨래"'] }, { obj: "P", type: "str", value: '"청소"' }, { bind: "x", to: "P" }] },
            { chapter: "sort 의 함정", say: "`sort()` 는 리스트를 **제자리에서** 정렬하고 **`None` 을 돌려준다.** `r = todo.sort()` 하면 `r` 은 None.", ops: [{ line: 4 }, { mutate: "L", items: ['"빨래"', '"설거지"'] }, { obj: "N", type: "NoneType", value: "None" }, { bind: "r", to: "N" }, { badge: "N", text: "정렬된 리스트가 아니다!", color: "dead" }] },
            { say: "새 리스트가 필요하면 `sorted(todo)`. 규칙: **바꾸는 메서드는 None 을 돌려주고, 새 것을 만드는 함수는 결과를 돌려준다.**", ops: [] },
          ],
        },
      },
    },
    {
      kind: "table",
      head: ["메서드", "하는 일", "돌려주는 것"],
      rows: [
        ["`append(x)`", "끝에 추가", "`None`"],
        ["`extend(iter)`", "여러 개를 끝에 추가", "`None`"],
        ["`insert(i, x)`", "i 번 자리에 끼우기 (뒤가 밀림)", "`None`"],
        ["`pop()` / `pop(i)`", "마지막 / i 번 항목을 빼서", "**그 항목**"],
        ["`remove(x)`", "값 x 인 첫 항목 삭제 (없으면 `ValueError`)", "`None`"],
        ["`index(x)`", "값 x 의 위치 (없으면 `ValueError`)", "정수"],
        ["`count(x)`", "x 의 개수", "정수"],
        ["`sort()`", "제자리 정렬", "`None`"],
        ["`reverse()`", "제자리 뒤집기", "`None`"],
        ["`clear()`", "전부 삭제", "`None`"],
        ["`copy()`", "얕은 복사", "**새 리스트**"],
      ],
      caption: "None 을 돌려주는 것 = 원본을 바꾸는 것. 이 규칙만 알면 리스트 메서드의 반은 안 것이다.",
    },
    {
      kind: "trace", traceId: "p3-list-methods", title: "한 줄씩",
      caption: "insert 에서 뒤 항목이 밀리는 것, extend 와 append 의 차이, 그리고 sort() 의 반환값이 None 인 것.",
    },
    {
      kind: "pitfall",
      title: "append([1, 2]) 와 extend([1, 2])",
      md: `\`append\` 는 인자를 **하나의 항목**으로 넣는다. \`[0].append([1, 2])\` → \`[0, [1, 2]]\`. 여러 개를 풀어서 넣으려면 \`extend\` → \`[0, 1, 2]\`. \`lst += [1, 2]\` 는 extend 와 같다.`,
    },
    {
      kind: "pitfall",
      title: "lst = lst.append(x)",
      md: `\`append\` 가 \`None\` 을 돌려주므로 이렇게 쓰면 \`lst\` 가 \`None\` 이 되어 버린다. 그냥 \`lst.append(x)\`. \`sort\`, \`reverse\`, \`extend\` 도 마찬가지.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `a = [3, 1, 2]
b = a.sort()
print(a, b)`,
      choices: [
        { text: "`[1, 2, 3] [1, 2, 3]`", why: "sort() 는 None 을 돌려준다." },
        { text: "`[1, 2, 3] None`", correct: true, why: "a 는 제자리에서 정렬되고, b 에는 sort() 의 반환값 None 이 붙는다. 정렬된 새 리스트를 원하면 sorted(a)." },
        { text: "`[3, 1, 2] [1, 2, 3]`", why: "그건 sorted(a) 의 동작이다. sort() 는 원본을 바꾼다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "리스트 메서드 대부분은 **객체를 제자리에서 바꾸고 `None` 을 돌려준다.** `pop` 만 항목을 돌려준다.",
        "`append` 는 하나, `extend` 는 여러 개. `insert(0, x)` 는 느리다 (전부 밀림).",
        "`sort()` 는 제자리 + None, `sorted()` 는 새 리스트.",
      ],
    },
  ],
};
