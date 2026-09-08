import type { Lesson } from "@/lib/types";

export const setLesson: Lesson = {
  part: 3,
  slug: "set",
  blocks: [
    {
      kind: "viz", component: "SetScene", title: "집합 연산 네 가지",
      caption: "| 합집합, & 교집합, - 차집합, ^ 대칭차. 집합은 순서가 없고 중복이 없으며, in 검사가 해시로 즉시 된다.",
    },
    {
      kind: "text",
      md: `집합(\`set\`)은 **중복 없는, 순서 없는** 모음이다. 딕셔너리에서 값을 뺀 것 — 키만 있는 딕셔너리라고 생각하면 정확하다. 그래서 내부 구조(해시 테이블)도 같고, \`in\` 이 O(1) 인 것도 같고, 원소가 해시 가능해야 하는 것도 같다.

쓰임 세 가지:
- **중복 제거**: \`set(lst)\`
- **빠른 포함 검사**: \`if x in allowed:\` (리스트보다 훨씬 빠르다)
- **집합 연산**: 두 목록의 공통·차이 구하기`,
    },
    {
      kind: "trace", traceId: "p3-set", title: "한 줄씩",
      caption: "set(nums) 에서 중복이 사라지는 것, discard 와 remove 의 차이, 그리고 {} 가 빈 집합이 아니라 빈 딕셔너리라는 함정.",
    },
    {
      kind: "table",
      head: ["연산", "연산자", "메서드", "뜻"],
      rows: [
        ["합집합", "`a | b`", "`a.union(b)`", "둘 중 하나라도"],
        ["교집합", "`a & b`", "`a.intersection(b)`", "둘 다"],
        ["차집합", "`a - b`", "`a.difference(b)`", "a 에만"],
        ["대칭차", "`a ^ b`", "`a.symmetric_difference(b)`", "한쪽에만"],
        ["부분집합", "`a <= b`", "`a.issubset(b)`", "a 가 b 에 전부 포함"],
        ["추가/삭제", "", "`add(x)`, `discard(x)`, `remove(x)`", "`remove` 는 없으면 `KeyError`"],
      ],
    },
    {
      kind: "code", title: "실전 — 두 명단 비교",
      code: `signed_up = {"지기", "영희", "철수"}
attended  = {"영희", "민수"}
print(signed_up - attended)    # 신청했지만 안 온 사람: {'지기', '철수'}
print(attended - signed_up)    # 신청 없이 온 사람: {'민수'}
print(signed_up & attended)    # 둘 다: {'영희'}

# 리스트 중복 제거 (순서 유지하려면 dict 트릭)
items = [3, 1, 3, 2, 1]
print(list(set(items)))              # 순서 보장 안 됨
print(list(dict.fromkeys(items)))    # [3, 1, 2] — 넣은 순서 유지`,
    },
    {
      kind: "pitfall",
      title: "{} 는 빈 딕셔너리다",
      md: `빈 집합은 \`set()\` 이다. \`{}\` 는 빈 딕셔너리. \`{1, 2}\` 처럼 원소가 있을 때만 중괄호로 집합을 만들 수 있다. 딕셔너리가 먼저 있었기 때문에 생긴 역사적 결과다.`,
    },
    {
      kind: "pitfall",
      title: "집합에는 순서가 없다",
      md: `\`{3, 1, 2}\` 를 출력하면 \`{1, 2, 3}\` 으로 나올 수 있지만 이건 우연(작은 정수의 해시가 자기 자신이라)이다. 문자열 집합은 실행마다 순서가 달라진다. 순서가 필요하면 \`sorted(s)\` 로 리스트를 만든다.`,
    },
    {
      kind: "quiz",
      question: "리스트 `lst` 에 중복이 있는지 가장 간단히 확인하는 방법은?",
      choices: [
        { text: "`len(set(lst)) != len(lst)`", correct: true, why: "집합으로 만들면 중복이 사라진다. 길이가 줄었다면 중복이 있었던 것. O(n)." },
        { text: "이중 반복문으로 전부 비교", why: "동작은 하지만 O(n²). 집합이면 한 줄, O(n)." },
        { text: "`lst.count(x) > 1` 을 모든 x 에 대해", why: "count 자체가 O(n) 이라 전체 O(n²)." },
      ],
    },
    {
      kind: "summary",
      items: [
        "집합은 **중복 없음, 순서 없음.** 값 없는 딕셔너리 — `in` 이 O(1).",
        "`|` `&` `-` `^` 로 합집합·교집합·차집합·대칭차.",
        "빈 집합은 `set()`. `{}` 는 딕셔너리.",
        "중복 제거는 `set(lst)`, 순서 유지하며 제거는 `dict.fromkeys(lst)`.",
      ],
    },
  ],
};
