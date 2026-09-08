count = 0

def bump():
    global count              # @note: '이 함수의 count 는 전역 것이다' 라고 선언
    count = count + 1

def bump_wrong():
    count = count + 1         # @note: 함수 안에서 대입하면 count 는 '지역' 이 된다 — 그런데 읽을 때 아직 값이 없다 → UnboundLocalError

bump()
bump()
print(count)
bump_wrong()
