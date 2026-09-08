point = (3, 4)                # @note: 튜플 — 만든 뒤 바꿀 수 없다
x, y = point                  # @note: 언패킹 — 왼쪽 이름 개수와 오른쪽 항목 개수가 같아야
print(x, y)
a, *rest = [1, 2, 3, 4]       # @note: * 로 나머지를 리스트로 받는다
print(a, rest)
single = (5,)                 # @note: 항목 하나짜리 튜플은 쉼표가 필수 — (5) 는 그냥 5
print(type(single), type((5)))
inner = ([1, 2], "고정")      # @note: 튜플은 못 바꾸지만, 안의 리스트는 바꿀 수 있다 — 튜플은 참조를 고정할 뿐
inner[0].append(3)
print(inner)
point[0] = 9                  # @note: 튜플의 칸을 바꾸려 하면 TypeError
