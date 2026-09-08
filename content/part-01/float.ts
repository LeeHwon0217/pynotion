import type { Lesson } from "@/lib/types";

export const floatLesson: Lesson = {
  part: 1,
  slug: "float",
  blocks: [
    {
      kind: "viz", component: "FloatScene", title: "0.1 + 0.2 는 왜 0.3 이 아닌가",
      caption: "10진법의 1/3 이 0.333… 으로 끝나지 않듯, 2진법에서는 0.1 이 끝나지 않는다. 64비트에서 잘라 저장하는 순간 오차가 생긴다.",
    },
    {
      kind: "text",
      md: `\`float\`는 소수를 다루는 타입이다. 겉으로는 평범해 보이지만 **모든 언어 공통의 함정**이 하나 있다 — \`0.1 + 0.2 == 0.3\`이 \`False\`다.

이유는 애니메이션에서 봤다. 컴퓨터는 수를 2진법으로 저장하는데, 0.1 은 2진법으로 무한소수다. 64비트 안에 넣으려면 어딘가에서 잘라야 하고, 그 순간 0.1 은 정확히 0.1 이 아니게 된다. 0.2 도 마찬가지. 둘의 오차가 더해져서 0.3 의 근사값과 어긋난다.

이건 파이썬의 문제가 아니다. C, Java, JavaScript 전부 같다. **IEEE 754** 라는 표준을 따르기 때문이다.`,
    },
    {
      kind: "trace", traceId: "p1-float-sum", title: "오차를 직접 확인하고 다루기",
      caption: "print 하면 오차가 보인다. == 대신 math.isclose 로 비교하고, 표시할 땐 round 로 자릿수를 정한다.",
    },
    {
      kind: "heading", text: "언제 무엇을 쓰나",
    },
    {
      kind: "table",
      head: ["상황", "도구", "예"],
      rows: [
        ["두 float 비교", "`math.isclose(a, b)`", "`math.isclose(0.1 + 0.2, 0.3)` → `True`"],
        ["출력 자릿수 정하기", "`round()` 또는 f-string", "`f\"{x:.2f}\"` → `'0.30'`"],
        ["돈 계산 (오차 허용 불가)", "`decimal.Decimal`", "`Decimal('0.1') + Decimal('0.2') == Decimal('0.3')` → `True`"],
        ["분수 그대로", "`fractions.Fraction`", "`Fraction(1, 3) + Fraction(1, 6)` → `Fraction(1, 2)`"],
      ],
      caption: "Decimal 은 문자열로 만들어야 한다. Decimal(0.1) 은 이미 오차가 든 float 를 받는다.",
    },
    {
      kind: "pitfall",
      title: "float 를 == 로 비교하는 코드",
      md: `\`if total == 0.3:\` 같은 코드는 언젠가 조용히 틀린다. 계산 경로에 따라 같은 값이 나올 수도, 아주 조금 다른 값이 나올 수도 있기 때문이다. **float 는 == 로 비교하지 않는다**를 습관으로 삼는다. \`math.isclose\` 또는 \`abs(a - b) < 1e-9\`.`,
    },
    {
      kind: "callout", tone: "deep", title: "float 의 한계",
      md: `64비트 float 는 유효 숫자가 약 **15~17자리**다. \`0.1 + 0.2\` 가 \`0.30000000000000004\` 로 찍히는 게 17번째 자리다. 정수는 \`2 ** 53\` (약 9천조) 까지는 정확히 표현되지만 그 위로는 건너뛰는 값이 생긴다 — \`float(2**53 + 1) == 2**53\` 이 \`True\`. 아주 큰 수나 아주 작은 수는 \`1e300\`, \`1e-300\` 처럼 지수 표기로 쓴다. 더 커지면 \`inf\`(무한)가 된다.`,
    },
    {
      kind: "quiz",
      question: "`0.1 * 3 == 0.3` 의 값은?",
      choices: [
        { text: "`True`", why: "0.1 이 이미 근사값이고, 3 을 곱하면 오차도 3배가 된다. 0.30000000000000004 가 나온다." },
        { text: "`False`", correct: true, why: "0.1 * 3 은 0.30000000000000004. 0.3 의 근사값과 다르다. math.isclose 를 써야 한다." },
        { text: "오류", why: "float 끼리의 비교는 정상 동작한다. 결과가 기대와 다를 뿐이다." },
      ],
    },
    {
      kind: "quiz",
      question: "돈 계산에서 오차를 없애려면?",
      choices: [
        { text: "`round(x, 2)` 로 매번 반올림", why: "표시는 되지만 내부 값의 오차가 누적된다. 근본 해결이 아니다." },
        { text: "`decimal.Decimal` 을 문자열로 만들어 쓴다", correct: true, why: "Decimal 은 10진 소수를 정확히 저장한다. Decimal('0.1') 처럼 문자열로 만들어야 float 의 오차가 섞이지 않는다." },
        { text: "`float` 대신 `int` 로 원 단위만 쓴다", why: "이것도 실무에서 흔히 쓰는 방법이지만(센트 단위 정수), 소수 이자율 등에서는 결국 Decimal 이 필요하다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`float` 는 2진 부동소수점. **0.1 은 2진법 무한소수**라 오차가 생긴다. 모든 언어 공통.",
        "float 는 `==` 로 비교하지 않는다. `math.isclose()` 를 쓴다.",
        "표시는 `round()` / `f\"{x:.2f}\"`, 정확한 돈 계산은 `Decimal('0.1')`.",
        "유효 숫자 약 15~17자리, 정수는 `2 ** 53` 까지 정확.",
      ],
    },
  ],
};
