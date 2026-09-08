score = 85
if score >= 90:              # @note: 85 >= 90 은 False — 이 블록은 건너뛴다
    grade = "A"
elif score >= 80:            # @note: 85 >= 80 은 True — 여기로 들어간다. 아래 else 는 보지도 않는다
    grade = "B"
else:
    grade = "C"
print(grade)                 # @note: if/elif/else 중 정확히 하나의 블록만 실행됐다
