grid = [[1, 2, 3], [4, 5, 6]]
flat = [x for row in grid for x in row]      # @note: for 가 두 개 — 바깥 for 를 먼저 쓴다 (중첩 반복문과 같은 순서)
print(flat)
table = [[i * j for j in range(3)] for i in range(3)]   # @note: 안쪽 [] 가 먼저 하나의 행을 만든다
print(table)
pairs = [(a, b) for a in "xy" for b in "12" if b != "2"]
print(pairs)
