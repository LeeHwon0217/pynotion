"use client";
import { Viz } from "@/components/viz/registry";
import { TracePlayer } from "@/components/TracePlayer";
import { TRACES } from "@/data/traces";

export function DevView({ scene, trace, t }: { scene?: string; trace?: string; t?: number }) {
  return (
    <main style={{ padding: 12, maxWidth: 1440, margin: "0 auto" }}>
      {scene && <Viz component={scene} initialT={t} />}
      {trace && TRACES[trace] && <TracePlayer trace={TRACES[trace]} initialT={t} autoplay={false} />}
    </main>
  );
}
