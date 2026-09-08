/* ---------- 커리큘럼 ---------- */
export type LessonMeta = {
  slug: string;
  title: string;
  summary: string;
  /** 전용 시각화가 핵심인 레슨 */
  star?: boolean;
  /** 분 단위 예상 학습 시간 */
  minutes?: number;
};

export type PartMeta = {
  id: number;          // 0..14
  slug: string;        // "start", "data", ...
  title: string;
  tagline: string;
  color: string;       // CSS 변수 이름 (--series-n)
  lessons: LessonMeta[];
};

/* ---------- 레슨 콘텐츠 블록 ---------- */
export type QuizChoice = { text: string; correct?: boolean; why?: string };

export type Block =
  | { kind: "text"; md: string }
  | { kind: "heading"; text: string; id?: string }
  | { kind: "viz"; component: string; props?: Record<string, unknown>; caption?: string; title?: string }
  | { kind: "trace"; traceId: string; title?: string; caption?: string }
  | { kind: "code"; code: string; title?: string; caption?: string; lang?: "python" | "text" }
  | { kind: "callout"; tone: "info" | "tip" | "warn" | "deep"; title?: string; md: string }
  | { kind: "pitfall"; title: string; md: string; traceId?: string; code?: string }
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string }
  | { kind: "try"; starter: string; hint?: string; title?: string }
  | { kind: "quiz"; question: string; code?: string; choices: QuizChoice[]; explain?: string }
  | { kind: "summary"; items: string[] };

export type Lesson = {
  part: number;
  slug: string;
  blocks: Block[];
};

/* ---------- 실행 추적 ---------- */
export type Ref = { ref: string };          // 힙 객체 id 참조
export type Prim = { prim: string; type: string }; // 인라인 원시값 표현

export type HeapObj = {
  id: string;
  type: string;                 // "int" | "str" | "list" | "dict" | "tuple" | "set" | "function" | "NoneType" | ...
  repr: string;                 // 짧은 표시용
  items?: (Ref | Prim)[];       // list/tuple/set
  entries?: [Ref | Prim, Ref | Prim][]; // dict
  fields?: Record<string, Ref | Prim>;   // 사용자 객체 속성
};

export type Frame = {
  fn: string;
  line: number;
  locals: Record<string, Ref | Prim>;
};

export type TraceStep = {
  line: number;
  event: "call" | "line" | "return" | "exception";
  frames: Frame[];
  heap: Record<string, HeapObj>;
  stdout: string;
  note?: string;
  retval?: string;
  exc?: string;
};

export type Trace = {
  id: string;
  code: string;
  steps: TraceStep[];
  /** 트레이스 생성기 버전 */
  v: number;
};
