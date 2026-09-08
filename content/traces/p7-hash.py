class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, o):
        return (self.x, self.y) == (o.x, o.y)
    def __hash__(self):             # @note: __eq__ 를 정의하면 __hash__ 는 사라진다 — 직접 정의해야 딕셔너리 키가 된다
        return hash((self.x, self.y))   # @note: 같은 값이면 같은 해시 — 튜플 해시를 빌린다

p, q = Point(1, 2), Point(1, 2)
print(p == q, p is q, hash(p) == hash(q))
visited = {p}
print(q in visited)                 # @note: 값이 같으면 같은 원소로 취급 — 해시가 같고 == 가 True 니까

class Bad:
    def __eq__(self, o): return True   # @note: __eq__ 만 정의
print(hash(Bad()))                  # @note: __hash__ 가 None 이 되어 TypeError: unhashable
