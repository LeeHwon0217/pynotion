import type { Lesson } from "@/lib/types";

export const callStack: Lesson = {
  part: 4,
  slug: "call-stack",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "호출할 때 쌓이고, 돌아올 때 사라진다",
      props: {
        stack: {
          code: ["def area(w, h):", "    result = w * h", "    return result", "", "a = area(3, 4)", "b = area(a, 2)", "print(a, b)"],
          steps: [
            { chapter: "def", say: "`def` 는 함수를 **실행하지 않는다.** 함수 객체를 만들어 `area` 라는 이름에 붙일 뿐. 본문은 나중에 호출될 때 돈다.", ops: [{ line: 0 }] },
            { chapter: "첫 호출", say: "`area(3, 4)` — 호출하는 순간 **프레임**이 하나 쌓인다. 프레임은 이 호출만의 작업 공간. 인자 3, 4 가 `w`, `h` 라는 이름에 붙는다.", ops: [{ line: 4 }, { push: "area(3, 4)", locals: { w: "3", h: "4" } }] },
            { say: "본문 실행. `result = w * h` — 이 `result` 는 **프레임 안의** 지역 이름이다. 바깥에서는 보이지 않는다.", ops: [{ line: 1 }, { set: { result: "12" } }] },
            { say: "`return result` — 값 12 를 호출한 곳으로 돌려보내고, **프레임은 통째로 사라진다.** w, h, result 도 함께.", ops: [{ line: 2 }, { pop: true, ret: "12" }] },
            { say: "돌아온 12 가 `a` 에 붙는다. 스택은 다시 비었다.", ops: [{ line: 4 }, { note: "a = 12" }] },
            { chapter: "두 번째 호출", say: "`area(a, 2)` — **완전히 새 프레임.** 아까의 result 는 없다. 함수는 호출될 때마다 백지에서 시작한다.", ops: [{ line: 5 }, { push: "area(12, 2)", locals: { w: "12", h: "2" } }] },
            { say: "", dur: 1500, ops: [{ line: 1 }, { set: { result: "24" } }] },
            { say: "", dur: 1800, ops: [{ line: 2 }, { pop: true, ret: "24" }] },
            { chapter: "정리", say: "**호출 = 프레임 쌓기, 반환 = 프레임 없애기.** 프레임이 쌓이는 곳이 **콜스택**이다. 오류 메시지의 Traceback 이 바로 이 스택을 위에서부터 출력한 것.", ops: [{ line: 6 }, { output: "12 24\n" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `함수는 세 단계로 이해하면 된다.

1. **정의** — \`def\` 는 함수 객체를 만들어 이름에 붙인다. 본문은 실행되지 않는다.
2. **호출** — \`area(3, 4)\`. 새 **프레임**(작업 공간)이 콜스택에 쌓이고, 인자가 매개변수 이름에 붙고, 본문이 실행된다.
3. **반환** — \`return\` 을 만나면 값을 호출한 곳으로 돌려주고 프레임이 사라진다. 프레임 안의 이름들도 전부 사라진다.

함수 안에서 만든 이름(지역 변수)이 밖에서 안 보이는 이유, 같은 함수를 두 번 불러도 서로 섞이지 않는 이유가 전부 "프레임은 호출마다 새로 만들어지고 반환하면 사라진다"에서 나온다.`,
    },
    {
      kind: "trace", traceId: "p4-call", title: "한 줄씩 — 오른쪽 이름 패널이 프레임별로 나뉜다",
      caption: "호출 순간 area() 프레임이 생기며 w, h 가 붙고, return 에서 프레임이 통째로 사라진다. 콜스택 트레이도 함께 보라.",
    },
    {
      kind: "callout", tone: "deep", title: "Traceback 은 콜스택의 사진이다",
      md: `Part 0 에서 본 오류 메시지의 \`File "app.py", line 8, in <module>\` → \`line 4, in calc\` 는 오류가 난 순간 콜스택에 쌓여 있던 프레임을 아래(모듈)에서 위(오류 지점)로 나열한 것이다. "most recent call last" — 가장 최근 호출이 맨 아래. 재귀가 너무 깊어지면 \`RecursionError: maximum recursion depth exceeded\` 가 나는 것도 이 스택에 상한(기본 1000)이 있어서다.`,
    },
    {
      kind: "pitfall",
      title: "함수 안의 변수를 밖에서 쓰려 하기",
      md: `\`def f(): x = 1\` 을 호출한 뒤 \`print(x)\` 는 \`NameError\`. \`x\` 는 f 의 프레임에 있었고, 프레임은 반환과 함께 사라졌다. 값을 밖으로 내보내는 정식 통로는 **\`return\`** 뿐이다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `def f():
    n = 10
    return n
f()
print(n)`,
      choices: [
        { text: "`10`", why: "n 은 f 의 프레임 안에만 있다. 반환하면서 프레임이 사라졌다." },
        { text: "`NameError`", correct: true, why: "f() 의 반환값 10 은 아무 이름에도 붙이지 않아 버려졌고, 지역 n 은 프레임과 함께 사라졌다. 전역에는 n 이 없다." },
        { text: "`None`", why: "n 이 정의되지 않은 것이지 None 인 것이 아니다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`def` 는 정의만. 본문은 **호출될 때** 실행된다.",
        "호출 = **프레임**을 스택에 쌓고 인자를 매개변수에 붙임. 반환 = 값을 돌려주고 프레임 **삭제.**",
        "프레임은 호출마다 새로 만들어진다 — 지역 변수는 호출 사이에 남지 않는다.",
        "값을 밖으로 내보내는 통로는 `return`.",
      ],
    },
  ],
};
