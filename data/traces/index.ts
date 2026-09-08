// 자동 생성 — npm run traces
import type { Trace } from "@/lib/types";
import t0 from "./p0-indent-error.json";
import t1 from "./p0-indent.json";
import t2 from "./p0-print.json";
import t3 from "./p0-runtime-error.json";
import t4 from "./p0-syntax-error.json";
import t5 from "./p0-traceback.json";
import t6 from "./p0-typeerror.json";
import t7 from "./p1-arith.json";
import t8 from "./p1-bool-none.json";
import t9 from "./p1-convert.json";
import t10 from "./p1-float-sum.json";
import t11 from "./p1-format.json";
import t12 from "./p1-fstring.json";
import t13 from "./p1-int-ops.json";
import t14 from "./p1-is-eq.json";
import t15 from "./p1-logic.json";
import t16 from "./p1-variables-alias.json";
import t17 from "./p1-variables-basic.json";
import t18 from "./p1-variables-swap.json";

export const TRACES: Record<string, Trace> = {
  "p0-indent-error": t0 as unknown as Trace,
  "p0-indent": t1 as unknown as Trace,
  "p0-print": t2 as unknown as Trace,
  "p0-runtime-error": t3 as unknown as Trace,
  "p0-syntax-error": t4 as unknown as Trace,
  "p0-traceback": t5 as unknown as Trace,
  "p0-typeerror": t6 as unknown as Trace,
  "p1-arith": t7 as unknown as Trace,
  "p1-bool-none": t8 as unknown as Trace,
  "p1-convert": t9 as unknown as Trace,
  "p1-float-sum": t10 as unknown as Trace,
  "p1-format": t11 as unknown as Trace,
  "p1-fstring": t12 as unknown as Trace,
  "p1-int-ops": t13 as unknown as Trace,
  "p1-is-eq": t14 as unknown as Trace,
  "p1-logic": t15 as unknown as Trace,
  "p1-variables-alias": t16 as unknown as Trace,
  "p1-variables-basic": t17 as unknown as Trace,
  "p1-variables-swap": t18 as unknown as Trace,
};
