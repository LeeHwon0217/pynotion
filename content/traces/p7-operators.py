class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"Vec({self.x}, {self.y})"
    def __add__(self, other):       # @note: a + b → a.__add__(b)
        return Vec(self.x + other.x, self.y + other.y)
    def __mul__(self, k):           # @note: a * 3 → a.__mul__(3)
        return Vec(self.x * k, self.y * k)
    def __rmul__(self, k):          # @note: 3 * a → int 가 못 하면 a.__rmul__(3)
        return self * k
    def __eq__(self, other):        # @note: a == b → a.__eq__(b). 없으면 is 비교가 된다
        return (self.x, self.y) == (other.x, other.y)

a, b = Vec(1, 2), Vec(3, 4)
print(a + b)                        # @note: 파이썬이 __add__ 를 대신 불러 준다
print(a * 2, 2 * a)
print(a == Vec(1, 2), a is Vec(1, 2))
