nums = [1, 2, 3, 4, 5]
squares = [n * n for n in nums]              # @note: for 로 하나씩 꺼내 식을 계산해 새 리스트에 담는다
print(squares)
evens = [n for n in nums if n % 2 == 0]      # @note: if 로 거른다 — 조건이 참인 것만
print(evens)
labels = {n: "짝" if n % 2 == 0 else "홀" for n in nums}   # @note: 딕셔너리 컴프리헨션
print(labels)
lengths = {len(w) for w in ["a", "bb", "cc", "ddd"]}       # @note: 셋 컴프리헨션 — 중복은 하나로
print(lengths)
