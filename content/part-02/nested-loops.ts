import type { Lesson } from "@/lib/types";

export const nestedLoops: Lesson = {
  part: 2,
  slug: "nested-loops",
  blocks: [
    {
      kind: "viz", component: "NestedScene", title: "바깥이 한 칸 갈 때 안쪽은 끝까지",
      caption: "격자의 칸이 켜지는 순서가 곧 print 가 실행되는 순서다. 한 행(i)이 끝날 때마다 --- 가 찍힌다.",
    },
    {
      kind: "text",
      md: `반복문 안에 반복문을 넣으면, **바깥 반복이 한 번 돌 때 안쪽 반복은 처음부터 끝까지** 돈다. 바깥이 3번, 안쪽이 4번이면 안쪽 블록은 12번 실행된다. 표(행×열), 좌표(x, y), 모든 쌍 비교 같은 문제에서 자연스럽게 나온다.

들여쓰기가 어느 반복에 속하는지를 정한다. 안쪽 \`for\` 와 같은 깊이에 쓴 줄은 바깥 반복마다 한 번, 안쪽 블록에 쓴 줄은 안쪽 반복마다 한 번 실행된다.`,
    },
    {
      kind: "trace", traceId: "p2-nested", title: "한 줄씩 — 어느 줄이 몇 번 실행되나",
      caption: "3번 줄(print(i, j))은 9번, 4번 줄(---)은 3번. 안쪽 반복이 끝나야 4번 줄로 내려오는 것을 보라.",
    },
    {
      kind: "heading", text: "흔한 쓰임",
    },
    {
      kind: "code",
      code: `# 구구단 (행 × 열)
for i in range(2, 4):
    for j in range(1, 4):
        print(f"{i}×{j}={i*j}", end="  ")
    print()                          # 행마다 줄바꿈

# 2차원 리스트 순회
grid = [[1, 2, 3], [4, 5, 6]]
for row in grid:                     # row 는 [1, 2, 3], [4, 5, 6]
    for cell in row:
        print(cell, end=" ")
    print()

# 모든 쌍 (i < j)
names = ["A", "B", "C"]
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        print(names[i], names[j])    # AB AC BC`,
    },
    {
      kind: "callout", tone: "warn", title: "중첩이 깊어지면 느려진다",
      md: `안쪽 반복이 n번, 바깥이 n번이면 n² 번. n 이 1,000 이면 백만 번, 10,000 이면 1억 번이다. 세 겹이면 n³. "리스트 안에서 다른 리스트의 항목을 찾는" 코드가 두 겹 반복이 되기 쉬운데, 이럴 땐 집합이나 딕셔너리로 바꾸면 한 겹으로 줄어든다. Part 11 시간복잡도에서 애니메이션으로 비교한다.`,
    },
    {
      kind: "pitfall",
      title: "break 는 안쪽만 끝낸다",
      md: `안쪽 반복에서 \`break\` 하면 안쪽만 끝나고 바깥은 계속 돈다. 둘 다 끝내려면 (1) 플래그 변수를 두고 바깥에서도 검사하거나, (2) 이중 반복을 함수로 빼서 \`return\` 하거나, (3) \`for-else\` 를 조합한다. 가장 깔끔한 건 (2) 다.`,
      code: `def find(grid, target):
    for i, row in enumerate(grid):
        for j, v in enumerate(row):
            if v == target:
                return i, j        # 두 반복을 한 번에 빠져나간다
    return None`,
    },
    {
      kind: "quiz",
      question: "`print` 는 총 몇 번 실행될까?",
      code: `for i in range(3):
    for j in range(i):
        print(i, j)`,
      choices: [
        { text: "9번", why: "안쪽 range 가 range(i) 다 — 바깥 값에 따라 길이가 달라진다." },
        { text: "3번", correct: true, why: "i=0 → range(0) 0번, i=1 → range(1) 1번, i=2 → range(2) 2번. 합 3번. 안쪽 반복의 범위가 바깥 변수에 의존하는 삼각형 패턴이다." },
        { text: "6번", why: "range(i) 는 i 개다. 0 + 1 + 2 = 3." },
      ],
    },
    {
      kind: "summary",
      items: [
        "바깥이 한 번 돌 때 안쪽은 **끝까지** 돈다. 실행 횟수는 곱(n × m).",
        "들여쓰기 깊이가 '어느 반복에 속하는지' 를 정한다.",
        "`break` 는 안쪽만. 둘 다 끝내려면 함수로 빼서 `return`.",
        "n² 은 금방 커진다. 두 겹 반복으로 '찾는' 코드는 집합/딕셔너리로 한 겹으로.",
      ],
    },
  ],
};
