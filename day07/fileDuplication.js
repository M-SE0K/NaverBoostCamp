
function match(inputList) {
    // 마지막 파일명 추출 후 _v1~_v9 제거
    const files = inputList.map(path => {
        return path
            .split('/').pop()         // 마지막 파일명
            .replace(/_v[1-9]/i, ''); // _v1~_v9 제거 (대소문자 구분 X)
    });

    
    const fileCount = new Map();
    for (let file of files) {
        fileCount.set(file, (fileCount.get(file) || 0) + 1);
    }

    
    const result = new Map();
    for (let [file, count] of fileCount.entries()) {
        if (count > 1) {
            result.set(file, count.toString());
        }
    }

    return result;
}


const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputs = [];

rl.on('line', (line) => {
    inputs.push(line);
    if (inputs.length === 1) {
        rl.close();
    }
});

rl.on('close', () => {
    const rawInput = inputs[0].trim();
    let parsed;

    try {
        parsed = JSON.parse(rawInput); // JSON 파싱
    } catch (e) {
        console.log("Invalid JSON input");
        return;
    }

    const answer = match(parsed);

    if (answer.size === 0) {
        console.log("0"); // 중복 없을 때는 0 출력
        return;
    }

    for (const [key, value] of answer) {
        console.log(`${key} ${value}`);
    }
    rl.close();
});
