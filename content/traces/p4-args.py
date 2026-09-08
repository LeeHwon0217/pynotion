def order(item, qty=1, note=""):     # @note: qty 와 note 는 기본값이 있다 — 생략 가능
    print(item, qty, note)

order("커피")                          # @note: 위치 인자 하나, 나머지는 기본값
order("커피", 2)                       # @note: 순서대로 item, qty
order("커피", note="샷 추가")          # @note: 키워드 인자 — 순서와 무관하게 이름으로
order(qty=3, item="라떼")              # @note: 키워드로 넘기면 순서를 바꿔도 된다
