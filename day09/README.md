# README.md

## 기능 요약

- 입력된 문자열 배열에 따라 플레이어별로 이동 경로 계산
- 도착지점(Z)에 정확히 도달하거나 초과 시 점수 획득
- 분기점(W, V 등)에서는 자동으로 짧은 경로 우선 선택
- 잘못된 입력에 대해 오류 처리 수행 (`ERR`, `ERROR`)
- 하나의 말만 존재하며, 다른 말과의 상호작용 없음

---

## 게임 규칙 요약

- 모든 말은 `Z`에서 시작하여 다시 `Z`로 돌아오면 점수 1점을 획득
- 각 이동 명령어는 다음과 같이 칸 수를 의미함:
    - `D`: 1칸
    - `K`: 2칸
    - `G`: 3칸
    - `U`: 4칸
    - `M`: 5칸
- 분기점 노드에 정확히 도달한 경우 짧은 방향으로 자동 전환
    - 예: `ZW5` → `WV`, `WX5` → `XV`, `WV3` → `VZ`
- 도착지점(`Z`)을 지나면 점수 획득 후 말은 `Z`에 위치
- 허용되지 않은 문자가 포함되면 해당 플레이어는 `"ERR"` 처리
- 참가자 수는 2~10명, 각 턴의 길이는 동일해야 함

---

## 코드 구성

- `moveBoard`: 이동 문자 → 거리 매핑
- `paths`: 각 경로명 → 경로를 구성하는 노드 배열
- `branchEntry`: 분기점에서 짧은 경로로 진입
- `branchNext`: 분기점 통과 시 다음 경로로 진입
- `buildBoard()`: 모든 노드의 다음 위치를 Map으로 구성
- `move()`: 플레이어의 이동 경로와 점수를 계산
- `score()`: 전체 참가자의 결과를 수집하여 출력
- `main()`: 사용자 입력(JSON 배열 형식)을 받아 처리

---

## 주요 로직 설명

### 1. `buildBoard()`

보드의 모든 노드를 순회하며, 각 노드의 다음 위치를 결정합니다. 경로의 마지막 노드가 분기점일 경우, 일반 경로로 매핑합니다. 일반 노드의 마지막은 `Z`로 매핑됩니다.

짧은 경로에 대한 분기 조건은 **`move()` 함수에서 처리하였습니다.**

```jsx
function buildBoard() {
    const board = new Map();
  
    for (const [key, posList] of Object.entries(paths)) {
	      for (let i = 0; i < posList.length; i++) {
        const current = posList[i];
        const isLast = i === posList.length - 1;

        if (!isLast) {
          board.set(current, posList[i + 1]); //다음 경로에 대한 매핑
        } 
        else if (current in branchNext) {    //현재 경로가 분기점인 경우 다음 경로를 분기 지점이 아닌 일반 경로로 매핑
          const key = branchNext[current];
          if (key === 'Z') {  board.set(current, 'Z');  } 
          else {
            const tempList = paths[key];
            if (!tempList) {
              console.error(`경로 ${key}가 paths에 없습니다.`);
              continue;
            }
            board.set(current, tempList[0]);
          }
        }
        else {
          board.set(current, 'Z'); // 도착 처리
        }
      }
    }
    return board;
}
```

### 2. `move()`

플레이어의 입력 문자열을 순차적으로 처리하여 이동을 시뮬레이션합니다.

- 이동 전에 현재 위치가 `branchEntry`에 해당하면 즉시 짧은 경로로 진입
- 이후 각 이동 명령어에 대해 거리만큼 `board.get(pos)`를 통해 전진
- Z에 도착하거나 넘어가면 점수 증가 및 위치 `"Z"`로 고정
- 잘못된 입력 문자가 포함되면 `"ERR"` 반환

```jsx
function move(playerOrder, board) {
    let pos = 'Z';  //출발지점 정의
    let score = 0;  //도착 지점 지난 횟수
  
    for (let idx = 0; idx < playerOrder.length; idx++) {
      //명령어의 길이만큼 반복

      const ch = playerOrder[idx];  //idx 번째 명령어 젖아
      if (!isValidChar(ch)) return { score, pos: 'ERR' }; //해당 문자열이 포함되어 있는 지에 대한 검사. 즉, 올바른 명령인지 검사
  
      let moveCnt = moveBoard[ch];  //해당 명령만큼 이동거리 저장
      let prevPos = pos;

      if (pos in branchEntry && pos !== 'Z') {  //플레이어가 이동하기 전 현재 위치가 분기 지점인지에 대한 검사
        const tempPos = branchEntry[pos];
        const tempList = paths[tempPos];
        pos = tempList[0];
        moveCnt--;
      }
      for (let i = 0; i < moveCnt; i++) {
        var nextPos;
        nextPos = board.get(pos); //pos 현재 경로를 key값으로 하여 map에 매핑된 다음 경로를 가져와 저장
        if (nextPos === 'Z' || nextPos === 'VZ3') {  nextPos = 'Z'; score++;  i++;}// 다음이 Z라면 점수 +1
        
        pos = nextPos;// 다음 위치로 이동
      }

      if (idx === playerOrder - 1 && prevPos in branchEntry) {
        pos = prevPos;
      }

    }
    return {score, pos};

}
```

---

**이와 같은 방식은 설계한 방식에 대한 이유는 다음과 같습니다. 1 turn씩 모든 플레이어가 소요한다는 개념으로 한 칸씩 차근차근 움직이자는 설계 의도에서 비롯되었으며, 그러기에 한 칸씩 이동하다 보면 미리 매핑된 짧은 분기 경로로 라우트 되는 현상을 확인할 수 있었습니다. 이를 방지하기 위해 미리 일반 경로로 매핑 후, 이동이 모두 종료된 시점에서 분기 지점에 대한 검사를 수행하게 되었습니다.**

### 3. **`inputCheck(orders)`**

참가자 수 및 턴 길이 일치 여부를 확인합니다.

- 모든 참가자의 입력이 동일한 길이를 가지는지 확인합니다.
- 참가자 수가 2명 이상 10명 이하인지 확인합니다.

```jsx
const turnLength = orders[0].length;
const valid = orders.every((o) => o.length === turnLength);
if (!valid || orders.length < 2 || orders.length > 10) {
  return false;
}
return true;
```

### 4. `isValidChar(ch)`

유효한 이동 명령어인지 판단합니다.

- 이동 명령어는 오직 다섯 가지(D, K, G, U, M)만 유효하다. 그 이외의 경우 false 반환 이후 **`“ERR”`**츨력합니다.

```jsx
function isValidChar(ch) {
    return ['D', 'K', 'G', 'U', 'M'].includes(ch);
}
```

### 5. `score()`

모든 참가자 입력을 처리하고 결과를 배열 형태로 출력합니다. 참가자 수가 2~10명 범위를 벗어나거나 입력 길이가 다르면 `"ERROR"` 출력합니다.

---

### 실행 결과

![image.png](README%20md%20226ed78e319f80538402cb25b845087c/image.png)

![image.png](README%20md%20226ed78e319f80538402cb25b845087c/image%201.png)

![image.png](README%20md%20226ed78e319f80538402cb25b845087c/image%202.png)

![image.png](README%20md%20226ed78e319f80538402cb25b845087c/image%203.png)