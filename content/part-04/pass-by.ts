import type { Lesson } from "@/lib/types";

export const passBy: Lesson = {
  part: 4,
  slug: "pass-by",
  blocks: [
    {
      kind: "viz", component: "Story", title: "인자 전달 = 같은 객체에 이름 하나 더",
      props: {
        story: {
          code: ["def rebind(lst):", "    lst = [9, 9]", "", "def mutate(lst):", "    lst.append(9)", "", "nums = [1, 2]", "rebind(nums)", "mutate(nums)"],
          steps: [
            { chapter: "호출", say: "`nums = [1, 2]`. 이걸 `rebind(nums)` 로 넘긴다.", ops: [{ line: 6 }, { obj: "L", type: "list", items: ["1", "2"] }, { bind: "nums", to: "L" }] },
            { say: "인자 전달은 **복사가 아니다.** 함수 프레임의 `lst` 라는 이름이 **같은 객체**에 붙는다. `lst = nums` 를 한 것과 정확히 같다.", ops: [{ line: 7 }, { bind: "lst", to: "L", frame: "rebind()" }, { badge: "L", text: "이름 둘, 객체 하나", color: "name" }] },
            { chapter: "재바인딩", say: "`lst = [9, 9]` — 새 객체를 만들어 **지역 이름 lst** 를 옮겨 붙인다. `nums` 는 여전히 원래 객체. 바깥은 아무것도 모른다.", ops: [{ line: 1 }, { unbadge: "L" }, { obj: "L2", type: "list", items: ["9", "9"] }, { bind: "lst", to: "L2", frame: "rebind()" }] },
            { say: "함수가 끝나면 프레임과 함께 `lst` 도, `[9, 9]` 도 사라진다. `nums` 는 `[1, 2]` 그대로.", ops: [{ unbind: "lst", frame: "rebind()" }, { del: "L2" }] },
            { chapter: "객체 변경", say: "`mutate(nums)` — 역시 `lst` 가 같은 객체에 붙는다.", ops: [{ line: 8 }, { bind: "lst", to: "L", frame: "mutate()" }] },
            { say: "`lst.append(9)` — 이름을 옮기는 게 아니라 **객체를 바꾼다.** 같은 객체를 보고 있는 `nums` 도 9 를 본다.", ops: [{ line: 4 }, { mutate: "L", items: ["1", "2", "9"] }, { badge: "L", text: "nums 도 바뀌었다", color: "warn" }] },
            { chapter: "결론", say: "파이썬은 '값 전달' 도 '참조 전달' 도 아니다. **객체를 가리키는 이름을 하나 더 만드는 것**(call by sharing). 재바인딩은 바깥에 안 보이고, 객체 변경은 보인다.", ops: [{ unbind: "lst", frame: "mutate()" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `"파이썬은 값으로 넘기나, 참조로 넘기나?" — 둘 다 아니다. 인자 전달은 \`매개변수 = 인자\` 대입과 똑같다. 즉 **같은 객체에 이름을 하나 더 붙이는 것.** Part 1 의 이름표 모델을 알면 새로 배울 게 없다.

그래서 함수 안에서:
- \`lst = 다른것\` (**재바인딩**) → 지역 이름만 바뀐다. 바깥 영향 없음.
- \`lst.append(x)\`, \`d["k"] = v\` (**객체 변경**) → 같은 객체를 바꾼 것. 바깥에서도 보인다.
- 정수·문자열·튜플은 바꿀 수 없으니 함수 안에서 무엇을 하든 바깥이 바뀔 방법이 없다.`,
    },
    {
      kind: "trace", traceId: "p4-pass-by", title: "한 줄씩",
      caption: "rebind() 안의 lst 화살표가 새 객체로 옮겨 가는 것과, mutate() 가 nums 와 같은 객체를 바꾸는 것.",
    },
    {
      kind: "table",
      head: ["함수 안에서", "바깥에 보이나?", "이유"],
      rows: [
        ["`n = n + 1` (정수)", "아니오", "새 객체에 지역 이름을 붙임"],
        ["`s = s.upper()` (문자열)", "아니오", "새 객체 (문자열은 불변)"],
        ["`lst = []`", "아니오", "재바인딩"],
        ["`lst.append(1)`", "**예**", "같은 객체를 변경"],
        ["`lst += [1]`", "**예**", "리스트의 `+=` 는 제자리 변경 (`extend`)"],
        ["`lst = lst + [1]`", "아니오", "새 리스트를 만들어 재바인딩"],
        ["`d[\"k\"] = 1`", "**예**", "딕셔너리 변경"],
      ],
    },
    {
      kind: "pitfall",
      title: "'원본을 바꾸지 않을 것'이라고 믿고 넘기기",
      md: `함수가 받은 리스트를 \`sort()\` 하거나 \`append\` 하면 호출한 쪽의 데이터가 바뀐다. 함수를 만드는 쪽에서는 **원본을 바꿀 거면 이름에 드러내고**(\`sort_in_place\`), 아니면 안에서 복사해 쓴다(\`lst = list(lst)\`). 함수를 쓰는 쪽에서는 소중한 리스트는 복사본을 넘긴다(\`f(lst[:])\`).`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `def f(a, b):
    a += [3]
    b = b + [3]
x, y = [1], [1]
f(x, y)
print(x, y)`,
      choices: [
        { text: "`[1, 3] [1, 3]`", why: "b = b + [3] 은 새 리스트를 만들어 지역 b 에 붙인다. y 는 그대로." },
        { text: "`[1, 3] [1]`", correct: true, why: "a += [3] 은 리스트를 제자리에서 변경 → x 에 보인다. b = b + [3] 은 새 객체를 지역 b 에 재바인딩 → y 는 영향 없다." },
        { text: "`[1] [1]`", why: "+= 는 리스트에서 extend 와 같아 원본을 바꾼다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "인자 전달 = `매개변수 = 인자` 대입 = **같은 객체에 이름 하나 더.**",
        "함수 안 **재바인딩**은 바깥에 안 보이고, **객체 변경**은 보인다.",
        "불변 객체(정수·문자열·튜플)는 함수 안에서 바깥을 바꿀 방법이 없다.",
        "원본을 바꾸는 함수는 이름에 드러내고, 아니면 안에서 복사.",
      ],
    },
  ],
};
