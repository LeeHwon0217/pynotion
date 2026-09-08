def to_int(text):
    try:
        return int(text)          # @note: 위험한 코드는 try 안에
    except ValueError:            # @note: ValueError 가 나면 여기로. 다른 종류의 예외는 잡지 않는다
        return None

print(to_int("42"))               # @note: 정상 — except 는 실행되지 않는다
print(to_int("사십이"))            # @note: int() 가 ValueError → except 블록 → None
print(to_int(None))               # @note: int(None) 은 TypeError — except ValueError 로는 못 잡는다 → 전파
