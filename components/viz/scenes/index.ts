import type { Script } from "@/lib/anim";
import type { ReactNode } from "react";
import { buildPipelineScene } from "./pipeline";
import { buildFloatScene } from "./float";
import { buildNestedScene } from "./nested";
import { buildSliceScene, type SliceProps } from "./slice";
import { buildDynArrayScene } from "./dynarray";
import { buildHashTableScene } from "./hashtable";
import { buildSetScene } from "./sets";
import { buildSortKeyScene } from "./sortkey";

export type Built = { script: Script; render: (t: number) => ReactNode; viewBox?: string };
/** 전용 시각화 등록부 — 파트를 만들 때마다 여기에 추가 */
export const SCENES: Record<string, (props: Record<string, unknown>) => Built> = {
  PipelineScene: () => buildPipelineScene(),
  FloatScene: () => buildFloatScene(),
  NestedScene: () => buildNestedScene(),
  SliceScene: (props) => buildSliceScene(props as unknown as SliceProps),
  DynArrayScene: () => buildDynArrayScene(),
  HashTableScene: () => buildHashTableScene(),
  SetScene: () => buildSetScene(),
  SortKeyScene: () => buildSortKeyScene(),
};
