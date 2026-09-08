import type { PartMeta } from "@/lib/types";

const L = (slug: string, title: string, summary: string, star = false, minutes = 12) =>
  ({ slug, title, summary, star, minutes });

export const PARTS: PartMeta[] = [
  {
    id: 0, slug: "start", title: "시작하기", color: "--series-1",
    tagline: "파이썬이 무엇이고, 코드가 어떻게 실행되는지",
    lessons: [
      L("what-is-python", "파이썬이란", "어디에 쓰이고 왜 배우는가"),
      L("setup", "설치와 실행 환경", "REPL과 스크립트, 두 가지 실행 방식"),
      L("how-code-runs", "코드가 실행되는 원리", "소스 → 바이트코드 → 인터프리터", true),
      L("first-program", "첫 프로그램과 print", "출력, 주석, 들여쓰기 규칙"),
      L("reading-errors", "오류 메시지 읽는 법", "트레이스백을 위에서부터가 아니라 아래서부터"),
    ],
  },
  {
    id: 1, slug: "data", title: "데이터와 변수", color: "--series-2",
    tagline: "변수는 상자가 아니라 이름표다",
    lessons: [
      L("variables", "변수는 상자가 아니라 이름표", "파이썬의 변수가 값을 '담지' 않고 객체를 '가리키는' 이유", true, 18),
      L("int", "정수 int", "크기 제한이 없는 정수와 진법"),
      L("float", "실수 float와 부동소수점 오차", "0.1 + 0.2가 0.3이 아닌 이유", true),
      L("bool-none", "bool과 None", "참·거짓, 그리고 '없음'을 뜻하는 값"),
      L("string-basics", "문자열 기초와 f-string", "따옴표, 이스케이프, 포매팅"),
      L("arithmetic", "산술 연산자와 우선순위", "//, %, **, 그리고 계산 순서"),
      L("comparison-logic", "비교·논리 연산자와 단축평가", "and/or가 값을 돌려주는 방식"),
      L("type-conversion", "형변환과 동적 타입", "int(), str(), float()와 타입 추론"),
      L("is-vs-eq", "is vs ==, 작은 정수 캐싱", "같은 값과 같은 객체의 차이", true),
      L("input-format", "input과 포매팅", "사용자 입력 받기와 출력 다듬기"),
    ],
  },
  {
    id: 2, slug: "flow", title: "흐름 제어", color: "--series-3",
    tagline: "조건과 반복으로 프로그램의 길을 정한다",
    lessons: [
      L("if", "if / elif / else", "조건에 따라 갈라지는 길"),
      L("truthiness", "진리값 truthy / falsy", "빈 것은 거짓, 있는 것은 참"),
      L("while", "while 반복", "조건이 참인 동안 계속"),
      L("for", "for와 이터러블", "꺼낼 것이 있는 동안 하나씩"),
      L("range", "range 파헤치기", "숫자를 미리 만들지 않는 게으른 수열", true),
      L("break-continue", "break / continue / for-else", "반복을 끊고 건너뛰고, 안 끊겼을 때"),
      L("nested-loops", "중첩 반복문", "바깥이 한 번 돌 때 안쪽은 끝까지", true),
      L("match", "match-case 입문", "구조적 패턴 매칭의 첫걸음"),
    ],
  },
  {
    id: 3, slug: "collections", title: "자료구조", color: "--series-4",
    tagline: "리스트·딕셔너리·집합의 겉과 속",
    lessons: [
      L("list-basics", "리스트 기초", "만들기, 접근, 바꾸기"),
      L("indexing", "인덱싱과 음수 인덱스", "-1은 왜 마지막인가"),
      L("slicing", "슬라이싱 완전정복 [a:b:c]", "시작·끝·스텝이 그리는 범위", true, 20),
      L("list-methods", "리스트 메서드와 가변성", "append, insert, pop, remove, sort"),
      L("dynamic-array", "리스트 내부 구조와 append 비용", "동적 배열이 2배로 커지는 순간", true),
      L("tuple", "튜플·불변성·언패킹", "바꿀 수 없어서 얻는 것"),
      L("string-methods", "문자열 메서드 총정리", "split, join, strip, replace, find"),
      L("string-immutable", "문자열 불변성과 join", "+= 가 매번 새로 만드는 이유", true),
      L("dict-basics", "딕셔너리 기초", "키로 값을 찾는 자료구조"),
      L("hash-table", "딕셔너리 내부: 해시 테이블", "왜 100만 개여도 한 번에 찾는가", true, 20),
      L("dict-methods", "딕셔너리 순회와 get / setdefault", "items, keys, values, 안전한 접근"),
      L("set", "집합 set과 집합 연산", "중복 제거와 교집합·합집합", true),
      L("comprehension", "컴프리헨션", "리스트·딕셔너리·셋을 한 줄로"),
      L("nested-comprehension", "중첩 컴프리헨션과 가독성", "어디까지가 한 줄인가"),
      L("copy", "얕은 복사 vs 깊은 복사", "복사했는데 왜 같이 바뀌나", true),
      L("sorting", "정렬과 key, 안정 정렬", "sorted, sort, reverse, key 함수"),
    ],
  },
  {
    id: 4, slug: "functions", title: "함수", color: "--series-5",
    tagline: "코드를 이름 붙여 재사용한다",
    lessons: [
      L("call-stack", "함수 호출과 콜스택", "호출할 때 쌓이고 돌아올 때 사라지는 프레임", true, 18),
      L("return", "반환값과 다중 반환", "return 없는 함수는 None을 돌려준다"),
      L("args", "위치 인자와 키워드 인자", "순서로 넘길까, 이름으로 넘길까"),
      L("mutable-default", "가변 기본값 인자 함정", "def f(x=[])가 위험한 이유", true),
      L("star-args", "*args / **kwargs", "개수를 모르는 인자 받기"),
      L("positional-only", "위치전용·키워드전용 (/, *)", "시그니처의 특수 기호"),
      L("scope", "스코프와 LEGB", "이름을 찾는 네 단계", true, 18),
      L("global-nonlocal", "global / nonlocal", "바깥 이름을 안에서 바꾸기"),
      L("recursion", "재귀와 재귀 트리", "자기 자신을 부르는 함수", true, 20),
      L("lambda", "람다와 일급 함수", "함수를 값처럼 넘기기"),
      L("docstring-hints", "독스트링과 타입 힌트 기초", "함수 설명서 쓰기"),
      L("pass-by", "인자 전달 방식의 실체", "값 전달도 참조 전달도 아니다", true),
    ],
  },
  {
    id: 5, slug: "modules", title: "모듈·패키지·환경", color: "--series-6",
    tagline: "코드를 파일과 폴더로 나누고 공유한다",
    lessons: [
      L("import", "import 동작 원리", "sys.path와 모듈 캐시", true),
      L("from-as", "from / as와 순환 import", "필요한 것만 가져오기"),
      L("main", "__name__ == \"__main__\"", "직접 실행과 import의 차이"),
      L("packages", "패키지와 __init__.py", "폴더를 모듈로"),
      L("stdlib", "표준 라이브러리 투어", "이미 들어 있는 도구들"),
      L("venv", "가상환경 venv", "프로젝트마다 다른 패키지"),
      L("pip", "pip와 requirements", "외부 패키지 설치와 고정"),
    ],
  },
  {
    id: 6, slug: "errors-files", title: "파일·예외", color: "--series-7",
    tagline: "잘못될 수 있는 일을 다루는 법",
    lessons: [
      L("exception-flow", "예외가 전파되는 과정", "프레임을 거슬러 올라가는 예외", true, 18),
      L("try-except", "try / except", "예외를 잡는 기본 형태"),
      L("else-finally", "else / finally 실행 순서", "언제 무엇이 실행되는가", true),
      L("exception-hierarchy", "예외 계층 구조", "Exception 가계도", true),
      L("raise", "raise·커스텀 예외·raise from", "직접 예외 만들기"),
      L("file-modes", "파일 열기 모드", "r, w, a, b, +"),
      L("with", "with와 컨텍스트 매니저", "자동으로 닫히는 이유", true),
      L("encoding", "인코딩과 한글", "UTF-8, cp949, 깨지는 이유"),
      L("csv-json", "CSV / JSON 다루기", "표와 구조화 데이터"),
      L("pathlib", "pathlib", "경로를 객체로"),
    ],
  },
  {
    id: 7, slug: "oop", title: "객체지향", color: "--series-1",
    tagline: "데이터와 동작을 하나로 묶는다",
    lessons: [
      L("why-class", "왜 클래스인가", "딕셔너리와 함수로 버티다 한계가 오는 순간"),
      L("class-init", "클래스와 인스턴스, __init__", "설계도와 실물"),
      L("instance-vs-class-attr", "인스턴스 속성 vs 클래스 속성", "공유되는 것과 각자 가진 것", true),
      L("attribute-lookup", "속성 조회 순서", "인스턴스 → 클래스 → 상위 클래스", true),
      L("self", "self의 정체", "메서드 첫 인자가 자동으로 채워지는 원리"),
      L("inheritance", "상속", "부모의 것을 물려받기"),
      L("mro", "super()와 MRO", "다이아몬드 상속에서 누가 먼저인가", true, 20),
      L("polymorphism", "다형성과 덕 타이핑", "오리처럼 걸으면 오리"),
      L("encapsulation", "캡슐화와 네임 맹글링", "_ 하나와 __ 둘의 차이"),
      L("property", "property", "속성처럼 보이는 메서드"),
      L("classmethod-staticmethod", "classmethod / staticmethod", "인스턴스 없이 부르는 메서드"),
      L("magic-repr", "매직메서드 ① __repr__ / __str__ / __len__", "파이썬이 자동으로 부르는 메서드"),
      L("magic-operators", "매직메서드 ② 연산자 오버로딩", "+ 가 __add__ 를 부르는 순간", true),
      L("magic-hash", "매직메서드 ③ 비교·해시", "딕셔너리 키가 될 수 있는 조건", true),
      L("dataclass", "dataclass", "보일러플레이트 없는 데이터 클래스"),
      L("abc-protocol-slots", "ABC·프로토콜·__slots__", "인터페이스 강제와 메모리 절약"),
    ],
  },
  {
    id: 8, slug: "iterators", title: "이터레이터·제너레이터", color: "--series-2",
    tagline: "필요할 때 하나씩 만들어 내는 기술",
    lessons: [
      L("iterable-vs-iterator", "이터러블 vs 이터레이터", "꺼낼 수 있는 것과 꺼내는 것", true),
      L("iter-next", "__iter__ / __next__ 직접 구현", "내 클래스를 for에 넣기"),
      L("for-desugared", "for문의 실체", "iter()와 next()와 StopIteration", true),
      L("generator", "제너레이터와 yield", "얼어붙었다 깨어나는 함수", true, 20),
      L("lazy-memory", "지연 평가와 메모리", "리스트 100만 개 vs 제너레이터", true),
      L("yield-from", "yield from", "제너레이터 위임"),
      L("itertools", "itertools 실전", "chain, islice, groupby, product"),
      L("infinite-pipeline", "무한 시퀀스 파이프라인", "끝없는 데이터를 흘려보내기"),
    ],
  },
  {
    id: 9, slug: "advanced", title: "함수형·고급 문법", color: "--series-3",
    tagline: "함수를 재료로 쓰는 프로그래밍",
    lessons: [
      L("higher-order", "고차 함수와 map / filter", "함수를 받는 함수"),
      L("reduce-partial", "reduce · partial", "누적과 부분 적용"),
      L("decorator", "데코레이터 원리", "함수를 감싸는 함수", true, 20),
      L("decorator-args", "인자 받는 데코레이터와 wraps", "세 겹의 함수"),
      L("lru-cache", "lru_cache와 클래스 데코레이터", "결과를 기억하는 함수", true),
      L("closure-late-binding", "클로저와 늦은 바인딩 함정", "반복문 안 람다가 전부 같은 값인 이유", true),
      L("custom-context-manager", "컨텍스트 매니저 직접 만들기", "__enter__ / __exit__ / contextlib"),
      L("typing", "타입 힌트 심화", "제네릭, Optional, Protocol, TypedDict"),
      L("match-advanced", "패턴 매칭 심화", "클래스 패턴, 가드, 캡처"),
      L("descriptor", "디스크립터 프로토콜", "property의 정체", true),
    ],
  },
  {
    id: 10, slug: "concurrency", title: "동시성·병렬성", color: "--series-4",
    tagline: "여러 일을 동시에 하는 것처럼",
    lessons: [
      L("concurrency-vs-parallel", "동시성 vs 병렬성", "번갈아 하기와 정말 동시에 하기", true),
      L("gil", "GIL의 정체", "스레드가 여럿이어도 한 번에 하나만", true, 18),
      L("threads-race", "스레드와 경쟁 조건", "count += 1이 사라지는 순간", true),
      L("lock", "Lock과 동기화", "한 번에 하나만 들어오게"),
      L("multiprocessing", "multiprocessing", "GIL을 피해 프로세스로"),
      L("futures", "concurrent.futures", "풀에 맡기고 결과 받기"),
      L("async-await", "async / await와 이벤트 루프", "기다리는 동안 다른 일 하기", true, 20),
      L("asyncio", "asyncio 실전", "gather, create_task, 타임아웃"),
    ],
  },
  {
    id: 11, slug: "internals", title: "내부 동작·성능", color: "--series-5",
    tagline: "파이썬은 안에서 무슨 일을 하는가",
    lessons: [
      L("cpython-pipeline", "CPython 실행 파이프라인", "토크나이저 → 파서 → 컴파일러 → VM", true),
      L("bytecode", "바이트코드와 dis: 스택 머신", "명령어가 값 스택을 밀고 당기는 모습", true, 20),
      L("refcount", "참조 카운팅", "0이 되는 순간 사라진다", true),
      L("gc", "순환 참조와 GC", "서로 가리키는 객체를 누가 치우나", true),
      L("complexity", "자료구조별 시간복잡도", "in 연산이 리스트와 셋에서 다른 이유", true),
      L("profiling", "프로파일링 timeit / cProfile", "어디가 느린지 재기"),
      L("memory-opt", "메모리 최적화", "제너레이터, __slots__, array"),
      L("caching", "캐싱 전략", "계산 대신 기억"),
      L("anti-patterns", "성능 안티패턴", "자주 보이는 느린 코드"),
    ],
  },
  {
    id: 12, slug: "tools", title: "실무 도구", color: "--series-6",
    tagline: "혼자 쓰는 코드에서 남과 쓰는 코드로",
    lessons: [
      L("regex", "정규표현식", "패턴이 문자열을 훑는 과정", true, 20),
      L("datetime", "datetime과 zoneinfo", "날짜·시간·시간대"),
      L("logging", "로깅", "print 대신 logging"),
      L("debugging", "디버깅 pdb / breakpoint", "멈춰서 들여다보기"),
      L("pytest", "테스트 pytest", "코드가 맞는지 자동으로 확인"),
      L("style", "PEP 8·포매터·린터", "읽기 좋은 코드의 약속"),
      L("packaging", "프로젝트 구조와 패키징", "pyproject.toml과 배포"),
      L("third-party", "외부 라이브러리 맛보기", "requests, rich, typer"),
      L("roadmap", "다음 단계 로드맵", "웹, 데이터, 자동화 — 어디로 갈까"),
    ],
  },
  {
    id: 13, slug: "algorithms", title: "알고리즘 시각화", color: "--series-7",
    tagline: "문제를 푸는 절차를 눈으로",
    lessons: [
      L("search", "선형 탐색과 이진 탐색", "반씩 버리는 힘", true),
      L("simple-sorts", "버블·선택·삽입 정렬", "가장 단순한 정렬 세 가지", true),
      L("merge-sort", "병합 정렬", "분할정복 재귀 트리", true),
      L("quick-sort", "퀵 정렬", "피벗을 기준으로 나누기", true),
      L("stack-queue", "스택·큐·덱", "넣고 꺼내는 순서"),
      L("hash-problems", "해시 활용 문제", "딕셔너리로 O(n)에 풀기"),
      L("recursion-dp", "재귀 → 메모이제이션 → DP", "피보나치가 빨라지는 과정", true),
    ],
  },
  {
    id: 14, slug: "projects", title: "미니 프로젝트", color: "--series-8",
    tagline: "배운 것을 하나로 엮는다",
    lessons: [
      L("text-stats", "텍스트 통계기", "단어 빈도, 문장 길이"),
      L("budget-cli", "가계부 CLI", "입력·저장·집계"),
      L("file-organizer", "파일 정리 자동화", "확장자별로 폴더 정리"),
      L("scraper", "웹 스크래핑", "페이지에서 데이터 뽑기"),
      L("api-server", "간단 API 서버", "HTTP로 응답하기"),
    ],
  },
];

export const TOTAL_LESSONS = PARTS.reduce((n, p) => n + p.lessons.length, 0);

export function findPart(slug: string) {
  return PARTS.find((p) => p.slug === slug);
}
export function findLesson(partSlug: string, lessonSlug: string) {
  const part = findPart(partSlug);
  if (!part) return null;
  const idx = part.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx < 0) return null;
  return { part, lesson: part.lessons[idx], idx };
}
/** 전체 순서에서 이전/다음 레슨 */
export function neighbors(partSlug: string, lessonSlug: string) {
  const flat = PARTS.flatMap((p) => p.lessons.map((l) => ({ part: p, lesson: l })));
  const i = flat.findIndex((x) => x.part.slug === partSlug && x.lesson.slug === lessonSlug);
  return { prev: i > 0 ? flat[i - 1] : null, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null };
}
export const lessonKey = (partSlug: string, lessonSlug: string) => `${partSlug}/${lessonSlug}`;
