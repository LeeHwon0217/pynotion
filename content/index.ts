import type { Lesson } from "@/lib/types";
import { lessonKey } from "./curriculum";
import { variables } from "./part-01/variables";

const ALL: Lesson[] = [variables];

const BY_KEY: Record<string, Lesson> = Object.fromEntries(
  ALL.map((l) => [lessonKey(["start", "data", "flow", "collections", "functions", "modules", "errors-files", "oop", "iterators", "advanced", "concurrency", "internals", "tools", "algorithms", "projects"][l.part], l.slug), l]),
);

export function getLesson(partSlug: string, lessonSlug: string): Lesson | null {
  return BY_KEY[lessonKey(partSlug, lessonSlug)] ?? null;
}
export const AUTHORED = new Set(Object.keys(BY_KEY));
