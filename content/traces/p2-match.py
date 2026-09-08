command = "go north"
match command.split():       # @note: 리스트 ["go", "north"] 를 각 case 패턴과 위에서부터 맞춰 본다
    case ["quit"]:
        print("종료")
    case ["go", direction]:  # @note: 길이 2, 첫 항목이 "go" — 맞다! direction 에 "north" 가 붙는다
        print("이동:", direction)
    case _:
        print("모르는 명령")
