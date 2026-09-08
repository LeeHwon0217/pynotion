import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PARTS, findLesson } from "@/content/curriculum";
import { getLesson } from "@/content";
import { LessonShell } from "@/components/lesson/LessonShell";

export function generateStaticParams() {
  return PARTS.flatMap((p) => p.lessons.map((l) => ({ part: p.slug, lesson: l.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ part: string; lesson: string }> }): Promise<Metadata> {
  const { part, lesson } = await params;
  const f = findLesson(part, lesson);
  return { title: f ? f.lesson.title : "레슨" };
}

export default async function LessonPage({ params }: { params: Promise<{ part: string; lesson: string }> }) {
  const { part, lesson } = await params;
  const f = findLesson(part, lesson);
  if (!f) notFound();
  const content = getLesson(part, lesson);
  return <LessonShell part={f.part} meta={f.lesson} idx={f.idx} lesson={content} />;
}
