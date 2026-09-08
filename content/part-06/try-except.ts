import type { Lesson } from "@/lib/types";

export const tryExcept: Lesson = {
  part: 6,
  slug: "try-except",
  blocks: [
    {
      kind: "viz", component: "Stack", title: "except 가 예외를 받으면 흐름이 돌아온다",
      props: {
        stack: {
          code: ["def to_int(text):", "    try:", "        return int(text)", "    except ValueError:", "        return None", "", 'to_int("42")', 'to_int("사십이")', "to_int(None)"],
          steps: [
            { chapter: "정상", say: "`to_int(\"42\")` — `int(\"42\")` 성공. `except` 는 **건너뛴다.** 예외가 없으면 except 블록은 존재하지 않는 것과 같다.", ops: [{ line: 6 }, { push: 'to_int("42")', locals: { text: '"42"' } }, { line: 2 }] },
            { say: "", dur: 1500, ops: [{ pop: true, ret: "42" }] },
            { chapter: "잡힘", say: "`to_int(\"사십이\")` — `int()` 가 **`ValueError`** 를 던진다.", ops: [{ line: 7 }, { push: 'to_int("사십이")', locals: { text: '"사십이"' } }, { line: 2 }, { raise: "ValueError" }] },
            { say: "이 프레임에 `except ValueError` 가 있다. **잡힌다.** 예외는 사라지고 except 블록으로 점프 — 프레임은 살아 있다.", ops: [{ line: 3 }, { catch: "except ValueError" }] },
            { say: "`return None`. 정상적으로 돌아간다. 호출한 쪽은 예외가 있었는지도 모른다.", ops: [{ line: 4 }, { pop: true, ret: "None" }] },
            { chapter: "종류가 다르면", say: "`to_int(None)` — `int(None)` 은 **`TypeError`**. `except ValueError` 는 이걸 **받지 않는다.** 종류가 다르니까.", ops: [{ line: 8 }, { push: "to_int(None)", locals: { text: "None" } }, { line: 2 }, { raise: "TypeError" }] },
            { say: "except 가 있어도 종류가 안 맞으면 없는 것과 같다. 예외는 그대로 위로 전파된다.", ops: [{ pop: true }, { uncaught: true }] },
            { chapter: "규칙", say: "**잡을 예외의 종류를 정확히 적는다.** `except:` 나 `except Exception:` 으로 전부 잡으면 진짜 버그(오타로 인한 NameError 등)까지 삼켜 버린다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`\`\`
try:
    위험한 코드
except 예외종류:
    예외가 났을 때
\`\`\`

\`try\` 블록에서 예외가 나면 그 즉시 블록의 나머지를 건너뛰고, **종류가 맞는** \`except\` 로 점프한다. 예외가 안 나면 except 는 건너뛴다. 종류가 안 맞으면 잡지 않고 위로 전파한다.`,
    },
    {
      kind: "trace", traceId: "p6-try-except", title: "한 줄씩 — 세 가지 경우",
      caption: "정상, ValueError 잡힘, TypeError 는 못 잡아 전파.",
    },
    {
      kind: "code", title: "여러 형태",
      code: `try:
    x = int(input())
    y = 10 / x
except ValueError:                    # 종류 하나
    print("숫자를 입력하세요")
except ZeroDivisionError:             # 여러 except — 위에서부터 첫 번째 맞는 것
    print("0은 안 됩니다")
except (TypeError, KeyError) as e:    # 여러 종류를 한 번에 + 객체 받기
    print("문제:", e)
except Exception as e:                # 나머지 전부 (마지막에, 정말 필요할 때만)
    print("예상 못한 오류:", type(e).__name__, e)
    raise                             # 다시 던진다 — 삼키지 않는다`,
    },
    {
      kind: "pitfall",
      title: "except: 로 전부 잡기",
      md: `\`except:\` (종류 없음) 나 \`except Exception:\` 은 오타로 난 \`NameError\`, 잘못된 인자로 난 \`TypeError\` 까지 전부 삼킨다. 프로그램은 조용히 잘못된 채 계속 돈다 — 가장 찾기 어려운 버그. **예상되는 예외만, 정확한 이름으로.** 전부 잡아야 하는 경우(최상위 로깅)는 \`except Exception as e:\` 로 받고 **로그를 남긴 뒤 다시 \`raise\`**.`,
    },
    {
      kind: "callout", tone: "tip", title: "EAFP — 허락보다 용서",
      md: `파이썬은 "먼저 확인하고 하기"(\`if key in d: d[key]\`)보다 "일단 하고 안 되면 잡기"(\`try: d[key] except KeyError:\`)를 선호한다. **EAFP**(Easier to Ask Forgiveness than Permission). 확인과 실행 사이에 상태가 바뀔 수 있는 경우(파일, 네트워크)에 특히 안전하고, 정상 경로가 빠르다.`,
    },
    {
      kind: "quiz",
      question: "다음 코드의 출력은?",
      code: `try:
    print("A")
    int("x")
    print("B")
except ValueError:
    print("C")
print("D")`,
      choices: [
        { text: "`A B C D`", why: "int(\"x\") 에서 예외가 나면 try 블록의 나머지(B)는 건너뛴다." },
        { text: "`A C D`", correct: true, why: "A 출력 → int(\"x\") ValueError → B 건너뜀 → except 에서 C → try/except 뒤의 D 는 정상 실행." },
        { text: "`A C`", why: "except 에서 잡혔으므로 흐름은 정상으로 돌아와 D 도 실행된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`try` 에서 예외 → 나머지 건너뛰고 **종류가 맞는** `except` 로. 안 나면 except 건너뜀.",
        "종류가 안 맞으면 못 잡는다. 여러 `except` 는 위에서부터.",
        "`except:` / `except Exception:` 으로 전부 잡지 말 것. 잡았으면 처리하거나 다시 `raise`.",
        "EAFP — 확인보다 시도하고 잡기.",
      ],
    },
  ],
};
