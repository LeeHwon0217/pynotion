class InsufficientFunds(Exception):     # @note: Exception 을 상속하면 내 예외 클래스가 된다
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"잔액 {balance}, 요청 {amount}")   # @note: raise 로 직접 발생시킨다
    return balance - amount

try:
    withdraw(100, 150)
except InsufficientFunds as e:     # @note: 이름으로 정확히 잡는다
    print("실패:", e)

try:
    try:
        int("x")
    except ValueError as e:
        raise RuntimeError("설정 파싱 실패") from e   # @note: from 으로 원인을 연결 — 트레이스백에 둘 다 남는다
except RuntimeError as e:
    print(e, "| 원인:", repr(e.__cause__))
