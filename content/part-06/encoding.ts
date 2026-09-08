import type { Lesson } from "@/lib/types";

export const encoding: Lesson = {
  part: 6,
  slug: "encoding",
  blocks: [
    {
      kind: "viz", component: "Story", title: "글자와 바이트 사이 — 인코딩",
      props: {
        story: {
          code: ['s = "가"', 'b = s.encode("utf-8")', 'b.decode("utf-8")', 'b.decode("cp949")'],
          steps: [
            { chapter: "str", say: "파이썬의 문자열은 **글자**(유니코드 코드 포인트)의 나열이다. `\"가\"` 는 U+AC00 하나. 디스크나 네트워크는 글자를 모른다 — **바이트**만 안다.", ops: [{ line: 0 }, { obj: "S", type: "str", value: '"가"', note: "U+AC00 — 글자 1개" }] },
            { chapter: "encode", say: "`encode(\"utf-8\")` — 글자를 **바이트열**로 바꾸는 규칙. UTF-8 에서 한글 한 글자는 **3바이트.** 영문은 1바이트.", ops: [{ line: 1 }, { obj: "B", type: "bytes", items: ["EA", "B0", "80"], note: "3바이트" }, { bind: "b", to: "B" }] },
            { chapter: "decode", say: "`decode(\"utf-8\")` — 같은 규칙으로 되돌린다. **쓸 때와 읽을 때 규칙이 같아야** 원래 글자가 나온다.", ops: [{ line: 2 }, { obj: "S2", type: "str", value: '"가"' }, { badge: "S2", text: "복원", color: "fresh" }] },
            { chapter: "다른 규칙으로", say: "같은 바이트를 `cp949`(윈도우 옛 한글 규칙) 로 읽으면? EA B0 80 을 다르게 해석해 **엉뚱한 글자**가 나오거나 오류. 이것이 '한글 깨짐' 의 정체.", ops: [{ line: 3 }, { del: "S2" }, { obj: "S3", type: "str", value: '"陝\\x80"' }, { badge: "S3", text: "UnicodeDecodeError 또는 깨짐", color: "dead" }] },
            { chapter: "규칙", say: "**언제나 UTF-8.** `open(..., encoding=\"utf-8\")` 을 습관으로. 생략하면 OS 기본값(윈도우는 cp949)이 쓰여 다른 컴퓨터에서 깨진다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`str\` 은 글자, \`bytes\` 는 0~255 숫자의 나열이다. 둘 사이를 오가는 규칙이 **인코딩**이다.

- \`"가".encode("utf-8")\` → \`b'\\xea\\xb0\\x80'\` (str → bytes)
- \`b'\\xea\\xb0\\x80'.decode("utf-8")\` → \`"가"\` (bytes → str)

파일·네트워크·DB 는 bytes 를 다룬다. 텍스트 모드로 \`open\` 하면 파이썬이 알아서 encode/decode 해 주는데, **어떤 규칙으로 할지**를 \`encoding=\` 으로 정해야 한다. 안 정하면 OS 기본값 — Windows 는 \`cp949\`, Mac/Linux 는 \`utf-8\`. 그래서 윈도우에서 만든 파일이 맥에서 깨진다.`,
    },
    {
      kind: "trace", traceId: "p6-encoding", title: "encode / decode 직접 보기",
      caption: "UTF-8 은 한글 3바이트, cp949 는 2바이트 — 표현이 다르다. 마지막 줄에서 규칙이 어긋나면 깨진다.",
    },
    {
      kind: "table",
      head: ["인코딩", "한글 1자", "쓰이는 곳"],
      rows: [
        ["**UTF-8**", "3바이트", "웹, Linux/Mac, 거의 모든 현대 시스템. **기본 선택**"],
        ["`cp949` / `euc-kr`", "2바이트", "옛 윈도우 한글, 일부 공공 데이터 CSV"],
        ["`utf-16`", "2~4바이트", "윈도우 내부, 일부 텍스트 파일 (BOM 있음)"],
        ["`ascii`", "표현 불가", "영문만. 한글 넣으면 `UnicodeEncodeError`"],
      ],
    },
    {
      kind: "pitfall",
      title: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xb0",
      md: `파일이 cp949 로 저장됐는데 utf-8 로 읽었다는 뜻이다. \`open(p, encoding="cp949")\` 로 읽고, 다시 저장할 땐 utf-8 로. 인코딩을 모르는 파일은 \`chardet\` 패키지로 추측하거나, \`errors="replace"\` 로 깨진 글자를 �로 바꿔 일단 읽는다.`,
    },
    {
      kind: "callout", tone: "deep", title: "왜 UTF-8 인가",
      md: `유니코드는 세상의 모든 글자에 번호(코드 포인트)를 매긴 표다. 그 번호를 바이트로 적는 방법이 여럿인데, UTF-8 은 영문을 1바이트로 두어 ASCII 와 호환되고, 다른 글자는 2~4바이트로 늘리는 가변 길이 방식이다. 낭비가 적고 호환성이 좋아 사실상 표준이 됐다. 파이썬 3.15 부터는 \`open()\` 의 기본 인코딩도 UTF-8 로 바뀔 예정이다.`,
    },
    {
      kind: "quiz",
      question: "`len(\"안녕\")` 과 `len(\"안녕\".encode(\"utf-8\"))` 는?",
      choices: [
        { text: "`2` 와 `2`", why: "encode 하면 바이트 수를 센다. 한글은 UTF-8 에서 글자당 3바이트." },
        { text: "`2` 와 `6`", correct: true, why: "str 의 len 은 글자 수(2), bytes 의 len 은 바이트 수(3 × 2 = 6)." },
        { text: "`6` 과 `6`", why: "str 은 글자 단위로 센다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`str` = 글자, `bytes` = 숫자열. `encode` / `decode` 로 오간다. 규칙이 **같아야** 복원된다.",
        "파일을 열 땐 **항상 `encoding=\"utf-8\"`.** 생략하면 OS 마다 다르다.",
        "`UnicodeDecodeError` = 저장한 규칙과 읽는 규칙이 다름.",
      ],
    },
  ],
};
