class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):             # @note: 개발자용 표현 — 가능하면 '다시 만들 수 있는' 코드 모양
        return f"Point({self.x}, {self.y})"
    def __str__(self):              # @note: 사용자용 표현 — print 가 쓴다. 없으면 __repr__ 을 쓴다
        return f"({self.x}, {self.y})"
    def __len__(self):
        return 2

p = Point(1, 2)
print(p)                            # @note: print → str(p) → __str__
print(repr(p), [p])                 # @note: repr, 그리고 컨테이너 안에서는 __repr__
print(len(p), bool(p))              # @note: len 은 __len__. bool 도 __len__ 이 0 이 아니면 True
