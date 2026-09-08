class Temp:
    def __init__(self, c):
        self._c = c

    @property                       # @note: 메서드를 '속성처럼' 읽게 만든다 — 괄호 없이
    def celsius(self):
        return self._c

    @celsius.setter                 # @note: 대입할 때 호출되는 쪽 — 검증을 넣을 수 있다
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("절대영도 이하")
        self._c = value

    @property
    def fahrenheit(self):           # @note: 저장하지 않고 계산해서 돌려주는 속성
        return self._c * 9 / 5 + 32

t = Temp(25)
print(t.celsius, t.fahrenheit)     # @note: 괄호 없이 — 호출자는 메서드인지 모른다
t.celsius = 30                      # @note: setter 가 호출된다
print(t.fahrenheit)
t.celsius = -300                    # @note: 검증 실패 → ValueError
