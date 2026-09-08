def area(w: float, h: float) -> float:
    """직사각형 넓이를 구한다.

    w, h 는 양수여야 한다.
    """
    return w * h

print(area.__doc__)           # @note: 독스트링은 함수 객체에 저장된다 — help(area) 가 보여주는 것
print(area.__annotations__)   # @note: 타입 힌트도 저장될 뿐, 검사하지 않는다
print(area("a", 3))           # @note: 힌트와 다르게 넘겨도 파이썬은 막지 않는다 — "aaa"
