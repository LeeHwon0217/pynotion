import type { Lesson } from "@/lib/types";

export const attributeLookup: Lesson = {
  part: 7,
  slug: "attribute-lookup",
  blocks: [
    {
      kind: "viz", component: "Tree", title: "d.sound 를 찾는 길 — 인스턴스 → 클래스 → 부모",
      props: {
        tree: {
          layout: "bottom-up",
          code: ["class Animal:", '    sound = "..."', "    def speak(self):", "        return self.sound", "", "class Dog(Animal):", '    sound = "멍"', "", "d = Dog()", "d.sound", "d.speak()", 'd.sound = "왈"'],
          nodes: [
            { id: "obj", label: "object", sub: "모든 클래스의 뿌리" },
            { id: "an", label: "Animal", parent: "obj", sub: "sound, speak" },
            { id: "dog", label: "Dog", parent: "an", sub: "sound" },
            { id: "d", label: "d (인스턴스)", parent: "dog", sub: "__dict__ = {}" },
          ],
          steps: [
            { chapter: "구조", say: "인스턴스 `d` 위에 클래스 `Dog`, 그 위에 부모 `Animal`, 맨 위에 `object`. 속성 찾기는 이 **사슬을 아래에서 위로** 올라간다.", line: 8, lit: ["d"] },
            { chapter: "d.sound", say: "`d.sound` — 먼저 `d.__dict__`. 비어 있다. 다음 `Dog.__dict__` — `sound = \"멍\"` **있다.** 여기서 멈춘다.", line: 9, path: ["d", "dog"], badge: { at: "dog", text: '"멍" — Dog 에서 찾음', color: "fresh" } },
            { chapter: "d.speak()", say: "`d.speak` — d 에 없음, Dog 에도 없음, **Animal** 에 있다. 함수를 찾았으니 `self=d` 로 묶어 호출.", line: 10, path: ["d", "dog", "an"], badge: { at: "an", text: "speak — Animal 에서 찾음", color: "fresh" } },
            { say: "그 안의 `self.sound` — 다시 **d 부터** 찾기 시작한다. Animal 의 `\"...\"` 가 아니라 Dog 의 `\"멍\"`. 메서드가 어디 정의됐든 self 는 실제 인스턴스다.", line: 3, path: ["d", "dog"], badge: { at: "dog", text: 'self.sound → "멍"', color: "name" } },
            { chapter: "인스턴스에 대입", say: "`d.sound = \"왈\"` — 대입은 **d 의 `__dict__`** 에. 이제 `d.sound` 는 첫 단계에서 바로 찾힌다. `Dog.sound` 는 여전히 `\"멍\"`.", line: 11, path: ["d"], badge: { at: "d", text: '__dict__ = {"sound": "왈"}', color: "warn" } },
            { chapter: "MRO", say: "이 사슬의 순서를 **MRO**(Method Resolution Order) 라 하고 `Dog.__mro__` 로 볼 수 있다. 다중 상속에서 순서가 복잡해지는데, 그건 「super()와 MRO」에서.", lit: ["d", "dog", "an", "obj"] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`obj.attr\` 을 읽을 때 파이썬은 정해진 순서로 찾는다.

1. \`obj.__dict__\` (인스턴스 자신)
2. \`type(obj).__dict__\` (클래스)
3. 부모 클래스들의 \`__dict__\`, MRO 순서대로
4. 끝까지 없으면 \`AttributeError\`

**처음 찾은 곳에서 멈춘다.** 그래서 자식 클래스가 같은 이름을 정의하면 부모 것을 가리고(오버라이드), 인스턴스에 붙이면 클래스 것을 가린다. Part 4 의 LEGB 와 똑같은 구조 — 가까운 곳부터.

(엄밀히는 데이터 디스크립터가 먼저 확인되는 등 예외가 있다 — Part 9 「디스크립터」.)`,
    },
    {
      kind: "trace", traceId: "p7-lookup", title: "한 줄씩",
      caption: "d.speak() 안에서 self.sound 가 Dog 의 것을 찾는 것, 그리고 Dog.__mro__ 가 찾는 순서표인 것.",
    },
    {
      kind: "callout", tone: "deep", title: "메서드도 그냥 속성이다",
      md: `\`d.speak\` 는 "Dog 의 메서드 목록에서 찾는" 특별한 동작이 아니다. \`sound\` 를 찾는 것과 **같은 규칙**으로 \`speak\` 라는 이름을 찾고, 찾은 것이 함수라서 \`self\` 를 묶어 주는 것뿐이다. 그래서 인스턴스에 \`d.speak = lambda: "야옹"\` 이라고 붙이면 그게 먼저 찾힌다 — 메서드를 인스턴스별로 바꿔치기할 수 있다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `class A:
    x = "A"
class B(A):
    pass
b = B()
B.x = "B"
print(b.x)`,
      choices: [
        { text: "`\"A\"`", why: "b.x 는 b → B → A 순으로 찾는다. B.x = \"B\" 로 B 에 x 가 생겼으니 거기서 멈춘다." },
        { text: "`\"B\"`", correct: true, why: "b.__dict__ 에 없음 → B.__dict__ 에 x = \"B\" 있음. A 까지 가지 않는다. 클래스 속성은 나중에 붙여도 즉시 반영된다." },
        { text: "`AttributeError`", why: "사슬 어딘가에 x 가 있으므로 찾힌다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`obj.attr` 찾기: **인스턴스 `__dict__` → 클래스 → 부모들(MRO 순)**. 처음 찾은 곳에서 멈춤.",
        "자식이 부모 것을 가리고, 인스턴스가 클래스 것을 가린다.",
        "메서드 안의 `self.x` 도 **실제 인스턴스부터** 다시 찾는다.",
        "메서드도 속성이다. 같은 규칙.",
      ],
    },
  ],
};
