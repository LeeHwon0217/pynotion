class Date:
    def __init__(self, y, m, d):
        self.y, self.m, self.d = y, m, d

    @classmethod
    def from_str(cls, text):        # @note: 첫 인자가 인스턴스가 아니라 클래스(cls) — 대안 생성자
        y, m, d = map(int, text.split("-"))
        return cls(y, m, d)         # @note: cls() 로 만들면 자식 클래스에서 불러도 자식 인스턴스가 된다

    @staticmethod
    def is_leap(y):                 # @note: self 도 cls 도 없다 — 클래스 안에 둔 그냥 함수
        return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)

d = Date.from_str("2026-09-08")    # @note: 인스턴스 없이 클래스에서 바로
print(d.y, d.m, d.d)
print(Date.is_leap(2024), d.is_leap(2026))   # @note: 클래스로도 인스턴스로도 부를 수 있다
