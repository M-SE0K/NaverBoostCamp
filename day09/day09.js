
const dictBoard = {};
const moveBoard = { D: 1, K: 2, G: 3, U: 4, M: 5 };

// 각 경로를 키로 사용하여 노드들을 연결
const paths = {
  ZW: ['Z', 'ZW1', 'ZW2', 'ZW3', 'ZW4', 'ZW5'],
  WX: ['WX1', 'WX2', 'WX3', 'WX4', 'WX5'],
  XY: ['XY1', 'XY2', 'XY3', 'XY4', 'XY5'],
  YZ: ['YZ1', 'YZ2', 'YZ3', 'YZ4', 'YZ5'],
  WV: ['WV1', 'WV2', 'WV3'],
  VY: ['VY1', 'VY2', 'VY3'],
  XV: ['XV1', 'XV2', 'XV3'],
  VZ: ['VZ1', 'VZ2', 'VZ3']
};

// 분기점에서 다음 경로 (짧은 길)
const branchEntry = {
  // ZW5: ['WX', 'WV'],
  // WV3: ['VY','VZ'],
  ZW5: 'WV',
  WX5: 'XV',
  WV3: 'VZ',
  XY5: 'YZ',
  XV3: 'VZ',
  VZ3: 'Z'
};
// 분기점에서 다음 경로 (짧은 길)
const branchNext = {
  // ZW5: ['WX', 'WV'],
  // WV3: ['VY','VZ'],
  ZW5: 'WX',
  WX5: 'XY',
  WV3: 'VZ',
  XY5: 'YZ',
  VZ3: 'Z'
};
const readline = require("readline");
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}
// 전체 보드 구성: Map(현재 위치 → 다음 위치)
function buildBoard() {
    const board = new Map();
  
    for (const [key, posList] of Object.entries(paths)) {
      for (let i = 0; i < posList.length; i++) {
        const current = posList[i];
        const isLast = i === posList.length - 1;

        if (!isLast) {
          board.set(current, posList[i + 1]); //다음 경로에 대한 매핑
        } 
        else if (current in branchNext) {    //현재 경로가 분기점인 경우 다음 경로를 분기 지점으로 매핑
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
  
function inputCheck(orders) {
    const turnLength = orders[0].length;
    const valid = orders.every((o) => o.length === turnLength);
    if (!valid || orders.length < 2 || orders.length > 10) {
      return false;
    }
    return true;
}
  
function isValidChar(ch) {
    return ['D', 'K', 'G', 'U', 'M'].includes(ch);
}
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
  
function score(orders) {
    if (!inputCheck(orders)) {
      console.log(["ERROR"]);
      return;
    }
  
    const board = buildBoard(); //매핑된 board 저장
    const results = [];
  
    for (let order of orders) { //각 플레이어별 명령어 수행
      const { score: s, pos } = move(order, board);
      results.push(`${s}, ${pos}`);
    }
  
    console.log(results);
}
/*    
    "moneky" in dictObject   // true
    "elephant" in dictObject // false
*/
async function main() {
    const input = (await askQuestion(">>> 요청들 (배열 형식): ")).trim();

    let orders;
    try {
        orders = JSON.parse(input); // 예: ["INVITE", "CANCEL", "200(CANCEL)", ...]
        if (!Array.isArray(orders)) throw new Error();
    } catch (e) {
        console.log("올바른 배열 형식의 입력이 아닙니다.");
        return;
    }
    //console.log(orders); 정상적인 배열 입력 확인하기 위함

    score(orders);

    rl.close();
}

main();


