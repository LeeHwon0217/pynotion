words = ["banana", "kiwi", "apple", "fig"]
print(sorted(words))                       # @note: 새 리스트. 원본 그대로
print(sorted(words, key=len))              # @note: 길이 기준. kiwi 와 fig… 아니 fig(3) < kiwi(4)
print(sorted(words, key=len, reverse=True))
people = [("지기", 29), ("영희", 25), ("철수", 29)]
print(sorted(people, key=lambda p: p[1]))  # @note: 나이 기준 — 29 인 둘은 원래 순서 유지(안정 정렬)
words.sort()                               # @note: 제자리 정렬. None 을 돌려준다
print(words)
