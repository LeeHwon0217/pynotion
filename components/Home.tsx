"use client";
import Link from "next/link";
import { PARTS, TOTAL_LESSONS, lessonKey } from "@/content/curriculum";
import { AUTHORED } from "@/content";
import { useProgress } from "@/lib/progress";
import { HeroDemo } from "./HeroDemo";

export function Home() {
  const { progress, ready } = useProgress();
  const doneTotal = Object.keys(progress.done).length;
  const pct = Math.round((doneTotal / TOTAL_LESSONS) * 100);
  const last = progress.last;
  const starCount = PARTS.reduce((n, p) => n + p.lessons.filter((l) => l.star).length, 0);

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <h1>파이썬이 <em>실제로 움직이는</em> 모습을<br />눈으로 배운다</h1>
          <p className="lead">
            변수가 객체를 가리키는 순간, 재귀가 쌓였다 풀리는 과정, 딕셔너리가 해시로 자리를 찾는 방법, GIL이 스레드 사이를 오가는 모습 —
            글 대신 애니메이션으로. 모든 코드는 한 줄씩 실행되며 메모리가 어떻게 바뀌는지 보여준다.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={last ? `/learn/${last}` : "/learn/data/variables"}>
              {last ? "이어서 학습 →" : "첫 레슨 시작 →"}
            </Link>
            <Link className="btn btn-ghost" href="/learn/data/variables">변수는 이름표다 (샘플)</Link>
          </div>
          <div className="hero-stats">
            <div><b>{PARTS.length}</b><span>파트</span></div>
            <div><b>{TOTAL_LESSONS}</b><span>레슨</span></div>
            <div><b>{starCount}</b><span>핵심 시각화</span></div>
            <div><b>{ready ? pct : 0}%</b><span>진도</span></div>
          </div>
        </div>
        <div className="hero-stage"><HeroDemo /></div>
      </section>

      <div className="section-head">
        <h2>커리큘럼</h2>
        <p>기초부터 CPython 내부까지, 빠짐없이</p>
      </div>
      <div className="progress-line">
        <span>{doneTotal} / {TOTAL_LESSONS} 레슨 완료</span>
        <div className="track"><i style={{ width: `${ready ? pct : 0}%` }} /></div>
        <b>{ready ? pct : 0}%</b>
      </div>

      <div className="parts">
        {PARTS.map((p) => {
          const done = p.lessons.filter((l) => progress.done[lessonKey(p.slug, l.slug)]).length;
          const authored = p.lessons.filter((l) => AUTHORED.has(lessonKey(p.slug, l.slug))).length;
          return (
            <Link key={p.slug} href={`/learn/${p.slug}`} className="part-card" style={{ ["--pc" as string]: `var(${p.color})` }}>
              <span className="part-num">Part {p.id}</span>
              <h3>{p.title}</h3>
              <p>{p.tagline}</p>
              <div className="part-foot">
                <span className="part-dots">
                  {p.lessons.map((l) => <i key={l.slug} className={`${progress.done[lessonKey(p.slug, l.slug)] ? "done" : ""}${l.star ? " star" : ""}`} />)}
                </span>
                <span>{p.lessons.length}개 · {done > 0 ? `${done} 완료` : authored > 0 ? `${authored} 준비됨` : "준비 중"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
