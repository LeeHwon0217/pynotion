def greet(name):
    print("안녕,", name)       # @note: 출력은 하지만 return 이 없다

def min_max(nums):
    return min(nums), max(nums)   # @note: 쉼표로 여러 값 — 사실은 튜플 하나를 돌려준다

r = greet("지기")             # @note: return 이 없는 함수의 값은 None
print(r)
lo, hi = min_max([3, 1, 2])   # @note: 튜플을 언패킹해 두 이름에
print(lo, hi)
