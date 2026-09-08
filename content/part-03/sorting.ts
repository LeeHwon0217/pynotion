import type { Lesson } from "@/lib/types";

export const sorting: Lesson = {
  part: 3,
  slug: "sorting",
  blocks: [
    {
      kind: "viz", component: "SortKeyScene", title: "sorted 와 key — 무엇을 기준으로 줄 세우나",
      caption: "key 함수는 각 항목에서 '비교에 쓸 값'을 뽑는다. 기준값이 같은 항목은 원래 순서를 유지한다(안정 정렬).",
    },
    {
      kind: "text",
      md: `정렬은 두 가지다.

- \`sorted(iter)\` — **새 리스트**를 돌려준다. 원본 그대로. 리스트가 아닌 것(튜플, 문자열, 딕셔너리 키…)도 받는다.
- \`lst.sort()\` — 리스트를 **제자리에서** 정렬하고 \`None\` 을 돌려준다. 메모리를 아낀다.

둘 다 옵션이 같다: \`key=함수\` (기준값 뽑기), \`reverse=True\` (내림차순).`,
    },
    {
      kind: "trace", traceId: "p3-sort", title: "한 줄씩",
      caption: "key=len, key=lambda, 안정 정렬(나이 29 인 지기·철수의 순서 유지), 그리고 sort() 의 None.",
    },
    {
      kind: "heading", text: "key 함수",
    },
    {
      kind: "code",
      code: `words = ["banana", "Apple", "cherry"]
sorted(words)                          # ['Apple', 'banana', 'cherry'] — 대문자가 먼저 (ASCII)
sorted(words, key=str.lower)           # 소문자로 바꾼 값을 기준으로
sorted(words, key=len)                 # 길이 기준
sorted(words, key=len, reverse=True)   # 긴 것부터

people = [("지기", 29), ("영희", 25)]
sorted(people, key=lambda p: p[1])     # 나이 기준
sorted(people, key=lambda p: (-p[1], p[0]))   # 나이 내림차순, 같으면 이름 오름차순

# 딕셔너리를 값 기준으로
scores = {"a": 3, "b": 1, "c": 2}
sorted(scores, key=scores.get)         # ['b', 'c', 'a'] — 키를 값 순으로
sorted(scores.items(), key=lambda kv: kv[1], reverse=True)   # [('a', 3), ('c', 2), ('b', 1)]`,
    },
    {
      kind: "callout", tone: "deep", title: "튜플 키로 다단계 정렬",
      md: `\`key=lambda p: (p.age, p.name)\` 처럼 튜플을 돌려주면 첫 항목으로 비교하고, 같으면 둘째 항목으로 비교한다. 내림차순이 섞이면 숫자는 부호를 뒤집고(\`-p.age\`), 문자열은 뒤집을 수 없으니 **안정 정렬을 이용해 두 번 정렬**한다: 먼저 이름으로 \`sort()\`, 그다음 나이로 \`sort(reverse=True)\`. 나중 정렬이 우선 기준이 된다.`,
    },
    {
      kind: "pitfall",
      title: "섞인 타입은 정렬할 수 없다",
      md: `\`sorted([3, "a"])\` 는 \`TypeError\` — 정수와 문자열은 \`<\` 로 비교할 수 없다. \`None\` 이 섞여 있어도 마찬가지. \`key=str\` 로 전부 문자열로 바꿔 비교하거나, 먼저 걸러낸다.`,
    },
    {
      kind: "quiz",
      question: "`sorted([\"bb\", \"a\", \"ccc\", \"dd\"], key=len)` 의 결과는?",
      choices: [
        { text: "`['a', 'bb', 'dd', 'ccc']`", correct: true, why: "길이 1, 2, 2, 3 순. 길이가 같은 bb 와 dd 는 원래 순서(bb 가 먼저)를 유지한다 — 안정 정렬." },
        { text: "`['a', 'dd', 'bb', 'ccc']`", why: "길이가 같을 때 사전순으로 다시 정렬하지 않는다. 원래 순서 유지." },
        { text: "`['ccc', 'bb', 'dd', 'a']`", why: "reverse 가 없으므로 짧은 것부터." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`sorted()` 는 새 리스트, `.sort()` 는 제자리 + `None`.",
        "`key=` 로 비교 기준값을 뽑는다. `len`, `str.lower`, `lambda`, `dict.get`.",
        "파이썬 정렬은 **안정** 정렬 — 기준값이 같으면 원래 순서 유지. 다단계 정렬에 활용.",
        "튜플 키 `(a, b)` 로 여러 기준. 섞인 타입은 정렬 불가.",
      ],
    },
  ],
};
