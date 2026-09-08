s = ["a", "b", "c", "d", "e"]
print(s[0], s[4])             # @note: 앞에서 0, 1, 2, 3, 4
print(s[-1], s[-5])           # @note: 뒤에서 -1, -2, … -5. s[-1] 은 s[len(s) - 1] 과 같다
print(s[len(s) - 1])
print(s[5])                   # @note: 5 번은 없다 → IndexError. 마지막은 4 (길이 - 1)
