"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "pymotion.progress.v1";

export type Progress = {
  done: Record<string, number>;       // lessonKey -> 완료 시각(ms)
  quiz: Record<string, { correct: number; total: number }>;
  last?: string;                       // 마지막으로 본 lessonKey
  speed?: number;                      // 재생 속도 배율
};

const EMPTY: Progress = { done: {}, quiz: {} };

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return { ...EMPTY, ...p };
  } catch {
    return EMPTY;
  }
}
function write(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* 저장 불가 환경 */ }
}

/** 진도 상태. SSR에서는 EMPTY, 마운트 후 localStorage 값으로 교체. */
export function useProgress() {
  const [p, setP] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setP(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setP(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (prev: Progress) => Progress) => {
    setP((prev) => { const next = fn(prev); write(next); return next; });
  }, []);

  const markDone = useCallback((key: string, done = true) => {
    update((prev) => {
      const d = { ...prev.done };
      if (done) d[key] = Date.now(); else delete d[key];
      return { ...prev, done: d };
    });
  }, [update]);

  const setLast = useCallback((key: string) => {
    update((prev) => (prev.last === key ? prev : { ...prev, last: key }));
  }, [update]);

  const recordQuiz = useCallback((key: string, correct: number, total: number) => {
    update((prev) => ({ ...prev, quiz: { ...prev.quiz, [key]: { correct, total } } }));
  }, [update]);

  const setSpeed = useCallback((speed: number) => {
    update((prev) => ({ ...prev, speed }));
  }, [update]);

  return { progress: p, ready, markDone, setLast, recordQuiz, setSpeed };
}
