/* ---------- 시간 기반 애니메이션 유틸 ----------
   모든 시각화는 "현재 시각 t(ms)의 순수 함수"로 그린다.
   그래서 스크러빙·되감기·속도 변경이 공짜다.                      */

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const ease = {
  linear: (t: number) => t,
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outBack: (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  spring: (t: number) => 1 - Math.exp(-6 * t) * Math.cos(9 * t),
};

/** t가 [from, from+dur] 구간에서 0→1 로 진행한 값. 구간 밖은 0 또는 1. */
export function seg(t: number, from: number, dur: number, fn: (x: number) => number = ease.inOut) {
  if (dur <= 0) return t >= from ? 1 : 0;
  const x = clamp01((t - from) / dur);
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return fn(x);
}
/** [from, to] 사이에서만 1, 앞뒤로 fade 만큼 페이드 */
export function window_(t: number, from: number, to: number, fade = 250) {
  if (t < from || t > to) return 0;
  const a = clamp01((t - from) / fade);
  const b = clamp01((to - t) / fade);
  return Math.min(a, b);
}
/** 지정 시각 이후 1 (즉시). */
export const after = (t: number, at: number) => (t >= at ? 1 : 0);

/** 자막 트랙 */
export type Subtitle = { from: number; to: number; text: string };
export type Chapter = { at: number; title: string };
export type Script = { total: number; subtitles: Subtitle[]; chapters: Chapter[] };

export function currentSubtitle(subs: Subtitle[], t: number) {
  for (let i = subs.length - 1; i >= 0; i--) if (t >= subs[i].from && t < subs[i].to) return subs[i];
  return null;
}
export function currentChapter(chs: Chapter[], t: number) {
  let idx = 0;
  for (let i = 0; i < chs.length; i++) if (t >= chs[i].at) idx = i;
  return idx;
}

/** 대본 작성 도우미: 순서대로 장면을 쌓아 시각 자동 계산 */
export class ScriptBuilder {
  t = 0;
  subtitles: Subtitle[] = [];
  chapters: Chapter[] = [];
  marks: Record<string, number> = {};
  chapter(title: string) { this.chapters.push({ at: this.t, title }); return this; }
  /** 이름 붙은 시각 */
  mark(name: string) { this.marks[name] = this.t; return this; }
  /** 자막을 dur 동안 보여주고 시간을 그만큼 진행 */
  say(text: string, dur: number) { this.subtitles.push({ from: this.t, to: this.t + dur, text }); this.t += dur; return this; }
  /** 자막 없이 시간만 진행 */
  wait(dur: number) { this.t += dur; return this; }
  build(): Script { return { total: this.t, subtitles: this.subtitles, chapters: this.chapters }; }
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** SVG 텍스트 폭 추정 (px). 한글/CJK 는 1em, 라틴은 평균 0.58em, 모노스페이스는 0.6em. */
export function textW(str: string, size: number, mono = false) {
  let w = 0;
  for (const ch of str) {
    const c = ch.codePointAt(0)!;
    if (c > 0x2e80) w += 1.0;                      // 한글·한자·전각
    else if (mono) w += 0.6;
    else if (ch === " ") w += 0.3;
    else if (/[A-Z@#%&]/.test(ch)) w += 0.7;
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[ijl.,:;'!|\[\]()]/.test(ch)) w += 0.32;
    else if (/[mw]/.test(ch)) w += 0.85;
    else w += 0.56;
  }
  return w * size;
}
/** 주어진 폭에 맞는 최대 글꼴 크기 */
export function fitFont(str: string, maxW: number, size: number, min = 11, mono = false) {
  const w = textW(str, size, mono);
  return w <= maxW ? size : Math.max(min, (size * maxW) / w);
}
