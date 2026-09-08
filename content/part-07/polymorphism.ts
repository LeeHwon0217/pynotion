import type { Lesson } from "@/lib/types";

export const polymorphism: Lesson = {
  part: 7,
  slug: "polymorphism",
  blocks: [
    {
      kind: "viz", component: "Story", title: "오리처럼 걸으면 오리 — 타입이 아니라 능력을 본다",
      props: {
        story: {
          code: ["def talk(thing):", "    return thing.speak()", "", "talk(Duck())", "talk(Robot())", "talk(Rock())"],
          steps: [
            { chapter: "talk()", say: "`talk` 는 인자의 **타입을 검사하지 않는다.** `thing.speak()` 가 되기만 하면 된다.", ops: [{ line: 0 }, { obj: "F", type: "function", value: "talk" }, { bind: "talk", to: "F" }] },
            { say: "`Duck` 인스턴스 — speak 가 있다. 통과.", ops: [{ line: 3 }, { obj: "D", type: "Duck", fields: [["speak", "→ \"꽥\""]] }, { bind: "thing", to: "D", frame: "talk()" }, { output: "꽥\n" }] },
            { say: "`Robot` — Duck 과 **아무 상속 관계도 없다.** 그래도 speak 가 있으니 통과. 같은 함수가 다른 타입에 대해 다르게 동작한다 — **다형성.**", ops: [{ line: 4 }, { obj: "R", type: "Robot", fields: [["speak", "→ \"삐빅\""]] }, { bind: "thing", to: "R", frame: "talk()" }, { output: "삐빅\n" }] },
            { say: "`Rock` — speak 가 없다. 그제야 `AttributeError`. 미리 검사하지 않고 **써 보고 안 되면 오류**. 이것이 **덕 타이핑**: \"오리처럼 걷고 꽥 하면 오리다.\"", ops: [{ line: 5 }, { obj: "K", type: "Rock", fields: [] }, { bind: "thing", to: "K", frame: "talk()" }, { badge: "K", text: "AttributeError: speak", color: "dead" }] },
            { chapter: "내장도 그렇다", say: "`len(x)` 는 x 가 문자열이든 리스트든 딕셔너리든 내 클래스든 `__len__` 만 있으면 된다. `for` 도 `__iter__` 만 본다. 파이썬 전체가 덕 타이핑 위에 있다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `**다형성**(polymorphism)은 "같은 호출이 대상에 따라 다르게 동작한다"는 뜻이다. \`thing.speak()\` 가 Duck 에겐 꽥, Robot 에겐 삐빅. 상속으로 만들 수도 있고(부모 메서드를 자식이 오버라이드), 파이썬에서는 **상속 없이도** 된다 — 같은 이름의 메서드만 있으면.

이것이 **덕 타이핑**(duck typing). "이 객체가 Duck 타입인가"를 묻지 않고 "speak 할 수 있는가"만 본다. 파이썬 코드가 \`isinstance\` 검사를 거의 안 하는 이유다.`,
    },
    {
      kind: "trace", traceId: "p7-poly", title: "한 줄씩",
      caption: "Duck 과 Robot 은 무관한 클래스지만 같은 talk() 로 처리된다. Rock 은 마지막에야 실패한다.",
    },
    {
      kind: "table",
      head: ["", "명목적 타이핑 (Java 등)", "덕 타이핑 (파이썬)"],
      rows: [
        ["무엇을 보나", "선언된 타입·인터페이스", "실제로 그 메서드가 **있는가**"],
        ["확인 시점", "컴파일 때", "**호출하는 순간**"],
        ["유연성", "인터페이스를 명시적으로 구현해야", "이름만 맞으면 됨 — 남의 클래스도"],
        ["단점", "장황함", "실수를 실행 전에 못 잡음 → 타입 힌트·Protocol 로 보완 (Part 9)"],
      ],
    },
    {
      kind: "code", title: "isinstance 대신 시도하기 (EAFP)",
      code: `# 덜 파이썬다움
def total(x):
    if isinstance(x, list): return sum(x)
    elif isinstance(x, dict): return sum(x.values())
    ...

# 파이썬다움 — '더할 수 있는 것들' 이면 된다
def total(items):
    return sum(items)              # 리스트, 튜플, 집합, 제너레이터, 딕셔너리 values … 전부

# 정말 구분이 필요하면 try
def read_all(src):
    try:
        return src.read()          # 파일처럼 read 가 있으면
    except AttributeError:
        return open(src).read()    # 아니면 경로로 취급`,
    },
    {
      kind: "pitfall",
      title: "isinstance 로 타입을 좁히면 확장이 막힌다",
      md: `\`if isinstance(shape, Circle): ... elif isinstance(shape, Square): ...\` 식의 코드는 새 도형을 추가할 때마다 이 함수를 고쳐야 한다. 대신 각 클래스에 \`area()\` 를 두고 \`shape.area()\` 로 부르면 새 클래스는 자기 \`area\` 만 구현하면 된다. **분기를 타입 검사가 아니라 메서드 호출로.**`,
    },
    {
      kind: "quiz",
      question: "덕 타이핑 관점에서 `for x in obj:` 가 동작하려면 obj 에 필요한 것은?",
      choices: [
        { text: "list 또는 tuple 을 상속", why: "상속은 필요 없다. 필요한 메서드만 있으면 된다." },
        { text: "`__iter__` 메서드 (또는 `__getitem__`)", correct: true, why: "for 는 iter(obj) 를 부르고, 그것은 __iter__ 를 찾는다. 타입은 무엇이든 상관없다. Part 8 에서 자세히." },
        { text: "`isinstance(obj, Iterable)` 이 True 여야", why: "그것도 사실 __iter__ 유무를 검사하는 것이다. 본질은 메서드." },
      ],
    },
    {
      kind: "summary",
      items: [
        "다형성 = 같은 호출, 대상에 따라 다른 동작. 파이썬에선 **같은 이름의 메서드**만 있으면 된다.",
        "덕 타이핑: 타입이 아니라 **능력**(메서드 유무)을 본다. 확인은 호출 시점에.",
        "`isinstance` 분기 대신 **각 클래스의 메서드**로. 새 타입 추가가 쉬워진다.",
        "`len`, `for`, `+` 전부 덕 타이핑 — 매직 메서드만 있으면 (곧 배운다).",
      ],
    },
  ],
};
