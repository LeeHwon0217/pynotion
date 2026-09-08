import type { Lesson } from "@/lib/types";

export const fileModes: Lesson = {
  part: 6,
  slug: "file-modes",
  blocks: [
    {
      kind: "viz", component: "Story", title: "open() 은 파일 객체를 만든다 — 모드가 할 수 있는 일을 정한다",
      props: {
        story: {
          code: ['f = open("memo.txt", "w")', 'f.write("첫 줄\\n")', "f.close()", 'f = open("memo.txt", "a")', 'f = open("memo.txt")', "f.read()"],
          steps: [
            { chapter: "w", say: "`open(경로, \"w\")` — **쓰기** 모드. 파일이 없으면 만들고, **있으면 내용을 지운다.** 파일 객체가 생겨 `f` 에 붙는다. 디스크의 파일과 연결된 '손잡이' 다.", ops: [{ line: 0 }, { obj: "F", type: "file", fields: [["name", '"memo.txt"'], ["mode", '"w"'], ["closed", "False"]] }, { bind: "f", to: "F" }, { obj: "D", type: "disk", value: "(비어 있음)", note: "memo.txt" }] },
            { say: "`f.write(\"첫 줄\\n\")` — 일단 **버퍼**(메모리)에 쌓인다. 줄바꿈은 직접 넣어야 한다.", ops: [{ line: 1 }, { mutate: "F", fields: [["name", '"memo.txt"'], ["mode", '"w"'], ["buffer", '"첫 줄\\n"']] }] },
            { say: "`f.close()` — 버퍼를 디스크에 **실제로 쓰고** 연결을 끊는다. close 를 안 하면 마지막 내용이 파일에 없을 수 있다.", ops: [{ line: 2 }, { mutate: "F", fields: [["name", '"memo.txt"'], ["mode", '"w"'], ["closed", "True"]] }, { mutate: "D", value: '"첫 줄\\n"' }] },
            { chapter: "a", say: "`\"a\"` — **추가** 모드. 기존 내용 뒤에 이어 쓴다. 로그 파일에 쓰는 모드.", ops: [{ line: 3 }, { obj: "F2", type: "file", fields: [["mode", '"a"'], ["위치", "끝"]] }, { bind: "f", to: "F2" }, { badge: "D", text: "기존 내용 보존", color: "fresh" }] },
            { chapter: "r", say: "모드를 생략하면 `\"r\"` — **읽기.** 파일이 없으면 `FileNotFoundError`. `f.read()` 는 전체를 문자열 하나로 돌려준다.", ops: [{ line: 4 }, { unbadge: "D" }, { obj: "F3", type: "file", fields: [["mode", '"r"'], ["위치", "0"]] }, { bind: "f", to: "F3" }, { line: 5 }, { obj: "S", type: "str", value: '"첫 줄\\n…"' }, { bind: "text", to: "S" }] },
          ],
        },
      },
    },
    {
      kind: "table",
      head: ["모드", "뜻", "파일이 없으면", "파일이 있으면"],
      rows: [
        ["`\"r\"` (기본)", "읽기", "`FileNotFoundError`", "처음부터 읽음"],
        ["`\"w\"`", "쓰기", "새로 만듦", "**내용을 지우고** 새로 씀"],
        ["`\"a\"`", "추가", "새로 만듦", "끝에 이어 씀"],
        ["`\"x\"`", "새로 만들기", "새로 만듦", "`FileExistsError` — 덮어쓰기 방지"],
        ["`\"r+\"`", "읽기+쓰기", "오류", "처음부터, 덮어씀"],
        ["`+ \"b\"`", "바이너리 (`\"rb\"`, `\"wb\"`)", "", "bytes 로 읽고 씀 — 이미지, 압축 파일"],
      ],
      caption: "\"w\" 가 기존 파일을 지운다는 것을 잊으면 데이터를 날린다. 덮어쓰면 안 되는 경우 \"x\" 또는 \"a\".",
    },
    {
      kind: "trace", traceId: "p6-file", title: "쓰고, 이어 쓰고, 읽기",
      caption: "이 추적기는 임시 폴더에 실제로 파일을 만든다. close() 뒤에야 내용이 확정된다.",
    },
    {
      kind: "heading", text: "읽는 방법 세 가지",
    },
    {
      kind: "code",
      code: `f = open("data.txt", encoding="utf-8")
text = f.read()          # 전체를 문자열 하나로 — 작은 파일
lines = f.readlines()    # 줄들의 리스트 (각 줄 끝에 \\n 포함)
for line in f:           # 한 줄씩 — 큰 파일도 메모리 걱정 없음 (가장 권장)
    print(line.rstrip("\\n"))
f.close()`,
      caption: "읽기 위치는 앞으로만 간다. read() 한 뒤 다시 read() 하면 빈 문자열. f.seek(0) 으로 되돌린다.",
    },
    {
      kind: "pitfall",
      title: "close() 를 빼먹기",
      md: `닫지 않은 파일은 (1) 마지막 쓰기가 디스크에 안 갔을 수 있고, (2) OS 의 파일 핸들을 계속 점유하며, (3) 다른 프로그램이 못 연다. 예외가 나면 close() 줄까지 못 가는 문제도 있다. 그래서 **다음 레슨의 \`with\`** 를 쓴다. 이 레슨의 \`open/close\` 는 원리 이해용이다.`,
    },
    {
      kind: "quiz",
      question: "기존 파일 `log.txt` 에 새 줄을 덧붙이려면?",
      choices: [
        { text: "`open(\"log.txt\", \"w\")`", why: "w 는 기존 내용을 지운다. 로그가 날아간다." },
        { text: "`open(\"log.txt\", \"a\")`", correct: true, why: "a 는 끝에 이어 쓴다. 없으면 만들고, 있으면 보존." },
        { text: "`open(\"log.txt\", \"r\")`", why: "r 은 읽기 전용. write 하면 오류." },
      ],
    },
    {
      kind: "summary",
      items: [
        "`open(경로, 모드, encoding=\"utf-8\")` → 파일 객체. `r` 읽기(기본), `w` 쓰기(**지움**), `a` 추가, `x` 새로만.",
        "`write` 는 버퍼에, `close()` 가 디스크에. 줄바꿈은 직접.",
        "읽기는 `for line in f` 가 표준.",
        "실전에서는 항상 `with` (다음 레슨).",
      ],
    },
  ],
};
