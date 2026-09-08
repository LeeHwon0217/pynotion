import csv, json, io
text = "name,age\n지기,29\n영희,25\n"
rows = list(csv.DictReader(io.StringIO(text)))   # @note: 첫 줄을 헤더로 써서 각 줄을 딕셔너리로
print(rows)
print(rows[0]["age"] + 1)                        # @note: CSV 의 값은 전부 문자열이다 → TypeError
