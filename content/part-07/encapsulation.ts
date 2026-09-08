import type { Lesson } from "@/lib/types";

export const encapsulation: Lesson = {
  part: 7,
  slug: "encapsulation",
  blocks: [
    {
      kind: "viz", component: "Story", title: "밑줄 하나는 약속, 밑줄 둘은 이름 바꾸기",
      props: {
        story: {
          code: ["class Account:", "    def __init__(self, bal):", "        self._balance = bal", '        self.__pin = "0000"', "", "a = Account(100)", "a._balance", "a.__pin", "a._Account__pin"],
          steps: [
            { chapter: "_balance", say: "`self._balance` — 밑줄 하나. 파이썬은 **아무것도 막지 않는다.** '이건 내부용이니 밖에서 건드리지 마세요' 라는 **약속**일 뿐. 편집기 자동완성에서 숨겨지는 정도.", ops: [{ line: 2 }, { obj: "A", type: "Account", fields: [["_balance", "100"]] }, { bind: "a", to: "A" }] },
            { chapter: "__pin", say: "`self.__pin` — 밑줄 둘. 클래스 블록 안에서 파이썬이 이름을 **`_Account__pin`** 으로 바꿔 저장한다. **네임 맹글링.**", ops: [{ line: 3 }, { mutate: "A", fields: [["_balance", "100"], ["_Account__pin", '"0000"']] }, { badge: "A", text: "__pin → _Account__pin 으로 저장됨", color: "warn" }] },
            { chapter: "밖에서", say: "`a._balance` — 그냥 읽힌다. `a.__pin` — **없다.** `AttributeError`. 원래 이름으로는 못 찾는다.", ops: [{ line: 6 }, { unbadge: "A" }, { line: 7 }, { badge: "A", text: "a.__pin → AttributeError", color: "dead" }] },
            { say: "`a._Account__pin` — 바뀐 이름으로는 접근된다. 즉 **진짜 비공개는 아니다.** 목적은 보안이 아니라 **자식 클래스와의 이름 충돌 방지**다.", ops: [{ line: 8 }, { unbadge: "A" }, { badge: "A", text: '"0000" — 우회 가능', color: "name" }] },
            { chapter: "파이썬의 태도", say: "\"우리는 모두 책임감 있는 어른이다\" — 파이썬은 접근 제어를 문법으로 강제하지 않는다. `_` 로 의도를 표시하고, 밖에서 만지는 사람이 책임진다. 실무에서는 `_` 하나면 충분하고 `__` 는 거의 안 쓴다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `**캡슐화**는 객체의 내부 상태를 밖에서 함부로 만지지 못하게 하고, 메서드를 통해서만 다루게 하는 것이다. 파이썬에는 \`private\` 키워드가 없다. 대신 **이름 규칙**을 쓴다.

- \`name\` — 공개. 밖에서 써도 됨.
- \`_name\` — **내부용 약속.** 밖에서 쓸 수 있지만 쓰지 말라는 신호. \`from m import *\` 에서도 제외된다.
- \`__name\` — **네임 맹글링.** 클래스 안에서 \`_클래스명__name\` 으로 바뀐다. 자식 클래스가 같은 이름을 써도 충돌하지 않게 하려는 것. 비공개 목적으로는 잘 쓰지 않는다.
- \`__name__\` — 앞뒤 둘 다. 파이썬이 예약한 특수 이름(매직 메서드). 내가 만들지 않는다.`,
    },
    {
      kind: "trace", traceId: "p7-encap", title: "한 줄씩 — __dict__ 에 바뀐 이름이 보인다",
      caption: "a.__dict__ 출력에서 _Account__pin 을 확인하라. 마지막 줄은 일부러 AttributeError.",
    },
    {
      kind: "code", title: "캡슐화의 실제 — 메서드로 규칙을 지킨다",
      code: `class Account:
    def __init__(self, balance):
        self._balance = balance          # 직접 만지지 말고

    def withdraw(self, amount):          # 메서드를 통해서만
        if amount > self._balance:
            raise ValueError("잔액 부족")
        self._balance -= amount

    @property                            # 읽기는 허용하되 (다음 레슨)
    def balance(self):
        return self._balance

a = Account(100)
a.withdraw(30)        # 규칙(잔액 검사)이 반드시 거쳐진다
a.balance             # 70 — 읽기만
a._balance = -999     # 막지는 않는다. 하지만 밑줄이 '하지 말라' 고 말하고 있다`,
    },
    {
      kind: "pitfall",
      title: "__ 를 '비공개' 라고 믿고 남발하기",
      md: `\`self.__x\` 를 쓰면 자식 클래스에서 \`self.__x\` 로 접근했을 때 \`_Child__x\` 를 찾아 **부모 것과 다른 속성**이 되어 버린다. 테스트에서도 \`obj._Cls__x\` 로 써야 해서 번거롭다. 대부분의 파이썬 코드는 \`_x\` 하나로 끝낸다. \`__x\` 는 "자식이 실수로 덮어쓰면 안 되는 부모 내부 속성"에만.`,
    },
    {
      kind: "quiz",
      question: "`class A: def __init__(self): self.__v = 1` 에서 `A().__dict__` 의 키는?",
      choices: [
        { text: "`'__v'`", why: "클래스 블록 안의 __v 는 맹글링된다." },
        { text: "`'_A__v'`", correct: true, why: "밑줄 둘로 시작하고 둘로 끝나지 않는 이름은 _클래스명 이 앞에 붙는다." },
        { text: "`'v'`", why: "밑줄은 사라지지 않는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "파이썬에 `private` 은 없다. `_x` 는 **약속**, `__x` 는 **이름 바꾸기**(`_Cls__x`).",
        "`__x` 의 목적은 자식과의 충돌 방지. 보안이 아니다.",
        "캡슐화는 **메서드를 통해 규칙을 지키게** 하는 것. 실무에선 `_x` + 메서드/property.",
      ],
    },
  ],
};
