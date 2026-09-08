class Dog:
    def __init__(self, name, age):   # @note: 인스턴스가 만들어진 직후 자동 호출. self 는 그 새 인스턴스
        self.name = name             # @note: 인스턴스에 속성을 붙인다 — self.__dict__["name"] = name 과 같다
        self.age = age

    def bark(self):
        return f"{self.name}: 멍!"

d1 = Dog("초코", 3)                 # @note: Dog(...) → 빈 인스턴스 생성 → __init__(인스턴스, "초코", 3)
d2 = Dog("보리", 5)                 # @note: 완전히 별개의 인스턴스 — 자기만의 __dict__
print(d1.name, d2.name)
print(d1.bark())                    # @note: d1.bark() 는 Dog.bark(d1) 과 같다
print(d1.__dict__)                  # @note: 인스턴스 속성은 그냥 딕셔너리다
print(type(d1), isinstance(d1, Dog))
