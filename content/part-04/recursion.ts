import type { Lesson } from "@/lib/types";

export const recursion: Lesson = {
  part: 4,
  slug: "recursion",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "쌓였다가, 하나씩 풀린다",
      props: {
        stack: {
          tree: true,
          code: ["def fact(n):", "    if n <= 1:", "        return 1", "    return n * fact(n - 1)", "", "print(fact(4))"],
          steps: [
            { chapter: "fact(4)", say: "`fact(4)` 호출. n 은 4. 1 이 아니니 `4 * fact(3)` 을 계산해야 하는데 — `fact(3)` 의 값을 **아직 모른다.** 곱셈을 **보류**하고 fact(3) 을 부른다.", ops: [{ line: 5 }, { push: "fact(4)", locals: { n: "4" } }, { line: 3 }] },
            { chapter: "내려가기", say: "`fact(3)` — 새 프레임. 역시 `3 * fact(2)` 를 보류하고 fact(2) 를 부른다. 프레임이 **쌓인다.**", ops: [{ push: "fact(3)", locals: { n: "3" } }, { line: 3 }] },
            { say: "`fact(2)` — `2 * fact(1)` 보류.", ops: [{ push: "fact(2)", locals: { n: "2" } }, { line: 3 }] },
            { say: "`fact(1)` — n 이 1. **기저 조건.** 더 부르지 않고 1 을 돌려준다. 여기서 멈추지 않으면 무한히 쌓인다.", ops: [{ push: "fact(1)", locals: { n: "1" } }, { line: 2 }] },
            { chapter: "올라오기", say: "1 이 fact(2) 로 돌아온다. 보류했던 `2 * 1` 을 이제 계산 → 2. fact(2) 프레임이 사라진다.", ops: [{ pop: true, ret: "1" }, { line: 3 }] },
            { say: "2 가 fact(3) 으로. `3 * 2` = 6.", ops: [{ pop: true, ret: "2" }] },
            { say: "6 이 fact(4) 로. `4 * 6` = 24.", ops: [{ pop: true, ret: "6" }] },
            { say: "24 가 print 로. 스택이 비었다.", ops: [{ pop: true, ret: "24" }, { line: 5 }, { output: "24\n" }] },
            { chapter: "정리", say: "재귀는 **같은 함수의 프레임이 겹겹이 쌓이는 것**이다. 내려갈 때 문제가 작아지고, 기저 조건에서 멈추고, 올라오면서 답이 조립된다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `재귀 함수는 자기 자신을 부르는 함수다. 신비로울 게 없다 — 콜스택 관점에서 보면 **같은 함수의 프레임이 여러 개 쌓이는 것**뿐이다. 각 프레임은 자기만의 \`n\` 을 갖는다.

재귀 함수에 반드시 있어야 하는 두 부분:

1. **기저 조건**(base case) — 더 이상 자신을 부르지 않는 경우. 없으면 무한히 쌓여 \`RecursionError\`.
2. **재귀 단계** — 문제를 조금 더 작게 만들어 자신을 부르는 경우. 매 호출마다 기저 조건에 **가까워져야** 한다.`,
    },
    {
      kind: "trace", traceId: "p4-recursion", title: "한 줄씩 — 프레임이 4개까지 쌓인다",
      caption: "콜스택 트레이에 fact 프레임이 쌓였다가 풀리는 것, 그리고 각 프레임의 n 이 다른 것을 보라.",
    },
    {
      kind: "heading", text: "재귀로 생각하기",
    },
    {
      kind: "code",
      code: `# "n! 은 n × (n-1)! 이다" — 정의를 그대로 옮긴다
def fact(n):
    if n <= 1: return 1           # 기저
    return n * fact(n - 1)        # 재귀

# 리스트 합: "첫 항목 + 나머지의 합"
def total(lst):
    if not lst: return 0          # 빈 리스트 = 기저
    return lst[0] + total(lst[1:])

# 중첩 구조 — 재귀가 진짜 빛나는 곳 (반복문으로는 깊이를 모른다)
def count_files(folder):
    n = 0
    for item in folder:
        if isinstance(item, list):     # 하위 폴더
            n += count_files(item)     # 같은 방법으로
        else:
            n += 1
    return n`,
      caption: "반복문으로 풀 수 있는 것은 반복문이 보통 낫다. 재귀는 트리·중첩 구조·분할정복(Part 13)에서 쓴다.",
    },
    {
      kind: "pitfall",
      title: "RecursionError: maximum recursion depth exceeded",
      md: `콜스택은 무한하지 않다. 파이썬은 기본 **1000** 겹에서 멈춘다. 기저 조건을 빠뜨렸거나(\`fact(n - 1)\` 대신 \`fact(n)\`), 입력이 커서(\`total(range(5000))\`) 생긴다. 깊이가 수천을 넘을 수 있는 문제는 반복문이나 명시적 스택으로 바꾼다. \`sys.setrecursionlimit\` 로 올릴 수는 있지만 근본 해결은 아니다.`,
    },
    {
      kind: "callout", tone: "deep", title: "피보나치의 함정",
      md: `\`fib(n) = fib(n-1) + fib(n-2)\` 를 그대로 재귀로 쓰면 같은 값을 **수없이 다시 계산**한다 — fib(30) 이 130만 번 호출된다. 호출 트리가 폭발하는 것이다. 결과를 기억해 두는 **메모이제이션**(\`functools.lru_cache\`, Part 9)을 붙이면 31번이 된다. Part 13 에서 트리가 줄어드는 것을 애니메이션으로 본다.`,
    },
    {
      kind: "quiz",
      question: "`def f(n): return 0 if n == 0 else 1 + f(n - 1)` 에서 `f(3)` 을 부르면 프레임이 최대 몇 개까지 쌓일까?",
      choices: [
        { text: "3개", why: "f(3), f(2), f(1), 그리고 기저 f(0) 까지 4개다. 기저 조건 호출도 프레임이 생긴다." },
        { text: "4개", correct: true, why: "f(3) → f(2) → f(1) → f(0). f(0) 이 0 을 돌려주는 순간이 가장 깊다." },
        { text: "1개", why: "재귀는 반환하기 전에 자신을 부르므로 프레임이 쌓인다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "재귀 = 같은 함수의 프레임이 **겹겹이 쌓이는 것.** 각 프레임은 자기 변수를 갖는다.",
        "**기저 조건**이 반드시 있어야 하고, 매 호출마다 거기에 가까워져야 한다.",
        "내려가며 보류 → 기저에서 값 → 올라오며 조립.",
        "깊이 한계 1000. 트리·중첩·분할정복에 쓰고, 단순 반복은 반복문으로.",
      ],
    },
  ],
};
