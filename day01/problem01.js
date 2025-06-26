const arr_compensation = [];
const arr_snake = [];
function initMap(){
    for (let i = 0; i < 100; i++){
        arr_compensation[i] = 0;
        arr_snake[i] = 0;
    }

    arr_compensation[4] = 14;
    arr_compensation[8] = 30;
    arr_compensation[21] = 42;
    arr_compensation[28] = 76;
    arr_compensation[50] = 67;
    arr_compensation[71] = 92;
    arr_compensation[80] = 99;
    
    arr_snake[32] = 10;
    arr_snake[36] = 6;
    arr_snake[48] = 26;
    arr_snake[62] = 18;
    arr_snake[88] = 24;
    arr_snake[95] = 56;
    arr_snake[97] = 78;
}

function nextPosition(current, dice) {
    const next = current + dice;
    if (arr_compensation[next] != 0) {  return arr_compensation[next];   }
    return next;    
}
function nextSnakePosition(current, dice)
{
    const next = current + dice;
    if (next >= 100) {
        console.log("도착 지점 도착!") 
        process.exit();
    }   
    if (arr_snake[next] != 0)        {   return arr_snake[next];  }

    return nextPosition(current, dice);
    //뱀이 존재하지 않는 좌표인 경우 별도의 조건 처리 없이 반환
}


const readline = require("readline");
//Node.js의 내장 모듈인 readline을 불러오는(import) 코드이며,
//require("readline")을 통해 이 모듈을 가져오고, 그 결과를 readline이라는 이름의 상수에 할당하는 방식

const rl = readline.createInterface({
//readline.createInterface({......})는 입출력 인터페이스 객체를 생성함. 이 객체를 통해 사용자 입력을 받을 수 있음.
//이 객체는 rl이라는 이름으로 선언되며, 여기서 rl은 ReadLine InterFace 객체임.
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise((resolve) => { 
        rl.question(query, answer => resolve(answer))
    });
}

(async function main() {
    initMap();
    let start = Number(await askQuestion("시작 지점을 입력하세요: "));
    let dice = Number(await askQuestion("주사위 값을 입력하세요: "));
    let next;

    next = nextSnakePosition(start, dice);
    console.log("from=",start,", dice=",dice,", next=", next);
    start = next;
    dice = Number(await askQuestion("주사위 값을 입력하세요: "));
    next = nextSnakePosition(start, dice);
    console.log("from=",start,", dice=",dice,", next=", next);
    
    start = next;
    dice = Number(await askQuestion("주사위 값을 입력하세요: "));
    next = nextSnakePosition(start, dice);
    console.log("from=",start,", dice=",dice,", next=", next);
    
    start = next;
    dice = Number(await askQuestion("주사위 값을 입력하세요: "));
    next = nextSnakePosition(start, dice);
    console.log("from=",start,", dice=",dice,", next=", next);
    
    start = next;
    dice = Number(await askQuestion("주사위 값을 입력하세요: "));
    next = nextSnakePosition(start, dice);
    console.log("from=",start,", dice=",dice,", next=", next);
    
    rl.close();
})();
