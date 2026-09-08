import type { Lesson } from "@/lib/types";

export const propertyLesson: Lesson = {
  part: 7,
  slug: "property",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "t.celsius 는 속성처럼 보이지만 메서드가 실행된다",
      props: {
        stack: {
          code: ["class Temp:", "    @property", "    def celsius(self):", "        return self._c", "    @celsius.setter", "    def celsius(self, v):", "        if v < -273.15: raise ValueError", "        self._c = v", "", "t.celsius", "t.celsius = 30", "t.celsius = -300"],
          steps: [
            { chapter: "읽기", say: "`t.celsius` — 괄호가 없다. 속성 읽기처럼 보인다. 하지만 `@property` 가 붙은 메서드라서 파이썬이 **대신 호출**한다.", ops: [{ line: 9 }, { push: "celsius(self) — getter", locals: { self: "<Temp _c=25>" } }, { line: 3 }] },
            { say: "", dur: 1500, ops: [{ pop: true, ret: "25" }] },
            { chapter: "쓰기", say: "`t.celsius = 30` — 대입처럼 보이지만 `@celsius.setter` 메서드가 호출된다. 값이 `v` 로 들어온다.", ops: [{ line: 10 }, { push: "celsius(self, v) — setter", locals: { self: "<Temp _c=25>", v: "30" } }, { line: 6 }] },
            { say: "검증 통과. `self._c = 30`. 실제 저장은 `_c` 에.", ops: [{ line: 7 }, { set: { self: "<Temp _c=30>" } }, { pop: true, ret: "None" }] },
            { chapter: "검증", say: "`t.celsius = -300` — setter 가 검사한다. 절대영도 이하 → **`ValueError`.** 잘못된 값이 객체에 들어가는 것을 원천 차단.", ops: [{ line: 11 }, { push: "celsius(self, v) — setter", locals: { self: "<Temp _c=30>", v: "-300" } }, { line: 6 }, { raise: "ValueError" }] },
            { say: "", dur: 1400, ops: [{ pop: true }, { uncaught: true }] },
            { chapter: "왜 쓰나", say: "처음엔 `t.celsius` 가 평범한 속성이었다가, 나중에 검증이 필요해져 property 로 바꿔도 **사용하는 코드는 한 줄도 안 바뀐다.** 자바의 getter/setter 를 처음부터 쓸 필요가 없는 이유.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`@property\` 는 메서드를 **속성처럼** 읽고 쓰게 만든다. 호출하는 쪽은 \`t.celsius\` 라고 쓰지만 실제로는 메서드가 돈다.

- \`@property\` 붙은 메서드 → **읽을 때** 호출 (getter)
- \`@이름.setter\` 붙은 메서드 → **대입할 때** 호출 (setter)
- setter 가 없으면 **읽기 전용** — 대입하면 \`AttributeError\`

쓰는 이유: 검증(잘못된 값 거부), 계산 속성(저장하지 않고 그때그때 계산), 그리고 **인터페이스를 바꾸지 않고** 내부 구현을 바꾸기.`,
    },
    {
      kind: "trace", traceId: "p7-property", title: "한 줄씩 — getter, setter, 계산 속성, 검증 실패",
      caption: "t.celsius 와 t.fahrenheit 는 괄호 없이 읽히고, t.celsius = -300 은 ValueError.",
    },
    {
      kind: "code", title: "세 가지 용도",
      code: `class Circle:
    def __init__(self, r):
        self.r = r                    # 평범한 속성

    @property
    def area(self):                   # ① 계산 속성 — 저장하지 않는다
        return 3.14159 * self.r ** 2  #    r 이 바뀌면 자동으로 따라온다

    @property
    def r(self):
        return self._r
    @r.setter
    def r(self, value):               # ② 검증
        if value <= 0:
            raise ValueError("반지름은 양수")
        self._r = value

class User:
    def __init__(self, first, last):
        self.first, self.last = first, last
    @property
    def full_name(self):              # ③ 읽기 전용 — setter 없음
        return f"{self.first} {self.last}"`,
    },
    {
      kind: "pitfall",
      title: "property 안에서 self.같은이름 을 읽기",
      md: `\`@property def x(self): return self.x\` — \`self.x\` 가 다시 property 를 호출해 **무한 재귀** → \`RecursionError\`. 실제 값은 반드시 다른 이름(\`self._x\`)에 저장한다.`,
    },
    {
      kind: "callout", tone: "deep", title: "property 는 디스크립터다",
      md: `\`@property\` 가 어떻게 "속성 읽기를 가로채는지"는 **디스크립터 프로토콜**(\`__get__\`/\`__set__\`)로 설명된다. 클래스 속성에 디스크립터 객체가 있으면 인스턴스의 \`__dict__\` 보다 먼저 확인된다 — 「속성 조회 순서」에서 미뤄 둔 예외가 이것이다. Part 9 에서 직접 만들어 본다.`,
    },
    {
      kind: "quiz",
      question: "`@property` 만 있고 setter 가 없는 `full_name` 에 `u.full_name = \"x\"` 를 하면?",
      choices: [
        { text: "인스턴스 `__dict__` 에 full_name 이 생긴다", why: "property 는 데이터 디스크립터라 인스턴스 대입을 가로챈다. setter 가 없으면 거부." },
        { text: "`AttributeError: can't set attribute`", correct: true, why: "setter 가 정의되지 않은 property 는 읽기 전용이다." },
        { text: "getter 가 호출된다", why: "대입은 getter 와 무관하다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`@property` = 읽기를 메서드로, `@x.setter` = 쓰기를 메서드로. 호출자는 그냥 속성처럼 쓴다.",
        "용도: **검증, 계산 속성, 읽기 전용**, 그리고 인터페이스 유지하며 구현 바꾸기.",
        "실제 값은 `self._x` 에. 같은 이름을 읽으면 무한 재귀.",
        "처음부터 getter/setter 를 만들지 않는다. 필요해지면 property 로.",
      ],
    },
  ],
};
