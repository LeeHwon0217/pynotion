class Counter:
    count = 0                       # @note: 클래스 속성 — 클래스 객체에 하나. 모든 인스턴스가 공유

    def __init__(self):
        Counter.count += 1          # @note: 클래스 것을 바꾼다 (self.count += 1 이면 인스턴스 속성이 새로 생긴다!)
        self.id = Counter.count     # @note: 인스턴스 속성 — 각자

a = Counter()
b = Counter()
print(a.id, b.id, Counter.count)   # @note: id 는 각자, count 는 공유
print(a.count, b.count)            # @note: 인스턴스에 count 가 없으니 클래스에서 찾는다 → 둘 다 2
a.count = 99                       # @note: 인스턴스에 새 속성 count 가 생긴다 — 클래스 것은 그대로
print(a.count, b.count, Counter.count)
