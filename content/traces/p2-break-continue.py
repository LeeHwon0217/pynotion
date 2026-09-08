for n in [1, 2, 3, 4, 5, 6]:
    if n % 2 == 0:
        continue             # @note: continue — 이번 항목은 여기서 끝. 다음 항목으로 바로 넘어간다
    if n > 4:
        break                # @note: break — 반복 자체를 끝낸다. 남은 항목 6 은 보지 않는다
    print(n)
print("종료")
