import type { Lesson } from "@/lib/types";

export const mainLesson: Lesson = {
  part: 5,
  slug: "main",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "직접 실행 vs import — __name__ 이 갈린다",
      props: {
        flow: {
          code: ["# calc.py", "def add(a, b):", "    return a + b", "", 'if __name__ == "__main__":', "    print(add(2, 3))"],
          nodes: [
            { id: "s", kind: "start", label: "calc.py 코드 실행", x: 640, y: 70 },
            { id: "d", kind: "step", label: "def add → 함수 객체", x: 640, y: 160 },
            { id: "c", kind: "cond", label: '__name__ == "__main__" ?', x: 640, y: 270 },
            { id: "p", kind: "io", label: "print(add(2, 3))", x: 460, y: 400 },
            { id: "e", kind: "end", label: "끝 (import 한 쪽으로)", x: 820, y: 400 },
          ],
          edges: [
            { from: "s", to: "d" }, { from: "d", to: "c" },
            { from: "c", to: "p", label: "참 (직접 실행)", via: [[460, 270]] },
            { from: "c", to: "e", label: "거짓 (import 됨)", via: [[820, 270]] },
          ],
          steps: [
            { chapter: "python calc.py", say: "터미널에서 `python calc.py` 로 **직접 실행**하면 파이썬은 이 파일의 `__name__` 을 `\"__main__\"` 으로 정한다.", at: "s", line: 0, vars: { __name__: '"__main__"' } },
            { say: "위에서부터 실행. `def` 는 함수 객체만 만든다.", at: "d", line: 1 },
            { say: "`if __name__ == \"__main__\"` — 참. 테스트 코드가 실행된다.", at: "c", line: 4, badge: { at: "c", text: "True", color: "fresh" } },
            { say: "", dur: 1600, at: "p", line: 5, output: "5\n" },
            { chapter: "import calc", say: "이번엔 다른 파일이 `import calc` 를 한 경우. 파이썬은 `__name__` 을 **모듈 이름** `\"calc\"` 로 정한다.", at: "s", line: 0, vars: { __name__: '"calc"' }, reset: true },
            { say: "", dur: 1400, at: "d", line: 1 },
            { say: "조건이 **거짓.** 테스트 코드는 건너뛴다. import 한 쪽은 `calc.add` 만 깔끔하게 얻는다.", at: "c", line: 4, badge: { at: "c", text: "False", color: "dead" } },
            { say: "", dur: 1600, at: "e" },
            { chapter: "왜 쓰나", say: "한 파일이 **도구(import 용)** 이면서 **프로그램(직접 실행용)** 일 수 있게 한다. 파이썬 스크립트의 마지막 줄이 거의 항상 이 형태인 이유.", at: "e" },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `모든 모듈에는 \`__name__\` 이라는 변수가 자동으로 있다. 파이썬이 그 파일을 어떻게 실행하느냐에 따라 값이 다르다.

- \`python calc.py\` 로 **직접 실행** → \`__name__ == "__main__"\`
- 다른 파일에서 \`import calc\` → \`__name__ == "calc"\` (파일 이름)

\`if __name__ == "__main__":\` 은 "이 파일이 직접 실행될 때만"이라는 뜻. 그 안에 테스트 코드, 명령줄 진입점을 둔다. import 될 때는 실행되지 않으므로 다른 파일이 함수만 깨끗하게 가져다 쓸 수 있다.`,
    },
    {
      kind: "trace", traceId: "p5-main", title: "직접 실행할 때",
      caption: "이 추적기는 '직접 실행' 모드라 __name__ 이 \"__main__\" 이고 main() 이 실행된다.",
    },
    {
      kind: "code", title: "관례적인 파일 구조",
      code: `"""모듈 설명."""
import sys                     # 1. import

CONFIG = {...}                 # 2. 상수

def helper(): ...              # 3. 함수/클래스 정의
def main():                    # 4. 진입점 — 실제 일은 여기서
    args = sys.argv[1:]
    ...

if __name__ == "__main__":     # 5. 직접 실행일 때만 main 호출
    main()`,
      caption: "main() 으로 감싸는 이유: 전역 변수를 안 만들고, 테스트에서 main() 을 직접 부를 수 있고, return 으로 종료 코드를 줄 수 있다.",
    },
    {
      kind: "pitfall",
      title: "모듈 수준에 실행 코드를 그대로 두기",
      md: `\`calc.py\` 맨 아래에 \`print(add(2, 3))\` 을 그냥 두면, 다른 파일이 \`import calc\` 할 때마다 그 줄이 실행되어 5 가 찍힌다. 함수를 재사용하려고 import 했는데 부작용이 따라온다. 실행 코드는 반드시 \`if __name__ == "__main__":\` 아래로.`,
    },
    {
      kind: "quiz",
      question: "`tool.py` 에 `if __name__ == \"__main__\": print(\"A\")` 와 그 밖에 `print(\"B\")` 가 있다. 다른 파일에서 `import tool` 하면 무엇이 출력될까?",
      choices: [
        { text: "`A` 와 `B`", why: "import 될 때 __name__ 은 \"tool\" 이라 A 블록은 실행되지 않는다." },
        { text: "`B` 만", correct: true, why: "모듈 수준의 print(\"B\") 는 import 시 실행된다. A 는 직접 실행할 때만." },
        { text: "아무것도", why: "if 밖의 코드는 import 될 때도 실행된다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "직접 실행하면 `__name__ == \"__main__\"`, import 되면 모듈 이름.",
        "`if __name__ == \"__main__\":` 아래에 실행 코드 → 한 파일이 도구이자 프로그램.",
        "`main()` 함수로 감싸는 것이 관례.",
      ],
    },
  ],
};
