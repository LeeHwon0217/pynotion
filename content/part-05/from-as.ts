import type { Lesson } from "@/lib/types";

export const fromAs: Lesson = {
  part: 5,
  slug: "from-as",
  blocks: [
    {
      kind: "viz", component: "Story", title: "from 은 안의 이름을 꺼내 오고, as 는 이름을 바꾼다",
      props: {
        story: {
          code: ["from math import sqrt", "import math as m", "from math import *"],
          steps: [
            { chapter: "모듈 객체", say: "math 모듈 객체는 어차피 만들어져 캐시된다. 차이는 **내 이름공간에 무엇이 생기느냐**뿐이다.", ops: [{ obj: "M", type: "module", fields: [["sqrt", "<function>"], ["pi", "3.14159…"], ["floor", "<function>"]] }] },
            { chapter: "from", say: "`from math import sqrt` — 모듈 안의 `sqrt` 객체를 꺼내 **내 이름공간에 `sqrt` 라는 이름**으로 붙인다. `math` 라는 이름은 생기지 않는다.", ops: [{ line: 0 }, { obj: "F", type: "function", value: "sqrt", note: "math.sqrt 와 같은 객체" }, { bind: "sqrt", to: "F" }] },
            { chapter: "as", say: "`import math as m` — 모듈 객체에 `m` 이라는 이름을 붙인다. `math` 는 안 생긴다. 긴 이름 줄이기, 충돌 피하기.", ops: [{ line: 1 }, { bind: "m", to: "M" }] },
            { chapter: "*", say: "`from math import *` — 모듈의 **모든 공개 이름**을 쏟아 붓는다. 어디서 온 이름인지 알 수 없게 되고, 기존 이름을 조용히 덮어쓴다. **쓰지 않는다.**", ops: [{ line: 2 }, { bind: "pi", to: "M" }, { bind: "floor", to: "M" }, { badge: "M", text: "출처 불명 이름들 — 피할 것", color: "dead" }] },
          ],
        },
      },
    },
    {
      kind: "table",
      head: ["문", "내 이름공간에 생기는 것", "쓰는 법"],
      rows: [
        ["`import math`", "`math` (모듈)", "`math.sqrt(2)`"],
        ["`import math as m`", "`m` (모듈)", "`m.sqrt(2)`"],
        ["`from math import sqrt`", "`sqrt` (함수)", "`sqrt(2)`"],
        ["`from math import sqrt as sq`", "`sq`", "`sq(2)`"],
        ["`from math import *`", "math 의 모든 공개 이름", "**피할 것**"],
      ],
    },
    {
      kind: "trace", traceId: "p5-from-as", title: "한 줄씩 — 마지막 줄은 NameError",
      caption: "from math import 뒤에 math 라는 이름이 없는 것을 마지막 줄에서 확인한다.",
    },
    {
      kind: "heading", text: "순환 import",
    },
    {
      kind: "text",
      md: `\`a.py\` 가 \`import b\` 를 하고, \`b.py\` 가 \`import a\` 를 하면? 순서를 따라가 보자.

1. \`a\` 실행 시작 → \`import b\` → b 가 \`sys.modules\` 에 없으니 \`b\` 실행 시작
2. \`b\` 안에서 \`import a\` → a 는 **이미 \`sys.modules\` 에 있다** (실행 중이지만 등록은 됐다) → 캐시된 **반쯤 만들어진 a** 를 받는다
3. \`b\` 가 \`a.something\` 을 쓰려 하면 아직 정의 전 → \`AttributeError\` 또는 \`ImportError: cannot import name\`

해결: (1) 공통 부분을 제3의 모듈로 뺀다, (2) import 를 함수 안으로 옮겨 필요할 때 하게 한다, (3) \`from a import x\` 대신 \`import a\` 를 쓰고 \`a.x\` 로 늦게 접근한다. 근본적으로는 **의존 방향을 한쪽으로** 정리하는 것.`,
    },
    {
      kind: "pitfall",
      title: "from 으로 가져온 이름은 '그 시점의 객체'다",
      md: `\`from config import debug\` 를 한 뒤 다른 곳에서 \`config.debug = True\` 로 바꿔도 내 \`debug\` 는 옛 값이다 — from 은 객체를 **복사가 아니라 이름 붙이기**로 가져오므로(Part 1), 모듈에서 이름이 재바인딩되면 따라가지 않는다. 바뀌는 값은 \`import config\` 후 \`config.debug\` 로 읽는다.`,
    },
    {
      kind: "quiz",
      question: "`from os.path import join as j` 뒤에 쓸 수 있는 것은?",
      choices: [
        { text: "`os.path.join(...)`", why: "os 라는 이름은 생기지 않았다. NameError." },
        { text: "`j(...)`", correct: true, why: "join 함수 객체에 j 라는 이름만 붙었다." },
        { text: "`join(...)`", why: "as 로 이름을 j 로 바꿨으므로 join 은 없다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`import x` 는 모듈 이름, `from x import y` 는 안의 이름, `as` 는 별명. 모듈 객체는 어느 쪽이든 하나.",
        "`from x import *` 는 쓰지 않는다.",
        "순환 import 는 '반쯤 만들어진 모듈' 을 받는 문제. 의존 방향을 정리하거나 import 를 늦춘다.",
        "`from` 으로 가져온 이름은 그 시점의 객체 — 모듈에서 재바인딩되면 따라가지 않는다.",
      ],
    },
  ],
};
