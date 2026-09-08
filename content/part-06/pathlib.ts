import type { Lesson } from "@/lib/types";

export const pathlibLesson: Lesson = {
  part: 6,
  slug: "pathlib",
  blocks: [
    {
      kind: "viz", component: "Story", title: "경로를 문자열이 아니라 객체로",
      props: {
        story: {
          code: ['p = Path("docs") / "memo.txt"', "p.parent, p.name, p.suffix", "p.exists()", 'p.write_text("안녕")'],
          steps: [
            { chapter: "Path", say: "`Path(\"docs\") / \"memo.txt\"` — 슬래시 연산자로 경로를 **잇는다.** 문자열 붙이기(`\"docs\" + \"/\" + ...`)가 아니라 OS 에 맞는 구분자를 알아서 쓰는 객체.", ops: [{ line: 0 }, { obj: "P", type: "Path", fields: [["parts", '("docs", "memo.txt")']], note: "Windows: docs\\memo.txt / Mac: docs/memo.txt" }, { bind: "p", to: "P" }] },
            { chapter: "속성", say: "경로의 부분들을 **속성**으로 꺼낸다. `parent` 는 폴더, `name` 은 파일명, `suffix` 는 확장자, `stem` 은 확장자 뺀 이름.", ops: [{ line: 1 }, { mutate: "P", fields: [["parent", 'Path("docs")'], ["name", '"memo.txt"'], ["stem", '"memo"'], ["suffix", '".txt"']] }] },
            { chapter: "디스크에 묻기", say: "`exists()`, `is_file()`, `is_dir()` — 실제 디스크를 확인한다. Path 객체를 만드는 것 자체는 디스크와 무관하다.", ops: [{ line: 2 }, { badge: "P", text: "exists() → False (아직 없음)", color: "warn" }] },
            { chapter: "읽고 쓰기", say: "`write_text` / `read_text` — open/with/close 없이 한 줄. 작은 파일에 딱 맞다.", ops: [{ line: 3 }, { unbadge: "P" }, { obj: "D", type: "disk", value: '"안녕"', note: "docs/memo.txt" }, { badge: "P", text: "exists() → True", color: "fresh" }] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `\`os.path\` 의 문자열 함수들(\`os.path.join\`, \`os.path.basename\` …) 대신 \`pathlib.Path\` 를 쓴다. 경로가 **객체**가 되어 속성과 메서드로 다루고, 윈도우/맥의 구분자 차이를 신경 쓰지 않아도 된다.`,
    },
    {
      kind: "trace", traceId: "p6-pathlib", title: "한 줄씩",
      caption: "/ 로 잇기, 속성, mkdir(parents=True), write_text/read_text, rglob.",
    },
    {
      kind: "table",
      head: ["하고 싶은 것", "pathlib"],
      rows: [
        ["경로 잇기", "`Path(\"a\") / \"b\" / \"c.txt\"`"],
        ["파일명 / 확장자 / 폴더", "`p.name` / `p.suffix` / `p.parent`"],
        ["확장자 바꾸기", "`p.with_suffix(\".md\")`"],
        ["있나?", "`p.exists()`, `p.is_file()`, `p.is_dir()`"],
        ["폴더 만들기", "`p.mkdir(parents=True, exist_ok=True)`"],
        ["읽기 / 쓰기", "`p.read_text(encoding=\"utf-8\")` / `p.write_text(s, encoding=\"utf-8\")`"],
        ["폴더 안 목록", "`p.iterdir()`, `p.glob(\"*.py\")`, `p.rglob(\"*.py\")` (하위까지)"],
        ["현재 폴더 / 홈", "`Path.cwd()` / `Path.home()`"],
        ["절대 경로", "`p.resolve()`"],
        ["삭제", "`p.unlink()` (파일), `p.rmdir()` (빈 폴더), `shutil.rmtree(p)` (통째로)"],
      ],
    },
    {
      kind: "code", title: "실전 — 폴더의 모든 .txt 를 .md 로",
      code: `from pathlib import Path

for p in Path("notes").rglob("*.txt"):
    text = p.read_text(encoding="utf-8")
    p.with_suffix(".md").write_text(text, encoding="utf-8")
    p.unlink()`,
    },
    {
      kind: "pitfall",
      title: "이 스크립트 파일 옆의 파일을 열기",
      md: `\`open("data.txt")\` 는 **현재 작업 폴더** 기준이라 어디서 실행하느냐에 따라 못 찾는다. 스크립트 위치 기준으로 하려면 \`Path(__file__).parent / "data.txt"\`. \`__file__\` 은 지금 실행 중인 파일의 경로다.`,
    },
    {
      kind: "quiz",
      question: "`Path(\"a/b/c.tar.gz\")` 의 `.suffix` 와 `.stem` 은?",
      choices: [
        { text: "`\".tar.gz\"` 와 `\"c\"`", why: "suffix 는 마지막 점 이후만이다. 전부 보려면 .suffixes." },
        { text: "`\".gz\"` 와 `\"c.tar\"`", correct: true, why: "suffix 는 마지막 확장자 하나, stem 은 그것을 뺀 이름. .suffixes 는 [\".tar\", \".gz\"]." },
        { text: "`\".gz\"` 와 `\"c\"`", why: "stem 은 마지막 확장자만 뗀다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`Path` 객체 + `/` 연산자. OS 구분자 신경 끝.",
        "`name`, `suffix`, `parent`, `exists()`, `mkdir(parents=True)`, `read_text`/`write_text`, `glob`/`rglob`.",
        "스크립트 옆 파일은 `Path(__file__).parent / 이름`.",
      ],
    },
  ],
};
