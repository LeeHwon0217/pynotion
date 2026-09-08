import type { Lesson } from "@/lib/types";

export const selfLesson: Lesson = {
  part: 7,
  slug: "self",
  blocks: [
    {
      kind: "viz", component: "Story", title: "g.hello(\"지기\") 는 Greeter.hello(g, \"지기\") 다",
      props: {
        story: {
          code: ["class Greeter:", "    def hello(self, name):", '        return f"{self.prefix} {name}"', "", "g = Greeter()", 'g.hello("지기")', "f = g.hello"],
          steps: [
            { chapter: "함수", say: "클래스 안의 `def hello` 는 그냥 **함수 객체**다. `Greeter.__dict__[\"hello\"]` 에 저장된다. 매개변수가 둘: `self`, `name`.", ops: [{ line: 1 }, { obj: "K", type: "class Greeter", fields: [["hello", "<function>"]] }, { obj: "F", type: "function", value: "hello(self, name)" }, { bind: "Greeter", to: "K" }] },
            { chapter: "인스턴스에서 꺼내면", say: "`g.hello` — 속성 찾기로 Greeter 의 함수를 찾는다. 그런데 **인스턴스를 통해** 꺼냈으므로 파이썬은 함수를 그대로 주지 않고, `g` 를 첫 인자로 **미리 묶은** 새 객체를 만든다 — **바운드 메서드.**", ops: [{ line: 5 }, { obj: "G", type: "Greeter", fields: [["prefix", '"안녕,"']] }, { bind: "g", to: "G" }, { obj: "BM", type: "bound method", fields: [["__func__", "hello"], ["__self__", "g"]], note: "g.hello" }] },
            { say: "`g.hello(\"지기\")` — 바운드 메서드를 호출하면 묶인 `g` 가 `self` 자리에, `\"지기\"` 가 `name` 에. 결국 `Greeter.hello(g, \"지기\")`.", ops: [{ badge: "BM", text: 'hello(g, "지기") 로 호출됨', color: "fresh" }, { output: "안녕, 지기\n" }] },
            { chapter: "f = g.hello", say: "바운드 메서드는 값이다. `f` 에 붙여 두면 나중에 `f(\"영희\")` 로 불러도 `self` 는 여전히 `g`. 콜백으로 넘길 때 이 성질을 쓴다.", ops: [{ line: 6 }, { unbadge: "BM" }, { bind: "f", to: "BM" }] },
            { chapter: "왜 self 를 쓰나", say: "다른 언어의 `this` 는 숨겨져 있다. 파이썬은 **명시적으로 첫 매개변수**로 받게 해서 '메서드는 첫 인자로 인스턴스를 받는 함수' 라는 사실을 감추지 않는다. 이름 `self` 는 관례일 뿐 — 하지만 바꾸지 않는다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`self\` 에 마법은 없다. 규칙은 하나:

**인스턴스를 통해 함수를 꺼내면, 파이썬이 그 인스턴스를 첫 인자로 묶어 준다.**

\`g.hello("지기")\` → \`Greeter.hello(g, "지기")\`. 그래서 메서드의 첫 매개변수 \`self\` 가 필요하고, \`self\` 가 곧 "지금 이 메서드가 불린 인스턴스"다. 메서드 안에서 \`self.x\` 로 그 인스턴스의 속성을 읽고 쓴다.`,
    },
    {
      kind: "trace", traceId: "p7-self", title: "한 줄씩 — 바운드 메서드",
      caption: "Greeter.hello 는 function, g.hello 는 bound method. f = g.hello 로 저장해 두고 나중에 불러도 self 는 g.",
    },
    {
      kind: "table",
      head: ["표현", "타입", "self 는?"],
      rows: [
        ["`Greeter.hello`", "function", "직접 넘겨야 함: `Greeter.hello(g, \"x\")`"],
        ["`g.hello`", "bound method", "`g` 가 묶여 있음: `g.hello(\"x\")`"],
        ["`g.hello.__self__`", "Greeter 인스턴스", "묶인 그 객체 `g`"],
        ["`g.hello.__func__`", "function", "원래 함수 `Greeter.hello`"],
      ],
    },
    {
      kind: "pitfall",
      title: "self 를 안 쓰고 인스턴스 변수를 읽으려 하기",
      md: `\`def show(self): print(name)\` — \`name\` 은 지역/전역에서 찾는다(LEGB). 인스턴스 속성은 \`self.name\` 으로만 닿는다. \`NameError: name 'name' is not defined\` 가 나면 십중팔구 \`self.\` 를 빠뜨린 것.`,
    },
    {
      kind: "quiz",
      question: "`class C: def m(self, x): return x * 2` 에서 `C.m(5)` 를 부르면?",
      choices: [
        { text: "`10`", why: "클래스에서 꺼낸 m 은 그냥 함수다. self 가 자동으로 채워지지 않아 5 가 self 로 가고 x 가 없다." },
        { text: "`TypeError` — 인자가 하나 부족", correct: true, why: "C.m 은 바운드가 아니므로 self 와 x 둘 다 넘겨야 한다. C.m(C(), 5) 또는 C().m(5)." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`obj.method(args)` = `Class.method(obj, args)`. 인스턴스를 통해 꺼내면 첫 인자가 **묶인다**(바운드 메서드).",
        "`self` = 그 인스턴스. 인스턴스 속성은 `self.x` 로만.",
        "`obj.method` 는 값이라 저장하고 넘길 수 있다. `self` 는 유지된다.",
      ],
    },
  ],
};
