import type { Lesson } from "@/lib/types";

export const dictBasics: Lesson = {
  part: 3,
  slug: "dict-basics",
  blocks: [
    {
      kind: "viz", component: "Story", title: "딕셔너리 — 키로 값을 찾는다",
      props: {
        story: {
          code: ['ages = {"지기": 29}', 'ages["영희"] = 31', 'ages["지기"] = 30', 'del ages["영희"]', 'ages["없음"]'],
          steps: [
            { chapter: "만들기", say: "`{키: 값}` — 키 `\"지기\"` 로 값 `29` 를 찾을 수 있는 객체. 리스트가 **번호**로 찾는다면 딕셔너리는 **키**로 찾는다.", ops: [{ line: 0 }, { obj: "D", type: "dict", entries: [['"지기"', "29"]] }, { bind: "ages", to: "D" }] },
            { chapter: "추가", say: "없는 키에 대입하면 **새 쌍이 추가**된다. 딕셔너리 객체가 제자리에서 바뀐다.", ops: [{ line: 1 }, { mutate: "D", entries: [['"지기"', "29"], ['"영희"', "31"]] }] },
            { chapter: "덮어쓰기", say: "있는 키에 대입하면 **값이 바뀐다.** 키는 중복될 수 없으니 새 쌍이 생기지 않는다.", ops: [{ line: 2 }, { mutate: "D", entries: [['"지기"', "30"], ['"영희"', "31"]] }] },
            { chapter: "삭제", say: "`del ages[\"영희\"]` — 쌍을 지운다.", ops: [{ line: 3 }, { mutate: "D", entries: [['"지기"', "30"]] }] },
            { chapter: "없는 키", say: "`ages[\"없음\"]` — 없는 키를 `[]` 로 읽으면 **`KeyError`.** 오류 없이 읽으려면 `ages.get(\"없음\")` (다음다음 레슨).", ops: [{ line: 4 }, { badge: "D", text: "KeyError: '없음'", color: "dead" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `딕셔너리(\`dict\`)는 **키 → 값** 쌍의 모음이다. 전화번호부처럼 이름으로 번호를 찾는다. 키는 중복될 수 없고, 값은 뭐든 된다.

- 만들기: \`{}\`, \`{"a": 1, "b": 2}\`, \`dict(a=1, b=2)\`
- 읽기: \`d["a"]\` (없으면 \`KeyError\`), \`d.get("a")\` (없으면 \`None\`)
- 쓰기: \`d["c"] = 3\` — 있으면 덮어쓰기, 없으면 추가
- 삭제: \`del d["a"]\`, \`d.pop("a")\`
- 검사: \`"a" in d\` — **키**를 검사한다
- 개수: \`len(d)\`

파이썬 3.7 부터 딕셔너리는 **넣은 순서를 기억한다.** \`for k in d\` 는 추가한 순서대로 돈다.`,
    },
    {
      kind: "trace", traceId: "p3-dict", title: "한 줄씩",
      caption: "추가·덮어쓰기·삭제에서 딕셔너리 객체가 제자리에서 바뀌는 것. 마지막 줄은 일부러 KeyError.",
    },
    {
      kind: "heading", text: "언제 리스트 대신 딕셔너리인가",
    },
    {
      kind: "table",
      head: ["", "리스트", "딕셔너리"],
      rows: [
        ["찾는 방법", "번호 (0, 1, 2 …)", "**키** (이름, id, 좌표 …)"],
        ["`x in`", "앞에서부터 전부 비교 O(n)", "해시로 즉시 O(1)"],
        ["순서", "번호가 곧 순서", "넣은 순서 (3.7+)"],
        ["어울리는 데이터", "같은 종류의 나열 (점수들, 파일들)", "이름 붙은 항목들 (설정, 사람 한 명의 정보, 개수 세기)"],
      ],
    },
    {
      kind: "code", title: "가장 흔한 쓰임 — 개수 세기",
      code: `counts = {}
for word in ["a", "b", "a", "c", "a"]:
    counts[word] = counts.get(word, 0) + 1   # 없으면 0 에서 시작
print(counts)   # {'a': 3, 'b': 1, 'c': 1}

# 같은 일을 표준 라이브러리로
from collections import Counter
print(Counter(["a", "b", "a", "c", "a"]))   # Counter({'a': 3, 'b': 1, 'c': 1})`,
    },
    {
      kind: "pitfall",
      title: "값으로는 못 찾는다",
      md: `\`ages[29]\` 처럼 값으로 키를 찾는 건 안 된다 — 딕셔너리는 한 방향이다. 값으로 찾아야 하면 \`for k, v in d.items(): if v == 29\` 로 훑거나, 반대 방향 딕셔너리를 하나 더 만든다(\`{v: k for k, v in d.items()}\`).`,
    },
    {
      kind: "quiz",
      question: "`d = {\"a\": 1}; d[\"a\"] = 2; d[\"b\"] = 3` 후 `len(d)` 는?",
      choices: [
        { text: "3", why: "\"a\" 에 두 번 대입했지만 키는 중복되지 않는다. 두 번째는 덮어쓰기." },
        { text: "2", correct: true, why: "\"a\" 는 덮어쓰기(값만 1 → 2), \"b\" 는 추가. 쌍은 두 개." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`{키: 값}`. 키는 유일, 값은 자유. **키로** 찾는다.",
        "`d[k] = v` 는 있으면 덮어쓰기, 없으면 추가. `d[k]` 읽기는 없으면 `KeyError`.",
        "`in` 은 **키**를 검사하고, 해시 덕분에 즉시 답한다.",
        "3.7+ 는 **넣은 순서**를 기억한다.",
      ],
    },
  ],
};
