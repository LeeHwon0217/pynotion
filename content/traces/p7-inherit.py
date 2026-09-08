class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."
    def intro(self):
        return f"{self.name}: {self.speak()}"   # @note: self.speak() 는 실제 타입의 speak 를 찾는다

class Dog(Animal):                  # @note: Animal 을 상속 — Animal 의 메서드를 물려받는다
    def speak(self):                # @note: 재정의(오버라이드) — Dog 에서는 이게 먼저 찾힌다
        return "멍"

class Puppy(Dog):
    def __init__(self, name, age):
        super().__init__(name)      # @note: 부모의 __init__ 을 호출해 name 을 세팅 — 안 하면 name 이 없다
        self.age = age

d = Dog("초코")
p = Puppy("보리", 1)
print(d.intro(), "|", p.intro())    # @note: intro 는 Animal 에 있지만 speak 는 Dog 것이 쓰인다
print(isinstance(p, Animal), issubclass(Puppy, Animal))
