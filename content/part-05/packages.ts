import type { Lesson } from "@/lib/types";

export const packages: Lesson = {
  part: 5,
  slug: "packages",
  blocks: [
    {
      kind: "viz", component: "Story", title: "패키지는 폴더, 모듈은 파일",
      props: {
        story: {
          code: ["shop/", "  __init__.py", "  cart.py", "  pay/", "    __init__.py", "    card.py", "", "from shop.pay import card"],
          codeTitle: "폴더 구조",
          steps: [
            { chapter: "구조", say: "`shop/` 폴더에 `__init__.py` 가 있으면 파이썬은 이 폴더를 **패키지**로 본다. 안의 `.py` 파일은 모듈, 하위 폴더는 서브패키지.", ops: [{ line: 0 }, { obj: "P", type: "package", fields: [["__init__", "shop/__init__.py"], ["cart", "?"], ["pay", "?"]] }] },
            { chapter: "from shop.pay import card", say: "점으로 이은 경로를 **왼쪽부터** 처리한다. 먼저 `shop` — `shop/__init__.py` 가 실행되어 패키지 객체가 된다.", ops: [{ line: 7 }, { bind: "shop", to: "P", frame: "sys.modules" }, { badge: "P", text: "shop/__init__.py 실행됨", color: "fresh" }] },
            { say: "다음 `shop.pay` — `shop/pay/__init__.py` 실행. 서브패키지 객체가 `shop` 의 속성 `pay` 로 붙는다.", ops: [{ unbadge: "P" }, { obj: "SP", type: "package", fields: [["__init__", "shop/pay/__init__.py"], ["card", "?"]] }, { mutate: "P", fields: [["__init__", "shop/__init__.py"], ["cart", "?"], ["pay", "<package>"]] }, { bind: "shop.pay", to: "SP", frame: "sys.modules" }] },
            { say: "마지막 `card` — `shop/pay/card.py` 가 실행되어 모듈 객체가 되고, 내 이름공간에 `card` 가 붙는다. `cart.py` 는 **아직 읽지 않았다** — 필요한 것만 읽는다.", ops: [{ obj: "M", type: "module", fields: [["charge", "<function>"]] }, { mutate: "SP", fields: [["__init__", "shop/pay/__init__.py"], ["card", "<module>"]] }, { bind: "card", to: "M" }] },
            { chapter: "__init__.py", say: "`__init__.py` 는 비어 있어도 된다. 패키지를 import 할 때 실행되므로 '패키지의 대표 이름' 을 여기서 골라 내놓는 데 쓴다: `from .cart import Cart`.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `파일이 많아지면 폴더로 묶는다. 그 폴더가 **패키지**다.

- 폴더에 \`__init__.py\` 를 두면 패키지. 비어 있어도 된다.
- \`import shop.pay.card\` — 점은 폴더 구분. 왼쪽부터 순서대로 \`__init__.py\` 들이 실행된다.
- \`from shop.pay import card\` — 서브패키지 안의 모듈을 이름으로 가져온다.
- 패키지 안에서 옆 모듈을 부를 땐 \`from . import cart\`, \`from .cart import Cart\` (**상대 import**). 점 하나는 같은 폴더, 둘은 상위.`,
    },
    {
      kind: "code", title: "예시",
      code: `shop/
    __init__.py        # from .cart import Cart   ← 대표 이름 노출
    cart.py            # class Cart: ...
    pay/
        __init__.py
        card.py        # from ..cart import Cart  ← 상위 패키지의 모듈

# 사용하는 쪽
from shop import Cart              # __init__.py 가 노출한 이름
from shop.pay.card import charge   # 깊은 경로도 그대로
import shop.pay.card as card       # 별명`,
    },
    {
      kind: "table",
      head: ["", "절대 import", "상대 import"],
      rows: [
        ["모양", "`from shop.cart import Cart`", "`from .cart import Cart`"],
        ["기준", "`sys.path` 의 최상위", "지금 이 파일이 속한 패키지"],
        ["장점", "어디서 봐도 명확", "패키지 이름을 바꿔도 안 깨짐"],
        ["제약", "—", "**패키지 안에서만.** 스크립트로 직접 실행하는 파일에선 오류"],
      ],
    },
    {
      kind: "pitfall",
      title: "ImportError: attempted relative import with no known parent package",
      md: `\`python shop/pay/card.py\` 처럼 패키지 안의 파일을 **직접 실행**하면 파이썬은 그 파일을 최상위 스크립트로 보고, \`from ..cart\` 의 "상위"를 모른다. 패키지 안의 모듈을 실행하려면 프로젝트 루트에서 \`python -m shop.pay.card\` 로 실행한다. \`-m\` 은 "모듈로 실행"이다.`,
    },
    {
      kind: "callout", tone: "deep", title: "__init__.py 없이도 되긴 한다",
      md: `파이썬 3.3 부터는 \`__init__.py\` 가 없는 폴더도 **네임스페이스 패키지**로 import 된다. 하지만 동작이 미묘하게 다르고(여러 폴더가 합쳐질 수 있음), 도구들이 혼란스러워하므로 일반 프로젝트에서는 **항상 \`__init__.py\` 를 둔다.**`,
    },
    {
      kind: "quiz",
      question: "`import a.b.c` 를 하면 실행되는 파일은?",
      choices: [
        { text: "`a/b/c.py` 만", why: "경로의 패키지들이 먼저 초기화된다." },
        { text: "`a/__init__.py`, `a/b/__init__.py`, `a/b/c.py` 순서로", correct: true, why: "왼쪽부터 각 패키지의 __init__.py 가 실행되고 마지막에 모듈 c 가 실행된다. (이미 캐시된 것은 건너뜀)" },
        { text: "`a/b/c.py` 와 `a/b/__init__.py` 만", why: "최상위 패키지 a 의 __init__.py 도 실행된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "패키지 = `__init__.py` 가 있는 폴더. 점은 폴더 경계.",
        "`import a.b.c` 는 왼쪽부터 `__init__.py` 들을 순서대로 실행한다.",
        "패키지 안에서는 상대 import `from .x import y`. 직접 실행할 땐 `python -m 패키지.모듈`.",
        "`__init__.py` 에서 대표 이름을 노출하면 사용자가 짧게 쓸 수 있다.",
      ],
    },
  ],
};
