import tempfile, os
d = tempfile.mkdtemp()
path = os.path.join(d, "memo.txt")
f = open(path, "w", encoding="utf-8")   # @note: "w" — 새로 쓴다 (있으면 지우고). 파일 객체가 생긴다
f.write("첫 줄\n")
f.write("둘째 줄\n")                    # @note: write 는 줄바꿈을 붙여 주지 않는다 — 직접 \n
f.close()                               # @note: 닫아야 버퍼가 디스크에 실제로 써진다
f = open(path, "a", encoding="utf-8")   # @note: "a" — 끝에 이어 쓴다
f.write("셋째 줄\n")
f.close()
f = open(path, encoding="utf-8")        # @note: 모드 생략 = "r" 읽기
print(f.read())                         # @note: 전체를 문자열 하나로
f.close()
