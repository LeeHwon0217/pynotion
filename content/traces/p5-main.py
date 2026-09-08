print(__name__)               # @note: 직접 실행하면 "__main__". 다른 파일이 import 하면 모듈 이름("mymod")이 된다

def main():
    print("프로그램 시작")

if __name__ == "__main__":    # @note: '직접 실행될 때만' 실행 — import 될 때는 이 블록을 건너뛴다
    main()
