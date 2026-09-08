# 딕셔너리 + 함수로 버티기
acct = {"owner": "지기", "balance": 100}
def deposit(a, amount):
    a["balance"] += amount
deposit(acct, 50)
print(acct["balance"])

# 같은 것을 클래스로 — 데이터와 동작이 한 곳에
class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount

acc = Account("지기", 100)     # @note: 인스턴스를 만든다 — __init__ 이 자동 호출된다
acc.deposit(50)                # @note: 어떤 데이터에 대한 동작인지 점 하나로 분명하다
print(acc.balance)
