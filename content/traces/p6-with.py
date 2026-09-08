import tempfile, os
path = os.path.join(tempfile.mkdtemp(), "a.txt")
with open(path, "w", encoding="utf-8") as f:   # @note: with 블록에 들어가며 파일이 열리고 f 에 붙는다
    f.write("hello\n")
    print(f.closed)                     # @note: 블록 안 — 아직 열려 있다
print(f.closed)                         # @note: 블록을 나오는 순간 자동으로 close() 됐다
try:
    with open(path, encoding="utf-8") as f:
        raise ValueError("중간에 오류")    # @note: 블록 안에서 예외가 나도
except ValueError:
    print("예외 뒤에도 닫혔나:", f.closed)   # @note: 그래도 닫힌다 — with 의 진짜 가치
with open(path, encoding="utf-8") as f:
    for line in f:                      # @note: 파일 객체는 이터러블 — 줄 단위로, 전체를 메모리에 안 올리고
        print(repr(line))
