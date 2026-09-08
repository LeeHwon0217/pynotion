def total(*nums):             # @note: 위치 인자를 몇 개든 튜플 nums 로 받는다
    return sum(nums)

def show(**opts):             # @note: 키워드 인자를 몇 개든 딕셔너리 opts 로 받는다
    for k, v in opts.items():
        print(k, "=", v)

print(total(1, 2, 3))
print(total())
show(color="red", size=3)
values = [4, 5, 6]
print(total(*values))         # @note: 호출할 때 * 는 반대 — 리스트를 풀어서 따로따로 넘긴다
config = {"color": "blue"}
show(**config)                # @note: ** 는 딕셔너리를 키워드 인자로 풀어 넘긴다
