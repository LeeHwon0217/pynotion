def f(a, b, /, c, *, d):      # @note: / 앞은 위치로만, * 뒤는 키워드로만. c 는 둘 다 가능
    return a + b + c + d

print(f(1, 2, 3, d=4))        # @note: 정상
print(f(1, 2, c=3, d=4))      # @note: c 는 키워드로도 된다
print(f(1, 2, 3, 4))          # @note: d 는 키워드로만 → TypeError
