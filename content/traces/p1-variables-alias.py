nums = [1, 2]        # @note: 리스트 객체 하나가 생기고 nums 가 붙는다
other = nums         # @note: 복사가 아니다 — other 도 같은 객체를 가리킨다
other.append(3)      # @note: 재바인딩이 아니라 객체 자체를 바꾸는 연산
print(nums)          # @note: nums 로 봐도 3 이 들어 있다 — 같은 객체니까
copy = list(nums)    # @note: 진짜 복사 — list() 가 새 객체를 만든다
copy.append(4)       # @note: 새 객체를 바꾸는 것이므로 nums 는 무관
print(nums, copy)
