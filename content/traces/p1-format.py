price = 1234567
ratio = 0.8734
print(f"{price:,}원")        # @note: , 는 천 단위 구분
print(f"{ratio:.1%}")        # @note: .1% 는 백분율, 소수 1자리
print(f"{3.14159:.2f}")      # @note: .2f 는 소수 둘째 자리까지
print(f"[{'왼쪽':<6}][{'오른쪽':>6}]")   # @note: < > 로 정렬, 숫자는 폭
print(f"{price=}")           # @note: = 를 붙이면 '이름=값' 형태 — 디버깅용
