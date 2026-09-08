from pathlib import Path
import tempfile
root = Path(tempfile.mkdtemp())
p = root / "docs" / "memo.txt"        # @note: / 로 경로를 잇는다 — 문자열 붙이기가 아니라 Path 객체
print(p.name, p.suffix, p.parent.name)   # @note: 이름·확장자·상위 폴더를 속성으로
p.parent.mkdir(parents=True)          # @note: 중간 폴더까지 만든다
p.write_text("안녕", encoding="utf-8")   # @note: open/close 없이 한 줄로 쓰기
print(p.read_text(encoding="utf-8"), p.exists())
print([x.name for x in root.rglob("*.txt")])   # @note: 하위 폴더까지 패턴 검색
