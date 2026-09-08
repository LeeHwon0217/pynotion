class Account:
    def __init__(self, balance):
        self._balance = balance     # @note: 밑줄 하나 — '내부용' 이라는 약속. 막지는 않는다
        self.__pin = "0000"         # @note: 밑줄 둘 — 이름이 _Account__pin 으로 바뀐다 (네임 맹글링)

a = Account(100)
print(a._balance)                   # @note: 읽힌다 — 약속일 뿐. 하지만 밖에서 쓰지 않는 게 예의
print(a.__dict__)                   # @note: __pin 이 _Account__pin 으로 저장된 것이 보인다
print(a._Account__pin)              # @note: 바뀐 이름으로는 접근된다 — 진짜 비공개는 아니다
print(a.__pin)                      # @note: 원래 이름으로는 없다 → AttributeError
