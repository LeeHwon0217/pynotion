class A:
    def who(self): return "A"
class B(A):
    def who(self): return "B→" + super().who()   # @note: super() 는 '부모' 가 아니라 'MRO 에서 나 다음' 을 부른다
class C(A):
    def who(self): return "C→" + super().who()
class D(B, C):
    def who(self): return "D→" + super().who()

print(D.__mro__)                    # @note: D → B → C → A → object. A 는 한 번만, 맨 뒤에
print(D().who())                    # @note: B 의 super() 가 A 가 아니라 C 를 부른다! MRO 순서를 따라가기 때문
