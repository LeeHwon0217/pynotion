def rebind(lst):
    lst = [9, 9]              # @note: 지역 이름 lst 를 새 객체에 다시 붙인다 — 바깥의 nums 는 모른다

def mutate(lst):
    lst.append(9)             # @note: 같은 객체를 바꾼다 — 바깥 nums 도 같은 객체를 보고 있다

nums = [1, 2]
rebind(nums)                  # @note: 호출: 지역 lst 가 nums 와 같은 객체를 가리킨다
print(nums)
mutate(nums)
print(nums)
