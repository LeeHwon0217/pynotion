import random, os, json, datetime, collections
random.seed(0)
print(random.randint(1, 6))               # @note: random — 난수
print(os.path.join("data", "a.csv"))      # @note: os.path — 경로 조립 (OS 에 맞는 구분자)
print(json.dumps({"a": 1, "b": [2, 3]}))  # @note: json — 파이썬 객체 ↔ JSON 문자열
print(datetime.date(2026, 9, 8).weekday())  # @note: datetime — 날짜 (0 = 월요일)
print(collections.Counter("banana").most_common(1))   # @note: collections — 개수 세기
