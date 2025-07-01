import { useState } from "./state.js";

export class userInfo{
    #users = [
        {
            "userID": 1,
            "password": 1111,
            "name": "호날두",
            "age": 40,
            "gender": "male"
        },
        {
            "userID": 4,
            "password": 4444,
            "name": "메시",
            "age": 40,
            "gender": "male"
        },
        {
            "userID": 6,
            "password": 6666,
            "name": "김연아",
            "age": 23,
            "gender": "woman"
        },
        {
            "userID": 7,
            "password": 7777,
            "name": "유재석",
            "age": 50,
            "gender": "male"
        },
        {
            "userID": 9,
            "password": 9999,
            "name": "한효주",
            "age": 40,
            "gender": "woman"
        }
    ];
    // ID로 사용자 객체 찾기
    findUserByID(id) {
        return this.#users.find(user => user.userID === id);
    }

    // ID로 비밀번호 찾기
    findUserPassword(id) {
        const user = this.findUserByID(id);
        return user ? user.password : undefined;
    }

    // 로그인: ID와 비밀번호가 일치하는지 확인
    login(id, password) {
        const user = this.findUserByID(id);
        if (user && user.password === password) {
            console.log(`[로그인 화면] 로그인 성공: ${user.name}님`);
            useState.setLoginState();
            return true;
        } else {
            console.log(`[로그인 화면] 로그인 실패`);
            return false;
        }
    }

}