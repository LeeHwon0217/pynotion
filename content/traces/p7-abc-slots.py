from abc import ABC, abstractmethod
import sys

class Shape(ABC):                   # @note: 추상 클래스 — 직접 인스턴스를 만들 수 없다
    @abstractmethod
    def area(self): ...             # @note: 자식이 반드시 구현해야 하는 메서드

class Sq(Shape):
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

print(Sq(3).area())
try:
    Shape()                         # @note: 추상 메서드가 남아 있으면 TypeError
except TypeError as e:
    print("불가:", str(e)[:30])

class P1:
    def __init__(self): self.x = 1; self.y = 2
class P2:
    __slots__ = ("x", "y")          # @note: 속성을 이 둘로 고정 — __dict__ 를 만들지 않아 메모리 절약
    def __init__(self): self.x = 1; self.y = 2

print(sys.getsizeof(P1().__dict__) + sys.getsizeof(P1()), sys.getsizeof(P2()))
p = P2()
p.z = 3                             # @note: 슬롯에 없는 속성 → AttributeError
