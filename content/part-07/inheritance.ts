import type { Lesson } from "@/lib/types";

export const inheritance: Lesson = {
  part: 7,
  slug: "inheritance",
  blocks: [
    {
      kind: "viz", component: "Tree", title: "상속 — 부모의 것을 물려받고, 필요한 것만 바꾼다",
      props: {
        tree: {
          layout: "bottom-up",
          code: ["class Animal:", "    def __init__(self, name): self.name = name", '    def speak(self): return "..."', "    def intro(self): return f\"{self.name}: {self.speak()}\"", "", "class Dog(Animal):", '    def speak(self): return "멍"', "", "class Puppy(Dog):", "    def __init__(self, name, age):", "        super().__init__(name)", "        self.age = age"],
          nodes: [
            { id: "obj", label: "object" },
            { id: "an", label: "Animal", parent: "obj", sub: "__init__, speak, intro" },
            { id: "dog", label: "Dog", parent: "an", sub: "speak (재정의)" },
            { id: "pup", label: "Puppy", parent: "dog", sub: "__init__ (재정의)" },
            { id: "p", label: "p = Puppy(...)", parent: "pup", sub: "name, age" },
          ],
          steps: [
            { chapter: "물려받기", say: "`class Dog(Animal):` — 괄호 안이 **부모.** Dog 는 아무것도 새로 안 써도 Animal 의 `__init__`, `speak`, `intro` 를 전부 쓸 수 있다. 속성 찾기가 위로 올라가니까.", line: 5, lit: ["dog", "an"] },
            { chapter: "재정의", say: "Dog 가 `speak` 를 다시 정의하면 — 찾기 순서상 Dog 것이 **먼저** 찾힌다. Animal 의 speak 는 가려진다. **오버라이드.**", line: 6, path: ["dog"], badge: { at: "dog", text: 'speak → "멍" (Animal 것을 가림)', color: "fresh" } },
            { chapter: "p.intro()", say: "`p.intro()` — Puppy 에 없음, Dog 에 없음, Animal 에 있음. 실행.", line: 3, path: ["p", "pup", "dog", "an"], badge: { at: "an", text: "intro 는 여기", color: "fresh" } },
            { say: "intro 안의 `self.speak()` — self 는 p 이므로 **p 부터** 다시 찾는다 → Dog 의 `\"멍\"`. 부모의 메서드가 자식의 메서드를 부르는 셈. 이것이 다형성의 기초.", line: 3, path: ["p", "pup", "dog"], badge: { at: "dog", text: 'self.speak() → "멍"', color: "name" } },
            { chapter: "super()", say: "Puppy 의 `__init__` 은 age 를 추가하고 싶을 뿐, name 처리는 부모 것을 그대로 쓰고 싶다. **`super().__init__(name)`** — 부모의 `__init__` 을 호출한다. 안 하면 `self.name` 이 없다.", line: 10, path: ["pup", "dog", "an"], badge: { at: "an", text: "super().__init__ → name 세팅", color: "fresh" } },
            { chapter: "is-a", say: "상속은 **'~는 ~이다'** 관계다. Puppy 는 Dog 이고 Animal 이다. `isinstance(p, Animal)` → True. 반대로 '자동차는 엔진을 가진다' 는 상속이 아니라 **속성**(`self.engine = Engine()`).", lit: ["p", "pup", "dog", "an"] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`class Dog(Animal):\` — Dog 는 Animal 의 **자식 클래스**(subclass)다. 부모의 메서드와 클래스 속성을 전부 물려받고, 필요한 것만 다시 정의하거나(오버라이드) 추가한다.

- \`super()\` — 부모 클래스(정확히는 MRO 의 다음)를 가리키는 객체. \`super().__init__(...)\` 로 부모의 초기화를 재사용한다.
- \`isinstance(obj, Cls)\` — obj 가 Cls 또는 그 자손의 인스턴스인가.
- \`issubclass(A, B)\` — A 가 B 의 자손인가.

모든 클래스는 \`object\` 의 자손이다. \`class X:\` 는 \`class X(object):\` 와 같다.`,
    },
    {
      kind: "trace", traceId: "p7-inherit", title: "한 줄씩",
      caption: "p.intro() 가 Animal 의 intro 를 실행하면서 Dog 의 speak 를 쓰는 것. Puppy 의 super().__init__ 이 name 을 붙이는 것.",
    },
    {
      kind: "pitfall",
      title: "자식 __init__ 에서 super().__init__ 을 빼먹기",
      md: `자식이 \`__init__\` 을 정의하면 부모의 \`__init__\` 은 **자동으로 호출되지 않는다.** 부모가 세팅하던 속성이 없어서 나중에 \`AttributeError\`. 자식 \`__init__\` 의 첫 줄은 거의 항상 \`super().__init__(...)\`.`,
    },
    {
      kind: "callout", tone: "warn", title: "상속보다 구성 (composition)",
      md: `상속은 강한 결합이다. 부모를 바꾸면 모든 자식이 영향받고, 깊은 계층은 어느 메서드가 실제로 불리는지 추적하기 어렵다. "A 는 B 를 **가진다**"면 상속 대신 속성으로 담아라(\`self.engine = Engine()\`). 상속은 "A 는 B **이다**"가 정말로 성립하고, 부모 대신 자식을 넣어도 동작해야 할 때(리스코프 치환) 쓴다. 실무에서는 얕은 상속 1~2단계가 대부분이다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `class A:
    def f(self): return "A" + self.g()
    def g(self): return "a"
class B(A):
    def g(self): return "b"
print(B().f())`,
      choices: [
        { text: "`\"Aa\"`", why: "f 안의 self.g() 는 self(B 인스턴스)부터 찾는다. B 의 g 가 먼저." },
        { text: "`\"Ab\"`", correct: true, why: "f 는 A 에서 찾히지만, 그 안의 self.g() 는 B 인스턴스에서 시작하므로 B.g → \"b\"." },
        { text: "`\"b\"`", why: "f 는 \"A\" 를 앞에 붙인다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`class Child(Parent):` — 부모의 것을 전부 물려받고, 필요한 것만 **오버라이드**·추가.",
        "부모 메서드 안의 `self.x()` 도 **실제 인스턴스의 클래스**부터 찾는다.",
        "자식 `__init__` 첫 줄은 `super().__init__(...)`.",
        "상속은 **is-a**. has-a 는 속성(구성). 깊은 상속은 피한다.",
      ],
    },
  ],
};
