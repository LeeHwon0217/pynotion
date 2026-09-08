fruits = ["사과", "배", "귤"]
for fruit in fruits:         # @note: 리스트에서 항목을 하나 꺼내 fruit 에 붙인다. 없으면 반복 종료
    print(fruit, len(fruit))
for i, fruit in enumerate(fruits):   # @note: enumerate 는 (번호, 항목) 쌍을 준다
    print(i, fruit)
total = 0
for ch in "abc":             # @note: 문자열도 이터러블 — 글자 하나씩
    total += 1
print(total)
