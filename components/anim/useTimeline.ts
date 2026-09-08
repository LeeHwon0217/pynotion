"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/lib/anim";

/**
 * 재생 가능한 타임라인. 현재 시각 t(ms)를 rAF로 진행시킨다.
 * - play/pause/seek/speed
 * - 끝에 도달하면 정지 (loop 옵션)
 * - reduced-motion 이면 처음부터 끝 상태
 */
export function useTimeline(total: number, opts: { autoplay?: boolean; speed?: number; loop?: boolean } = {}) {
  const { autoplay = false, loop = false } = opts;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(opts.speed ?? 1);
  const tRef = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const stop = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    cancelAnimationFrame(raf.current);
  }, []);

  const tick = useCallback((now: number) => {
    if (!playingRef.current) return;
    const dt = last.current ? now - last.current : 0;
    last.current = now;
    let next = tRef.current + dt * speedRef.current;
    if (next >= total) {
      if (loop) next = 0;
      else { next = total; tRef.current = next; setT(next); stop(); return; }
    }
    tRef.current = next;
    setT(next);
    raf.current = requestAnimationFrame(tick);
  }, [total, loop, stop]);

  const play = useCallback(() => {
    if (reducedMotion()) { tRef.current = total; setT(total); return; }
    if (tRef.current >= total) { tRef.current = 0; setT(0); }
    playingRef.current = true;
    setPlaying(true);
    last.current = 0;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }, [tick, total]);

  const seek = useCallback((ms: number) => {
    const v = Math.max(0, Math.min(total, ms));
    tRef.current = v;
    setT(v);
  }, [total]);

  const toggle = useCallback(() => { if (playingRef.current) stop(); else play(); }, [play, stop]);

  useEffect(() => {
    if (autoplay) play();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 탭이 백그라운드로 가면 정지 (rAF 멈춤 → 큰 dt 튐 방지)
  useEffect(() => {
    const onVis = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [stop]);

  return { t, playing, speed, setSpeed, play, pause: stop, toggle, seek, total };
}

/** 스크롤 진입 시 자동 재생 (한 번만) */
export function useAutoplayOnView(ref: React.RefObject<HTMLElement | null>, play: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) return;
    let fired = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired) { fired = true; play(); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, play, enabled]);
}
