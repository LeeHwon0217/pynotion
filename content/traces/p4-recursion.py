def fact(n):
    if n <= 1:                # @note: 기저 조건 — 더 이상 자신을 부르지 않는 경우
        return 1
    return n * fact(n - 1)    # @note: 자신을 부른다. 곱셈은 안쪽 호출이 돌아온 뒤에야 계산된다

print(fact(4))                # @note: fact(4) → fact(3) → fact(2) → fact(1) 까지 쌓였다가 하나씩 풀린다
