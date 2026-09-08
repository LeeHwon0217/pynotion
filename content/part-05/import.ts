import type { Lesson } from "@/lib/types";

export const importLesson: Lesson = {
  part: 5,
  slug: "import",
  blocks: [
    {
      kind: "viz", component: "Story", title: "import 는 '찾고, 실행하고, 캐시하고, 이름 붙이기'",
      props: {
        story: {
          code: ["import math", "math.sqrt(16)", "import math as m", "m is math"],
          steps: [
            { chapter: "① 찾기", say: "`import math` — 파이썬은 먼저 `sys.modules` (이미 읽은 모듈의 딕셔너리) 를 본다. 없다. 그러면 `sys.path` 의 폴더들을 **순서대로** 뒤진다: 스크립트 폴더 → 표준 라이브러리 → site-packages.", ops: [{ line: 0 }, { obj: "SM", type: "dict", entries: [], note: "sys.modules (캐시)" }, { obj: "SP", type: "list", items: ['"."', '"…/lib"', '"…/site-packages"'], note: "sys.path (찾는 순서)" }] },
            { chapter: "② 실행", say: "찾았다. 파일의 코드를 **위에서 아래로 한 번 실행**한다. 그 결과로 생긴 이름들(sqrt, pi, …)을 담은 **모듈 객체**가 만들어진다.", ops: [{ obj: "M", type: "module", fields: [["sqrt", "<function>"], ["pi", "3.14159…"], ["floor", "<function>"]] }] },
            { chapter: "③ 캐시", say: "모듈 객체를 `sys.modules[\"math\"]` 에 넣어 둔다. 이 프로세스가 끝날 때까지 다시 읽지 않는다.", ops: [{ mutate: "SM", entries: [['"math"', "<module math>"]] }, { badge: "SM", text: "두 번째부턴 여기서", color: "fresh" }] },
            { chapter: "④ 이름", say: "마지막으로 현재 이름공간에 `math` 라는 이름을 붙인다. 이제 `math.sqrt(16)` — 모듈 객체의 속성을 점으로 꺼낸다.", ops: [{ bind: "math", to: "M" }, { unbadge: "SM" }, { line: 1 }, { output: "4.0\n" }] },
            { chapter: "다시 import", say: "`import math as m` — `sys.modules` 에 있다. 파일을 다시 읽지 않고 **같은 객체**에 `m` 을 붙인다. `m is math` → True.", ops: [{ line: 2 }, { bind: "m", to: "M" }, { line: 3 }, { badge: "M", text: "m is math → True", color: "fresh" }] },
            { say: "그래서 모듈은 **프로세스당 한 번만 실행**된다. 모듈 수준의 코드에 print 를 넣어 두면 몇 번을 import 해도 한 번만 찍힌다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`import\` 문은 네 단계로 일한다.

1. **찾기** — \`sys.modules\` 캐시에 있으면 바로 4번으로. 없으면 \`sys.path\` 의 폴더를 순서대로 뒤진다.
2. **실행** — 파일의 코드를 처음부터 끝까지 한 번 실행해 **모듈 객체**를 만든다. 모듈 객체는 그 파일의 전역 이름들을 속성으로 갖는다.
3. **캐시** — \`sys.modules["이름"]\` 에 저장.
4. **이름 붙이기** — 현재 이름공간에 이름을 만든다.

모듈은 그냥 \`.py\` 파일이다. \`math.sqrt\` 는 "math 모듈 객체의 sqrt 속성"이고, 점(\`.\`)은 딕셔너리 키 찾기와 다르지 않다.`,
    },
    {
      kind: "trace", traceId: "p5-import", title: "한 줄씩",
      caption: "sys.modules 에 캐시되는 것과 as 로 다시 import 해도 같은 객체인 것.",
    },
    {
      kind: "heading", text: "sys.path — 어디서 찾나",
    },
    {
      kind: "code", lang: "text",
      code: `>>> import sys; sys.path
['',                                  ← 1. 실행한 스크립트가 있는 폴더 (REPL 이면 현재 폴더)
 'C:\\\\Python312\\\\python312.zip',
 'C:\\\\Python312\\\\Lib',                 ← 2. 표준 라이브러리
 'C:\\\\Python312',
 'C:\\\\...\\\\site-packages']              ← 3. pip 로 설치한 패키지`,
      caption: "앞에 있는 폴더가 이긴다. 내 폴더에 random.py 를 만들면 표준 random 대신 내 파일이 import 된다 — 흔한 사고.",
    },
    {
      kind: "pitfall",
      title: "표준 라이브러리와 같은 이름의 파일",
      md: `연습하다가 \`random.py\`, \`json.py\`, \`test.py\` 같은 이름으로 파일을 만들면, 그 폴더에서 실행하는 모든 스크립트가 표준 모듈 대신 내 파일을 가져간다. 증상: \`AttributeError: module 'random' has no attribute 'randint'\`. 파일 이름을 바꾸고 \`__pycache__\` 를 지운다.`,
    },
    {
      kind: "callout", tone: "deep", title: "모듈은 딱 한 번 실행된다 — 그래서 상태를 공유한다",
      md: `\`sys.modules\` 캐시 덕에 여러 파일이 같은 모듈을 import 해도 **모듈 객체는 하나**다. 그래서 어떤 파일에서 \`config.debug = True\` 로 바꾸면 다른 파일에서도 보인다 — 모듈이 전역 설정 저장소 역할을 하는 이유이자, 순환 import 가 생기는 배경(다음 레슨). 강제로 다시 읽으려면 \`importlib.reload(module)\`.`,
    },
    {
      kind: "quiz",
      question: "`a.py` 와 `b.py` 가 둘 다 `import tools` 를 하고, `tools.py` 맨 위에 `print(\"로딩\")` 이 있다. `main.py` 가 `import a; import b` 를 하면 \"로딩\" 은 몇 번 찍힐까?",
      choices: [
        { text: "2번", why: "두 번째 import 는 sys.modules 캐시에서 가져온다. 파일은 다시 실행되지 않는다." },
        { text: "1번", correct: true, why: "처음 import 될 때 한 번 실행되어 캐시된다. b 의 import tools 는 캐시된 객체를 받는다." },
        { text: "3번", why: "main, a, b 가 각각 실행하는 게 아니다. 프로세스당 한 번." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`import` = 찾기(`sys.modules` → `sys.path`) → **한 번 실행** → 캐시 → 이름 붙이기.",
        "모듈 객체는 프로세스에 **하나.** 몇 번 import 해도 같은 객체.",
        "`sys.path` 는 순서대로 뒤진다. 스크립트 폴더가 1순위 — 표준 모듈과 같은 파일명은 금물.",
        "`math.sqrt` 의 점은 모듈 객체의 속성 접근.",
      ],
    },
  ],
};
