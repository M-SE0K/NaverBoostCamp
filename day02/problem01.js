var arr = [10, 30, 50, 80].map(v => [v]);
var map = [['A', 0], ['B', 0], ['C', 0]];

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

function sort(line) {
//입력을 오름차순 형식으로 정렬하기 위한 함수
    line.sort((a, b) => a - b);
}

function simulator(num, grade) {
    let temp_value = Math.abs(arr[0][arr[0].length - 1] - num);
    console.log(temp_value);
    console.log(num);
    let temp_index = 0;

    for (let i = 0; i < 4; i++) {
        let current_value = Math.abs(arr[i][arr[i].length - 1] - num);
        if (current_value < temp_value || 
            ((current_value == temp_value) && arr[temp_index][arr[temp_index].length - 1] < arr[i][arr[i].length - 1]) ){   
                temp_value = current_value; 
                temp_index = i;
                console.log("temp_index, temp_value : ", temp_index, temp_value);
        }
        
    }

    if (arr[temp_index][arr[temp_index].length - 1] < num) {
        map[grade][1] = arr[temp_index].length;
        arr[temp_index] = []; // 배열 비우기
        arr[temp_index] = [0];
        return false;
    }

    arr[temp_index].push(num);
    console.log(arr[temp_index]);
    return true;
}

async function main() {
    const line = (await askQuestion("입력: "))
        .trim()
        .split(" ")
        .map(Number);

    if (line.length % 3 != 0){
        console.log("Map:", map);
        rl.close();
        process.exit();
    }

    sort(line);

    for (let i = 0; i < line.length / 2; i++)
    {
        for (let j = i * 3; j < 3 + (i * 3); j++) {
            console.log(line[j], j);
            simulator(line[j], i);
        }
    }

    console.log("최종 배열 상태:", arr);
    console.log("Map:", map);
    rl.close();
}

main();
