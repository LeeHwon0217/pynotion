"use client";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Stage } from "@/components/Stage";
import { useAutoplayOnView, useTimeline } from "./useTimeline";
import { currentChapter, currentSubtitle, type Script } from "@/lib/anim";

/** 자막 텍스트에 `code` 와 **강조** 를 허용 */
export function richSub(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("**")) return <b key={i}>{p.slice(2, -2)}</b>;
    return <span key={i}>{p}</span>;
  });
}

/**
 * 대본(Script) + t의 순수 함수인 render 로 이루어진 무대.
 * 화면에 들어오면 자동 재생.
 */
export function ScriptedStage({
  script, render, title, kicker, tall, autoplay = false, viewBox = "0 0 1200 520", initialT,
}: {
  script: Script;
  render: (t: number) => ReactNode;
  title?: string; kicker?: string; tall?: boolean; autoplay?: boolean;
  viewBox?: string;
  /** QA용: 이 시각에서 멈춘 채 시작 */
  initialT?: number;
}) {
  const tl = useTimeline(script.total, { speed: 1 });
  const wrap = useRef<HTMLDivElement>(null);
  useAutoplayOnView(wrap, tl.play, autoplay && initialT === undefined);
  useEffect(() => { if (initialT !== undefined) tl.seek(initialT); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [initialT]);

  const sub = currentSubtitle(script.subtitles, tl.t);
  const chIdx = currentChapter(script.chapters, tl.t);
  const marks = useMemo(() => script.chapters.map((c) => c.at), [script]);

  return (
    <div ref={wrap}>
      <Stage
        title={title} kicker={kicker} tall={tall}
        chapters={script.chapters} chapterIdx={chIdx}
        onChapter={(i) => { tl.seek(script.chapters[i].at); if (!tl.playing) tl.play(); }}
        subtitle={sub ? richSub(sub.text) : null}
        transport={{
          t: tl.t, total: tl.total, playing: tl.playing, toggle: tl.toggle, seek: tl.seek,
          speed: tl.speed, setSpeed: tl.setSpeed, marks,
          stepBack: () => { const prev = [...script.chapters].reverse().find((c) => c.at < tl.t - 300); tl.seek(prev ? prev.at : 0); },
          stepFwd: () => { const next = script.chapters.find((c) => c.at > tl.t + 50); tl.seek(next ? next.at : tl.total); },
        }}
      >
        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="st-mono-root">
          {render(tl.t)}
        </svg>
      </Stage>
    </div>
  );
}
