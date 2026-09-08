a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b, a & b)           # @note: 합집합, 교집합
print(a - b, a ^ b)           # @note: 차집합, 대칭차
nums = [3, 1, 3, 2, 1]
print(set(nums))              # @note: 중복 제거 — 순서는 보장되지 않는다
print(sorted(set(nums)))      # @note: 정렬된 리스트로 만들려면
a.add(9)
a.discard(100)                # @note: 없어도 오류 없음 (remove 는 KeyError)
print(a, 9 in a)
print({})                     # @note: 함정 — {} 는 빈 딕셔너리다. 빈 집합은 set()
