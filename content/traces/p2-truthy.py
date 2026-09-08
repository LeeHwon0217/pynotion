cart = []
if cart:                     # @note: 빈 리스트는 거짓 — 'if len(cart) > 0' 과 같은 뜻을 더 짧게
    print("결제 진행")
else:
    print("장바구니가 비어 있어요")
name = ""
if not name:                 # @note: 빈 문자열은 거짓, not 을 붙이면 참
    name = "손님"
print(name)
count = 0
print("있음" if count else "없음")   # @note: 0 은 거짓 — 조건부 표현식(삼항)도 같은 규칙
