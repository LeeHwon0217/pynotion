stock = {"사과": 3, "배": 0}
print(stock.get("귤"))                 # @note: 없는 키는 None — 오류 대신
print(stock.get("귤", 0))              # @note: 기본값을 줄 수 있다
stock.setdefault("귤", 10)             # @note: 없으면 넣고, 있으면 그대로 두고 값을 돌려준다
for name, qty in stock.items():        # @note: items() 는 (키, 값) 쌍을 준다
    print(name, qty)
stock.update({"배": 5, "감": 2})       # @note: 여러 키를 한 번에 추가/덮어쓰기
removed = stock.pop("사과")            # @note: 키로 꺼내면서 삭제
print(removed, list(stock.keys()), list(stock.values()))
