todo = ["빨래"]
todo.append("청소")             # @note: 끝에 추가 — 리스트 객체가 바뀐다. 돌려주는 값은 None
todo.insert(0, "설거지")        # @note: 0 번 자리에 끼워 넣기 — 뒤 항목이 전부 밀린다
todo.extend(["장보기", "운동"])   # @note: 여러 개를 한 번에 붙인다 (append 하면 리스트 하나가 통째로 들어감)
print(todo)
done = todo.pop()               # @note: 마지막 항목을 꺼내 돌려주고 리스트에서 뺀다
first = todo.pop(0)             # @note: 인덱스를 주면 그 자리 항목
todo.remove("청소")             # @note: 값으로 찾아 첫 번째 것을 뺀다 — 없으면 ValueError
print(done, first, todo)
result = todo.sort()            # @note: sort() 는 제자리 정렬. 돌려주는 값은 None! 
print(result, todo)
