/* 장면: 코드가 실행되는 원리 — 소스 → 토큰 → 구문 트리 → 바이트코드 → 가상 머신 */
import { ScriptBuilder, seg, ease, lerp, window_ } from "@/lib/anim";
import { Badge, C } from "../prims";

const SRC = "total = price * 2 + 5";
const TOKENS = [["total", "NAME"], ["=", "OP"], ["price", "NAME"], ["*", "OP"], ["2", "NUMBER"], ["+", "OP"], ["5", "NUMBER"]];
const BYTECODE = ["LOAD_NAME    price", "LOAD_CONST   2", "BINARY_OP    *", "LOAD_CONST   5", "BINARY_OP    +", "STORE_NAME   total"];

export function buildPipelineScene() {
  const s = new ScriptBuilder();
  s.chapter("소스 코드").mark("src");
  s.say("파이썬 파일은 그냥 **글자**다. 컴퓨터는 글자를 바로 실행할 수 없다.", 3200);
  s.say("`python 파일.py` 를 치면 파이썬 인터프리터가 이 글자를 **4단계**로 가공한다.", 3400);
  s.chapter("① 토큰화").mark("tok");
  s.say("① 토크나이저가 글자 뭉치를 **단어(토큰)** 로 자른다. 이름·연산자·숫자를 구분한다.", 4200);
  s.chapter("② 구문 트리").mark("ast");
  s.say("② 파서가 토큰을 **문법 트리**로 조립한다. `*` 가 `+` 보다 먼저 계산돼야 함이 여기서 결정된다.", 4600);
  s.mark("astDone").say("문법에 안 맞으면 여기서 멈춘다 — 그게 `SyntaxError` 다. 아직 아무것도 실행되지 않았다.", 3800);
  s.chapter("③ 바이트코드").mark("bc");
  s.say("③ 컴파일러가 트리를 **바이트코드** 로 바꾼다. 가상 머신이 알아듣는 단순한 명령어 목록이다.", 4200);
  s.say("`.pyc` 파일에 저장되는 게 바로 이것. `dis` 모듈로 직접 볼 수 있다.", 3200);
  s.chapter("④ 실행").mark("vm");
  s.say("④ 가상 머신(VM)이 명령어를 **하나씩** 실행한다. 값을 스택에 올리고, 계산하고, 이름에 저장한다.", 4200);
  s.mark("vmRun").wait(6 * 900 + 600);
  s.say("`NameError`, `TypeError` 같은 대부분의 오류는 이 4단계에서 난다 — 코드가 이미 **실행 중**일 때.", 4200);
  s.chapter("정리").mark("wrap");
  s.say("글자 → 토큰 → 트리 → 바이트코드 → 실행. 파이썬이 **'인터프리터 언어'** 라는 말의 실제 의미다.", 4600);
  s.wait(800);
  const script = s.build();
  const M = s.marks;

  const render = (t: number) => {
    const stageX = [60, 330, 600, 870];
    const stageW = 250;
    const titles = ["① 토큰화", "② 구문 트리", "③ 바이트코드", "④ 가상 머신"];
    const stageOn = [seg(t, M.tok, 500), seg(t, M.ast, 500), seg(t, M.bc, 500), seg(t, M.vm, 500)];
    const srcP = seg(t, M.src, 600);
    const wrapP = seg(t, M.wrap, 600);

    // 토큰 등장
    const tokP = (i: number) => seg(t, M.tok + 500 + i * 220, 400, ease.outBack);
    // 트리 노드
    const astP = (i: number) => seg(t, M.ast + 400 + i * 260, 450, ease.outBack);
    // 바이트코드 줄
    const bcP = (i: number) => seg(t, M.bc + 400 + i * 260, 400, ease.out);
    // VM 실행: 각 명령 900ms
    const vmStep = t < M.vmRun ? -1 : Math.min(BYTECODE.length, Math.floor((t - M.vmRun) / 900));
    const stack: string[] = [];
    let total = "";
    for (let i = 0; i <= Math.min(vmStep, BYTECODE.length - 1); i++) {
      const ins = BYTECODE[i];
      if (ins.startsWith("LOAD_NAME")) stack.push("price=3");
      else if (ins.startsWith("LOAD_CONST")) stack.push(ins.split(/\s+/)[1]);
      else if (ins.startsWith("BINARY_OP")) { const b = stack.pop()!, a = stack.pop()!; const av = a.includes("=") ? Number(a.split("=")[1]) : Number(a); const bv = Number(b); stack.push(String(ins.endsWith("*") ? av * bv : av + bv)); }
      else if (ins.startsWith("STORE_NAME")) { total = stack.pop()!; }
    }

    return (
      <g opacity={1 - wrapP * 0.0}>
        {/* 소스 코드 */}
        <g opacity={srcP}>
          <text x={60} y={44} className="st-type">소스 코드 (그냥 글자)</text>
          <rect x={60} y={56} width={1080} height={56} rx={12} fill="var(--stage-code-bg)" stroke={C.stroke} />
          <text x={84} y={92} className="st-mono" style={{ fill: C.text, fontSize: 26, fontWeight: 600 }}>{SRC}</text>
          <text x={1120} y={92} textAnchor="end" className="st-m st-mono">price = 3 이라고 하자</text>
        </g>

        {/* 4단계 박스 */}
        {titles.map((ti, i) => (
          <g key={i} opacity={lerp(0.18, 1, stageOn[i])}>
            <rect x={stageX[i]} y={140} width={stageW} height={360} rx={16} fill={C.node} stroke={stageOn[i] > 0.5 ? C.hi : C.stroke} strokeWidth={stageOn[i] > 0.5 ? 2 : 1.2} />
            <text x={stageX[i] + 16} y={168} className="st-t" style={{ fontSize: 17, fontWeight: 750 }}>{ti}</text>
            {i < 3 && <path d={`M${stageX[i] + stageW + 6} 320 l16 0 m-6 -8 l8 8 -8 8`} stroke={stageOn[i + 1] > 0 ? C.hi : C.stroke} strokeWidth={3} fill="none" strokeLinecap="round" />}
          </g>
        ))}

        {/* ① 토큰 */}
        {TOKENS.map(([v, ty], i) => {
          const p = tokP(i);
          const y = 196 + i * 40;
          return (
            <g key={i} opacity={p} transform={`translate(${lerp(-20, 0, p)} 0)`}>
              <rect x={stageX[0] + 16} y={y} width={90} height={30} rx={7} fill={C.node2} stroke={C.stroke} />
              <text x={stageX[0] + 61} y={y + 21} textAnchor="middle" className="st-mono" style={{ fill: C.name, fontSize: 16, fontWeight: 650 }}>{v}</text>
              <text x={stageX[0] + 120} y={y + 21} className="st-m st-mono" style={{ fontSize: 12 }}>{ty}</text>
            </g>
          );
        })}

        {/* ② 구문 트리 */}
        {(() => {
          const cx = stageX[1] + stageW / 2;
          const nodes: [string, number, number, number][] = [["=", cx, 210, 0], ["total", cx - 70, 280, 1], ["+", cx + 70, 280, 1], ["*", cx + 20, 350, 2], ["5", cx + 120, 350, 2], ["price", cx - 20, 420, 3], ["2", cx + 60, 420, 3]];
          const edges: [number, number][] = [[0, 1], [0, 2], [2, 3], [2, 4], [3, 5], [3, 6]];
          const hiStar = window_(t, M.ast + 2200, M.astDone, 300);
          return (
            <g>
              {edges.map(([a, b], i) => { const p = astP(nodes[b][3]); return <line key={i} x1={nodes[a][1]} y1={nodes[a][2]} x2={lerp(nodes[a][1], nodes[b][1], p)} y2={lerp(nodes[a][2], nodes[b][2], p)} stroke={C.stroke} strokeWidth={2} />; })}
              {nodes.map(([v, x, y, d], i) => { const p = astP(d); const isStar = v === "*"; return (
                <g key={i} opacity={p} transform={`translate(${x} ${y}) scale(${lerp(0.5, 1, p)})`}>
                  <circle r={22} fill={isStar && hiStar > 0 ? C.hi : C.node2} stroke={/^[a-z]/.test(v) ? C.name : C.arrow} strokeWidth={2} />
                  <text y={6} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 15, fontWeight: 650 }}>{v}</text>
                </g>
              ); })}
              <Badge x={cx} y={470} text="* 가 + 보다 아래 = 먼저 계산" p={hiStar} color={C.hi} />
            </g>
          );
        })()}

        {/* ③ 바이트코드 */}
        {BYTECODE.map((ins, i) => {
          const p = bcP(i);
          const y = 196 + i * 42;
          const running = vmStep === i;
          return (
            <g key={i} opacity={p} transform={`translate(${lerp(-16, 0, p)} 0)`}>
              {running && <rect x={stageX[2] + 8} y={y - 4} width={stageW - 16} height={34} rx={8} fill="var(--stage-code-line)" />}
              <text x={stageX[2] + 18} y={y + 19} className="st-mono" style={{ fill: running ? C.text : "#b6c0dc", fontSize: 14, fontWeight: running ? 700 : 450 }}>{ins}</text>
            </g>
          );
        })}

        {/* ④ VM 스택 */}
        <g opacity={stageOn[3]}>
          <text x={stageX[3] + 16} y={200} className="st-type">값 스택</text>
          {stack.map((v, i) => (
            <g key={i} transform={`translate(${stageX[3] + 16} ${400 - i * 46})`}>
              <rect width={150} height={40} rx={8} fill={C.node2} stroke={i === stack.length - 1 ? C.hi : C.stroke} strokeWidth={1.5} />
              <text x={75} y={27} textAnchor="middle" className="st-mono" style={{ fill: C.text, fontSize: 18, fontWeight: 650 }}>{v}</text>
            </g>
          ))}
          <rect x={stageX[3] + 16} y={444} width={218} height={2} fill={C.stroke} />
          <text x={stageX[3] + 16} y={472} className="st-type">이름</text>
          {total && <text x={stageX[3] + 60} y={473} className="st-mono" style={{ fill: C.fresh, fontSize: 17, fontWeight: 700 }}>total = {total}</text>}
        </g>
      </g>
    );
  };
  return { script, render };
}
