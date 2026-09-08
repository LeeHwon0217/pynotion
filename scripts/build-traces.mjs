// content/traces/*.py 를 전부 실행해 data/traces/*.json 으로 만든다.
// 파일 첫 줄에 `# @inline-small` 이 있으면 원시값을 인라인으로 표시한다.
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(root, "content", "traces");
const outDir = join(root, "data", "traces");
mkdirSync(outDir, { recursive: true });

const only = process.argv[2];
const files = readdirSync(srcDir).filter((f) => f.endsWith(".py") && (!only || f.includes(only)));
const index = [];
let fail = 0;
for (const f of files) {
  const id = basename(f, ".py");
  const src = readFileSync(join(srcDir, f), "utf-8");
  const args = [join(root, "scripts", "trace.py"), id, join(srcDir, f), join(outDir, `${id}.json`)];
  if (src.startsWith("# @inline-small")) args.push("--inline-small");
  const r = spawnSync("python", args, { encoding: "utf-8" });
  if (r.status !== 0) { fail++; console.error(`✗ ${id}\n${r.stderr}`); continue; }
  process.stdout.write(`✓ ${r.stdout.trim()}\n`);
  index.push(id);
}
// 정적 import 용 인덱스
const idx = `// 자동 생성 — npm run traces\nimport type { Trace } from "@/lib/types";\n` +
  index.map((id, i) => `import t${i} from "./${id}.json";`).join("\n") +
  `\n\nexport const TRACES: Record<string, Trace> = {\n` +
  index.map((id, i) => `  "${id}": t${i} as unknown as Trace,`).join("\n") + `\n};\n`;
writeFileSync(join(outDir, "index.ts"), idx);
if (!existsSync(join(outDir, "index.ts"))) process.exit(1);
console.log(`${index.length} traces${fail ? `, ${fail} failed` : ""}`);
process.exit(fail ? 1 : 0);
