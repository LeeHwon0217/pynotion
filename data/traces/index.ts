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
import t19 from "./p2-break-continue.json";
import t20 from "./p2-for-else.json";
import t21 from "./p2-for.json";
import t22 from "./p2-if.json";
import t23 from "./p2-match.json";
import t24 from "./p2-nested.json";
import t25 from "./p2-range.json";
import t26 from "./p2-truthy.json";
import t27 from "./p2-while.json";
import t28 from "./p3-comp.json";
import t29 from "./p3-copy.json";
import t30 from "./p3-dict-methods.json";
import t31 from "./p3-dict.json";
import t32 from "./p3-getsizeof.json";
import t33 from "./p3-hash.json";
import t34 from "./p3-index.json";
import t35 from "./p3-join.json";
import t36 from "./p3-list-basics.json";
import t37 from "./p3-list-methods.json";
import t38 from "./p3-nested-comp.json";
import t39 from "./p3-set.json";
import t40 from "./p3-slice.json";
import t41 from "./p3-sort.json";
import t42 from "./p3-str-methods.json";
import t43 from "./p3-tuple.json";
import t44 from "./p4-args-error.json";
import t45 from "./p4-args.json";
import t46 from "./p4-call.json";
import t47 from "./p4-docstring.json";
import t48 from "./p4-global-nonlocal.json";
import t49 from "./p4-lambda.json";
import t50 from "./p4-mutable-default.json";
import t51 from "./p4-nonlocal.json";
import t52 from "./p4-pass-by.json";
import t53 from "./p4-positional-only.json";
import t54 from "./p4-recursion.json";
import t55 from "./p4-return.json";
import t56 from "./p4-scope.json";
import t57 from "./p4-star-args.json";
import t58 from "./p5-from-as.json";
import t59 from "./p5-import.json";
import t60 from "./p5-main.json";
import t61 from "./p5-stdlib.json";
import t62 from "./p6-csv-json.json";
import t63 from "./p6-else-finally.json";
import t64 from "./p6-encoding.json";
import t65 from "./p6-file.json";
import t66 from "./p6-hierarchy.json";
import t67 from "./p6-json.json";
import t68 from "./p6-pathlib.json";
import t69 from "./p6-propagate.json";
import t70 from "./p6-raise.json";
import t71 from "./p6-try-except.json";
import t72 from "./p6-with.json";
import t73 from "./p7-abc-slots.json";
import t74 from "./p7-class-attr-trap.json";
import t75 from "./p7-class-attr.json";
import t76 from "./p7-class-init.json";
import t77 from "./p7-classmethod.json";
import t78 from "./p7-dataclass.json";
import t79 from "./p7-encap.json";
import t80 from "./p7-hash.json";
import t81 from "./p7-inherit.json";
import t82 from "./p7-lookup.json";
import t83 from "./p7-mro.json";
import t84 from "./p7-operators.json";
import t85 from "./p7-poly.json";
import t86 from "./p7-property.json";
import t87 from "./p7-repr.json";
import t88 from "./p7-self.json";
import t89 from "./p7-why-class.json";

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
  "p2-break-continue": t19 as unknown as Trace,
  "p2-for-else": t20 as unknown as Trace,
  "p2-for": t21 as unknown as Trace,
  "p2-if": t22 as unknown as Trace,
  "p2-match": t23 as unknown as Trace,
  "p2-nested": t24 as unknown as Trace,
  "p2-range": t25 as unknown as Trace,
  "p2-truthy": t26 as unknown as Trace,
  "p2-while": t27 as unknown as Trace,
  "p3-comp": t28 as unknown as Trace,
  "p3-copy": t29 as unknown as Trace,
  "p3-dict-methods": t30 as unknown as Trace,
  "p3-dict": t31 as unknown as Trace,
  "p3-getsizeof": t32 as unknown as Trace,
  "p3-hash": t33 as unknown as Trace,
  "p3-index": t34 as unknown as Trace,
  "p3-join": t35 as unknown as Trace,
  "p3-list-basics": t36 as unknown as Trace,
  "p3-list-methods": t37 as unknown as Trace,
  "p3-nested-comp": t38 as unknown as Trace,
  "p3-set": t39 as unknown as Trace,
  "p3-slice": t40 as unknown as Trace,
  "p3-sort": t41 as unknown as Trace,
  "p3-str-methods": t42 as unknown as Trace,
  "p3-tuple": t43 as unknown as Trace,
  "p4-args-error": t44 as unknown as Trace,
  "p4-args": t45 as unknown as Trace,
  "p4-call": t46 as unknown as Trace,
  "p4-docstring": t47 as unknown as Trace,
  "p4-global-nonlocal": t48 as unknown as Trace,
  "p4-lambda": t49 as unknown as Trace,
  "p4-mutable-default": t50 as unknown as Trace,
  "p4-nonlocal": t51 as unknown as Trace,
  "p4-pass-by": t52 as unknown as Trace,
  "p4-positional-only": t53 as unknown as Trace,
  "p4-recursion": t54 as unknown as Trace,
  "p4-return": t55 as unknown as Trace,
  "p4-scope": t56 as unknown as Trace,
  "p4-star-args": t57 as unknown as Trace,
  "p5-from-as": t58 as unknown as Trace,
  "p5-import": t59 as unknown as Trace,
  "p5-main": t60 as unknown as Trace,
  "p5-stdlib": t61 as unknown as Trace,
  "p6-csv-json": t62 as unknown as Trace,
  "p6-else-finally": t63 as unknown as Trace,
  "p6-encoding": t64 as unknown as Trace,
  "p6-file": t65 as unknown as Trace,
  "p6-hierarchy": t66 as unknown as Trace,
  "p6-json": t67 as unknown as Trace,
  "p6-pathlib": t68 as unknown as Trace,
  "p6-propagate": t69 as unknown as Trace,
  "p6-raise": t70 as unknown as Trace,
  "p6-try-except": t71 as unknown as Trace,
  "p6-with": t72 as unknown as Trace,
  "p7-abc-slots": t73 as unknown as Trace,
  "p7-class-attr-trap": t74 as unknown as Trace,
  "p7-class-attr": t75 as unknown as Trace,
  "p7-class-init": t76 as unknown as Trace,
  "p7-classmethod": t77 as unknown as Trace,
  "p7-dataclass": t78 as unknown as Trace,
  "p7-encap": t79 as unknown as Trace,
  "p7-hash": t80 as unknown as Trace,
  "p7-inherit": t81 as unknown as Trace,
  "p7-lookup": t82 as unknown as Trace,
  "p7-mro": t83 as unknown as Trace,
  "p7-operators": t84 as unknown as Trace,
  "p7-poly": t85 as unknown as Trace,
  "p7-property": t86 as unknown as Trace,
  "p7-repr": t87 as unknown as Trace,
  "p7-self": t88 as unknown as Trace,
  "p7-why-class": t89 as unknown as Trace,
};
