price = 1200                  # @note: 정상
qty = 3                       # @note: 정상
print("계산 시작")            # @note: 정상 — 출력이 나온다
total = price * qty + fee     # @note: fee 라는 이름은 만든 적이 없다 → NameError. 여기서 멈춘다
print("총액:", total)
