text = "42"
n = int(text)             # @note: 문자열 "42" 로부터 새 정수 객체 42 를 만든다 — 원래 문자열은 그대로
print(n + 1)
print(str(3.0), float("2.5"))    # @note: str() 과 float() 도 각각 새 객체를 만든다
print(int(3.99), int(-3.99))     # @note: int() 는 소수점을 '버린다' — 반올림이 아니다
print(int("3.5"))         # @note: "3.5" 는 정수 모양이 아니다 → ValueError
