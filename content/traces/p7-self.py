class Greeter:
    def hello(self, name):
        return f"{self.prefix} {name}"

g = Greeter()
g.prefix = "안녕,"
print(g.hello("지기"))              # @note: g.hello("지기") — 파이썬이 g 를 첫 인자로 끼워 넣는다
print(Greeter.hello(g, "지기"))     # @note: 정확히 같은 호출을 손으로 쓴 것
f = g.hello                         # @note: g.hello 는 '바운드 메서드' — g 가 묶여 있는 함수 객체
print(f("영희"))                    # @note: self 는 이미 채워져 있다
print(Greeter.hello)                # @note: 클래스에서 꺼내면 그냥 함수
print(g.hello)                      # @note: 인스턴스에서 꺼내면 바운드 메서드
