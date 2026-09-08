import type { Lesson } from "@/lib/types";

export const mutableDefault: Lesson = {
  part: 4,
  slug: "mutable-default",
  blocks: [
    {
      kind: "viz", component: "Story", title: "기본값은 def 가 실행될 때 딱 한 번 만들어진다",
      props: {
        story: {
          code: ["def add(item, bag=[]):", "    bag.append(item)", "    return bag", "", 'a = add("사과")', 'b = add("배")'],
          steps: [
            { chapter: "def 순간", say: "`def` 가 실행되는 순간, 기본값 `[]` 가 **평가되어 리스트 객체 하나**가 만들어진다. 이 객체는 **함수 객체에 매달려** 계속 산다.", ops: [{ line: 0 }, { obj: "F", type: "function", value: "add" }, { obj: "D", type: "list", items: [], note: "add.__defaults__ 에 저장됨" }, { bind: "add", to: "F" }] },
            { chapter: "첫 호출", say: "`add(\"사과\")` — bag 을 안 넘겼으니 **그 기본 리스트**에 `bag` 이 붙는다. 새로 만드는 게 아니다.", ops: [{ line: 4 }, { bind: "bag", to: "D", frame: 'add("사과")' }] },
            { say: "`bag.append(\"사과\")` — 기본 리스트 객체가 **바뀐다.** 그리고 그걸 돌려준다. `a` 도 같은 객체.", ops: [{ line: 1 }, { mutate: "D", items: ['"사과"'] }, { unbind: "bag", frame: 'add("사과")' }, { bind: "a", to: "D" }] },
            { chapter: "두 번째 호출", say: "`add(\"배\")` — 또 bag 을 안 넘겼다. 기본값은 **아까 그 객체.** 이미 사과가 들어 있다.", ops: [{ line: 5 }, { bind: "bag", to: "D", frame: 'add("배")' }, { badge: "D", text: "새 리스트가 아니다!", color: "dead" }] },
            { say: "배가 추가된다. `b` 도 같은 객체. `a`, `b`, 기본값 전부 **하나의 리스트**를 가리킨다. `a is b` → True.", ops: [{ line: 1 }, { mutate: "D", items: ['"사과"', '"배"'] }, { unbind: "bag", frame: 'add("배")' }, { bind: "b", to: "D" }, { unbadge: "D" }, { badge: "D", text: "a is b → True", color: "warn" }] },
            { chapter: "해결", say: "기본값을 `None` 으로 두고 함수 **안에서** `if bag is None: bag = []`. 호출할 때마다 새 리스트가 만들어진다.", ops: [{ clear: true }, { obj: "F2", type: "function", value: "add_ok" }, { obj: "N", type: "NoneType", value: "None", note: "기본값 — 바꿀 수 없으니 안전" }, { bind: "add_ok", to: "F2" }] },
            { say: "", dur: 2400, ops: [{ obj: "L1", type: "list", items: ['"사과"'], note: "1번째 호출" }, { obj: "L2", type: "list", items: ['"배"'], note: "2번째 호출" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `파이썬에서 가장 유명한 함정이다. 매개변수의 기본값은 **함수가 호출될 때가 아니라 \`def\` 가 실행될 때** 딱 한 번 평가된다. 기본값이 숫자나 문자열처럼 바꿀 수 없는 것이면 문제없다. 하지만 리스트·딕셔너리·집합처럼 **바꿀 수 있는 객체**면, 그 하나의 객체가 모든 호출에서 공유된다.

증상: 함수를 여러 번 부를수록 "이전 호출의 데이터"가 남아 있다.`,
    },
    {
      kind: "trace", traceId: "p4-mutable-default", title: "함정과 해결을 한 줄씩",
      caption: "a is b 가 True 인 것을 확인하고, add_ok 에서는 호출마다 다른 리스트가 만들어지는 것을 보라.",
    },
    {
      kind: "code", title: "올바른 패턴",
      code: `def add(item, bag=None):        # 기본값은 None (불변)
    if bag is None:
        bag = []                    # 호출마다 새로
    bag.append(item)
    return bag`,
      caption: "'기본값이 가변 객체면 None 으로 두고 안에서 만든다' — 파이썬 코드 어디서나 보이는 관용구.",
    },
    {
      kind: "callout", tone: "deep", title: "직접 확인: __defaults__",
      md: `\`add.__defaults__\` 를 출력하면 \`([],)\` — 기본값 튜플이 함수 객체에 붙어 있다. 호출할 때마다 파이썬은 여기서 값을 꺼내 매개변수에 **붙인다**(복사하지 않는다). Part 1 의 이름표 모델 그대로다. 이 성질을 일부러 이용해 함수 호출 사이에 값을 기억시키는 트릭(캐시)도 있지만, 읽는 사람이 놀라니 쓰지 않는 게 좋다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `def f(n, seen={}):
    seen[n] = True
    return len(seen)
f(1)
f(2)
print(f(3))`,
      choices: [
        { text: "`1`", why: "seen 은 def 때 만들어진 하나의 딕셔너리다. 세 번의 호출이 전부 거기에 키를 넣는다." },
        { text: "`3`", correct: true, why: "기본 딕셔너리 하나를 세 호출이 공유한다. 1, 2, 3 이 전부 들어가 길이 3." },
        { text: "오류", why: "문법·실행 모두 정상이다. 결과가 놀라울 뿐." },
      ],
    },
    {
      kind: "summary",
      items: [
        "기본값은 **`def` 때 한 번** 만들어져 함수 객체에 저장된다.",
        "가변 기본값(리스트·딕셔너리·집합)은 **모든 호출이 공유** → 데이터가 누적된다.",
        "해결: `=None` 으로 두고 함수 안에서 `if x is None: x = []`.",
      ],
    },
  ],
};
