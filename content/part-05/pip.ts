import type { Lesson } from "@/lib/types";

export const pipLesson: Lesson = {
  part: 5,
  slug: "pip",
  blocks: [
    {
      kind: "viz", component: "Flow", title: "pip install 이 하는 일",
      props: {
        flow: {
          code: ["pip install requests", "pip freeze > requirements.txt", "pip install -r requirements.txt"],
          nodes: [
            { id: "s", kind: "start", label: "pip install requests", x: 640, y: 60 },
            { id: "i", kind: "step", label: "PyPI 에서 최신 버전 조회", x: 640, y: 140 },
            { id: "d", kind: "cond", label: "의존 패키지가 있나?", x: 640, y: 240 },
            { id: "dd", kind: "step", label: "그것들도 설치 (재귀)", x: 900, y: 240 },
            { id: "w", kind: "step", label: "wheel 다운로드 → site-packages 에 풀기", x: 640, y: 340 },
            { id: "e", kind: "end", label: "import requests 가능", x: 640, y: 440 },
          ],
          edges: [
            { from: "s", to: "i" }, { from: "i", to: "d" },
            { from: "d", to: "dd", label: "예", via: [[900, 240]] },
            { from: "dd", to: "w", via: [[900, 340]] },
            { from: "d", to: "w", label: "아니오" },
            { from: "w", to: "e" },
          ],
          steps: [
            { chapter: "install", say: "`pip install requests` — pip 는 파이썬 패키지 저장소 **PyPI**(pypi.org) 에 물어본다. 50만 개가 넘는 패키지가 있다.", at: "s", line: 0 },
            { say: "최신 버전(예: 2.32.3)을 고른다. `requests==2.31.0` 처럼 버전을 박을 수도 있다.", at: "i", vars: { requests: "2.32.3" } },
            { say: "requests 는 `urllib3`, `certifi`, `charset-normalizer`, `idna` 에 **의존**한다. pip 는 이것들도 찾아 설치한다.", at: "d", badge: { at: "d", text: "4개 의존", color: "warn" } },
            { say: "", dur: 1600, at: "dd", vars: { requests: "2.32.3", urllib3: "2.2.3", certifi: "2024.8", "charset-normalizer": "3.4", idna: "3.10" } },
            { say: "미리 빌드된 `.whl` 파일을 받아 가상환경의 `site-packages` 에 푼다.", at: "w" },
            { say: "이제 `import requests` 가 된다.", at: "e", output: "Successfully installed requests-2.32.3 …\n" },
            { chapter: "freeze", say: "`pip freeze` — 지금 설치된 모든 패키지를 **정확한 버전**과 함께 나열한다. 파일로 저장하면 `requirements.txt`.", line: 1, output: "requests==2.32.3\nurllib3==2.2.3\n…\n" },
            { chapter: "재현", say: "다른 컴퓨터에서 `pip install -r requirements.txt` — 같은 버전을 그대로 설치. 이것이 '내 컴퓨터에선 되는데' 를 없애는 방법.", line: 2 },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`pip\` 는 파이썬의 패키지 설치 도구다. **PyPI**(Python Package Index)에서 패키지를 받아 가상환경의 \`site-packages\` 에 넣는다. 의존 패키지도 알아서 따라온다.`,
    },
    {
      kind: "code", lang: "text", title: "자주 쓰는 명령",
      code: `pip install requests              # 최신 버전
pip install requests==2.31.0      # 정확한 버전
pip install "requests>=2.30,<3"   # 범위
pip install -U requests           # 업그레이드
pip uninstall requests
pip list                          # 설치된 것 보기
pip show requests                 # 버전·위치·의존
pip freeze > requirements.txt     # 현재 환경을 파일로
pip install -r requirements.txt   # 파일대로 설치`,
    },
    {
      kind: "code", lang: "text", title: "requirements.txt",
      code: `requests==2.32.3
pandas>=2.2
python-dotenv==1.0.1
# 개발용은 따로: requirements-dev.txt
# pytest==8.3.2`,
      caption: "직접 쓰는 패키지만 적고 버전을 고정(==)하는 것이 재현성에 좋다. 의존 패키지는 pip 가 알아서.",
    },
    {
      kind: "pitfall",
      title: "python 과 pip 가 다른 파이썬을 가리킬 때",
      md: `\`pip install x\` 는 됐는데 \`python\` 에서 \`import x\` 가 안 되면, \`pip\` 가 다른 파이썬(전역)의 것이다. 확실한 방법: \`python -m pip install x\` — "지금 이 python 의 pip 로 설치". 습관적으로 \`python -m pip\` 를 쓰면 이 문제가 사라진다.`,
    },
    {
      kind: "callout", tone: "deep", title: "pyproject.toml 과 최신 도구",
      md: `요즘은 \`requirements.txt\` 대신 \`pyproject.toml\` 에 의존성을 적고, **uv**(매우 빠른 pip 대체), **Poetry**, **PDM** 같은 도구로 가상환경과 잠금 파일(lock)까지 한 번에 관리하는 흐름이다. 원리는 같다 — PyPI 에서 받아 site-packages 에 넣기. Part 12 「패키징」에서 pyproject 를 다룬다.`,
    },
    {
      kind: "quiz",
      question: "동료가 내 프로젝트를 받아 똑같이 실행하려면 내가 해 둘 일은?",
      choices: [
        { text: "`.venv` 폴더를 통째로 보낸다", why: "수백 MB 이고 OS 가 다르면 동작하지 않는다." },
        { text: "`pip freeze > requirements.txt` 를 커밋한다", correct: true, why: "동료는 자기 가상환경을 만들고 pip install -r requirements.txt 로 같은 버전을 설치한다." },
        { text: "설치한 패키지 이름을 README 에 적는다", why: "버전이 없으면 다른 버전이 설치되어 동작이 달라질 수 있다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`pip install` = PyPI 에서 받아 `site-packages` 에. 의존성도 자동.",
        "`==` 로 버전 고정, `pip freeze > requirements.txt` 로 기록, `-r` 로 재현.",
        "`python -m pip` 로 쓰면 '어느 파이썬의 pip 인가' 문제가 없다.",
      ],
    },
  ],
};
