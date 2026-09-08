import type { Lesson } from "@/lib/types";
import { PARTS, lessonKey } from "./curriculum";
import { whatIsPython } from "./part-00/what-is-python";
import { setup } from "./part-00/setup";
import { howCodeRuns } from "./part-00/how-code-runs";
import { firstProgram } from "./part-00/first-program";
import { readingErrors } from "./part-00/reading-errors";
import { variables } from "./part-01/variables";
import { intLesson } from "./part-01/int";
import { floatLesson } from "./part-01/float";
import { boolNone } from "./part-01/bool-none";
import { stringBasics } from "./part-01/string-basics";
import { arithmetic } from "./part-01/arithmetic";
import { comparisonLogic } from "./part-01/comparison-logic";
import { typeConversion } from "./part-01/type-conversion";
import { isVsEq } from "./part-01/is-vs-eq";
import { inputFormat } from "./part-01/input-format";
import { ifLesson } from "./part-02/if";
import { truthiness } from "./part-02/truthiness";
import { whileLesson } from "./part-02/while";
import { forLesson } from "./part-02/for";
import { rangeLesson } from "./part-02/range";
import { breakContinue } from "./part-02/break-continue";
import { nestedLoops } from "./part-02/nested-loops";
import { matchLesson } from "./part-02/match";

const ALL: Lesson[] = [
  whatIsPython, setup, howCodeRuns, firstProgram, readingErrors,
  variables, intLesson, floatLesson, boolNone, stringBasics, arithmetic, comparisonLogic, typeConversion, isVsEq, inputFormat,
  ifLesson, truthiness, whileLesson, forLesson, rangeLesson, breakContinue, nestedLoops, matchLesson,
];

const partSlug = (id: number) => PARTS.find((p) => p.id === id)!.slug;
const BY_KEY: Record<string, Lesson> = Object.fromEntries(ALL.map((l) => [lessonKey(partSlug(l.part), l.slug), l]));

export function getLesson(partSlug_: string, lessonSlug: string): Lesson | null {
  return BY_KEY[lessonKey(partSlug_, lessonSlug)] ?? null;
}
export const AUTHORED = new Set(Object.keys(BY_KEY));
