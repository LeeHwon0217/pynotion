def divide(a, b):
    try:
        r = a / b                 # @note: 시도
    except ZeroDivisionError:
        print("0으로 나눔")        # @note: 예외가 났을 때만
        return None
    else:
        print("성공")             # @note: 예외가 '안 났을 때만' — try 에 넣지 않는 이유는 else 안의 오류를 except 가 잡지 않게 하려고
        return r
    finally:
        print("정리")             # @note: 예외 여부와 무관하게 '항상' — return 이 있어도 그 전에 실행된다

print(divide(6, 3))
print(divide(6, 0))
