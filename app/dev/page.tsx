import { Suspense } from "react";
import { DevView } from "@/components/DevView";

/** QA 전용: /dev?scene=VariablesScene&t=12000  또는 /dev?trace=p1-variables-alias&t=5200 */
export default function Dev() {
  return (
    <Suspense fallback={null}>
      <DevView />
    </Suspense>
  );
}
