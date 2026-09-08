import type { Lesson } from "@/lib/types";

export const csvJson: Lesson = {
  part: 6,
  slug: "csv-json",
  blocks: [
    {
      kind: "viz", component: "Story", title: "JSON 은 파이썬 객체와 거의 1:1 로 대응한다",
      props: {
        story: {
          code: ['data = {"name": "지기", "tags": ["a"], "ok": True}', "text = json.dumps(data)", "back = json.loads(text)"],
          steps: [
            { chapter: "파이썬 객체", say: "딕셔너리 안에 문자열·리스트·불. 이걸 파일이나 네트워크로 보내려면 **문자열**로 바꿔야 한다.", ops: [{ line: 0 }, { obj: "D", type: "dict", entries: [['"name"', '"지기"'], ['"tags"', '["a"]'], ['"ok"', "True"]] }, { bind: "data", to: "D" }] },
            { chapter: "dumps", say: "`json.dumps` — 객체를 **JSON 문자열**로. 규칙이 거의 파이썬 문법과 같지만 `True` → `true`, `None` → `null`, 따옴표는 큰따옴표만.", ops: [{ line: 1 }, { obj: "S", type: "str", value: '{"name": "지기", "tags": ["a"], "ok": true}' }, { bind: "text", to: "S" }] },
            { chapter: "loads", say: "`json.loads` — 문자열을 다시 파이썬 객체로. **새 객체**가 만들어진다. 내용은 같지만 `back is data` 는 False.", ops: [{ line: 2 }, { obj: "D2", type: "dict", entries: [['"name"', '"지기"'], ['"tags"', '["a"]'], ['"ok"', "True"]] }, { bind: "back", to: "D2" }, { badge: "D2", text: "back == data → True", color: "fresh" }] },
            { chapter: "오갈 수 있는 것", say: "JSON 이 아는 타입은 여섯: **객체(dict), 배열(list), 문자열, 숫자, 불, null.** 튜플은 리스트가 되고, 집합·날짜·내 클래스는 그냥은 안 된다.", ops: [] },
          ],
        },
      },
    },
    {
      kind: "text",
      md: `프로그램 밖과 데이터를 주고받는 두 가지 표준 형식.

- **CSV** — 쉼표로 구분된 표. 엑셀·구글시트와 호환. 값은 전부 **문자열**이고 구조는 평평하다.
- **JSON** — 중첩 가능한 구조(딕셔너리·리스트). 웹 API 의 표준. 타입(숫자·불·null)이 살아 있다.

둘 다 표준 라이브러리(\`csv\`, \`json\`)로 읽고 쓴다.`,
    },
    {
      kind: "trace", traceId: "p6-json", title: "json.dumps / loads",
      caption: "True 가 true 로, 튜플이 리스트로 바뀌는 것. ensure_ascii=False 가 없으면 한글이 \\uac00 식으로 나온다.",
    },
    {
      kind: "code", title: "파일로",
      code: `import json
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)   # dump (s 없음) = 파일에
with open("config.json", encoding="utf-8") as f:
    data = json.load(f)                                # load = 파일에서`,
      caption: "dumps/loads 는 문자열, dump/load 는 파일. s 는 string.",
    },
    {
      kind: "trace", traceId: "p6-csv-json", title: "csv.DictReader — 값은 전부 문자열",
      caption: "age 가 \"29\" 라는 문자열이라 + 1 에서 TypeError. int() 로 바꿔야 한다.",
    },
    {
      kind: "code", title: "CSV 읽고 쓰기",
      code: `import csv
with open("people.csv", encoding="utf-8", newline="") as f:   # newline="" 필수 (빈 줄 방지)
    for row in csv.DictReader(f):            # 첫 줄을 헤더로 → 각 줄이 dict
        print(row["name"], int(row["age"]))  # 값은 문자열 — 직접 변환

with open("out.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["name", "age"])
    w.writeheader()
    w.writerow({"name": "지기", "age": 29})`,
      caption: "쉼표가 든 값, 따옴표, 줄바꿈 처리를 csv 모듈이 해 준다. split(\",\") 로 직접 자르지 말 것.",
    },
    {
      kind: "pitfall",
      title: "엑셀에서 한글이 깨진다",
      md: `UTF-8 로 저장한 CSV 를 엑셀이 cp949 로 열어서 생기는 문제. \`encoding="utf-8-sig"\` 로 저장하면 앞에 BOM(표식)이 붙어 엑셀이 UTF-8 로 인식한다.`,
    },
    {
      kind: "quiz",
      question: "`json.dumps({\"a\": (1, 2), \"b\": None})` 의 결과는?",
      choices: [
        { text: "`{\"a\": (1, 2), \"b\": None}`", why: "JSON 에는 튜플과 None 이 없다. 각각 배열과 null 로 바뀐다." },
        { text: "`{\"a\": [1, 2], \"b\": null}`", correct: true, why: "튜플 → JSON 배열, None → null. 다시 loads 하면 튜플은 리스트로 돌아온다." },
        { text: "`TypeError`", why: "튜플은 리스트로 변환 가능하다. 집합이나 날짜였다면 TypeError." },
      ],
    },
    {
      kind: "summary",
      items: [
        "JSON: `dumps`/`loads` 는 문자열, `dump`/`load` 는 파일. `ensure_ascii=False`, `indent=2`.",
        "JSON 타입은 dict·list·str·수·bool·null 뿐. 튜플은 리스트가 된다.",
        "CSV: `DictReader`/`DictWriter`, `newline=\"\"`, 값은 **전부 문자열.**",
        "엑셀용 CSV 는 `utf-8-sig`.",
      ],
    },
  ],
};
