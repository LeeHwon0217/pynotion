print(issubclass(ZeroDivisionError, ArithmeticError))   # @note: ZeroDivisionError 는 ArithmeticError 의 자식
print(issubclass(ArithmeticError, Exception))
print(issubclass(KeyError, LookupError), issubclass(IndexError, LookupError))   # @note: KeyError 와 IndexError 는 형제
try:
    {}["x"]
except LookupError as e:          # @note: 부모 클래스로 잡으면 자식 예외도 잡힌다
    print("잡힘:", type(e).__name__)
try:
    1 / 0
except Exception as e:            # @note: Exception 은 거의 모든 예외의 부모 — 너무 넓게 잡으면 버그를 숨긴다
    print("잡힘:", type(e).__name__)
