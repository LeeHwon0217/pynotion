a = 10            # @note: 오른쪽 먼저 — 정수 객체 10 이 생기고, 이름 a 가 붙는다
b = a             # @note: 복사가 아니다 — 이름 b 가 같은 객체에 붙는다
print(a is b)     # @note: 같은 객체이므로 True
a = 20            # @note: 새 객체 20 이 생기고 a 만 옮겨 붙는다 (재바인딩)
print(a, b)       # @note: b 는 여전히 10 을 가리킨다
