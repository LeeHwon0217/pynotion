import type { Lesson } from "@/lib/types";

export const mroLesson: Lesson = {
  part: 7,
  slug: "mro",
  blocks: [
    {
      kind: "viz", component: "Tree", title: "다이아몬드 상속에서 누가 먼저인가",
      props: {
        tree: {
          layout: "bottom-up",
          code: ["class A:", '    def who(self): return "A"', "class B(A):", '    def who(self): return "B→" + super().who()', "class C(A):", '    def who(self): return "C→" + super().who()', "class D(B, C):", '    def who(self): return "D→" + super().who()', "", "D().who()"],
          nodes: [
            { id: "obj", label: "object" },
            { id: "A", label: "A", parent: "obj" },
            { id: "B", label: "B", parent: "A" },
            { id: "C", label: "C", parent: "A" },
            { id: "D", label: "D", parents: ["B", "C"] },
          ],
          steps: [
            { chapter: "다이아몬드", say: "D 는 B 와 C 를 상속하고, 둘 다 A 를 상속한다. 마름모꼴. `D().who()` 에서 B 의 `super()` 는 누구를 부를까 — A? C?", lit: ["D", "B", "C", "A"] },
            { chapter: "MRO", say: "파이썬은 클래스마다 **찾는 순서표**(MRO)를 미리 계산한다. `D.__mro__` = **D → B → C → A → object.** A 는 한 번만, 자식들보다 **뒤에.**", path: ["D", "B", "C", "A", "obj"] },
            { say: "규칙(C3 선형화)의 핵심: ① 자식이 부모보다 앞 ② `class D(B, C)` 에 쓴 순서 유지 ③ 공통 조상은 마지막에 한 번. 그래서 A 가 맨 뒤로 밀린다.", lit: ["D", "B", "C", "A", "obj"] },
            { chapter: "super() 의 정체", say: "`super()` 는 '부모' 가 아니다. **'MRO 에서 나 다음 클래스'** 다. D 안에서 super() 는 B.", path: ["D", "B"], badge: { at: "B", text: "D 의 super() → B", color: "fresh" } },
            { say: "B 안에서 `super()` — B 의 부모 A 가 아니라 MRO 에서 B 다음인 **C** 다! 그래서 B 는 C 를 모르는데도 C.who 가 호출된다.", path: ["B", "C"], badge: { at: "C", text: "B 의 super() → C (A 가 아님!)", color: "warn" } },
            { say: "C 의 super() → A. 결과: `\"D→B→C→A\"`. 모든 클래스가 정확히 한 번씩, MRO 순서로 협력한다.", path: ["C", "A"], badge: { at: "A", text: '결과 "D→B→C→A"', color: "fresh" } },
            { chapter: "왜 이렇게", say: "만약 super() 가 '내 부모' 였다면 B→A, C→A 로 A 가 **두 번** 실행됐을 것이다. `__init__` 이 두 번 돌면 재앙. MRO 덕에 다중 상속에서도 각 클래스가 한 번만 실행된다 — 단, 모두 super() 를 써야 한다.", lit: ["D", "B", "C", "A"] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `클래스가 여러 부모를 가질 수 있다(다중 상속). 그러면 "속성을 어느 순서로 찾나"가 문제인데, 파이썬은 **MRO**(Method Resolution Order)라는 순서표를 C3 알고리즘으로 계산해 \`Cls.__mro__\` 에 둔다. 속성 찾기도, \`super()\` 도 이 표를 따른다.

핵심 두 가지:
- \`super()\` = "MRO 에서 **나 다음**". 부모가 아니다.
- 다중 상속 사슬에서 모든 클래스가 \`super()\` 를 쓰면, 각 클래스의 메서드가 **정확히 한 번씩** MRO 순서로 호출된다 (협력적 다중 상속).`,
    },
    {
      kind: "trace", traceId: "p7-mro", title: "한 줄씩 — 프레임이 D, B, C, A 순으로 쌓인다",
      caption: "콜스택 트레이에서 who 프레임 네 개가 MRO 순서대로 쌓이는 것을 보라. B 의 super() 가 C 로 가는 순간이 핵심.",
    },
    {
      kind: "code", title: "실전 — 믹스인",
      code: `class JSONMixin:                       # 기능 한 조각 — 단독으로는 쓰지 않는다
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class LogMixin:
    def log(self, msg):
        print(f"[{type(self).__name__}] {msg}")

class User(JSONMixin, LogMixin):       # 조각들을 조합
    def __init__(self, name):
        self.name = name

u = User("지기")
u.log(u.to_json())                     # [User] {"name": "지기"}
print(User.__mro__)                    # User, JSONMixin, LogMixin, object`,
      caption: "다중 상속의 현실적 용도는 '작은 기능 조각(믹스인)을 붙이는 것'. 상태를 갖지 않는 믹스인은 MRO 걱정이 거의 없다.",
    },
    {
      kind: "pitfall",
      title: "super().__init__ 에 인자 넘기기",
      md: `협력적 다중 상속에서 각 클래스의 \`__init__\` 은 자기 인자만 쓰고 나머지를 \`super().__init__(**kwargs)\` 로 넘겨야 사슬이 끊기지 않는다. 한 클래스라도 super() 를 안 부르면 그 뒤 클래스들의 \`__init__\` 은 실행되지 않는다.`,
      code: `class A:
    def __init__(self, a, **kw):
        self.a = a
        super().__init__(**kw)      # 나머지를 다음으로
class B:
    def __init__(self, b, **kw):
        self.b = b
        super().__init__(**kw)
class C(A, B):
    pass
C(a=1, b=2)                         # A.__init__ → B.__init__ → object.__init__`,
    },
    {
      kind: "quiz",
      question: "`class X(Y, Z)` 에서 Y 와 Z 가 서로 무관하고 둘 다 `object` 만 상속한다. `X.__mro__` 는?",
      choices: [
        { text: "`X, Y, object, Z, object`", why: "object 는 한 번만, 맨 뒤에." },
        { text: "`X, Y, Z, object`", correct: true, why: "자식 먼저, 선언 순서(Y, Z) 유지, 공통 조상 object 는 마지막에 한 번." },
        { text: "`X, Z, Y, object`", why: "괄호에 쓴 순서(Y, Z)가 유지된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "MRO = 속성을 찾는 순서표. `Cls.__mro__`. 자식 먼저, 선언 순서 유지, 공통 조상은 마지막에 한 번.",
        "`super()` 는 부모가 아니라 **MRO 의 다음.** 다이아몬드에서 B 의 super() 가 C 일 수 있다.",
        "모두 `super()` 를 쓰면 각 클래스가 **한 번씩** 협력한다. `**kwargs` 로 인자를 넘긴다.",
        "다중 상속은 믹스인 정도로.",
      ],
    },
  ],
};
