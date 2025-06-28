var arr = [10, 30, 50, 80].map(v => [v]);
var map = [['A', 0], ['B', 0], ['C', 0]];

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

function play(num, grade) {
    let temp_value = Infinity;  //양의 무한대
    let temp_index = -1;        //내려놓을 1차원 배열의 인덱스 저장

    for (let i = 0; i < 4; i++) {
        if (arr[i].length === 0) continue;
        //현재 위치의 배열이 비어있는 경우 -> "빈 배열에는 더 이상 추가하지 못합니다."

        let current_diff = Math.abs(arr[i][arr[i].length - 1] - num);
        //내려놓는 카드와 배열 마지막 카드 차이가 가장 가까운 숫자를 판독하기 위함. 현재 위치의 배열의 마지막 인덱스에 위치한 값 - 내려놓을 카드의 값

        if (current_diff < temp_value 
            || (current_diff === temp_value 
                && arr[i][arr[i].length - 1] > arr[temp_index][arr[temp_index].length - 1]))
            // 조건 A : (현재 위치의 배열의 마지막 인덱스에 위치한 값 - 내려놓을 카드의 값)이 < temp_valu인 경우 즉, 이전까지의 값의 diff값 보다 작은 경우
            // OR 값이 같은 경우 각 위치의 배열의 마지막 카드 숫자가 더 큰 것을 선택함. 
        {
            temp_value = current_diff;
            temp_index = i;
        }
    }
    
    if (temp_index === -1) return;
    // 추가할 수 있는 배열이 없는 경우

    const last = arr[temp_index][arr[temp_index].length - 1];
    //A 조건을 만족하며, 내려놓을 위치의 앞 배열의 마지막 카드 값

    if (num < last) {
    //B 조건 : "배열 마지막 숫자보다 내려놓을 카드가 반드시 더 작아야 해당 배열 뒤에 카드를 추가할 수 있습니다." 조건 검사 -> 만족하는 경우 해당 인덱스의 배열 마지막 위치에 삽입
        arr[temp_index].push(num);
    } else {
    //B 조건을 만족하지 못하는 경우 해당 유저에 대한 벌점 누적 (= 내려놓을 배열의 인덱스의 길이만큼). 이후 내려놓을 배열의 인덱스의 배열을 비움.
        map[grade][1] += arr[temp_index].length; // 벌점 누적
        arr[temp_index] = []; // 배열 비움
    }
}

async function main() {
    const line = (await askQuestion("입력: "))
        .trim()
        .split(" ")
        .map(Number);

    if (line.length % 3 !== 0) {
        //입력이 3의 배수 형태로 입력되지 않은 경우 map을 출력 후 -> 0 프로그램 종료
        console.log("Map:", map);
        rl.close();
        return;
    }

    for (let i = 0; i < line.length; i += 3) {
        //조건 : "입력에 대해(= 3개씩 끊어서 카드가 작은 순서로"
        const turn = [
            //객체 배열을 이용하여 정렬 이후에도 값이 A, B, C인지 구분
            { num: line[i], grade: 0 },
            { num: line[i + 1], grade: 1 },
            { num: line[i + 2], grade: 2 }
        ];

        
        turn.sort((a, b) => a.num - b.num);
        // 카드 숫자 기준 정렬 (낮은 순)

        for (let { num, grade } of turn) {
        //구현 요구사항 : A, B, C 3명의 참가자가 있다고 가정하고 매 턴마다 카드 숫자 값을 입력으로 제공함. 
            play(num, grade);
        }

        if (arr.every(a => a.length === 0)) {
        // 종료 조건 -> 더 이상 입력 값이 없거나, 더 이상 비울 배열이 없으면 게임을 종료함.
            console.log("모든 배열이 비어 게임 종료");
            console.log("Map:", map);
            break;
        }
    }

    //console.log("최종 배열 상태:", arr);
    console.log("Map:", map);
    rl.close();
}

main();
