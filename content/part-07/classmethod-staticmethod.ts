import type { Lesson } from "@/lib/types";

export const classmethodStaticmethod: Lesson = {
  part: 7,
  slug: "classmethod-staticmethod",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "self 대신 cls, 또는 아무것도",
      props: {
        stack: {
          code: ["class Date:", "    @classmethod", "    def from_str(cls, text):", "        y, m, d = ...", "        return cls(y, m, d)", "    @staticmethod", "    def is_leap(y):", "        return ...", "", 'Date.from_str("2026-09-08")', "Date.is_leap(2024)"],
          steps: [
            { chapter: "classmethod", say: "`Date.from_str(...)` — 인스턴스가 없는데 호출한다. `@classmethod` 는 첫 인자로 **클래스 자체**(`cls`)를 넘긴다.", ops: [{ line: 9 }, { push: "from_str(cls, text)", locals: { cls: "Date", text: '"2026-09-08"' } }, { line: 3 }] },
            { say: "문자열을 쪼개 `cls(2026, 9, 8)` — 즉 `Date(2026, 9, 8)`. **대안 생성자**다. `__init__` 은 하나뿐이지만 만드는 방법은 여러 개일 수 있다.", ops: [{ line: 4 }, { set: { y: "2026", m: "9", d: "8" } }, { pop: true, ret: "Date(2026, 9, 8)" }] },
            { say: "`Date` 대신 `cls` 를 쓰는 이유: 자식 클래스 `MyDate.from_str(...)` 로 부르면 `cls` 가 MyDate 라서 **MyDate 인스턴스**가 나온다. 상속에 안전하다.", ops: [{ note: "cls 는 실제로 호출된 클래스" }] },
            { chapter: "staticmethod", say: "`Date.is_leap(2024)` — `self` 도 `cls` 도 받지 않는다. 클래스와 관련은 있지만 인스턴스나 클래스 상태를 안 쓰는 **그냥 함수**를 클래스 안에 둔 것.", ops: [{ line: 10 }, { push: "is_leap(y)", locals: { y: "2024" } }, { line: 7 }] },
            { say: "", dur: 1500, ops: [{ pop: true, ret: "True" }] },
            { chapter: "고르기", say: "인스턴스 상태를 쓰면 **일반 메서드**, 클래스를 써야 하면(생성자·클래스 속성) **classmethod**, 둘 다 아니면 **staticmethod** — 또는 그냥 모듈 함수로 뺀다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "table",
      head: ["", "일반 메서드", "`@classmethod`", "`@staticmethod`"],
      rows: [
        ["첫 인자", "`self` (인스턴스)", "`cls` (클래스)", "없음"],
        ["접근 가능", "인스턴스 + 클래스", "클래스 속성", "아무것도"],
        ["호출", "`obj.m()`", "`Cls.m()` 또는 `obj.m()`", "`Cls.m()` 또는 `obj.m()`"],
        ["용도", "대부분", "**대안 생성자**, 클래스 설정", "관련 유틸리티"],
      ],
    },
    {
      kind: "trace", traceId: "p7-classmethod", title: "한 줄씩",
      caption: "from_str 의 cls 에 Date 클래스가 들어오는 것, is_leap 이 클래스로도 인스턴스로도 불리는 것.",
    },
    {
      kind: "code", title: "대안 생성자 — 표준 라이브러리에도",
      code: `dict.fromkeys(["a", "b"], 0)          # {'a': 0, 'b': 0}
datetime.fromtimestamp(0)              # 1970-01-01 ...
int.from_bytes(b"\\x01\\x00", "big")     # 256
Path.cwd()                             # 현재 폴더

# 내 클래스
class Config:
    def __init__(self, data): self.data = data

    @classmethod
    def from_json(cls, path):
        import json
        with open(path) as f:
            return cls(json.load(f))

    @classmethod
    def default(cls):
        return cls({"debug": False})`,
    },
    {
      kind: "pitfall",
      title: "staticmethod 를 남발하기",
      md: `클래스와 정말 관련 없는 함수는 그냥 **모듈 수준 함수**로 두는 게 파이썬답다. \`Utils.helper()\` 처럼 함수를 담으려고 클래스를 만드는 건 다른 언어의 습관이다. staticmethod 는 "이 클래스와 개념적으로 묶이지만 상태는 안 쓴다"는 경우에만.`,
    },
    {
      kind: "quiz",
      question: "`class B(A): pass` 이고 A 에 `@classmethod def make(cls): return cls()` 가 있을 때 `B.make()` 는?",
      choices: [
        { text: "A 의 인스턴스", why: "cls 는 정의된 클래스가 아니라 호출된 클래스다." },
        { text: "B 의 인스턴스", correct: true, why: "B.make() 로 부르면 cls 는 B. cls() 는 B(). 이것이 Date 대신 cls 를 쓰는 이유." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`@classmethod` — 첫 인자 `cls`. **대안 생성자**에 쓴다. `cls()` 로 만들면 상속에 안전.",
        "`@staticmethod` — 인자 없음. 클래스 안의 그냥 함수. 남발하지 말고 모듈 함수로.",
        "인스턴스 상태를 쓰면 일반 메서드.",
      ],
    },
  ],
};
