"use client";
import { useSearchParams } from "next/navigation";
import { Viz } from "@/components/viz/registry";
import { TracePlayer } from "@/components/TracePlayer";
import { TRACES } from "@/data/traces";

export function DevView() {
  const q = useSearchParams();
  const scene = q.get("scene") ?? undefined;
  const trace = q.get("trace") ?? undefined;
  const t = q.get("t") ? Number(q.get("t")) : undefined;
  return (
    <main style={{ padding: 12, maxWidth: 1440, margin: "0 auto" }}>
      {scene && <Viz component={scene} initialT={t} />}
      {trace && TRACES[trace] && <TracePlayer trace={TRACES[trace]} initialT={t} autoplay={false} />}
    </main>
  );
}
