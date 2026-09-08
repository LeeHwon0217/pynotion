import type { Lesson } from "@/lib/types";

export const stdlib: Lesson = {
  part: 5,
  slug: "stdlib",
  blocks: [
    {
      kind: "text",
      md: `파이썬은 "배터리 포함"(batteries included)이라 불린다. 설치만 하면 200 개가 넘는 모듈이 같이 온다. 전부 알 필요는 없다 — **무엇이 있는지**만 알면 필요할 때 문서를 찾는다. 자주 쓰는 것부터.`,
    },
    {
      kind: "trace", traceId: "p5-stdlib", title: "다섯 개 맛보기",
      caption: "random, os.path, json, datetime, collections. 각각 한 줄씩.",
    },
    {
      kind: "table",
      head: ["분야", "모듈", "대표 기능"],
      rows: [
        ["수학·난수", "`math`, `random`, `statistics`, `fractions`, `decimal`", "`math.sqrt`, `random.choice`, `statistics.mean`"],
        ["문자열·텍스트", "`re`, `string`, `textwrap`, `difflib`", "정규식(Part 12), 상수, 줄바꿈"],
        ["날짜·시간", "`datetime`, `time`, `zoneinfo`, `calendar`", "`datetime.now()`, `time.sleep`, 시간대"],
        ["파일·경로", "`pathlib`, `os`, `shutil`, `glob`, `tempfile`", "경로 객체, 복사·이동, 패턴 검색"],
        ["데이터 형식", "`json`, `csv`, `pickle`, `sqlite3`, `configparser`", "JSON/CSV 읽고 쓰기, 내장 DB"],
        ["자료구조", "`collections`, `heapq`, `bisect`, `array`, `enum`", "`Counter`, `deque`, `defaultdict`, 우선순위 큐"],
        ["함수형·반복", "`itertools`, `functools`, `operator`", "`chain`, `groupby`, `lru_cache`, `partial`"],
        ["시스템", "`sys`, `argparse`, `logging`, `subprocess`", "명령줄 인자, 로그, 외부 명령 실행"],
        ["동시성", "`threading`, `multiprocessing`, `asyncio`, `concurrent.futures`", "Part 10"],
        ["네트워크·웹", "`urllib`, `http`, `socket`, `email`", "간단한 HTTP 요청 (실무는 requests)"],
        ["테스트·디버깅", "`unittest`, `doctest`, `pdb`, `timeit`, `cProfile`", "Part 11, 12"],
        ["기타", "`copy`, `typing`, `dataclasses`, `abc`, `contextlib`", "Part 7, 9 에서 하나씩"],
      ],
    },
    {
      kind: "code", title: "실전에서 매일 보는 조합",
      code: `from pathlib import Path
import json
from collections import Counter
from datetime import datetime

log = Path("app.log")                                  # 경로 객체
lines = log.read_text(encoding="utf-8").splitlines()   # 파일 읽기
levels = Counter(line.split()[0] for line in lines)    # 첫 단어 세기
report = {"at": datetime.now().isoformat(), "levels": dict(levels)}
Path("report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))`,
    },
    {
      kind: "callout", tone: "tip", title: "찾는 법",
      md: `\`help(모듈)\`, \`dir(모듈)\` 로 REPL 에서 바로 훑을 수 있다. 공식 문서는 docs.python.org/ko/3/library — 한국어 번역이 잘 되어 있다. "파이썬으로 X 하려면" 을 검색하기 전에 표준 라이브러리에 이미 있는지 먼저 본다. 대부분 있다.`,
    },
    {
      kind: "quiz",
      question: "리스트에서 가장 많이 나온 항목과 그 횟수를 구하는 가장 간단한 방법은?",
      choices: [
        { text: "딕셔너리로 직접 세고 max 로 찾기", why: "동작하지만 collections.Counter 가 정확히 이 일을 한다." },
        { text: "`collections.Counter(lst).most_common(1)`", correct: true, why: "Counter 는 개수를 세는 딕셔너리이고, most_common(n) 은 상위 n 개를 (항목, 횟수) 로 돌려준다." },
        { text: "`max(lst)`", why: "max 는 가장 큰 값이지 가장 많이 나온 값이 아니다." },
      ],
    },
    {
      kind: "summary",
      items: [
        "표준 라이브러리는 **무엇이 있는지** 알면 된다. 세부는 문서.",
        "자주 쓰는 것: `pathlib`, `json`, `collections`, `datetime`, `random`, `re`, `itertools`, `functools`.",
        "직접 짜기 전에 표준 라이브러리부터.",
      ],
    },
  ],
};
