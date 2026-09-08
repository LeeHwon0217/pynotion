nickname = ""
display = nickname or "익명"     # @note: or 는 왼쪽이 거짓이면 오른쪽 '값' 을 그대로 돌려준다 — True/False 가 아니다
print(display)
user = None
name = user and user.upper()     # @note: and 는 왼쪽이 거짓이면 거기서 멈춘다 — user.upper() 는 실행조차 안 된다
print(name)
print(3 < 5 < 10)                # @note: 비교를 이어 쓸 수 있다 — (3 < 5) and (5 < 10)
print(not 0, not "abc")          # @note: not 은 항상 bool 을 돌려준다
