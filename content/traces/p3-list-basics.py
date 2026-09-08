nums = [10, 20, 30]           # @note: 리스트 객체 하나 — 칸 3개에 각각 정수 객체를 가리키는 참조가 든다
print(nums[0], nums[2])       # @note: 인덱스는 0 부터. nums[2] 가 마지막
nums[1] = 25                  # @note: 1번 칸의 참조를 새 객체로 바꾼다 — 리스트 자체가 바뀐다 (mutation)
print(nums, len(nums))
mixed = [1, "둘", 3.0, [4]]   # @note: 타입이 섞여도 된다 — 칸은 그냥 참조를 담을 뿐
print(mixed[3][0])            # @note: 안쪽 리스트의 0번 칸
