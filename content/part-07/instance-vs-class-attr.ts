import type { Lesson } from "@/lib/types";

export const instanceVsClassAttr: Lesson = {
  part: 7,
  slug: "instance-vs-class-attr",
  blocks: [
    {
      kind: "viz", component: "Story", title: "클래스 속성은 하나, 인스턴스 속성은 각자",
      props: {
        story: {
          twoCols: true,
          code: ["class Counter:", "    count = 0", "    def __init__(self):", "        Counter.count += 1", "        self.id = Counter.count", "", "a = Counter()", "b = Counter()", "a.count = 99"],
          steps: [
            { chapter: "클래스 속성", say: "`class` 블록 안에서 `count = 0` — 이건 **클래스 객체의 속성**이다. `Counter.__dict__[\"count\"]`. 단 하나.", ops: [{ line: 1 }, { obj: "K", type: "class Counter", fields: [["count", "0"], ["__init__", "<function>"]] }, { bind: "Counter", to: "K" }] },
            { chapter: "a = Counter()", say: "`Counter.count += 1` — **클래스의** count 를 1 로. `self.id = 1` — **인스턴스 a 의** 속성.", ops: [{ line: 6 }, { mutate: "K", fields: [["count", "1"], ["__init__", "<function>"]] }, { obj: "A", type: "Counter", fields: [["id", "1"]], note: "a.__dict__" }, { bind: "a", to: "A" }] },
            { chapter: "b = Counter()", say: "`b` — 클래스의 count 는 2 가 되고, b 의 `__dict__` 에는 `id: 2` 만.", ops: [{ line: 7 }, { mutate: "K", fields: [["count", "2"], ["__init__", "<function>"]] }, { obj: "B", type: "Counter", fields: [["id", "2"]], note: "b.__dict__" }, { bind: "b", to: "B" }] },
            { chapter: "a.count 읽기", say: "`a.count` — a 의 `__dict__` 에 count 가 **없다.** 그러면 파이썬은 **클래스**에서 찾는다 → 2. `b.count` 도 2. 둘 다 클래스의 하나를 보는 것.", ops: [{ badge: "K", text: "a.count → 2, b.count → 2 (여기서 찾음)", color: "fresh" }] },
            { chapter: "a.count = 99", say: "`a.count = 99` — **대입은 항상 인스턴스에.** a 의 `__dict__` 에 새 count 가 생긴다. 클래스의 count 는 그대로 2, b.count 도 2.", ops: [{ line: 8 }, { unbadge: "K" }, { mutate: "A", fields: [["id", "1"], ["count", "99"]] }, { badge: "A", text: "인스턴스에 새로 생김 — 클래스 것을 가린다", color: "warn" }] },
            { chapter: "규칙", say: "**읽기**는 인스턴스 → 클래스 순으로 찾고, **쓰기**는 인스턴스에만. 클래스 것을 바꾸려면 `Counter.count = ...` 로 클래스를 직접 가리킨다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `속성이 사는 곳은 둘이다.

- **클래스 속성** — \`class\` 블록에 바로 쓴 것. 클래스 객체에 하나. 모든 인스턴스가 **공유**한다. 상수, 기본값, 인스턴스 개수 같은 공용 데이터.
- **인스턴스 속성** — \`self.x = ...\` 로 붙인 것. 인스턴스마다 **각자.**

읽을 때 \`obj.x\` 는 인스턴스 \`__dict__\` → 클래스 순으로 찾는다 (다음 레슨에서 정확히). 쓸 때 \`obj.x = v\` 는 **무조건 인스턴스**에 붙는다.`,
    },
    {
      kind: "trace", traceId: "p7-class-attr", title: "한 줄씩",
      caption: "Counter.count 가 클래스 객체의 필드로, id 가 각 인스턴스의 필드로 보인다. a.count = 99 뒤 a 에만 count 가 생긴다.",
    },
    {
      kind: "pitfall",
      title: "가변 클래스 속성 — 리스트를 공유하게 된다",
      md: `\`class Team: members = []\` 처럼 클래스 속성에 리스트를 두고 \`self.members.append(x)\` 하면, 모든 인스턴스가 **같은 리스트**에 append 한다. 인스턴스마다 따로 가져야 하는 데이터는 반드시 \`__init__\` 에서 \`self.members = []\` 로. (Part 4 의 가변 기본값 함정과 같은 뿌리.)`,
      traceId: "p7-class-attr-trap",
    },
    {
      kind: "code", title: "올바른 사용",
      code: `class Team:
    max_size = 5                 # 클래스 속성: 모든 팀 공통 상수 — OK

    def __init__(self, name):
        self.name = name         # 인스턴스 속성
        self.members = []        # 인스턴스마다 새 리스트 — 여기서!

    def add(self, who):
        if len(self.members) >= self.max_size:   # 읽기는 클래스까지 올라간다
            raise ValueError("가득 참")
        self.members.append(who)`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `class A:
    x = 1
a, b = A(), A()
a.x += 10
print(a.x, b.x, A.x)`,
      choices: [
        { text: "`11 11 11`", why: "a.x += 10 은 a.x = a.x + 10 — 대입이므로 a 의 인스턴스 속성이 새로 생긴다. 클래스와 b 는 그대로." },
        { text: "`11 1 1`", correct: true, why: "읽기(a.x → 클래스의 1) + 대입(a.__dict__[\"x\"] = 11). 클래스의 x 와 b.x 는 영향 없다." },
        { text: "`11 1 11`", why: "인스턴스에 대입하면 클래스 속성은 바뀌지 않는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "**클래스 속성** = `class` 블록에 쓴 것, 하나, 공유. **인스턴스 속성** = `self.x`, 각자.",
        "읽기: 인스턴스 → 클래스. 쓰기: **항상 인스턴스** (클래스 것을 가린다).",
        "가변 데이터(리스트·딕셔너리)는 클래스 속성으로 두지 말고 `__init__` 에서 `self.` 로.",
      ],
    },
  ],
};
