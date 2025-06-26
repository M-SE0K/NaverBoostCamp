## Day 1

### 개발환경 연습

- JS 추천 환경
    - VS Code(Visual Studio Code) 추천
    - Node.js 프로그램을 설치한다 (v22 버전 이상 권장)
- 개발 범위
    
    **OOO 회사에 입사 첫 날, 예전 개발자가 만들다 멈춘 보드 게임 에서 말의 움직임을 판단하는 코드를 공유해 주었다. 1번부터 시작하고 주사위를 굴려서 나온 숫자만큼 전진하는 보드 게임이다. 다음 보드 게임 이미지에서 사다리가 놓인 칸에 도착한 경우만 사다리를 타고 더 높은 숫자 칸으로 올라갈 수 있다.**
    
    ![image.png](attachment:ccf398d1-5eab-4519-b628-c7d3f0f5cdeb:image.png)
    
    - 기존 코드
        
        ```jsx
        function nextPosition(current, dice) {
            const next = current + dice;
            if (next == 4) {
                return dice + 10;
            }
            else if (next == 8) {
                return dice + 22;
            }
            else if (next == 28) {
                return dice + 48;
            }
            else if (next == 21) {
                return dice + 42;
            }
            else if (next == 50) {
                return dice + 17;
            }
            else if (next == 71) {
                return dice + 92;
            }
            else if (next == 80) {
                return dice + 19;
            }
            
            return dice;    
        }
        
        let start = 1;
        let next = 1;
        let dice = 3;
        next = start + nextPosition(start, dice);
        console.log("from=",start,", dice=",dice,", next=", next);
        
        start = next;
        dice = 4;
        next = start + nextPosition(start, dice);
        console.log("from=",start,", dice=",dice,", next=", next);
        
        start = next;
        dice = 3;
        next = start + nextPosition(start, dice);
        console.log("from=",start,", dice=",dice,", next=", next);
        
        start = next;
        dice = 5;
        next = start + nextPosition(start, dice);
        console.log("from=",start,", dice=",dice,", next=", next);
        
        start = next;
        dice = 1;
        next = start + nextPosition(start, dice);
        console.log("from=",start,", dice=",dice,", next=", next);
        
        ```
        
    
    ![image.png](attachment:3d5bf4e3-90a5-4db1-8a8d-3b8184bb3444:image.png)
    
- **문제점**
    
    → 21에 방문하는 경우 42로 이동하여야 하지만 next의 값이 42가 아닌 63으로 변한 것을 확인
    
    ```jsx
    	else if (next == 21) { return dice + 42; } //수정 전! 
    	else if (next == 21) { return dice + 23; } //수정 후! 
    ```
    
- **추가 요구사항 뱀 동작을 구분한 별도 함수 작성**
    
    ![image.png](attachment:6b144a57-186d-44fb-8363-c19043df2be9:image.png)
    
    - **수정 코드**
        
        ```jsx
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
        
        ```
        
- “사다리를 타고 더 높은 숫자 칸으로 올라갈 수 있다.” → 선택 가능한 부분으로 낮은 우선순위 배정.
- “뱀이 위치한 칸에 도착하면 뱀에게 물려서 더 낮은 숫자로 떨어진다.” → 선택 불가능한 부분으로 절대적으로 높은 우선순위 배정.
- 두 함수를 별도로 구분함. 하지만, 매 방문마다 여러차례 조건 비교는 O(N)까지 증가할 것으로 판단되어, 10 * 10 보드판의 사다리와 뱀의 위치를 기록하여 O(1)로 시간복잡도를 주

---

### 실수 축제

- 실수 축제란?
    
    실수 축제는 일부러 틀려 보고, 실수행 보고, 오류를 만들고, 비정상 상황을 만들어 보는 교육 활동입니다.
    
    개발 과정에서 누구나 실수를합니다. 전문가들도 하루에 평균 7개 실수를 한다고 합니다. 개발자들이 사용하는 통합 개발 환경에서는 컴파일러가 코드의 문법을 미리 검사하고 개발자가 실수한 부분을 알려줍니다. 개발 환경이 알려주는 실수들을 차곡차곡 챙겨 두어야 한다.
    
- 실수에서 배우기
    
    버그가 있거나 디버깅을 해야 하는 상황은 개발자가 의도하지 않아도 게속해서 생깁니다. 그래서 새로운 것이 익숙해지고 학습하는 과정에서는 일부러라도 비정상 상황을 만들어 보고, 정상 상황과 비교해 보고, 또 다시 오류를 만들어 보고, 정상 상황과 비교해 보고 , 또 다시 오류를 만들어 보고, 에러 문장을 살펴보고 고쳐 보는 습관이 필요합니다.
    

- 실수 축제 제출하기
    1. 개발 과정에 만난 컴파일러나 개발 환경에서 경고 또는 에러 메시지를 기록한다.
    2. 해당 경고나 에러를 해결했던 방법을 확인합니다.
    3. 코드 조각, 문제 상황, 에러 메시지, 해결 방법을 요약해서 댓글로 제출합니다.
    4. 제출하고 나면 다른 사람의 실수도 살펴보세요.

- !!실수 축제 주의사항
    - 어떤 실수들이 있었는지 확인하는 것은 좋지만 그대로 따라서 작성하지는 마세요.
    - 다른 사람이랑 코드가 완전히 동일하면 안됩니다.

- 사용자 입출력 로직을 추가하는 과정에서 발생하는 JavaScript의 async 처리 문제가 발생함. 이는 **`readline.question()` 이 비동기 함수이기 때문에 두 개의 `rl.question(….)` 을 호출한 후에 아래 로직을 바로 실행하면 입력이 끝나기도 전에 start, dice 값이 undefined 상태로 사용됨.**
    
    ```jsx
    시작 지점을 입력하세요: from= undefined , dice= undefined , next= undefined
    from= undefined , dice= 4 , next= 4
    from= 4 , dice= 3 , next= 3
    from= 3 , dice= 5 , next= 5
    from= 5 , dice= 1 , next= 1
    ```