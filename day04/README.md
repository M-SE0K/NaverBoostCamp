# Day04

## 해시맵과 사전

### 학습 목표

- **자신이 사용하는 언어에 있는 Map (혹은 Dictionary) 기능에 대해 학습하고 정리한다.**
- Map과 HashMap의 차이에 대해 학습한다.
- 해시 함수를 비교하고 효율적이고 효과적인 해시 함수에 대해 이해한다.
- 해시맵 구조상 버킷 사이즈를 이해한다.
- 해시 Hash 함수와 해시맵 HashMap에 대해 학습하고, 구조를 이해하고, 나만의 해시맵을 직접 구현하는 것이 목표다.

### 기능요구사항

- 문자열 키(key)와 문자열 값(value)을 저장하는 해시맵 라이브러리를 구현한다.
- 나만의 고유한 Hash 함수를 정한다.
    - 이미 구현된 코드를 그대로 가져오기보다는 원리에 충실하게 만들어 본다.
- 해당 언어/개발 환경에 있는 Map, HashMap (또는 Dictionary) 기본 동작을 따라 만드는 게 목표다.
- Hash() 함수 매칭과 한계 범위에 따라서 HashMap 구조상 Bucket Size도 결정한다.

### 프로그래밍 요구사항

- 클래스나 객체로 구현하지 않고 함수들만 구현해도 무방하다.
- 모든 함수를 hash 하나의 파일에 작성한다. **`hash.js`**
- 데이터 구조는 언어나 라이브러리에서 HashMap 역할로 제공하는 Object, Map, HashMap, Dictionary 등을 사용하지 않고 반드시 직접 배열이나 리스트로만 구현한다.
- 구현해야 하는 함수들
    - **`clear()`** 전체 맵을 초기화한다.
    - **`containsKey(String)`** 해당 키가 존재하는 지 판단해서 Bool 결과를 리턴한다.
    - **`get(String)`** 해당 키와 매치되는 값을 찾아서 리턴한다.
    - **`isEmpty()` 비어있는 맵인지 Bool 결과를 리턴한다.**
    - **`keys()`** 전체 키 목록을 [String] 배열로 리턴한다.
    - **`put(String key, String value)`** 키-값을 추가한다.
    - **`remove(String key)` 해당 키에 있는 값을 삭제한다.**
    - `size()` 전체 아이템 개수를 리턴한다.

### 추가 요구 사항

- 해시맵 키 값이 문자열이 아니라 다른 타입이라면 어떤 부분이 어떻게 바뀌는 지 살펴본다.

### 추가 학습 거리

HashMap 성능 기준을 어떤 측면에서 확인하고 고려해야 하는 지 추가로 학습해 본다.

### 설계 단계

1. **map 데이터 정의 → 표현 가능한 범위는 총 영어(대소문자 구분) 52 + 숫자 10 + 한글 19로 1차원 정의. 이후 동일한 해시코드에 대해 동적으로 linkedList 활용하여 할당**
2. **`Node`** class 구현하기 → 실제 key와 value를 가지고 있음
3. **`myMap`** class 구현하기 → map 라이브러리의 주요 함수 구현을 위함
4. **각 Method에서 발생하는 경우의 수(상황) 정의**

**→ 기존 자료구조 stack, queue를 C++로 구현했던 기억을 기반으로 class로 구현하게 됐음.**

## Class

### Node

```jsx
class Node {
    constructor(key, value, next = null){
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
```

**→ 실제 데이터들을 저장하고 있는 class로 linkedList로 활용하기 위해 next 멤버 추가하여 다음 노드를 가리키게 하였음.**

### MyMap

```jsx
class MyMap {
    constructor(){
        this.bucket = new Array(BUCKET_SIZE).fill(null);
        //영어(대소문자 구분) 52 + 숫자 10 + 한글 19 총 81만큼의 1차원 배열 생성. 이후 수요에 따라 동적으로 2차원 배열 생성
    }
	  //아래는 주요 함수
}
```

**→ 81개의 객체 배열 형태로 bucket을 할당하였으며, 선언시 null로 초기화하여, 사용 중이지 않은 bucket을 구분하였음**

## Method

### **`put(key, value)`**

```jsx
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
```

**→ put에 대한 경우의 수는 크게 두 가지로 bucket에 첫 할당과 이후의 할당으로 구분하였습니다.**

**→ 이후의 할당에서 발생하는 경우의 수는 두 가지로 정의하였습니다. 존재하는 key에 대한 접근과 존재하지 않는 key에 대한 접근으로 구분하였습니다.** 

**→ 존재하는 key의 경우 value만 업데이트 하는 방식으로 진행하였습니다.**

**→ 존재하지 않는 key의 경우 해당 bucket의 말단까지 이동하여 노드를 연결(추가)하였습니다. 이 방식의 경우 메모리에서 연속되지 않은 공간에 위치하여 remove 연산 이후 bucket 정렬시 O(1)의 시간복잡도를 가지게 됩니다. 2차원 배열을 사용하는 경우 O(N)의 정렬 시간이 소요됩니다.**

### `containsKey(key)` ,  `get(key)`

```jsx
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
```

→ containsKey() 메서드 구현은 key()의 값은 hash 과정을 거치기 때문에 O(1)로 예상하였으나, 그렇지 않았습니다. 해당 key 값은 유일하지만 한정된 배열 공간에 의해 해시코드는 유일하지 않기에 O(N)으로 구성되었습니다.

1. **key값을 해시코드로 변환하여 해당 해시코드의 bucket에 접근**
2. **해당 bucket 순회**

를 기반으로 설계하였습니다.

→ get() 메서드 또한 반환 형식만 다를 뿐 로직은 동일하기에 설명은 생략하겠습니다.

### **`keys()` , `size()`**

```jsx
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
```

→ keys() 메서드 구현단계에서는 고민이 많았습니다. key를 새롭게 해시코드로 변환하여 bucket에 할당할 때마다 별도의 전역으로 선언된 배열에 저장할까 하였지만, 이는 결국 remove 연산시 결국 삭제를 위해 O(N)의 시간복잡도가 소요되기에 불필요하다고 생각이 들어 지금과 같은 방식으로 구현하였습니다.

→ 전체 bucket에 대해 순회를 하며 활성화된 bucket들에 대해 순회를 하며 임시 객체 배열에 키값을 저장하였습니다.

→ size() 메서드 또한 동일한 방식으로 순회하였으며, 동일한 고민으로 81개의 각 bucket에 node_count 멤버변수를 통해 bucket 내부의 순회 없이 bucket까지만 접근하여도 내부의 node의 개수를 셀 수 있게 하려고 하였으나, 이 또한 아래와 같은 상황에서 동일하게 적용되어 별도의 멤버 변수를 두지 않았습니다.

**n개의 bucket의 node가 1개씩 존재하는 경우 == 한 bucket에 n개의 node가 존재하는 경우.**

두 경우 모두 O(N)의 시간 복잡도를 가집니다.

### **`remove`**

```jsx
    remove(key) {
        let index = hash(key);

        if (this.bucket[index] === null) {
            console.log("삭제할 노드가 없습니다.");
            return null;
        }
        let node = this.bucket[index]; let idx = 0; let prev = idx;
        while(node !== null){
            if (node.key === key) {
                this.bucket[prev] = node.next;
                return;
            }
            prev = idx;
            node = node.next;
        }
    }
```

→ 별도로 해당 bucket에 삭제할 노드에 대한 예외검사를 통해 잘못된 인덱스 접근을 방지하였습니다.

→ linkedList의 특징을 유지하기 위해 삭제 전 노드 포인터인 next의 값을 미리 저장하여 삭제 이후에도 node간 연결이 끊기지 않게 하였습니다.

### 실행 결과
![image.png](/day04/image.png)