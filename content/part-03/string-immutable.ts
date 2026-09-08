import type { Lesson } from "@/lib/types";

export const stringImmutable: Lesson = {
  part: 3,
  slug: "string-immutable",
  blocks: [
    {
      kind: "viz", component: "Story", title: "+= 는 매번 새로 만든다, join 은 한 번에",
      props: {
        story: {
          code: ['s = ""', 'for p in ["가", "나", "다", "라"]:', "    s = s + p", '"".join(parts)'],
          steps: [
            { chapter: "+= 반복", say: "빈 문자열에서 시작해 글자를 하나씩 붙여 보자.", ops: [{ line: 0 }, { obj: "s0", type: "str", value: '""' }, { bind: "s", to: "s0" }] },
            { say: "`s + \"가\"` — 문자열은 **바꿀 수 없으니** 새 객체 `\"가\"` 를 만든다. 이름 `s` 가 옮겨 붙고, 빈 문자열은 버려진다.", ops: [{ line: 2 }, { obj: "s1", type: "str", value: '"가"' }, { bind: "s", to: "s1" }, { del: "s0" }] },
            { say: "`\"가\" + \"나\"` — 또 새 객체. `\"가\"` 를 **복사**해서 뒤에 붙인다. 앞 것은 버려진다.", ops: [{ obj: "s2", type: "str", value: '"가나"' }, { bind: "s", to: "s2" }, { del: "s1" }, { badge: "s2", text: "복사 1글자", color: "warn" }] },
            { say: "`\"가나\" + \"다\"` — 2 글자 복사.", ops: [{ obj: "s3", type: "str", value: '"가나다"' }, { bind: "s", to: "s3" }, { del: "s2" }, { badge: "s3", text: "복사 2글자", color: "warn" }] },
            { say: "`\"가나다\" + \"라\"` — 3 글자 복사. n 개를 붙이면 복사량이 1 + 2 + … + n ≈ **n²/2.** 10만 글자면 50억 번.", ops: [{ obj: "s4", type: "str", value: '"가나다라"' }, { bind: "s", to: "s4" }, { del: "s3" }, { badge: "s4", text: "복사 3글자 — 누적 n²", color: "dead" }] },
            { chapter: "join", say: "`\"\".join(parts)` 는 조각들의 **전체 길이를 먼저 계산**하고, 딱 그 크기의 문자열 하나를 만들어 **한 번에** 채운다. 복사량 n.", ops: [{ line: 3 }, { unbadge: "s4" }, { clear: true }, { obj: "P", type: "list", items: ['"가"', '"나"', '"다"', '"라"'] }, { bind: "parts", to: "P" }] },
            { say: "", dur: 2200, ops: [{ obj: "J", type: "str", value: '"가나다라"' }, { bind: "result", to: "J" }, { badge: "J", text: "복사 총 4글자 — 한 번에", color: "fresh" }] },
            { chapter: "규칙", say: "조각을 모아 문자열을 만들 땐 **리스트에 append 하고 마지막에 join.** 반복문 안의 `+=` 는 피한다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `문자열은 **불변(immutable)** 이다. \`s[0] = "x"\` 는 \`TypeError\`. 바꾸려면 새 문자열을 만들어야 한다 — 모든 문자열 메서드가 새 객체를 돌려주는 이유다.

불변이라서 좋은 점: 딕셔너리 키로 쓸 수 있고, 여러 곳에서 안심하고 공유할 수 있고, 해시를 한 번 계산해 캐시할 수 있다. 나쁜 점: **조금씩 이어 붙이는 작업이 비싸다.** 매번 전체를 복사하니까.`,
    },
    {
      kind: "trace", traceId: "p3-join", title: "+= 반복 vs join",
      caption: "반복문 안에서 s 가 매번 다른 객체로 옮겨 가는 것을 오른쪽 화살표에서 보라. join 은 한 번에 만든다.",
    },
    {
      kind: "table",
      head: ["방법", "복사량 (n 조각)", "언제"],
      rows: [
        ["반복문 안 `s += piece`", "≈ n² / 2", "조각 몇 개일 땐 무방. 수천 개부터 체감"],
        ["`\"\".join(pieces)`", "n", "조각을 모아 붙일 때 **표준**"],
        ["f-string", "n", "조각 개수가 정해져 있을 때"],
        ["`io.StringIO`", "n", "아주 많이, 여러 곳에서 쓸 때"],
      ],
    },
    {
      kind: "callout", tone: "deep", title: "CPython 의 몰래 최적화",
      md: `사실 CPython 은 \`s += x\` 에서 \`s\` 를 가리키는 이름이 하나뿐이면 **제자리에서 늘리는 꼼수**를 쓴다. 그래서 간단한 실험에선 \`+=\` 도 빠르게 나올 수 있다. 하지만 이건 보장되지 않는 구현 세부사항이고(PyPy 등 다른 구현에선 없음), 조건이 조금만 달라져도 n² 로 돌아간다. **join 을 습관으로.**`,
    },
    {
      kind: "quiz",
      question: "문자열 `s` 의 첫 글자를 대문자로 바꾸려면?",
      choices: [
        { text: "`s[0] = s[0].upper()`", why: "문자열은 불변이라 인덱스 대입이 안 된다. TypeError." },
        { text: "`s = s[0].upper() + s[1:]`", correct: true, why: "새 문자열을 만들어 s 에 다시 붙인다. (s.capitalize() 도 있지만 나머지를 소문자로 바꾼다.)" },
        { text: "`s.upper(0)`", why: "upper 는 인자를 받지 않고 전체를 대문자로 만든다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "문자열은 **불변.** 바꾸는 모든 연산은 **새 객체**를 만든다.",
        "반복문 안의 `+=` 는 매번 전체를 복사 → n². 조각은 리스트에 모아 `join`.",
        "불변 덕분에 딕셔너리 키가 되고, 안전하게 공유되고, 해시가 캐시된다.",
      ],
    },
  ],
};
