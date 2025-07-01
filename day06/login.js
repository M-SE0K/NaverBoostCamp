import { userInfo } from "./localDatabase.js";
import readline from "readline";
//const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const userID = Math.floor(Math.random() * 10);

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}


// export class login {
//     loginCheck(userID){
//         console.log("사용자의 로그인 상태를 검사합니다.");
//         if (userInfo.findUserID(userID)){
//             console.log("[login.js] 로그인된 사용자입니다.");
//         }
//         else{
//             console.log("[login.js] 로그인 화면으로 이동합니다.");
//             console.log("-----<로그인 화면>-----");

//             const ID = (askQuestion("ID: "));
//             const PASSWORD = (askQuestion("PASSWORD:"));

//             if (userInfo.login(ID, PASSWORD))
//                 return true;
//             else
//                 return false;
//         }
//     }
// }
export function loginCheck(userID){
    console.log("사용자의 로그인 상태를 검사합니다.");
    const db = new userInfo();
    console.log(userID);
    if (db.findUserByID(userID)){
        console.log("[login.js] 로그인된 사용자입니다.");
    }
    else{
        console.log("[login.js] 로그인 화면으로 이동합니다.");
        console.log("-----<로그인 화면>-----");

        const ID = (askQuestion("ID: "));
        const PASSWORD = (askQuestion("PASSWORD:"));

        if (db.login(ID, PASSWORD))
            return true;
        else
            return false;
    }
}
