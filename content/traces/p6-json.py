import json
data = {"name": "지기", "tags": ["a", "b"], "ok": True, "none": None}
text = json.dumps(data, ensure_ascii=False)      # @note: 파이썬 객체 → JSON 문자열. True → true, None → null
print(text)
back = json.loads(text)                          # @note: JSON 문자열 → 파이썬 객체
print(back == data, type(back["tags"]))          # @note: 리스트·딕셔너리·문자열·숫자·불·None 만 오간다 — 튜플은 리스트가 된다
print(json.dumps({"n": (1, 2)}))
