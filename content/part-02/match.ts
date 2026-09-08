import type { Lesson } from "@/lib/types";

export const matchLesson: Lesson = {
  part: 2,
  slug: "match",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "match — 값의 모양으로 고른다",
      props: {
        flow: {
          code: ['cmd = ["go", "north"]', "match cmd:", '    case ["quit"]:', '        print("종료")', '    case ["go", direction]:', '        print("이동", direction)', "    case _:", '        print("모르는 명령")'],
          nodes: [
            { id: "m", kind: "step", label: "match cmd", x: 640, y: 60 },
            { id: "c1", kind: "cond", label: '["quit"] 모양?', x: 640, y: 160 },
            { id: "c2", kind: "cond", label: '["go", 무엇] 모양?', x: 640, y: 280 },
            { id: "c3", kind: "cond", label: "_ (아무거나)", x: 640, y: 400 },
            { id: "p2", kind: "io", label: "print(이동, direction)", x: 940, y: 280 },
            { id: "p1", kind: "io", label: 'print("종료")', x: 940, y: 160 },
            { id: "p3", kind: "io", label: 'print("모르는 명령")', x: 940, y: 400 },
          ],
          edges: [
            { from: "m", to: "c1" },
            { from: "c1", to: "p1", label: "맞음" },
            { from: "c1", to: "c2", label: "아님" },
            { from: "c2", to: "p2", label: "맞음" },
            { from: "c2", to: "c3", label: "아님" },
            { from: "c3", to: "p3", label: "맞음" },
          ],
          steps: [
            { chapter: "match", say: "`match` 는 값 하나를 받아 여러 `case` **패턴**과 위에서부터 맞춰 본다. 값은 리스트 `[\"go\", \"north\"]`.", at: "m", line: 1, vars: { cmd: '["go", "north"]' } },
            { say: "첫 패턴 `[\"quit\"]` — 길이 1, 첫 항목 \"quit\". 우리 값은 길이 2. **모양이 다르다.**", at: "c1", line: 2, badge: { at: "c1", text: "길이가 다름", color: "dead" } },
            { chapter: "캡처", say: "둘째 패턴 `[\"go\", direction]` — 길이 2, 첫 항목 \"go\", 둘째는 **무엇이든** — 맞다! 둘째 항목이 `direction` 이라는 이름에 **붙는다.**", at: "c2", line: 4, vars: { cmd: '["go", "north"]', direction: '"north"' }, badge: { at: "c2", text: "direction = \"north\"", color: "fresh" } },
            { say: "패턴이 맞으면 그 블록을 실행하고 **match 를 빠져나간다.** 아래 `case _` 는 보지 않는다.", at: "p2", line: 5, output: "이동 north\n" },
            { chapter: "_", say: "`case _:` 는 어떤 값이든 맞는 **기본 패턴.** if 의 else 역할. 맨 아래에 둔다.", at: "p2", line: 5 },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`match\`(파이썬 3.10+)는 값 하나를 여러 패턴과 맞춰 보는 문법이다. 다른 언어의 \`switch\`와 비슷하지만 훨씬 강력하다 — 값이 같은지만이 아니라 **구조(모양)**를 검사하고, 그 안의 값을 **이름에 꺼내 담는다**(캡처).

\`if/elif\` 로 쓸 수 있는 것을 굳이 \`match\` 로 쓸 필요는 없다. \`match\`가 빛나는 건 "리스트의 길이와 첫 항목에 따라", "딕셔너리에 특정 키가 있으면", "이 클래스의 인스턴스이고 속성이 ~이면" 처럼 **모양으로 분기**할 때다.`,
    },
    {
      kind: "trace", traceId: "p2-match", title: "한 줄씩",
      caption: "case 를 위에서부터 검사하다 맞는 것을 찾으면 그 블록만 실행하고 끝난다.",
    },
    {
      kind: "heading", text: "패턴의 종류",
    },
    {
      kind: "code",
      code: `match value:
    case 0:                    # 값 패턴 — 0 과 같은가
        ...
    case 1 | 2 | 3:            # 여러 값 중 하나 (or 패턴)
        ...
    case [x, y]:               # 시퀀스 패턴 — 길이 2, 각각 x, y 에 캡처
        ...
    case [first, *rest]:       # 첫 항목과 나머지
        ...
    case {"type": "circle", "r": r}:   # 매핑 패턴 — 이 키들이 있으면 (다른 키가 더 있어도 됨)
        ...
    case str() as s:           # 타입 검사 + 캡처
        ...
    case Point(x=0, y=y):      # 클래스 패턴 — Part 9 에서
        ...
    case n if n > 100:         # 가드 — 패턴이 맞고 조건도 참일 때만
        ...
    case _:                    # 기본
        ...`,
    },
    {
      kind: "pitfall",
      title: "case 의 이름은 비교가 아니라 캡처다",
      md: `\`RED = 1\` 이라고 두고 \`case RED:\` 라고 쓰면, "값이 RED 와 같은가"가 아니라 "**무엇이든 받아서 RED 라는 이름에 붙여라**"가 된다. 모든 값이 여기 걸린다. 상수와 비교하려면 점이 들어간 이름(\`case Color.RED:\`)을 쓰거나 리터럴을 직접 쓴다. 소문자 단독 이름은 항상 캡처다.`,
    },
    {
      kind: "quiz",
      question: "`match [1, 2, 3]:` 에서 첫 번째로 맞는 case 는?",
      code: `case [1, x]:        # A
case [1, *rest]:    # B
case [x, y, z]:     # C
case _:             # D`,
      choices: [
        { text: "A", why: "[1, x] 는 길이 2 패턴이다. 값은 길이 3." },
        { text: "B", correct: true, why: "[1, *rest] 는 첫 항목이 1 이고 나머지가 몇 개든 상관없다. rest 는 [2, 3]. C 도 맞지만 위에서부터 검사하므로 B 가 먼저 걸린다." },
        { text: "C", why: "C 도 맞는 패턴이지만 B 가 먼저 맞으므로 거기서 끝난다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`match 값:` + `case 패턴:` — 위에서부터 **처음 맞는 하나**만 실행.",
        "패턴은 값뿐 아니라 **구조**를 검사하고, 그 안의 값을 이름에 **캡처**한다.",
        "`case _:` 는 기본. `case 패턴 if 조건:` 은 가드.",
        "소문자 단독 이름은 **비교가 아니라 캡처.** 상수 비교는 점 있는 이름으로.",
      ],
    },
  ],
};
