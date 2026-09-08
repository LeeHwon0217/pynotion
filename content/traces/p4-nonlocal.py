def counter():
    n = 0
    def inc():
        nonlocal n            # @note: 감싸는 함수(counter) 의 n 을 쓰겠다는 선언 — 없으면 새 지역 n 이 생겨 버린다
        n += 1
        return n
    return inc

c = counter()                 # @note: counter 는 끝났지만 inc 는 n 을 기억한다 (클로저 — Part 9)
print(c(), c(), c())
