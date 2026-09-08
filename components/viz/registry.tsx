"use client";
import { useMemo } from "react";
import { ScriptedStage } from "@/components/anim/ScriptedStage";
import { buildVariablesScene } from "./scenes/variables";
import { buildStory, type Story } from "./StoryScene";
import { buildFlow, type Flow } from "./FlowScene";
import { buildStack, type StackStory } from "./StackScene";
import { buildScope, type ScopeStory } from "./ScopeScene";
import { SCENES as EXTRA } from "./scenes";

type Built = { script: import("@/lib/anim").Script; render: (t: number) => React.ReactNode; viewBox?: string };
/** 레슨 블록의 `component` 이름 → 실제 시각화 */
const SCENES: Record<string, (props: Record<string, unknown>) => Built> = {
  VariablesScene: () => buildVariablesScene(),
  Story: (props) => buildStory(props.story as Story),
  Flow: (props) => buildFlow(props.flow as Flow),
  Stack: (props) => buildStack(props.stack as StackStory),
  Scope: (props) => buildScope(props.scope as ScopeStory),
  ...EXTRA,
};

export function Viz({ component, props = {}, title, initialT }: { component: string; props?: Record<string, unknown>; title?: string; initialT?: number }) {
  const build = SCENES[component];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scene = useMemo(() => (build ? build(props) : null), [build, props]);
  if (!scene) {
    return <div className="stage" style={{ display: "grid", placeItems: "center", color: "var(--stage-muted)" }}>시각화 준비 중: {component}</div>;
  }
  return <ScriptedStage script={scene.script} render={scene.render} title={title} kicker="애니메이션" initialT={initialT} viewBox={scene.viewBox} />;
}
