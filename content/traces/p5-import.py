import math                   # @note: sys.path 를 뒤져 math 를 찾아 모듈 객체를 만들고, sys.modules 에 저장한 뒤 이름 math 에 붙인다
print(math.sqrt(16))          # @note: 모듈 객체의 속성(함수)을 점으로 꺼내 쓴다
import sys
print("math" in sys.modules)  # @note: 한 번 import 한 모듈은 sys.modules 딕셔너리에 캐시된다
import math as m              # @note: 다시 import — 파일을 다시 읽지 않고 캐시된 같은 객체를 돌려준다
print(m is math)              # @note: 같은 객체
print(sys.path[0] == "")      # @note: sys.path 의 첫 항목 — 스크립트가 있는 폴더 (여기선 실행 환경 특성상 빈 문자열)
