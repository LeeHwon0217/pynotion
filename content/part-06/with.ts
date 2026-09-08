import type { Lesson } from "@/lib/types";

export const withLesson: Lesson = {
  part: 6,
  slug: "with",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "with — 블록을 어떻게 나가든 정리는 된다",
      props: {
        flow: {
          code: ['with open("a.txt") as f:', "    data = f.read()", "    process(data)", 'print("다음 일")'],
          nodes: [
            { id: "en", kind: "step", label: "__enter__ → 파일 열기", x: 640, y: 70 },
            { id: "b", kind: "step", label: "블록 실행", x: 640, y: 170 },
            { id: "q", kind: "cond", label: "블록이 어떻게 끝났나?", x: 640, y: 280 },
            { id: "ex", kind: "step", label: "__exit__ → 닫기 (예외 정보 전달)", x: 640, y: 400 },
            { id: "n", kind: "end", label: "다음 코드 / 예외 전파", x: 640, y: 480 },
          ],
          edges: [
            { from: "en", to: "b" }, { from: "b", to: "q" },
            { from: "q", to: "ex", label: "정상 / return / 예외 — 전부" },
            { from: "ex", to: "n" },
          ],
          steps: [
            { chapter: "들어가기", say: "`with open(...) as f:` — 블록에 들어갈 때 파일 객체의 **`__enter__`** 가 호출된다. 열린 파일이 `f` 에 붙는다.", at: "en", line: 0, vars: { f: "<file, 열림>" } },
            { say: "블록 실행. 평범한 코드.", at: "b", line: 1, vars: { f: "<file, 열림>", data: '"…"' } },
            { chapter: "정상 종료", say: "블록이 끝나면 — **자동으로 `__exit__`** 가 호출되어 파일이 닫힌다. `close()` 를 쓸 필요가 없다.", at: "q", line: 2, badge: { at: "q", text: "정상", color: "fresh" } },
            { say: "", dur: 1500, at: "ex", vars: { f: "<file, 닫힘>", data: '"…"' } },
            { say: "", dur: 1200, at: "n", line: 3, output: "다음 일\n" },
            { chapter: "예외가 나도", say: "`process(data)` 에서 예외가 났다고 하자. 블록의 나머지는 건너뛰지만…", at: "b", line: 2, reset: true, badge: { at: "b", text: "ValueError!", color: "dead" } },
            { say: "**그래도 `__exit__` 는 호출된다.** 파일은 닫힌다. 그 뒤에 예외가 계속 전파된다. `try/finally` 를 직접 쓴 것과 같은 효과.", at: "ex", vars: { f: "<file, 닫힘>" } },
            { say: "", dur: 1400, at: "n", badge: { at: "n", text: "ValueError 전파", color: "dead" } },
            { chapter: "정리", say: "`with` 는 '들어갈 때 준비, 나갈 때 **무조건** 정리' 를 약속하는 문법이다. 파일, 잠금, DB 연결, 임시 폴더 — 열고 닫는 것 전부에 쓴다.", at: "n" },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`\`\`
with open("a.txt", encoding="utf-8") as f:
    data = f.read()
# 여기 오면 f 는 이미 닫혀 있다
\`\`\`

\`with\` 문은 **컨텍스트 매니저** 프로토콜을 쓴다. 객체의 \`__enter__()\` 를 블록 시작에, \`__exit__()\` 를 블록이 끝날 때 — 정상 종료든, \`return\` 이든, 예외든 — **반드시** 호출한다. 파일 객체의 \`__exit__\` 가 \`close()\` 를 한다.

\`try: ... finally: f.close()\` 를 매번 쓰는 대신 \`with\` 한 줄. 파일을 열 땐 **언제나** with.`,
    },
    {
      kind: "trace", traceId: "p6-with", title: "한 줄씩 — 예외 뒤에도 닫힌다",
      caption: "f.closed 가 블록 안에서는 False, 나오면 True. 블록 안에서 예외가 나도 True.",
    },
    {
      kind: "code", title: "with 를 쓰는 것들",
      code: `with open(path) as f: ...                   # 파일
with open(a) as fa, open(b) as fb: ...       # 여러 개 한 번에
with lock: ...                               # threading.Lock — 나갈 때 자동 해제 (Part 10)
with sqlite3.connect("db.sqlite") as conn: ... # DB — 나갈 때 커밋/롤백
with tempfile.TemporaryDirectory() as d: ... # 임시 폴더 — 나갈 때 삭제
with pytest.raises(ValueError): ...          # 테스트 — '이 블록은 예외를 내야 한다'`,
      caption: "직접 만드는 법(__enter__/__exit__, contextlib)은 Part 9.",
    },
    {
      kind: "pitfall",
      title: "with 밖에서 f 를 쓰기",
      md: `\`with open(p) as f: pass\` 뒤에 \`f.read()\` 하면 \`ValueError: I/O operation on closed file\`. 이름 \`f\` 는 남아 있지만 파일은 닫혔다. 읽은 **결과**(\`data\`)는 블록 밖에서 써도 된다 — 문자열 객체는 파일과 무관하니까.`,
    },
    {
      kind: "quiz",
      question: "다음 코드에서 파일은 닫힐까?",
      code: `def first_line(path):
    with open(path) as f:
        return f.readline()`,
      choices: [
        { text: "닫힌다", correct: true, why: "return 으로 블록을 나가는 것도 '블록 종료' 다. __exit__ 가 호출된 뒤 값이 반환된다. finally 와 같은 원리." },
        { text: "닫히지 않는다 — return 이 먼저 실행되니까", why: "return 값은 계산되지만, 실제로 함수를 떠나기 전에 __exit__ 가 실행된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`with 객체 as 이름:` — 들어갈 때 `__enter__`, 나갈 때 **무조건** `__exit__`.",
        "정상·return·예외 어느 경우든 정리된다. `try/finally` 의 짧은 형태.",
        "파일·잠금·연결·임시 자원은 항상 with.",
        "블록 밖에서 `f` 는 닫혀 있다. 결과 데이터는 써도 된다.",
      ],
    },
  ],
};
