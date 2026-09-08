import type { Lesson } from "@/lib/types";

export const truthiness: Lesson = {
  part: 2,
  slug: "truthiness",
  blocks: [
    {
      kind: "viz", component: "Story", title: "if 는 True 만 받는 게 아니다",
      props: {
        story: {
          code: ["cart = []", "if cart:", '    print("결제")', "else:", '    print("비어 있음")', "cart.append(\"우유\")", "if cart:", '    print("결제")'],
          steps: [
            { chapter: "빈 리스트", say: "`cart` 는 빈 리스트. `if cart:` 는 `if len(cart) > 0:` 과 같은 뜻이다.", ops: [{ line: 0 }, { obj: "L", type: "list", items: [] }, { bind: "cart", to: "L" }] },
            { say: "`if` 는 조건에 `bool()` 을 씌워 판단한다. **빈 것은 거짓**. 그래서 `else` 로 간다.", ops: [{ line: 1 }, { badge: "L", text: "bool([]) → False", color: "dead" }] },
            { say: "", dur: 1600, ops: [{ line: 4 }, { output: "비어 있음\n" }] },
            { chapter: "하나라도 있으면", say: "`append` 로 항목 하나를 넣는다. 리스트 객체 자체가 바뀐다.", ops: [{ line: 5 }, { mutate: "L", items: ['"우유"'] }, { unbadge: "L" }] },
            { say: "이제 `if cart:` 는 **참**. 비어 있지 않으니까. 내용이 무엇이든 상관없다.", ops: [{ line: 6 }, { badge: "L", text: "bool([\"우유\"]) → True", color: "fresh" }] },
            { say: "", dur: 1600, ops: [{ line: 7 }, { output: "결제\n" }] },
            { chapter: "규칙", say: "**0, 빈 것, None 은 거짓. 나머지는 전부 참.** 이것 하나로 `if lst:`, `if name:`, `if count:` 같은 짧은 조건문이 읽힌다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`if\`와 \`while\`은 조건이 \`True\`인지 보는 게 아니라, 조건을 \`bool()\`로 바꿨을 때 \`True\`인지 본다. 그래서 \`if x == True:\` 나 \`if len(lst) > 0:\` 처럼 쓸 필요가 없다 — \`if x:\`, \`if lst:\` 면 된다.

Part 1에서 본 규칙을 다시:`,
    },
    {
      kind: "table",
      head: ["거짓 (Falsy)", "참 (Truthy)"],
      rows: [
        ["`False`, `None`", "`True`"],
        ["`0`, `0.0`", "`0` 이 아닌 모든 수"],
        ["`\"\"`", "`\"0\"`, `\" \"`, `\"False\"` — 글자가 있으면"],
        ["`[]`, `()`, `{}`, `set()`, `range(0)`", "원소가 하나라도 있으면 — `[0]`, `[None]`, `[[]]` 도 참"],
      ],
    },
    {
      kind: "trace", traceId: "p2-truthy", title: "관용구 세 가지",
      caption: "if cart: (빈 컨테이너 검사), if not name: (빈 문자열에 기본값), 조건부 표현식에서의 0 검사.",
    },
    {
      kind: "pitfall",
      title: "0 과 None 을 구분해야 할 때는 truthiness 를 쓰면 안 된다",
      md: `\`if count:\` 는 \`count\` 가 \`0\` 일 때도, \`None\` 일 때도 거짓이다. "값이 아직 없음(None)"과 "값이 0"을 다르게 처리해야 하면 \`if count is None:\` 으로 명시해야 한다. 함수가 \`0\` 을 돌려줬는데 \`if not result:\` 로 "실패"라고 판단하는 버그가 흔하다.`,
      code: `def find_index(lst, x):
    return lst.index(x) if x in lst else None

idx = find_index([7, 8, 9], 7)   # 0
if not idx:                       # 버그: 0 도 여기 걸린다
    print("못 찾음")
if idx is None:                   # 맞음
    print("못 찾음")`,
    },
    {
      kind: "callout", tone: "deep", title: "내 객체도 참/거짓을 정할 수 있다",
      md: `클래스에 \`__bool__\` 메서드를 정의하면 \`if 객체:\` 가 그 결과를 쓴다. \`__bool__\` 이 없으면 \`__len__\` 을 써서 길이 0 이면 거짓으로 본다. 리스트·문자열·딕셔너리가 "비어 있으면 거짓"인 이유가 바로 \`__len__\` 이다. Part 7 매직메서드에서 다시 만난다.`,
    },
    {
      kind: "quiz",
      question: "다음 중 `if x:` 가 **참**이 되는 x 는?",
      choices: [
        { text: "`x = \"\"`", why: "빈 문자열은 거짓." },
        { text: "`x = [[]]`", correct: true, why: "빈 리스트를 하나 담은 리스트다. 원소가 하나 있으므로 비어 있지 않다 → 참. 안의 내용이 무엇이든 상관없다." },
        { text: "`x = 0.0`", why: "0 은 float 여도 거짓." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`if` 는 조건을 `bool()` 로 바꿔 본다. **0·빈 것·None 은 거짓**, 나머지는 참.",
        "`if lst:`, `if name:`, `if not items:` 처럼 짧게 쓰는 게 파이썬 스타일.",
        "**0 과 None 을 구분**해야 하면 `is None` 으로 명시.",
      ],
    },
  ],
};
