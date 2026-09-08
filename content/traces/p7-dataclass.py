from dataclasses import dataclass, field

@dataclass                          # @note: __init__, __repr__, __eq__ 를 필드 선언에서 자동 생성
class Item:
    name: str
    price: int
    tags: list = field(default_factory=list)   # @note: 가변 기본값은 factory 로 — 인스턴스마다 새 리스트

a = Item("펜", 1000)
b = Item("펜", 1000)
print(a)                            # @note: 자동 __repr__
print(a == b)                       # @note: 자동 __eq__ — 필드 값 비교
a.tags.append("문구")
print(a.tags, b.tags)               # @note: 각자 리스트

@dataclass(frozen=True, order=True) # @note: frozen = 불변(해시 가능), order = < > 비교 생성
class Ver:
    major: int
    minor: int
v = Ver(1, 2)
print(v < Ver(1, 3), {v: "ok"})
v.major = 9                         # @note: frozen 이라 대입 불가 → FrozenInstanceError
