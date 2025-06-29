const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

const BUCKET_SIZE = 81;

function hash(key) {
    let hashCode = 0;
    for (let i = 0; i < key.length; i++) {
        hashCode = (hashCode * 31 + key.charCodeAt(i)) % BUCKET_SIZE;
    }
    return hashCode;
}

class Node {
    constructor(key, value, next = null){
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
class MyMap {
    constructor(){
        this.bucket = new Array(BUCKET_SIZE).fill(null);
        this.nodeCount = 0;
        //영어(대소문자 구분) 52 + 숫자 10 + 한글 19 총 81만큼의 1차원 배열 생성. 이후 수요에 따라 동적으로 2차원 배열 생성
    }
    put(key, value){
        const index = hash(key);
        let node = this.bucket[index];

        if (node === null){
            this.bucket[index] = new Node(key, value);
            return;
        }

        while(node !== null){
            if (node.key === key) {
            //키 값이 완전하게 동일한 경우 value만 업데이트함.HashMap에서 key값은 유일함.
                node.value = value;
                return;
            }
            
            if (node.next !== null) break;
            // 그 다음 노드가 존재하느 경우 제일 끝에 삽입하기 위해 다음 노드로 변경

            node = node.next;
        }

        node.next = new Node(key, value);
        //해당 index의 마지막 체인에 도달한 경우 새로운 노드를 추가함.
    }
    containsKey(key){
    //해당 키가 존재하는 지 판단해서 bool 결과를 반환
        let index = hash(key);
        let node = this.bucket[index];

        while(node !== null) {
        //해당 index의 체인의 끝까지 탐색하며, 해당 key를 찾은 경우 true 반환
            if(node.key === key)    return true;
            node = node.next;
        }
        return false;
    }
    get(key){
    //해당 키와 매치되는 value를 찾아서 반환하며, 실패한 경우 null 반환
        let index = hash(key);
        let node = this.bucket[index];

        while(node !== null) {
            if (node.key === key)   return node.value;
            node = node.next;
        }
        return null;
    }
    keys() {
    //전체 키 목록을 배열로 반환
        var tempKeys = [];
        for (let i = 0; i < 81; i++) {
            let node = this.bucket[i];
            if (node === null) continue;

            while(node !== null){
                tempKeys.push(node);
                node = node.next;
            }
        }

        return tempKeys;
    }
    size() {
    //전체 아이템 개수를 반환.
        let totalcnt = 0;

        for (let i = 0; i < 81; i++) {
            let node = this.bucket[i];
            if (node === null) continue;
            while(node !== null){
                totalcnt++;
                node = node.next;
            }
        }
        return totalcnt;
    }
    remove(key) {
        let index = hash(key);

        if (this.bucket[index] === null) {
            console.log("삭제할 노드가 없습니다.");
            return null;
        }
        let node = this.bucket[index];
        let idx = 0;
        let prev = idx;
        while(node !== null){
            if (node.key === key) {
                this.bucket[prev] = node.next;
                return;
            }
            prev = idx;
            node = node.next;
        }
    }
    isEmpty(){
        let cnt = this.size();
        if (cnt === 0)  return true;
        return false;
    }
    clear() {
        this.bucket.fill(null);
    }
}

async function main() {
    const myMap = new MyMap();

    console.log("명령어 사용법:");
    console.log("- put key,value   : 키와 값을 추가");
    console.log("- containsKey key : 키가 존재하는 지 확인")
    console.log("- get key         : 키에 해당하는 값을 가져오기");
    console.log("- remove key      : 해당 키 제거");
    console.log("- keys            : 전체 키 목록 출력");
    console.log("- size            : 크기 출력");
    console.log("- isEmpty         : 비었는지 확인");
    console.log("- clear           : Map의 모든 bucket을 비움")
    console.log("- break           : 종료");

    while (true) {
        const line = (await askQuestion(">>> "))
            .trim()
            .split(" ");

        const cmd = line[0];

        if (cmd === 'break') {
            console.log("종료합니다.");
            rl.close();
            break;
        }

        if (cmd === 'put') {
            const [key, value] = line[1].split(",");
            myMap.put(key, value);
            console.log(`put 완료 (${key}:${value})`);
        } 
        else if (cmd === 'get') {
            const key = line[1];
            console.log(myMap.get(key) ?? "!NULL");
        } 
        else if (cmd === 'containsKey'){
            const key = line[1];
            console.log(myMap.containsKey(key) ? "존재함" : "존재하지 않음");
        }
        else if (cmd === 'remove') {
            const key = line[1];
            myMap.remove(key);
            console.log(`${key} 제거됨`);
        } 
        else if (cmd === 'keys') {
            console.log("Keys:", myMap.keys());
        } 
        else if (cmd === 'size') {
            console.log("Size:", myMap.size());
        } 
        else if (cmd === 'isEmpty') {
            console.log(myMap.isEmpty() ? "비어 있음" : "비어 있지 않음");
        } 
        else if (cmd === 'clear') {
            myMap.clear();
            console.log("Map의 모든 bucket을 비웠습니다.");
        }
        else {
            console.log("알 수 없는 명령입니다.");
        }
    }
}

main();
