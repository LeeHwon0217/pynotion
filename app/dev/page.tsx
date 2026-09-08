import { DevView } from "@/components/DevView";

/** QA 전용: /dev?scene=VariablesScene&t=12000  또는 /dev?trace=p1-variables-alias&t=5200 */
export default async function Dev({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return <DevView scene={q.scene} trace={q.trace} t={q.t ? Number(q.t) : undefined} />;
}
