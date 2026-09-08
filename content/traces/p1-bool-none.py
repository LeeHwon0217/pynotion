flag = True               # @note: True 는 파이썬 전체에 딱 하나 있는 객체 — 모든 True 가 같은 곳을 가리킨다
print(flag + flag)        # @note: bool 은 int 의 자식 — True 는 1 처럼 계산된다
print(type(flag))
result = None             # @note: None 도 단 하나뿐인 객체. '값이 없음' 을 뜻한다
print(result is None)     # @note: None 비교는 == 가 아니라 is 로 한다
print(bool(0), bool(""), bool([]))    # @note: 0, 빈 문자열, 빈 리스트는 거짓
print(bool(7), bool("a"), bool([0]))  # @note: 그 외는 참 — [0] 도 '비어 있지 않은' 리스트다
