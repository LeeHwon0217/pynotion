"use client";
import Link from "next/link";
import type { PartMeta } from "@/lib/types";
import { lessonKey } from "@/content/curriculum";
import { AUTHORED } from "@/content";
import { useProgress } from "@/lib/progress";

export function PartView({ part }: { part: PartMeta }) {
  const { progress } = useProgress();
  const doneCount = part.lessons.filter((l) => progress.done[lessonKey(part.slug, l.slug)]).length;
  return (
    <main className="shell shell-narrow" style={{ ["--pc" as string]: `var(${part.color})` }}>
      <div className="part-hero">
        <div className="crumbs"><Link href="/">커리큘럼</Link><span>/</span><span style={{ opacity: 1 }}>Part {part.id}</span></div>
        <div className="eyebrow">PART {part.id}</div>
        <h1>{part.title}</h1>
        <p>{part.tagline}</p>
      </div>
      <div className="progress-line">
        <span>{doneCount} / {part.lessons.length} 완료</span>
        <div className="track"><i style={{ width: `${(doneCount / part.lessons.length) * 100}%` }} /></div>
      </div>
      <div className="lesson-list">
        {part.lessons.map((l, i) => {
          const key = lessonKey(part.slug, l.slug);
          const done = !!progress.done[key];
          const ready = AUTHORED.has(key);
          return (
            <Link key={l.slug} href={`/learn/${part.slug}/${l.slug}`} className={`lesson-row${done ? " done" : ""}`} style={{ opacity: ready ? 1 : 0.62 }}>
              <span className="n">{done ? "✓" : i + 1}</span>
              <span><b>{l.title}</b><small>{l.summary}</small></span>
              <span className="meta">
                {l.star && <span className="star-chip">★ 시각화</span>}
                {!ready && <span>준비 중</span>}
                <span>{l.minutes}분</span>
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
