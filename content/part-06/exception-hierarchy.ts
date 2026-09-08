import type { Lesson } from "@/lib/types";

const NODES = [
  { id: "BE", label: "BaseException" },
  { id: "SE", label: "SystemExit", parent: "BE", sub: "sys.exit()" },
  { id: "KI", label: "KeyboardInterrupt", parent: "BE", sub: "Ctrl+C" },
  { id: "EX", label: "Exception", parent: "BE", sub: "보통 여기서부터" },
  { id: "AR", label: "ArithmeticError", parent: "EX" },
  { id: "LU", label: "LookupError", parent: "EX" },
  { id: "VE", label: "ValueError", parent: "EX" },
  { id: "TE", label: "TypeError", parent: "EX" },
  { id: "OS", label: "OSError", parent: "EX" },
  { id: "ZD", label: "ZeroDivisionError", parent: "AR" },
  { id: "OV", label: "OverflowError", parent: "AR" },
  { id: "KE", label: "KeyError", parent: "LU" },
  { id: "IE", label: "IndexError", parent: "LU" },
  { id: "FN", label: "FileNotFoundError", parent: "OS" },
  { id: "PE", label: "PermissionError", parent: "OS" },
];

export const exceptionHierarchy: Lesson = {
  part: 6,
  slug: "exception-hierarchy",
  blocks: [
    {
      kind: "viz", component: "Tree", title: "예외는 가계도를 이룬다 — 부모로 잡으면 자식도 잡힌다",
      props: {
        tree: {
          nodes: NODES,
          steps: [
            { chapter: "가계도", say: "모든 예외는 클래스이고, 전부 `BaseException` 의 자손이다. 실제로 잡을 일이 있는 건 **`Exception`** 아래.", lit: ["BE", "EX"] },
            { say: "`SystemExit` 과 `KeyboardInterrupt` 는 Exception 의 **형제**다. `except Exception` 으로는 안 잡힌다 — 프로그램 종료·Ctrl+C 를 실수로 삼키지 않게 하려는 설계.", lit: ["SE", "KI"], dim: ["AR", "LU", "VE", "TE", "OS", "ZD", "OV", "KE", "IE", "FN", "PE"] },
            { chapter: "부모로 잡기", say: "`{}[\"x\"]` 는 `KeyError`. `except LookupError:` 로 잡으면? KeyError 는 LookupError 의 **자식**이므로 **잡힌다.** 위로 올라가며 부모를 확인한다.", path: ["KE", "LU"], badge: { at: "LU", text: "except LookupError → KeyError 잡힘", color: "fresh" } },
            { say: "`IndexError` 도 LookupError 의 자식. 그래서 `except LookupError` 하나로 '없는 키·없는 인덱스' 둘 다 처리된다.", path: ["IE", "LU"] },
            { say: "`1 / 0` → `ZeroDivisionError` → 부모 `ArithmeticError` → 부모 `Exception`. `except Exception` 은 이걸 잡는다. 사실 거의 모든 걸 잡는다 — 그래서 위험하다.", path: ["ZD", "AR", "EX"], badge: { at: "EX", text: "너무 넓다", color: "warn" } },
            { chapter: "형제는 남", say: "`ValueError` 와 `TypeError` 는 형제. `except ValueError` 는 TypeError 를 **못 잡는다.** 잡히는 건 '자신과 자손' 뿐.", lit: ["VE"], dim: ["TE"], badge: { at: "TE", text: "안 잡힘", color: "dead" } },
            { chapter: "규칙", say: "가장 **구체적인** 예외를 잡는다. 여러 종류를 묶어 잡아야 할 때 공통 부모(`OSError`, `LookupError`)를 쓴다. `Exception` 은 최후의 수단.", lit: ["FN", "PE", "OS"] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `예외는 클래스이고 상속 관계로 **트리**를 이룬다. \`except X:\` 는 "X 이거나 X 의 자손"을 잡는다. 이 사실 하나로:

- 여러 관련 예외를 **부모 하나**로 잡을 수 있다 — \`except OSError:\` 는 FileNotFoundError, PermissionError, TimeoutError 등 전부.
- \`except Exception:\` 이 거의 모든 것을 잡는 이유 (너무 넓다).
- \`except ValueError:\` 가 TypeError 를 못 잡는 이유 (형제).

\`isinstance(e, LookupError)\`, \`issubclass(KeyError, LookupError)\` 로 확인할 수 있다.`,
    },
    {
      kind: "trace", traceId: "p6-hierarchy", title: "issubclass 와 부모로 잡기",
      caption: "except LookupError 가 KeyError 를 잡는 것, except Exception 이 ZeroDivisionError 를 잡는 것.",
    },
    {
      kind: "table",
      head: ["부모", "자식 (자주 보는 것)", "뜻"],
      rows: [
        ["`ArithmeticError`", "`ZeroDivisionError`, `OverflowError`", "계산 오류"],
        ["`LookupError`", "`KeyError`, `IndexError`", "없는 키·인덱스"],
        ["`OSError`", "`FileNotFoundError`, `PermissionError`, `TimeoutError`, `ConnectionError`", "OS·파일·네트워크"],
        ["`ValueError`", "`UnicodeError`", "값이 이상함"],
        ["`TypeError`", "—", "타입이 안 맞음"],
        ["`NameError`", "`UnboundLocalError`", "이름 없음"],
        ["`RuntimeError`", "`RecursionError`, `NotImplementedError`", "기타 실행 오류"],
        ["`StopIteration`", "—", "이터레이터 끝 (Part 8)"],
      ],
    },
    {
      kind: "pitfall",
      title: "except 순서 — 부모를 먼저 쓰면 자식은 영원히 안 잡힌다",
      md: `\`except Exception:\` 을 먼저 쓰고 그 아래 \`except ValueError:\` 를 쓰면, ValueError 도 첫 번째에서 잡혀 버려 두 번째는 죽은 코드가 된다. **구체적인 것을 위에, 넓은 것을 아래에.**`,
    },
    {
      kind: "quiz",
      question: "`except OSError:` 가 잡을 수 **없는** 것은?",
      choices: [
        { text: "`FileNotFoundError`", why: "OSError 의 자식이다. 잡힌다." },
        { text: "`PermissionError`", why: "OSError 의 자식이다. 잡힌다." },
        { text: "`KeyError`", correct: true, why: "KeyError 는 LookupError 의 자식이지 OSError 와 무관하다. 형제 가지에 있으므로 잡히지 않는다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "예외는 클래스 트리. `except X` 는 **X 와 그 자손**을 잡는다.",
        "공통 부모로 묶어 잡고, 형제는 서로 못 잡는다.",
        "`except` 는 **구체적인 것부터** 위에. `Exception` 은 마지막.",
        "`SystemExit`, `KeyboardInterrupt` 는 `Exception` 밖 — 일부러.",
      ],
    },
  ],
};
