import copy
a = [[1, 2], [3, 4]]
b = a                          # @note: 복사가 아니다 — 같은 객체
c = a[:]                       # @note: 얕은 복사 — 바깥 리스트만 새로. 안쪽 리스트는 같은 것을 가리킨다
d = copy.deepcopy(a)           # @note: 깊은 복사 — 안쪽까지 전부 새 객체
a[0].append(99)                # @note: 안쪽 리스트를 바꾼다
print(b[0], c[0], d[0])        # @note: b 와 c 는 같이 바뀌고(안쪽 공유), d 만 안 바뀐다
a.append([5])                  # @note: 바깥 리스트를 바꾼다
print(len(b), len(c), len(d))  # @note: b 만 같이 바뀐다 — c 의 바깥은 별개니까
