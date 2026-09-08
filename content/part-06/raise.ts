import type { Lesson } from "@/lib/types";

export const raiseLesson: Lesson = {
  part: 6,
  slug: "raise",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "내가 던지고, 내가 정의하고, 원인을 잇는다",
      props: {
        stack: {
          code: ["class InsufficientFunds(Exception):", "    pass", "", "def withdraw(bal, amt):", "    if amt > bal:", "        raise InsufficientFunds(...)", "    return bal - amt", "", "try:", "    withdraw(100, 150)", "except InsufficientFunds as e:", "    print(e)"],
          steps: [
            { chapter: "내 예외", say: "`Exception` 을 상속한 빈 클래스 — 그것만으로 **내 예외 종류**가 생긴다. 이름이 곧 문서다: '잔액 부족'.", ops: [{ line: 0 }] },
            { chapter: "raise", say: "`withdraw(100, 150)` — 150 > 100. `raise InsufficientFunds(...)` — 예외 객체를 만들어 **직접 던진다.** 여기서 함수는 끝난다. `return` 은 실행되지 않는다.", ops: [{ line: 9 }, { push: "withdraw(100, 150)", locals: { bal: "100", amt: "150" } }, { line: 5 }, { raise: "InsufficientFunds" }] },
            { say: "withdraw 에는 except 가 없다. 프레임이 버려지고 호출한 곳(try 블록)으로 올라간다.", ops: [{ pop: true }, { line: 9 }] },
            { say: "`except InsufficientFunds as e` — 잡힌다. `e` 는 던진 그 객체. 메시지를 출력한다.", ops: [{ line: 10 }, { catch: "except InsufficientFunds" }, { line: 11 }, { output: "잔액 100, 요청 150\n" }] },
            { chapter: "왜 예외인가", say: "`return None` 이나 `return -1` 로 실패를 알릴 수도 있다. 하지만 호출자가 **확인을 잊으면** 조용히 잘못된다. 예외는 **무시할 수 없다** — 처리하지 않으면 프로그램이 멈춘다.", ops: [] },
            { chapter: "raise from", say: "예외를 잡아서 **다른 예외로 바꿔** 던질 때 `raise NewError(...) from e` 를 쓰면 원인이 `__cause__` 에 연결되어 트레이스백에 둘 다 남는다. 원인을 잃지 않는다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`raise 예외객체\` 로 예외를 직접 던진다. 함수가 "이 입력은 처리할 수 없다"고 알리는 표준 방법이다.

- \`raise ValueError("나이는 양수여야 합니다")\` — 내장 예외에 메시지
- \`class MyError(Exception): pass\` — 내 예외 정의. 이름으로 잡을 수 있다
- \`raise\` (단독) — except 안에서 잡은 예외를 **그대로 다시** 던진다
- \`raise NewError(...) from e\` — 원인을 연결해 다른 예외로`,
    },
    {
      kind: "trace", traceId: "p6-raise", title: "한 줄씩",
      caption: "커스텀 예외 던지고 잡기, 그리고 raise from 으로 원인 연결하기.",
    },
    {
      kind: "code", title: "내 예외에 정보 담기",
      code: `class InsufficientFunds(Exception):
    def __init__(self, balance, amount):
        super().__init__(f"잔액 {balance}, 요청 {amount}")   # 메시지
        self.balance = balance                                # 추가 정보
        self.amount = amount

try:
    raise InsufficientFunds(100, 150)
except InsufficientFunds as e:
    print(e)              # 잔액 100, 요청 150
    print(e.amount - e.balance)   # 50 — 호출자가 정보를 꺼내 쓴다

# 프로젝트 전용 예외 계층
class AppError(Exception): ...
class ConfigError(AppError): ...
class NetworkError(AppError): ...
# → except AppError 로 '내 프로그램의 오류' 만 한 번에`,
    },
    {
      kind: "pitfall",
      title: "except 안에서 raise e 대신 raise",
      md: `잡은 예외를 다시 던질 때 \`raise e\` 라고 쓰면 트레이스백의 발생 지점이 \`raise e\` 줄로 바뀌어 원래 위치 정보가 흐려진다. 그냥 \`raise\` — 원래 트레이스백을 그대로 유지한 채 다시 던진다.`,
    },
    {
      kind: "callout", tone: "deep", title: "assert 는 raise 가 아니다",
      md: `\`assert 조건, "메시지"\` 는 조건이 거짓이면 \`AssertionError\` 를 던진다. 편리해 보이지만 \`python -O\` (최적화 모드)로 실행하면 **assert 문이 통째로 제거**된다. 입력 검증에는 \`if ...: raise ValueError\` 를 쓰고, \`assert\` 는 "이건 절대 거짓일 리 없다"는 개발자 가정을 적을 때만.`,
    },
    {
      kind: "quiz",
      question: "`raise ValueError(\"x\") from None` 의 효과는?",
      choices: [
        { text: "원인 예외를 트레이스백에서 숨긴다", correct: true, why: "from None 은 __cause__ 를 비우고 '처리 중 다른 예외 발생' 문구도 억제한다. 내부 구현 예외를 사용자에게 보이고 싶지 않을 때." },
        { text: "예외를 던지지 않는다", why: "from 은 원인 연결일 뿐, raise 는 정상적으로 던진다." },
        { text: "None 을 반환한다", why: "raise 는 반환이 아니다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`raise 예외(메시지)` 로 직접 던진다. 실패는 `return -1` 이 아니라 예외로 — 무시할 수 없으니까.",
        "`class MyError(Exception): pass` 로 내 예외. 계층을 만들면 한 번에 잡을 수 있다.",
        "다시 던질 땐 `raise` (단독), 바꿔 던질 땐 `raise New from e`.",
        "`assert` 는 검증용이 아니다 (`-O` 에서 사라진다).",
      ],
    },
  ],
};
