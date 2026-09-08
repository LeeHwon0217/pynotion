from math import sqrt, pi     # @note: 모듈 안의 이름 둘만 현재 이름공간으로 가져온다 — math 라는 이름은 생기지 않는다
print(sqrt(2) * pi)
from math import floor as fl  # @note: as 로 이름을 바꿔 붙인다 — 충돌 피하기, 줄여 쓰기
print(fl(3.7))
import collections as co      # @note: 긴 모듈 이름을 줄여서
print(co.Counter("aab"))
print(math)                   # @note: from math import ... 는 math 자체를 만들지 않는다 → NameError
