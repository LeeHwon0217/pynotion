a = 256
b = 256
print(a is b, a == b)     # @note: -5 ~ 256 은 미리 만들어 둔 객체를 재사용한다 → 같은 객체
c = int("257")            # @note: 257 은 캐시 밖 — 문자열에서 새로 만들면 새 객체
d = int("257")            # @note: 또 새 객체. 값은 같지만 다른 곳에 있다
print(c is d, c == d)     # @note: is 는 '같은 객체냐', == 는 '값이 같냐'
x = [1, 2]
y = [1, 2]
print(x is y, x == y)     # @note: 리스트 리터럴은 매번 새 객체 — 값은 같아도 is 는 False
