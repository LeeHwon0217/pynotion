"use client";
import { useMemo } from "react";
import { ScriptedStage } from "@/components/anim/ScriptedStage";
import { buildVariablesScene } from "./scenes/variables";

/** 레슨 블록의 `component` 이름 → 실제 시각화 */
const SCENES: Record<string, () => ReturnType<typeof buildVariablesScene>> = {
  VariablesScene: buildVariablesScene,
};

export function Viz({ component, props = {}, title, initialT }: { component: string; props?: Record<string, unknown>; title?: string; initialT?: number }) {
  const build = SCENES[component];
  const scene = useMemo(() => (build ? build() : null), [build]);
  if (!scene) {
    return <div className="stage" style={{ display: "grid", placeItems: "center", color: "var(--stage-muted)" }}>시각화 준비 중: {component}</div>;
  }
  return <ScriptedStage script={scene.script} render={scene.render} title={title} kicker="애니메이션" initialT={initialT} {...(props as object)} />;
}
