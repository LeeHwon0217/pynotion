import { notFound } from "next/navigation";
import { PARTS, findPart } from "@/content/curriculum";
import { PartView } from "@/components/PartView";

export function generateStaticParams() {
  return PARTS.map((p) => ({ part: p.slug }));
}

export default async function PartPage({ params }: { params: Promise<{ part: string }> }) {
  const { part } = await params;
  const p = findPart(part);
  if (!p) notFound();
  return <PartView part={p} />;
}
