class Animal:
    sound = "..."
    def speak(self):
        return self.sound

class Dog(Animal):
    sound = "멍"

d = Dog()
print(d.sound)          # @note: d.__dict__ 에 없음 → Dog 에 있음 → "멍"
print(d.speak())        # @note: speak 는 Dog 에 없음 → Animal 에서 찾음. 안에서 self.sound 는 다시 d 부터 → "멍"
d.sound = "왈"          # @note: 인스턴스에 붙이면 가장 먼저 찾힌다
print(d.sound, Dog.sound)
print(Dog.__mro__)      # @note: 찾는 순서표 — Dog → Animal → object
