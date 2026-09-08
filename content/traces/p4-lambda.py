def square(x):
    return x * x

sq = lambda x: x * x          # @note: 이름 없는 한 줄 함수 — def 와 같은 함수 객체
print(square(3), sq(3))
f = square                    # @note: 함수도 객체 — 이름을 하나 더 붙일 수 있다
print(f(4))
ops = {"더하기": lambda a, b: a + b, "곱하기": lambda a, b: a * b}   # @note: 함수를 값으로 담는다
print(ops["곱하기"](3, 4))
words = ["bb", "a", "ccc"]
print(sorted(words, key=lambda w: len(w)))   # @note: 함수를 인자로 넘긴다 — 가장 흔한 쓰임
