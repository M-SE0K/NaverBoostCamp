# Day08

# 프로토콜 상태 전환

## 학습 목표

- 일반적인 상태전환 다이어그램 구성에 대해 이해하고 구현할 수 있다.
- 상태 전환 다이어그램을 비교문 대신에 데이터 구조로 구현할 수 있다.
- 상태 전환에 대한 이해를 바탕으로 상태 관리를 구현할 수 있다.

## 사전 지식

상태 전환 (또는 전이) 다이어그램에 대해 학습한다.

## 기능 요구 사항

다음과 같은 상태 전환 다이어그램을 구현하려고 합니다.

![image.png](/day08/image.png)

- **`타원`** : 상태 값을 의미한다. 예시) **`IDLE`**, **`ACCEPTED`**, **`AUTH REQUESTED`**
- **`화살표`** : 상태가 변화하는 이벤트 값을 의미한다.
    - 문자로만 구성된 요청(**`INVITE`**, **`BYE`**)과 숫자 (**`180`**, **`407`**, **`301`**, **`200`**)로 응답이 있지만 구현상 구분하지 않아도 된다.
    - **`<timeout>`**도 시간이 만료되었다는 이벤트로 구분한다.
- 화살표에서 xx는 00~99까지 숫자 범위를 의미한다. 구체적인 숫자가 씌여진 경우가 우선이고 범위는 그 나머지를 의미한다.

| FROM | 화살표 | **TO** |
| --- | --- | --- |
| IDLE | **INVITE** | INVITED |
| INVITED | **1xx** | INVITED |
| INVITED | **200** | ACCEPTED |
| INVITED | **CANCEL** | CANCELLING |
| INVITED | **3xx** | REDURECTING |
| INVITED | **407** | AUTH REQUESTED |
| INVITED | **4xx - 6xx** | FAILED |
| FAILED | **ACK** | TERMINATED |
| AUTH REQUESTED | **ACK** | INVITED |
| REDIRECTING | **ACK** | REDIRECTED |
| REDIRECTED | **<time out>** | TERMINATED |
| CANCELLING | **200(CANCEL)** | CANCELLED |
| CANCELLED | **487** | FAILED |
| ACCEPTED | **ACK** | ESTABLISHED |
| ESTABLISHED | **BYE** | **CLOSING** |
| **CLOSING** | **BYE** | **CLOSING** |
| **CLOSING** | **200(BYE)** | TERMINATED |

### 상태 종류

- **`IDLE`**에서 시작해서 **`TERMNATED`**까지 상태가 계속해서 전환된다.
- 같은 상태가 유지되는 경우도 있다. **`INVITE`**, **`CLOSING`**
- 특정 상태에서 요청과 응답을 보내거나 받으면 다음 상태로 전환한다.

## 프로그래밍 요구사항

- 항상 IDLE 상태에서 시작해서 이벤트 값에 따라서 다음 상태로 변화한다.
- 만약 변환할 수 없는 이벤트라면 무시한다.
- 상태 전환 조건에 따라서 같은 상태가 유지될 수도 있다.
- 상태가 변화할 때마다 기록해서 배열로 리턴하여 출력한다.

### 제약 사항

- 상태와 이벤트 값을 상수로 선언한다. (반복되는 하드 코딩을 하지 말자)
- 상태와 이벤트 값의 비교를 비교문에서 직접 비교하지 말고, 자신이 선택한 상태 전환을 위한 FROM-TO 구조를 설계하고 구현한다.

## 예상 결과 및 동작 예시

### **예시1**

**입력 ["INVITE", "CANCEL", "200(CANCEL)", "487", "ACK"]**

**출력 ["INVITED", "CANCELLING", "CANCELLED", "FAILED", "TERMINATED"]**

### **예시2)**

**입력 ["INVITE", "180", "200", "ACK", "BYE", "200(BYE)"]**

**출력 ["INVITED", "ACCEPTED", "ESTABLISHED", "CLOSING", "TERMINATED"]**

### **예시3)**

**입력 ["INVITE", "407", "ACK", "301", "ACK", "`<timeout>`"]**

**출력 ["INVITED", "AUTH REQUESTED", "INVITED", "REDIRECTING", "REDIRECTED", "TERMINATED"]**

### **예시4)**

**입력 ["INVITE", "404", "ACK", "`<timeout>`"]**

**출력 ["INVITED", "FAILED", "TERMINATED"]**

[json 다루기](https://www.notion.so/json-224ed78e319f8016b390ce3b1c1d0389?pvs=21)

## 설계

- “상태와 이벤트 값을 상수로 선언한다. (반복되는 하드 코딩을 하지 말자)”,  ”상태와 이벤트 값의 비교를 비교문에서 직접 비교하지 말고, 자신이 선택한 상태 전환을 위한 FROM-TO 구조를 설계하고 구현한다.” 제약사항을 읽고 많이 헷갈렸습니다. 미션6과 비슷한 형식으로 데이터 구조를 설계하고.. 하려는데.. 오히려 얕은 지식 때문인지 저 제약사항 때문에 헷갈렸던 거 같습니다.
- 세세한 조건을 따지기 전 직관적인 해석을 통해 데이터 구조를 아래와 같은 형태로 설계하였습니다.
    
    이후 ‘xx’ 등의 조건에 대해 구현하기 보단 전반전인 흐름을 잡고 시작하는 것이 수월하다고 생각들어 ‘xx’ 등의 조건은 이후 별도의 메서드를 통해 처리하기로 하였습니다.
    
    ```jsx
    
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
        { from: "REDIRECTED", signals: [{ signal: "<time out>" }], to: "TERMINATED" },
        { from: "CANCELLING", signals: [{ signal: "200(CANCEL)" }], to: "CANCELLED" },
        { from: "CANCELLED", signals: [{ signal: "487" }], to: "FAILED" },
        { from: "ACCEPTED", signals: [{ signal: "ACK" }], to: "ESTABLISHED" },
        { from: "ESTABLISHED", signals: [{ signal: "BYE" }], to: "CLOSING" },
        { from: "CLOSING", signals: [{ signal: "BYE" }], to: "CLOSING" },
        { from: "CLOSING", signals: [{ signal: "200(BYE)" }], to: "TERMINATED" }
    ];
    ```
    

- 아래와 같은 방식으로 1차적으로 전반적인 흐름을 지켜 구현한 메서드입니다. 이후 **`channelCheck()` 를** 통해 신호별 채널을 통하여 데이터 구조와 맞는 형식으로 signal을 변환하여 반환하였습니다.
    
    ```jsx
    function stateTransition(currentState, signal){
        for (const temp of state) {
            if (temp.from === currentState) {
                for (const nextState of temp.signals || [temp]) {
                    if (nextState.signal === signal)
                        return temp.to || nextState.to;
                }
            }
        }
        return null;
    }
    ```
    

## 주요 함수

### **`channelCheck`**

문제에서 임의로 제시된 조건 화살표에서 “xx는 00~99까지 숫자 범위를 의미한다. 구체적인 숫자가 씌여진 경우가 우선이고 범위는 그 나머지를 의미한다.” 이기에 그림에 제시된 별도의 요청을 제외하곤 이 조건을 충족하기 위해 구현하였다.

그림에 명시된 별도의 신호들을 제외하곤 모두 같은 채널이라고 생각하고 이에 맞게 묶고 변환하여 반환했다.

호출 시점의 경우 매 시그널을 처리하는 함수가 호출된 이후 해당 함수에서 로직이 동작하기 직전 호출하여 데이터 구조와 동일하게 하여 보다 직관적으로 처리할 수 있게 의도하였다.

```jsx
function channelCheck(signal) {

    // 예외 처리용 직접 매핑 신호 (정확한 신호 우선)
    const exactMatches = ["407", "487", "CANCEL", "ACK", "BYE", "INVITE", "<time out>", "200(CANCEL)", "200(BYE)"];

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
```

### **`stateTransition()`**

상태 변화를 처리하기 위한 메서드입니다. 

정의된 데이터 구조를 순회하며, 현재 상태 (currentState)를 찾아 접근하였습니다. 상태별 전환될 수 있는 상태가 여러 개이기에 현재 상태에 대한 요청 할 수 있는 시그널에 대한 검사 및 요청한 시그널과 같은 시그널인지에 대한 검사를 통해 to state의 값을 반환함

```jsx
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
```

### 실행 결과(DEBUG, SOL)

![image.png](/day08/image%201.png)

![image.png](/day08/image%202.png)