const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}


const state = [
    { from: "IDLE", signal: "INVITE", to: "INVITED" },
    {
        from: "INVITED",
        signals: [
            { signal: "1xx", to: "INVITED" },
            { signal: "200", to: "ACCEPTED" },
            { signal: "CANCEL", to: "CANCELLING" },
            { signal: "3xx", to: "REDIRECTING" },
            { signal: "407", to: "AUTH REQUESTED" },
            { signal: "4xx - 6xx", to: "FAILED" }
        ]
    },
    { from: "FAILED", signals: [ { signal:"ACK" }], to: "TERMINATED" },
    { from: "AUTH REQUESTED", signals: [ { signal: "ACK" }], to: "INVITED" },
    { from: "REDIRECTING", signals: [{ signal: "ACK" }], to: "REDIRECTED" },
    { from: "REDIRECTED", signals: [{ signal: "<timeout>" }], to: "TERMINATED" },
    { from: "CANCELLING", signals: [{ signal: "200(CANCEL)" }], to: "CANCELLED" },
    { from: "CANCELLED", signals: [{ signal: "487" }], to: "FAILED" },
    { from: "ACCEPTED", signals: [{ signal: "ACK" }], to: "ESTABLISHED" },
    { from: "ESTABLISHED", signals: [{ signal: "BYE" }], to: "CLOSING" },
    { from: "CLOSING", signals: [{ signal: "BYE" }], to: "CLOSING" },
    { from: "CLOSING", signals: [{ signal: "200(BYE)" }], to: "TERMINATED" }
];

function channelCheck(signal) {

    // 예외 처리용 직접 매핑 신호 (정확한 신호 우선)
    const exactMatches = ["407", "487", "CANCEL", "ACK", "BYE", "INVITE", "<time out>", "200(CANCEL)", "200(BYE)", "200"];

    //신호가 예외목록에 포함되어 있으면, 원래 값 그대로 반환
    if (exactMatches.includes(signal)) return signal;
    
    // 숫자 아닌 경우 정상적인 숫자 즉, 문자인 경우 숫자로 정상적인 변환이 되지 않음.
    const code = parseInt(signal, 10);
    if (isNaN(code)) return signal; 
    
    if (code >= 100 && code < 200) return "1xx";
    if (code >= 200 && code < 300) return "2xx";
    if (code >= 300 && code < 400) return "3xx";
    if (code >= 400 && code <= 699) return "4xx - 6xx";

    return signal;
}

//상태 변환을 구현하는 함수
function stateTransition(currentState, signal){
    //신호의 채널 확인
    signal = channelCheck(signal);

    //state의 전체에 대해 순회하며 현재 상태와 일치하는 신호가 있는 지 검사함. 즉, 정상적인 신호가 들어왔는 지에 대한 검사.
    //상태별 전환될 수 있는 상태가 여러 개이기에 현재 상태에 대한 요청 할 수 있는 시그널에 대한 검사 및 요청한 시그널과 같은 시그널인지에 대한 검사를 통해 to state의 값을 반환함
    for (const temp of state) {        
        if (temp.from === currentState) {
            for (const nextState of temp.signals || [temp])
                if (nextState.signal === signal)    {   return temp.to || nextState.to; }
        }
    }
    return null;
}

async function mainDEBUG(){
    var st = "IDLE";
    const output = new Array();
    while(1){
        const signal = (await askQuestion(">>> 요청: "));
        st = stateTransition(st, signal);
        console.log(`>>> 응답: ${st}`);
        output.push(st);
        if (st === "TERMINATED")    break;
    }
    console.log(`최종상태: ${output}`);
}

async function main() {
    const input = (await askQuestion(">>> 요청들 (배열 형식): ")).trim();

    let signals;
    try {
        signals = JSON.parse(input); // 예: ["INVITE", "CANCEL", "200(CANCEL)", ...]
        if (!Array.isArray(signals)) throw new Error();
    } catch (e) {
        console.log("올바른 배열 형식의 입력이 아닙니다.");
        return;
    }

    let st = "IDLE";
    const output = [];

    for (const signal of signals) {
        st = stateTransition(st, signal);
        console.log(`>>> 응답: ${st}`);
        output.push(st);
        if (st === "TERMINATED") break;
    }

    console.log(`\n최종상태: ${output[output.length - 1]}`);
    console.log(`전체 전이 경로: [${output.join(", ")}]`);

    rl.close();
}
//["INVITE", "CANCEL", "200(CANCEL)", "487", "ACK"]
//["INVITE", "180", "200", "ACK", "BYE", "200(BYE)"]
//["INVITE", "407", "ACK", "301", "ACK", "<timeout>"]
//["INVITE", "404", "ACK", "<timeout>"]
main();