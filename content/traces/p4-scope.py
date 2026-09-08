x = "전역"

def outer():
    x = "감싸는 함수"          # @note: outer 의 지역 x — 전역 x 와 다른 이름표
    def inner():
        print(x)              # @note: inner 에 x 가 없다 → 감싸는 함수(outer) 에서 찾는다
    inner()

def solo():
    print(x)                  # @note: solo 안에도, 감싸는 함수도 없다 → 전역에서 찾는다

outer()
solo()
print(len)                    # @note: 어디에도 없으면 마지막으로 내장(builtins) 에서 찾는다
