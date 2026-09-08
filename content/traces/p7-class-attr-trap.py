class Team:
    members = []                    # @note: 가변 클래스 속성 — 모든 인스턴스가 이 리스트 하나를 공유

    def add(self, name):
        self.members.append(name)   # @note: self.members 는 클래스의 리스트 → 그걸 바꾼다

a = Team()
b = Team()
a.add("지기")
print(b.members)                    # @note: b 에도 지기가 있다 — 같은 리스트니까
