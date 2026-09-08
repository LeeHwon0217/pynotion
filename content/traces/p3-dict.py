ages = {"지기": 29, "영희": 31}      # @note: 키 → 값 쌍. 키는 중복 불가
print(ages["지기"])                  # @note: 키로 값을 꺼낸다
ages["철수"] = 25                     # @note: 없는 키에 대입하면 추가
ages["지기"] = 30                     # @note: 있는 키에 대입하면 덮어쓰기
print(ages, len(ages))
del ages["영희"]                      # @note: 삭제
print("영희" in ages, "철수" in ages)  # @note: in 은 키를 검사한다
print(ages["없음"])                   # @note: 없는 키를 [] 로 읽으면 KeyError
