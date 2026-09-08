name = "지기"
age = 29
msg = f"{name}는 {age}살"         # @note: f 를 붙이면 {} 안의 식이 계산되어 새 문자열 객체가 만들어진다
print(msg)
print(f"내년엔 {age + 1}살")       # @note: {} 안에는 어떤 식이든 올 수 있다
print("따옴표 안의 \"따옴표\"")     # @note: 백슬래시로 특수 문자를 탈출시킨다
print("첫 줄\n둘째 줄")            # @note: \n 은 줄바꿈
print(len(name), name[0])         # @note: 문자열은 길이가 있고, 인덱스로 한 글자씩 꺼낼 수 있다
