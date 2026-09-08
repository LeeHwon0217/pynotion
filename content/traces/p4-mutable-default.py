def add(item, bag=[]):        # @note: 기본값 [] 는 def 가 실행되는 '지금' 딱 한 번 만들어진다
    bag.append(item)
    return bag

a = add("사과")               # @note: bag 은 그 하나뿐인 기본 리스트 — 여기에 사과가 들어간다
b = add("배")                 # @note: 새 리스트가 아니다! 같은 기본 리스트에 배가 추가된다
print(a, b, a is b)           # @note: a 와 b 는 같은 객체

def add_ok(item, bag=None):   # @note: 올바른 방법 — None 을 기본값으로
    if bag is None:
        bag = []              # @note: 호출할 때마다 새 리스트
    bag.append(item)
    return bag

print(add_ok("사과"), add_ok("배"))
