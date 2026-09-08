"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Chapter } from "@/lib/anim";
import { BASE_RATE } from "./anim/useTimeline";

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

/** 대본 ms → 실제 재생 시간 표기 */
const fmt = (ms: number) => {
  const s = Math.max(0, ms / BASE_RATE) / 1000;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};
const SPEEDS = [1, 1.5, 2, 0.5];

const Icon = {
  play: <svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>,
  pause: <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4.5" height="14" rx="1" /><rect x="13.5" y="5" width="4.5" height="14" rx="1" /></svg>,
  replay: <svg viewBox="0 0 24 24"><path d="M12 5V2.5L7.5 6 12 9.5V7a5 5 0 1 1-4.9 6H5a7 7 0 1 0 7-8z" /></svg>,
  prev: <svg viewBox="0 0 24 24"><path d="M6 5h2.5v14H6zM18 6.2v11.6a1 1 0 0 1-1.55.83L9 12.9v-1.8l7.45-5.73A1 1 0 0 1 18 6.2z" /></svg>,
  next: <svg viewBox="0 0 24 24"><path d="M15.5 5H18v14h-2.5zM6 6.2v11.6a1 1 0 0 0 1.55.83L15 12.9v-1.8L7.55 5.37A1 1 0 0 0 6 6.2z" /></svg>,
  full: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" /></svg>,
  unfull: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4v4a1 1 0 0 1-1 1H4M15 4v4a1 1 0 0 0 1 1h4M9 20v-4a1 1 0 0 0-1-1H4M15 20v-4a1 1 0 0 1 1-1h4" /></svg>,
};

export function Stage({
  title, kicker, chapters = [], chapterIdx = 0, onChapter, subtitle, transport, children, tall = false,
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
  const [started, setStarted] = useState(false);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  useEffect(() => { if (transport && (transport.playing || transport.t > 0)) setStarted(true); }, [transport]);

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
      if (e.key === " " || e.key === "k") { e.preventDefault(); transport.toggle(); }
      if (e.key === "ArrowRight") { e.preventDefault(); (transport.stepFwd ?? (() => transport.seek(transport.t + 1000)))(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); (transport.stepBack ?? (() => transport.seek(transport.t - 1000)))(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hover, full, transport]);

  // 스크러버
  const scrubRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pctFromEvent = (e: PointerEvent | React.PointerEvent) => {
    if (!scrubRef.current) return 0;
    const r = scrubRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  };
  const seekFromEvent = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!transport) return;
    transport.seek(pctFromEvent(e) * transport.total);
  }, [transport]);
  const onPointerDown = (e: React.PointerEvent) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); seekFromEvent(e); };
  const onPointerMove = (e: React.PointerEvent) => { setHoverPct(pctFromEvent(e)); if (dragging.current) seekFromEvent(e); };
  const onPointerUp = () => { dragging.current = false; };

  const pct = transport ? (transport.total > 0 ? (transport.t / transport.total) * 100 : 0) : 0;
  const ended = !!transport && transport.total > 0 && transport.t >= transport.total;
  const poster = !!transport && !started && !transport.playing && transport.t === 0;
  const chapterAt = (ms: number) => { let i = 0; chapters.forEach((c, j) => { if (ms >= c.at) i = j; }); return chapters[i]; };
  const hoverChapter = hoverPct != null && transport && chapters.length ? chapterAt(hoverPct * transport.total) : null;

  // 챕터 구간 (YouTube 식 분할 바)
  const segments = transport && chapters.length > 1
    ? chapters.map((c, i) => ({ from: c.at / transport.total, to: (chapters[i + 1]?.at ?? transport.total) / transport.total }))
    : [{ from: 0, to: 1 }];

  return (
    <div
      ref={ref}
      className={`stage${tall ? " tall" : ""}${full ? " fullscreen" : ""}${poster ? " poster" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setHoverPct(null); }}
      tabIndex={-1}
    >
      <div className="stage-grid" />
      <div className="stage-head">
        <div className="stage-title">
          {kicker && <span className="stage-kicker">{kicker}</span>}
          {title && <b>{title}</b>}
        </div>
        <span className="sp" />
        {chapters.length > 1 && !poster && (
          <ol className="stage-chapters">
            {chapters.map((c, i) => (
              <li key={i}><button data-on={i === chapterIdx} onClick={() => onChapter?.(i)}><i>{i + 1}</i>{c.title}</button></li>
            ))}
          </ol>
        )}
        <button className="stage-ibtn" onClick={() => setFull((v) => !v)} title={full ? "전체화면 닫기 (Esc)" : "전체화면 (F)"} aria-label="전체화면">
          {full ? Icon.unfull : Icon.full}
        </button>
      </div>

      <div className="stage-canvas" onClick={poster || ended ? transport?.toggle : undefined}>
        {children}
        {poster && transport && (
          <div className="stage-poster">
            <button className="stage-bigplay" onClick={(e) => { e.stopPropagation(); transport.toggle(); }} aria-label="재생">{Icon.play}</button>
            <div className="stage-poster-meta">
              {title && <b>{title}</b>}
              <span>{fmt(transport.total)}{chapters.length > 1 ? ` · 장면 ${chapters.length}개` : ""}</span>
            </div>
          </div>
        )}
        {ended && transport && !poster && (
          <div className="stage-poster ended">
            <button className="stage-bigplay" onClick={(e) => { e.stopPropagation(); transport.seek(0); transport.toggle(); }} aria-label="다시 보기">{Icon.replay}</button>
            <div className="stage-poster-meta"><span>다시 보기</span></div>
          </div>
        )}
      </div>

      {subtitle !== undefined && (
        <div className="stage-sub">{subtitle != null && subtitle !== false && !poster && <p>{subtitle}</p>}</div>
      )}

      {transport && (
        <div className="stage-bar">
          <div
            className="stage-scrub" ref={scrubRef}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
            onPointerLeave={() => { if (!dragging.current) setHoverPct(null); }}
          >
            {segments.map((sg, i) => {
              const filled = Math.max(0, Math.min(1, (pct / 100 - sg.from) / (sg.to - sg.from)));
              return (
                <div key={i} className="seg" style={{ left: `${sg.from * 100}%`, width: `calc(${(sg.to - sg.from) * 100}% - ${segments.length > 1 ? 3 : 0}px)` }}>
                  <i style={{ width: `${filled * 100}%` }} />
                </div>
              );
            })}
            {transport.marks && transport.marks.length <= 40 && transport.marks.map((m, i) => (
              <span key={i} className="mark" style={{ left: `${(m / transport.total) * 100}%` }} />
            ))}
            <div className="knob" style={{ left: `${pct}%` }} />
            {hoverPct != null && (
              <div className="stage-tip" style={{ left: `${hoverPct * 100}%` }}>
                {hoverChapter ? <b>{hoverChapter.title}</b> : null}
                <span>{fmt(hoverPct * transport.total)}</span>
              </div>
            )}
          </div>
          <div className="stage-ctrl">
            <button className="stage-btn" onClick={transport.stepBack ?? (() => transport.seek(transport.t - 1000))} title="이전 장면 (←)" aria-label="이전">{Icon.prev}</button>
            <button className="stage-btn play" onClick={transport.toggle} title={transport.playing ? "일시정지 (Space)" : "재생 (Space)"} aria-label="재생/일시정지">
              {transport.playing ? Icon.pause : ended ? Icon.replay : Icon.play}
            </button>
            <button className="stage-btn" onClick={transport.stepFwd ?? (() => transport.seek(transport.t + 1000))} title="다음 장면 (→)" aria-label="다음">{Icon.next}</button>
            <span className="stage-time">{transport.timeLabel ?? `${fmt(transport.t)} / ${fmt(transport.total)}`}</span>
            {chapters.length > 1 && <span className="stage-now">{chapterIdx + 1}. {chapters[chapterIdx]?.title}</span>}
            <span className="sp" />
            <button className="stage-btn text" onClick={() => transport.setSpeed(SPEEDS[(SPEEDS.indexOf(transport.speed) + 1) % SPEEDS.length])} title="재생 속도">
              {transport.speed}×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
