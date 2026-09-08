import sys
nums = []
print(len(nums), sys.getsizeof(nums))       # @note: 빈 리스트의 기본 크기
for i in range(9):
    nums.append(i)
    print(len(nums), sys.getsizeof(nums))   # @note: 크기가 매번 늘지 않는다 — 4개, 8개 단위로 껑충 뛴다
