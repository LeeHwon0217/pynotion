nums = [3, 8, 12]
for n in nums:
    if n > 10:
        print("10 초과 발견:", n)
        break                # @note: break 로 나가면 else 는 실행되지 않는다
else:
    print("10 초과 없음")     # @note: for 의 else 는 'break 없이 끝까지 돌았을 때' 실행된다
for n in [1, 2]:
    if n > 10:
        break
else:
    print("이번엔 끝까지 돌았음")   # @note: break 를 안 만났으니 else 실행
