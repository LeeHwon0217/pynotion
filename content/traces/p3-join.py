parts = ["가", "나", "다", "라"]
s = ""
for p in parts:
    s = s + p                 # @note: 매번 새 문자열을 만든다 — 이전 것은 버려진다. n 개면 n 번 복사
print(s)
s2 = "".join(parts)           # @note: join 은 전체 길이를 먼저 계산해 한 번에 만든다
print(s2, s == s2)
