import { loginCheck } from "./login.js";
import { mainHome } from "./mainHome.js";
import readline from "readline";
//const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const userID = Math.floor(Math.random() * 10);

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

async function main(){

    console.log("*프로그램이 시작 되었습니다!*");
    console.log(`접속 계정: ${userID}님`);
    while(loginCheck(userID)){
        console.log("[로그인 화면]")
    }

    

    const line = (await askQuestion(">>> "))
    .trim()
    .split(" ");
}

main();