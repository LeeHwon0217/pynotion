import type { Lesson } from "@/lib/types";

export const dictMethods: Lesson = {
  part: 3,
  slug: "dict-methods",
  blocks: [
    {
      kind: "viz", component: "Story", title: "get 과 setdefault — 없는 키를 안전하게",
      props: {
        story: {
          code: ['stock = {"사과": 3}', 'stock.get("귤")', 'stock.get("귤", 0)', 'stock.setdefault("귤", 10)', 'stock.setdefault("사과", 99)'],
          steps: [
            { chapter: "get", say: "`stock[\"귤\"]` 은 `KeyError`. 대신 `get` 을 쓰면 없는 키에 대해 **`None`** 을 돌려준다. 오류 없이.", ops: [{ line: 0 }, { obj: "D", type: "dict", entries: [['"사과"', "3"]] }, { bind: "stock", to: "D" }] },
            { say: "", dur: 1800, ops: [{ line: 1 }, { obj: "N", type: "NoneType", value: "None", note: 'stock.get("귤")' }] },
            { say: "둘째 인자로 **기본값**을 주면 그걸 돌려준다. 개수 세기 `d.get(k, 0) + 1` 관용구의 근거.", ops: [{ line: 2 }, { del: "N" }, { obj: "Z", type: "int", value: "0", note: 'stock.get("귤", 0)' }] },
            { chapter: "setdefault", say: "`setdefault(\"귤\", 10)` — 없으면 **넣고** 그 값을 돌려준다. get + 대입을 한 번에.", ops: [{ line: 3 }, { del: "Z" }, { mutate: "D", entries: [['"사과"', "3"], ['"귤"', "10"]] }] },
            { say: "이미 있는 키면 **아무것도 바꾸지 않고** 기존 값을 돌려준다. 사과는 3 그대로. 99 는 무시된다.", ops: [{ line: 4 }, { badge: "D", text: "사과는 그대로 3", color: "name" }] },
          ],
        },
      },
    },
    {
      kind: "table",
      head: ["메서드", "하는 일", "없는 키일 때"],
      rows: [
        ["`d[k]`", "값 읽기", "`KeyError`"],
        ["`d.get(k)`, `d.get(k, 기본)`", "값 읽기", "`None` / 기본값"],
        ["`d.setdefault(k, 기본)`", "읽기, 없으면 넣기", "기본값을 넣고 돌려줌"],
        ["`d.pop(k)`, `d.pop(k, 기본)`", "빼서 돌려주기", "`KeyError` / 기본값"],
        ["`d.update(other)`", "여러 쌍 추가/덮어쓰기", "—"],
        ["`d.keys()`, `d.values()`, `d.items()`", "키 / 값 / (키, 값) 쌍 보기", "—"],
        ["`k in d`", "키 있나", "`False`"],
        ["`del d[k]`", "삭제", "`KeyError`"],
      ],
    },
    {
      kind: "trace", traceId: "p3-dict-methods", title: "한 줄씩",
      caption: "get 의 두 형태, setdefault, items() 순회, update, pop.",
    },
    {
      kind: "heading", text: "순회 세 가지",
    },
    {
      kind: "code",
      code: `d = {"a": 1, "b": 2}
for k in d:                  # 키만 — 가장 짧다
    print(k, d[k])
for v in d.values():         # 값만
    print(v)
for k, v in d.items():       # 키와 값 — 가장 많이 쓴다
    print(k, v)`,
    },
    {
      kind: "callout", tone: "tip", title: "값이 리스트인 딕셔너리 — defaultdict",
      md: `"이름 → 그 사람의 점수 목록" 같은 구조에서 \`d.setdefault(name, []).append(score)\` 를 매번 쓰는 게 번거로우면 \`collections.defaultdict(list)\` 를 쓴다. 없는 키를 읽으면 자동으로 빈 리스트를 만들어 넣는다. \`d[name].append(score)\` 한 줄이면 된다.`,
    },
    {
      kind: "pitfall",
      title: "돌면서 삭제하기",
      md: `\`for k in d: if ...: del d[k]\` 는 \`RuntimeError: dictionary changed size during iteration\`. 삭제할 키를 먼저 모으거나(\`for k in list(d):\`), 새 딕셔너리를 만든다(\`{k: v for k, v in d.items() if ...}\`).`,
    },
    {
      kind: "quiz",
      question: "`d = {}; d.setdefault(\"x\", []).append(1); d.setdefault(\"x\", []).append(2)` 후 `d` 는?",
      choices: [
        { text: "`{\"x\": [2]}`", why: "두 번째 setdefault 는 이미 있는 키이므로 새 리스트를 넣지 않고 기존 리스트를 돌려준다." },
        { text: "`{\"x\": [1, 2]}`", correct: true, why: "첫 호출에서 빈 리스트를 넣고 1 을 append. 두 번째는 기존 리스트를 돌려주므로 거기에 2 를 append." },
        { text: "`{\"x\": []}`", why: "setdefault 가 돌려준 리스트에 append 하므로 항목이 들어간다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "없는 키: `d[k]` 는 오류, `get` 은 None/기본값, `setdefault` 는 넣고 돌려줌.",
        "순회는 `for k, v in d.items()`.",
        "`update` 로 합치기, `pop` 으로 빼기.",
        "돌면서 크기를 바꾸지 말 것. 값이 리스트면 `defaultdict(list)`.",
      ],
    },
  ],
};
