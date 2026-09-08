"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Chapter } from "@/lib/anim";

export type Transport = {
  t: number;
  total: number;
  playing: boolean;
  toggle: () => void;
  seek: (ms: number) => void;
  speed: number;
  setSpeed: (s: number) => void;
  /** 스크러버 위 눈금 (ms) */
  marks?: number[];
  /** 한 스텝 앞/뒤 (없으면 시간 기준 ±1초) */
  stepBack?: () => void;
  stepFwd?: () => void;
  timeLabel?: string;
};

const fmt = (ms: number) => {
  const s = Math.max(0, ms) / 1000;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export function Stage({
  title, kicker, chapters = [], chapterIdx = 0, onChapter, subtitle, transport, children, tall = false, speeds = [0.5, 1, 1.5, 2],
}: {
  title?: string; kicker?: string;
  chapters?: Chapter[]; chapterIdx?: number; onChapter?: (i: number) => void;
  subtitle?: ReactNode | null;
  transport?: Transport;
  children: ReactNode;
  tall?: boolean;
  speeds?: number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);
  const [hover, setHover] = useState(false);

  // 전체화면: body 스크롤 잠금 + ESC
  useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [full]);

  // 단축키: 마우스가 무대 위에 있을 때 F / Space / ← →
  useEffect(() => {
    if (!hover && !full) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") { e.preventDefault(); setFull((v) => !v); }
      if (!transport) return;
      if (e.key === " ") { e.preventDefault(); transport.toggle(); }
      if (e.key === "ArrowRight") { e.preventDefault(); (transport.stepFwd ?? (() => transport.seek(transport.t + 1000)))(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); (transport.stepBack ?? (() => transport.seek(transport.t - 1000)))(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hover, full, transport]);

  // 스크러버
  const scrubRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const seekFromEvent = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!transport || !scrubRef.current) return;
    const r = scrubRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    transport.seek(p * transport.total);
  }, [transport]);
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    seekFromEvent(e);
  };
  const onPointerMove = (e: React.PointerEvent) => { if (dragging.current) seekFromEvent(e); };
  const onPointerUp = () => { dragging.current = false; };

  const pct = transport ? (transport.total > 0 ? (transport.t / transport.total) * 100 : 0) : 0;

  return (
    <div
      ref={ref}
      className={`stage${tall ? " tall" : ""}${full ? " fullscreen" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={-1}
    >
      <div className="stage-grid" />
      <div className="stage-head">
        {kicker && <span>{kicker}</span>}
        {title && <b>{title}</b>}
        <span className="sp" />
        {chapters.length > 1 && (
          <div className="stage-chapters">
            {chapters.map((c, i) => (
              <button key={i} data-on={i === chapterIdx} onClick={() => onChapter?.(i)}>{i + 1}. {c.title}</button>
            ))}
          </div>
        )}
        <button className="stage-ibtn" onClick={() => setFull((v) => !v)} title={full ? "전체화면 닫기 (Esc)" : "전체화면 (F)"} aria-label="전체화면">
          {full ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" /></svg>
          )}
        </button>
      </div>

      <div className="stage-canvas">{children}</div>

      {subtitle !== undefined && (
        <div className="stage-sub">{subtitle != null && subtitle !== false && <div>{subtitle}</div>}</div>
      )}

      {transport && (
        <div className="stage-bar">
          <button className="stage-step" onClick={transport.stepBack ?? (() => transport.seek(transport.t - 1000))} title="뒤로 (←)" aria-label="뒤로">
            <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM20 6v12L9 12z" /></svg>
          </button>
          <button className="stage-play" onClick={transport.toggle} title={transport.playing ? "일시정지 (Space)" : "재생 (Space)"} aria-label="재생/일시정지">
            {transport.playing ? (
              <svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : transport.t >= transport.total && transport.total > 0 ? (
              <svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M7 4v16l14-8z" /></svg>
            )}
          </button>
          <button className="stage-step" onClick={transport.stepFwd ?? (() => transport.seek(transport.t + 1000))} title="앞으로 (→)" aria-label="앞으로">
            <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM4 6v12l11-6z" /></svg>
          </button>
          <div
            className="stage-scrub" ref={scrubRef}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          >
            <div className="rail" />
            <div className="fill" style={{ width: `${pct}%` }} />
            {transport.marks?.map((m, i) => (
              <span key={i} className="mark" style={{ left: `${(m / transport.total) * 100}%` }} />
            ))}
            <div className="knob" style={{ left: `${pct}%` }} />
          </div>
          <span className="stage-time">{transport.timeLabel ?? `${fmt(transport.t)} / ${fmt(transport.total)}`}</span>
          <div className="stage-speed">
            {speeds.map((s) => (
              <button key={s} data-on={transport.speed === s} onClick={() => transport.setSpeed(s)}>{s}x</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
