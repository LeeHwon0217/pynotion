class Duck:
    def speak(self): return "꽥"
class Robot:
    def speak(self): return "삐빅"
class Rock:
    pass

def talk(thing):
    return thing.speak()            # @note: 타입을 검사하지 않는다 — speak 가 있으면 된다 (덕 타이핑)

for x in [Duck(), Robot()]:
    print(talk(x))                  # @note: 서로 상속 관계가 없어도 같은 인터페이스면 같은 함수로
print(len("abc"), len([1, 2]))     # @note: len 도 다형성 — __len__ 만 있으면 뭐든
print(talk(Rock()))                 # @note: speak 가 없으면 그때 AttributeError
