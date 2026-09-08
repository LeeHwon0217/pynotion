a = 0.1 + 0.2             # @note: 둘 다 2진수로 정확히 표현 안 되는 수 — 저장된 근사값끼리 더한다
print(a)                  # @note: 0.30000000000000004 — 오차가 눈에 보인다
print(a == 0.3)           # @note: 정확히 같지 않으므로 False
import math
print(math.isclose(a, 0.3))   # @note: '충분히 가깝나' 로 비교하면 True
print(round(a, 2))        # @note: 표시할 자릿수를 정하면 0.3
