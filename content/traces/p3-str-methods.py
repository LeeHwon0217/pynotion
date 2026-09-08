s = "  Hello, World  "
print(s.strip())              # @note: 양끝 공백 제거 — 새 문자열을 돌려준다. s 는 그대로
print(s.lower(), s.upper())
words = "a,b,,c".split(",")   # @note: 구분자로 잘라 리스트로
print(words)
print("-".join(["2026", "09", "08"]))   # @note: 리스트를 구분자로 이어 붙인다 — split 의 반대
print("banana".replace("a", "o"), "banana".count("a"))
print("banana".find("na"), "banana".find("x"))   # @note: find 는 못 찾으면 -1 (index 는 ValueError)
print("abc".startswith("ab"), "3.14".isdigit(), "42".isdigit())
print(s)                      # @note: 위의 어떤 메서드도 s 를 바꾸지 않았다
