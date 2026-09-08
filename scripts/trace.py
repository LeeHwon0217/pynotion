"""
실행 추적 생성기 — 파이썬 코드를 sys.settrace 로 한 줄씩 실행하며
매 스텝의 프레임/로컬/힙 스냅샷을 JSON 으로 남긴다.

사용:
  python scripts/trace.py <id> <source.py> [<out.json>]
  (stdin 으로 코드를 넘길 수도 있다: python scripts/trace.py <id> - < code.py)

주석 `# @note: 텍스트` 가 붙은 줄은 해당 줄 실행 시 note 로 들어간다.
"""
import io
import json
import sys
import types
from contextlib import redirect_stdout

MAX_STEPS = 400
V = 1


def is_prim(v):
    return v is None or isinstance(v, (bool, int, float, str, complex)) and not isinstance(v, (list, dict))


def short_repr(v, n=48):
    try:
        r = repr(v)
    except Exception:
        r = f"<{type(v).__name__}>"
    return r if len(r) <= n else r[: n - 1] + "…"


class Snap:
    """한 스텝의 힙을 모은다. id -> HeapObj"""

    def __init__(self, inline_small_ints=False):
        self.heap = {}
        self.inline = inline_small_ints

    def ref(self, v, depth=0):
        # 원시값도 객체지만, 설명 목적에 따라 인라인 표시 가능
        if v is None or isinstance(v, (bool, int, float, str, complex)):
            oid = hex(id(v))
            if self.inline:
                return {"prim": short_repr(v), "type": type(v).__name__}
            if oid not in self.heap:
                self.heap[oid] = {"id": oid, "type": type(v).__name__, "repr": short_repr(v)}
            return {"ref": oid}
        oid = hex(id(v))
        if oid in self.heap or depth > 3:
            return {"ref": oid}
        obj = {"id": oid, "type": type(v).__name__, "repr": short_repr(v)}
        self.heap[oid] = obj
        if isinstance(v, (list, tuple, set, frozenset)):
            obj["items"] = [self.ref(x, depth + 1) for x in list(v)[:24]]
        elif isinstance(v, dict):
            obj["entries"] = [[self.ref(k, depth + 1), self.ref(x, depth + 1)] for k, x in list(v.items())[:24]]
        elif isinstance(v, (types.FunctionType, types.BuiltinFunctionType, type, types.ModuleType)):
            obj["repr"] = getattr(v, "__name__", obj["repr"])
        elif hasattr(v, "__dict__"):
            obj["fields"] = {k: self.ref(x, depth + 1) for k, x in list(vars(v).items())[:16]}
        return {"ref": oid}


def run(trace_id, code, inline_small=False):
    lines = code.splitlines()
    notes = {}
    for i, ln in enumerate(lines, 1):
        if "# @note:" in ln:
            notes[i] = ln.split("# @note:", 1)[1].strip()
            lines[i - 1] = ln.split("# @note:", 1)[0].rstrip()
    clean = "\n".join(lines)

    steps = []
    out = io.StringIO()
    stack = []  # 프레임 스택 (우리가 관리)
    stop = {"flag": False}

    def snapshot(event, frame, arg=None):
        if stop["flag"]:
            return
        snap = Snap(inline_small)
        frames = []
        for f in stack:
            loc = {k: snap.ref(v) for k, v in f.f_locals.items() if not k.startswith("__")}
            frames.append({"fn": "<module>" if f.f_code.co_name == "<module>" else f.f_code.co_name, "line": f.f_lineno, "locals": loc})
        step = {
            "line": frame.f_lineno,
            "event": event,
            "frames": frames,
            "heap": snap.heap,
            "stdout": out.getvalue(),
        }
        if event == "return" and arg is not None:
            step["retval"] = short_repr(arg)
        if event == "exception":
            step["exc"] = f"{arg[0].__name__}: {arg[1]}"
        n = notes.get(frame.f_lineno)
        if n and event in ("line", "call"):
            step["note"] = n
        steps.append(step)
        if len(steps) >= MAX_STEPS:
            stop["flag"] = True

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<lesson>":
            return None
        if event == "call":
            stack.append(frame)
            snapshot("call", frame)
            return tracer
        if event == "line":
            snapshot("line", frame)
        elif event == "return":
            snapshot("return", frame, arg)
            stack.pop()
        elif event == "exception":
            snapshot("exception", frame, arg)
        return tracer

    g = {"__name__": "__main__"}
    compiled = compile(clean, "<lesson>", "exec")
    sys.settrace(tracer)
    try:
        with redirect_stdout(out):
            exec(compiled, g)
    except Exception as e:  # 예외로 끝나는 예제도 허용
        steps.append({
            "line": steps[-1]["line"] if steps else 1, "event": "exception", "frames": [],
            "heap": {}, "stdout": out.getvalue(), "exc": f"{type(e).__name__}: {e}",
        })
    finally:
        sys.settrace(None)

    # 마지막 스텝의 stdout 이 최종 출력
    return {"id": trace_id, "code": clean, "steps": steps, "v": V}


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    trace_id, src = sys.argv[1], sys.argv[2]
    inline = "--inline-small" in sys.argv
    code = sys.stdin.read() if src == "-" else open(src, encoding="utf-8").read()
    result = run(trace_id, code, inline)
    dest = next((a for a in sys.argv[3:] if not a.startswith("--")), None)
    data = json.dumps(result, ensure_ascii=False, indent=1)
    if dest:
        with open(dest, "w", encoding="utf-8") as f:
            f.write(data)
        print(f"{trace_id}: {len(result['steps'])} steps -> {dest}")
    else:
        sys.stdout.write(data)


if __name__ == "__main__":
    main()
