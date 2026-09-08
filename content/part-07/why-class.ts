import type { Lesson } from "@/lib/types";

export const whyClass: Lesson = {
  part: 7,
  slug: "why-class",
  blocks: [
    {
      kind: "viz", component: "Story", title: "데이터와 동작이 흩어져 있을 때 vs 한 곳에 있을 때",
      props: {
        story: {
          code: ['acct = {"owner": "지기", "balance": 100}', "def deposit(a, amount): ...", "def withdraw(a, amount): ...", "", "acc = Account(\"지기\", 100)", "acc.deposit(50)"],
          steps: [
            { chapter: "딕셔너리 + 함수", say: "계좌 하나를 딕셔너리로, 동작은 따로 함수로. 작을 땐 괜찮다.", ops: [{ line: 0 }, { obj: "D", type: "dict", entries: [['"owner"', '"지기"'], ['"balance"', "100"]] }, { bind: "acct", to: "D" }, { obj: "F1", type: "function", value: "deposit" }, { obj: "F2", type: "function", value: "withdraw" }, { bind: "deposit", to: "F1" }, { bind: "withdraw", to: "F2" }] },
            { say: "문제 ① — `deposit(acct, 50)` 에 **아무 딕셔너리나** 넘길 수 있다. 키 이름을 잘못 쓰면 실행할 때야 터진다. 문제 ② — 계좌 관련 함수가 10개가 되면 어디 있는지 흩어진다.", ops: [{ badge: "D", text: "이 dict 가 계좌라는 보장 없음", color: "warn" }] },
            { chapter: "클래스", say: "`Account` 클래스 — **데이터(속성)와 동작(메서드)을 한 곳에** 묶은 설계도. 인스턴스 `acc` 는 그 설계도로 찍어낸 실물.", ops: [{ clear: true }, { line: 4 }, { obj: "K", type: "class", fields: [["__init__", "<function>"], ["deposit", "<function>"], ["withdraw", "<function>"]], note: "Account — 설계도" }, { obj: "I", type: "Account", fields: [["owner", '"지기"'], ["balance", "100"]], note: "인스턴스 — 실물" }, { bind: "Account", to: "K" }, { bind: "acc", to: "I" }] },
            { say: "`acc.deposit(50)` — '이 계좌에 입금' 이 점 하나로 읽힌다. 어떤 동작이 가능한지 클래스만 보면 안다. 잘못된 객체에 부를 수도 없다.", ops: [{ line: 5 }, { mutate: "I", fields: [["owner", '"지기"'], ["balance", "150"]] }, { badge: "I", text: "acc.balance → 150", color: "fresh" }] },
            { chapter: "언제 쓰나", say: "**같은 모양의 데이터가 여럿**이고, 그 데이터에 **딸린 동작**이 있을 때. 계좌·사용자·주문·게임 캐릭터. 반대로 함수 하나로 끝나는 일에 클래스를 만들 필요는 없다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `지금까지 배운 것만으로도 프로그램은 만들 수 있다 — 데이터는 딕셔너리에, 동작은 함수에. 그런데 프로그램이 커지면 두 가지가 아프다.

1. **어떤 데이터에 어떤 동작이 가능한지**가 코드에 드러나지 않는다. \`deposit(x, 50)\` 의 \`x\` 가 계좌인지 사용자인지 함수 이름으로 짐작할 뿐.
2. 관련된 것들이 **흩어진다.** 계좌 함수 10개가 파일 여기저기.

**클래스**는 데이터(속성)와 동작(메서드)을 한 덩어리로 묶는 설계도다. 설계도로 만든 실물이 **인스턴스**. 파이썬에서 지금까지 쓴 리스트·문자열·딕셔너리가 전부 클래스의 인스턴스였다 — \`"abc".upper()\` 의 점이 바로 그것.`,
    },
    {
      kind: "trace", traceId: "p7-why-class", title: "같은 일, 두 가지 방식",
      caption: "오른쪽에서 Account 클래스 객체와 인스턴스 객체가 따로 생기는 것을 보라. 인스턴스의 필드가 딕셔너리처럼 보이는 건 우연이 아니다.",
    },
    {
      kind: "table",
      head: ["", "딕셔너리 + 함수", "클래스"],
      rows: [
        ["데이터", "`{\"balance\": 100}`", "`self.balance = 100`"],
        ["동작", "`deposit(acct, 50)`", "`acct.deposit(50)`"],
        ["잘못된 대상", "실행 때 KeyError", "메서드 자체가 없음 → 바로 AttributeError"],
        ["확장", "함수를 또 만든다", "메서드를 추가하거나 **상속**"],
        ["어울리는 곳", "일회성 데이터, 설정, JSON", "같은 모양이 여럿 + 딸린 동작"],
      ],
    },
    {
      kind: "callout", tone: "tip", title: "클래스가 과한 경우",
      md: `메서드가 \`__init__\` 하나뿐인 클래스는 그냥 딕셔너리나 \`dataclass\` (이 파트 후반) 가 낫다. 함수 하나면 되는 일에 클래스를 만드는 것도 흔한 과잉이다. "데이터 + 그 데이터를 다루는 동작 여러 개"가 있을 때 클래스.`,
    },
    {
      kind: "quiz",
      question: "클래스를 쓰는 것이 가장 어울리는 경우는?",
      choices: [
        { text: "설정 파일에서 읽은 옵션 몇 개를 담아 두기", why: "딕셔너리가 딱이다. 동작이 없다." },
        { text: "게임의 플레이어들 — 각자 체력·위치가 있고 이동·공격 동작이 있다", correct: true, why: "같은 모양의 데이터가 여럿이고 그 데이터에 딸린 동작이 여럿. 클래스의 전형." },
        { text: "두 수의 최대공약수 구하기", why: "함수 하나면 끝난다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "클래스 = **속성 + 메서드**를 묶은 설계도. 인스턴스 = 설계도로 만든 실물.",
        "`acc.deposit(50)` — 어떤 데이터에 어떤 동작인지가 코드에 드러난다.",
        "같은 모양이 여럿 + 딸린 동작 → 클래스. 데이터만 → 딕셔너리, 동작만 → 함수.",
        "리스트·문자열도 전부 클래스의 인스턴스였다.",
      ],
    },
  ],
};
