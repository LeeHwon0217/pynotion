"use client";
import { useSearchParams } from "next/navigation";
import { Viz } from "@/components/viz/registry";
import { TracePlayer } from "@/components/TracePlayer";
import { TRACES } from "@/data/traces";
import { getLesson } from "@/content";

export function DevView() {
  const q = useSearchParams();
  const scene = q.get("scene") ?? undefined;
  const trace = q.get("trace") ?? undefined;
  const lesson = q.get("lesson") ?? undefined;   // "data/is-vs-eq"
  const block = q.get("block") ? Number(q.get("block")) : 0;
  const t = q.get("t") ? Number(q.get("t")) : undefined;
  let vizEl: React.ReactNode = null;
  if (lesson) {
    const [p, l] = lesson.split("/");
    const L = getLesson(p, l);
    const vizBlocks = L?.blocks.filter((b) => b.kind === "viz") ?? [];
    const b = vizBlocks[block];
    if (b && b.kind === "viz") vizEl = <Viz component={b.component} props={b.props} title={b.title} initialT={t} />;
  }
  return (
    <main style={{ padding: 12, maxWidth: 1440, margin: "0 auto" }}>
      {scene && <Viz component={scene} initialT={t} />}
      {vizEl}
      {trace && TRACES[trace] && <TracePlayer trace={TRACES[trace]} initialT={t} autoplay={false} />}
    </main>
  );
}
