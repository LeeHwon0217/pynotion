def load(path):
    return open(path).read()      # @note: 파일이 없다 → 여기서 FileNotFoundError 가 '발생' 한다

def run():
    data = load("없는파일.txt")   # @note: load() 안에서 난 예외가 이 줄로 '올라온다' — run 에도 except 가 없다
    print(len(data))

run()                             # @note: 다시 모듈 수준으로 올라온다. 여기도 없다 → 프로그램 종료, 트레이스백 출력
print("여기는 실행되지 않는다")
