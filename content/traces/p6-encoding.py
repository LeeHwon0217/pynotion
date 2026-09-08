s = "가나"
b = s.encode("utf-8")                   # @note: str → bytes. 한글 한 글자가 UTF-8 에서 3바이트
print(b, len(b))
print(b.decode("utf-8"))                # @note: bytes → str. 같은 인코딩으로 되돌린다
print(s.encode("cp949"), len(s.encode("cp949")))   # @note: 윈도우 옛 인코딩 — 2바이트. 다른 표현
print(b.decode("cp949"))                # @note: UTF-8 바이트를 cp949 로 읽으면 깨진다 (또는 오류)
