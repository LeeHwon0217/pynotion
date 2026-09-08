def area(w, h):               # @note: def 는 함수 객체를 만들어 이름 area 에 붙일 뿐 — 아직 실행되지 않는다
    result = w * h            # @note: 새 프레임 안에서 계산. result 는 이 프레임의 지역 이름
    return result             # @note: 값을 돌려주고 프레임은 사라진다

a = area(3, 4)                # @note: 호출 — 프레임이 쌓이고 w=3, h=4 가 붙는다
b = area(a, 2)                # @note: 다시 호출 — 완전히 새 프레임. 아까의 result 는 없다
print(a, b)
