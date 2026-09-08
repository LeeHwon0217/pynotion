r = range(2, 10, 3)          # @note: range 는 숫자를 미리 만들지 않는다 — 시작·끝·간격 세 값만 기억하는 작은 객체
print(r)
print(list(r))               # @note: list() 로 감싸야 실제 숫자들이 만들어진다: 2, 5, 8 (10 은 포함 안 됨)
for i in range(3):           # @note: range(3) 은 0, 1, 2 — 끝 값은 포함하지 않는다
    print(i)
big = range(1_000_000)       # @note: 백만이어도 메모리는 같다 — 세 숫자만 저장하니까
print(len(big), 999_999 in big)   # @note: 길이와 포함 여부는 계산으로 바로 안다
