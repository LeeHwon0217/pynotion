import type { Lesson } from "@/lib/types";

export const classInit: Lesson = {
  part: 7,
  slug: "class-init",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "Dog(\"초코\", 3) 이 실행되는 순간",
      props: {
        stack: {
          code: ["class Dog:", "    def __init__(self, name, age):", "        self.name = name", "        self.age = age", "", 'd1 = Dog("초코", 3)', 'd2 = Dog("보리", 5)'],
          steps: [
            { chapter: "class 문", say: "`class Dog:` 블록이 실행되면 **클래스 객체** `Dog` 가 만들어진다. `__init__` 은 아직 호출되지 않는다 — 함수 객체로 클래스 안에 저장될 뿐.", ops: [{ line: 0 }] },
            { chapter: "Dog(...)", say: "`Dog(\"초코\", 3)` — 클래스를 **호출**한다. ① 빈 인스턴스가 만들어지고 ② 그 인스턴스를 `self` 로, 나머지 인자를 뒤에 붙여 `__init__` 이 **자동 호출**된다.", ops: [{ line: 5 }, { push: "Dog.__init__(self, …)", locals: { self: "<Dog 빈 인스턴스>", name: '"초코"', age: "3" } }] },
            { say: "`self.name = name` — 인스턴스에 속성을 **붙인다.** 인스턴스는 자기만의 `__dict__` 를 갖고, 여기에 `{\"name\": \"초코\"}` 가 들어간다.", ops: [{ line: 2 }, { set: { self: "<Dog name=초코>" } }] },
            { say: "", dur: 1400, ops: [{ line: 3 }, { set: { self: "<Dog name=초코 age=3>" } }] },
            { say: "`__init__` 은 아무것도 돌려주지 않는다(None). 대신 `Dog(...)` 식 전체의 값이 **완성된 인스턴스**이고, 그것에 `d1` 이 붙는다.", ops: [{ pop: true, ret: "None" }, { note: "d1 = 완성된 인스턴스" }] },
            { chapter: "두 번째", say: "`Dog(\"보리\", 5)` — **완전히 새 인스턴스**, 새 `__dict__`. d1 과는 무관하다. 클래스는 하나, 인스턴스는 얼마든지.", ops: [{ line: 6 }, { push: "Dog.__init__(self, …)", locals: { self: "<Dog 빈 인스턴스>", name: '"보리"', age: "5" } }] },
            { say: "", dur: 1600, ops: [{ line: 3 }, { set: { self: "<Dog name=보리 age=5>" } }, { pop: true, ret: "None" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`\`\`
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
\`\`\`

- \`class Dog:\` — 클래스 객체를 만든다. 관례상 이름은 대문자로 시작.
- \`__init__\` — **초기화 메서드.** \`Dog(...)\` 로 인스턴스를 만들면 자동으로 호출된다. 이름 앞뒤의 밑줄 두 개는 "파이썬이 특별히 취급하는 메서드"라는 표시(Part 7 후반 매직 메서드).
- \`self\` — 만들어지는 **그 인스턴스.** 파이썬이 자동으로 첫 인자로 넘긴다. \`self.name = name\` 은 인스턴스에 속성을 붙이는 것.

인스턴스의 속성은 \`인스턴스.__dict__\` 라는 딕셔너리에 산다. \`d1.name\` 은 사실상 \`d1.__dict__["name"]\`.`,
    },
    {
      kind: "trace", traceId: "p7-class-init", title: "한 줄씩 — 인스턴스의 __dict__",
      caption: "Dog(...) 호출에서 __init__ 프레임이 생기고 self 가 새 인스턴스에 붙는 것. 마지막의 d1.__dict__ 출력을 보라.",
    },
    {
      kind: "code", title: "메서드 추가",
      code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):                    # 메서드 — 첫 인자는 항상 self
        return f"{self.name}: 멍!"

    def birthday(self):
        self.age += 1                  # 인스턴스의 상태를 바꾼다
        return self.age

d = Dog("초코", 3)
d.bark()          # 'Dog.bark(d)' 와 같다 — self 에 d 가 들어간다
d.birthday()      # d.age 는 4`,
    },
    {
      kind: "pitfall",
      title: "self 를 빼먹기",
      md: `\`def bark():\` 라고 쓰고 \`d.bark()\` 를 부르면 \`TypeError: bark() takes 0 positional arguments but 1 was given\`. 파이썬이 \`d\` 를 첫 인자로 넣는데 받을 자리가 없어서다. 메서드의 첫 매개변수는 **언제나** \`self\` (이름은 관례지만 바꾸지 않는다). 다음 레슨들에서 왜 그런지 본다.`,
    },
    {
      kind: "quiz",
      question: "`class P: pass` 뒤에 `a = P(); b = P()` 를 하면 `a is b` 는?",
      choices: [
        { text: "`True`", why: "클래스를 호출할 때마다 새 인스턴스가 만들어진다." },
        { text: "`False`", correct: true, why: "P() 는 매번 새 객체를 만든다. __init__ 이 없어도 마찬가지 (object 의 기본 __init__ 이 쓰인다)." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`class X:` 는 클래스 객체를 만든다. `X(...)` 는 **새 인스턴스**를 만들고 `__init__` 을 자동 호출.",
        "`self` = 그 인스턴스. `self.x = v` 는 인스턴스의 `__dict__` 에 속성을 붙이는 것.",
        "메서드의 첫 매개변수는 항상 `self`. `d.bark()` 는 `Dog.bark(d)`.",
        "인스턴스마다 `__dict__` 가 따로 있다.",
      ],
    },
  ],
};
