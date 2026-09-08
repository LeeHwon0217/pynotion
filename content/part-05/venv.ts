import type { Lesson } from "@/lib/types";

export const venvLesson: Lesson = {
  part: 5,
  slug: "venv",
  blocks: [
    {
      kind: "viz", component: "Story", title: "가상환경 — 프로젝트마다 다른 site-packages",
      props: {
        story: {
          code: ["python -m venv .venv", ".venv\\Scripts\\activate", "pip install requests", "python app.py"],
          codeTitle: "터미널",
          steps: [
            { chapter: "문제", say: "프로젝트 A 는 `requests 2.x`, 프로젝트 B 는 `requests 3.x` 가 필요하다. 파이썬 하나에 둘 다 설치할 수는 없다 — `site-packages` 는 하나니까.", ops: [{ obj: "G", type: "site-packages", fields: [["(전역)", "C:/Python312/Lib/site-packages"]], note: "모든 프로젝트가 공유 — 충돌" }] },
            { chapter: "venv", say: "`python -m venv .venv` — 프로젝트 폴더 안에 **작은 파이썬 사본**을 만든다. 자기만의 `site-packages` 를 가진다.", ops: [{ line: 0 }, { obj: "V", type: "venv", fields: [["python", ".venv/Scripts/python.exe"], ["site-packages", ".venv/Lib/site-packages"]], note: "이 프로젝트 전용" }] },
            { chapter: "activate", say: "`activate` — 터미널의 `python` 과 `pip` 가 **이 .venv 의 것**을 가리키게 한다. 프롬프트 앞에 `(.venv)` 가 붙는다.", ops: [{ line: 1 }, { bind: "python", to: "V" }, { bind: "pip", to: "V" }, { badge: "V", text: "(.venv) 활성", color: "fresh" }] },
            { chapter: "install", say: "`pip install requests` — `.venv/Lib/site-packages` 에 설치된다. 전역 파이썬은 깨끗하다.", ops: [{ line: 2 }, { mutate: "V", fields: [["python", ".venv/Scripts/python.exe"], ["site-packages", "requests 2.32 …"]] }] },
            { say: "`python app.py` — `sys.path` 에 `.venv` 의 site-packages 가 들어가므로 `import requests` 가 된다. 프로젝트 B 는 자기 .venv 에 3.x 를 설치하면 끝.", ops: [{ line: 3 }, { unbadge: "V" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `**가상환경**(virtual environment)은 프로젝트 전용 파이썬 사본이다. 외부 패키지를 프로젝트별로 따로 설치해서 버전 충돌을 막고, 무엇을 설치했는지 명확히 한다. **모든 프로젝트는 자기 가상환경을 갖는다** — 예외 없는 습관.`,
    },
    {
      kind: "code", lang: "text", title: "만들고, 켜고, 끄기",
      code: `# 만들기 (프로젝트 폴더에서, 한 번만)
python -m venv .venv

# 켜기 — 터미널을 열 때마다
.venv\\Scripts\\activate          # Windows (PowerShell/cmd)
source .venv/bin/activate         # Mac / Linux
(.venv) >                         # ← 프롬프트가 이렇게 바뀐다

# 확인
where python                      # Windows:  ...\\.venv\\Scripts\\python.exe
which python                      # Mac:      .../.venv/bin/python

# 끄기
deactivate`,
    },
    {
      kind: "table",
      head: ["", "전역 파이썬에 설치", "가상환경에 설치"],
      rows: [
        ["버전 충돌", "프로젝트끼리 충돌", "각자 따로"],
        ["재현", "무엇을 깔았는지 모름", "`requirements.txt` 로 그대로 재현"],
        ["삭제", "어렵다", "폴더 지우면 끝"],
        ["시스템 영향", "OS 도구가 깨질 수 있음", "없음"],
      ],
    },
    {
      kind: "pitfall",
      title: "'설치했는데 ModuleNotFoundError'",
      md: `가장 흔한 원인 둘. (1) 가상환경을 켜지 않은 터미널에서 \`pip install\` 해서 전역에 설치됨. (2) 편집기(VS Code)가 다른 파이썬을 쓰고 있음 — 오른쪽 아래 인터프리터 표시를 \`.venv\` 로 바꾼다. \`where python\` / \`which python\` 으로 지금 어느 파이썬인지 확인하는 습관.`,
    },
    {
      kind: "callout", tone: "tip", title: ".venv 는 git 에 넣지 않는다",
      md: `\`.gitignore\` 에 \`.venv/\` 를 추가한다. 수백 MB 짜리 바이너리이고, 다른 OS 에서는 못 쓴다. 대신 다음 레슨의 \`requirements.txt\` 를 커밋하면 누구나 \`pip install -r requirements.txt\` 로 같은 환경을 만든다.`,
    },
    {
      kind: "quiz",
      question: "가상환경을 켠 상태에서 `pip install pandas` 를 하면 어디에 설치되나?",
      choices: [
        { text: "전역 파이썬의 site-packages", why: "activate 뒤의 pip 는 가상환경의 pip 다." },
        { text: "`.venv/Lib/site-packages` (Windows) 또는 `.venv/lib/.../site-packages`", correct: true, why: "가상환경이 켜져 있으면 python 과 pip 가 .venv 의 것을 가리킨다." },
        { text: "프로젝트 폴더 바로 아래", why: "패키지는 site-packages 폴더에 들어간다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "가상환경 = 프로젝트 전용 파이썬 사본 + 전용 `site-packages`.",
        "`python -m venv .venv` → `activate` → `pip install`. 터미널마다 켠다.",
        "`.venv` 는 git 에 넣지 않고, `requirements.txt` 로 재현한다.",
        "ModuleNotFoundError 면 `where python` 부터.",
      ],
    },
  ],
};
