print(hash("apple") % 8, hash("kiwi") % 8)   # @note: 해시값(큰 정수)을 칸 수로 나눈 나머지가 칸 번호
print(hash(42), hash(42.0), hash(True))       # @note: 값이 같은 정수·실수·불은 해시도 같다
d = {}
d[(1, 2)] = "튜플 키 OK"                     # @note: 튜플은 바뀌지 않으니 해시할 수 있다
print(d)
d[[1, 2]] = "리스트 키?"                     # @note: 리스트는 바뀔 수 있어 해시 불가 → TypeError: unhashable
