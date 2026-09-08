"use client";
import Link from "next/link";
import { useEffect } from "react";
import type { Lesson, LessonMeta, PartMeta } from "@/lib/types";
import { lessonKey, neighbors } from "@/content/curriculum";
import { useProgress } from "@/lib/progress";
import { Blocks } from "./Blocks";

export function LessonShell({ part, meta, idx, lesson }: { part: PartMeta; meta: LessonMeta; idx: number; lesson: Lesson | null }) {
  const key = lessonKey(part.slug, meta.slug);
  const { progress, ready, markDone, setLast } = useProgress();
  useEffect(() => { if (ready) setLast(key); }, [ready, key, setLast]);
  const done = !!progress.done[key];
  const nb = neighbors(part.slug, meta.slug);

  return (
    <main className="shell" style={{ ["--pc" as string]: `var(${part.color})` }}>
      <div className="lesson-top">
        <div className="crumbs">
          <Link href="/">커리큘럼</Link><span>/</span>
          <Link href={`/learn/${part.slug}`}>Part {part.id} · {part.title}</Link><span>/</span>
          <span style={{ opacity: 1 }}>{idx + 1}번째 레슨</span>
          {meta.star && <span className="star-chip" style={{ opacity: 1 }}>★ 핵심 시각화</span>}
        </div>
        <h1>{meta.title}</h1>
        <p className="lead">{meta.summary}</p>
      </div>

      {lesson ? (
        <Blocks blocks={lesson.blocks} lessonKey={key} />
      ) : (
        <div className="wip">
          <b>이 레슨은 준비 중입니다</b>
          {meta.summary} — 시각화와 실행 추적을 붙여서 곧 채워집니다.
        </div>
      )}

      <div className="done-bar">
        <span>{done ? "완료한 레슨입니다." : "다 읽었다면 완료로 표시하세요."}</span>
        <button className="btn btn-primary" data-done={done} onClick={() => markDone(key, !done)}>
          {done ? "✓ 완료됨" : "완료로 표시"}
        </button>
      </div>

      <nav className="lesson-nav">
        {nb.prev ? (
          <Link href={`/learn/${nb.prev.part.slug}/${nb.prev.lesson.slug}`}><small>← 이전</small><b>{nb.prev.lesson.title}</b></Link>
        ) : <span />}
        {nb.next ? (
          <Link className="next" href={`/learn/${nb.next.part.slug}/${nb.next.lesson.slug}`}><small>다음 →</small><b>{nb.next.lesson.title}</b></Link>
        ) : <span />}
      </nav>
    </main>
  );
}
