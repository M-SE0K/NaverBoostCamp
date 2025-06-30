# Day05 AST 리서치

## 문제를 푸는 시점에 컴파일러 동작 방식에 대해 어디까지 알고 있는 가?

> 학습한 주요 자료
> 
> 
> → https://webkit.org/blog/10308/speculation-in-javascriptcore/
> 
> **→** 📚 **모던 자바스크립트 Deep Dive (위키북스)**
> 
> → https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
> 
> → https://mathiasbynens.be/notes/shapes-ics
> 

**컴파일러 방식에 대해 깊게 공부해본 적이 없는 상태였습니다. 기본적인 인터프리터와 컴파일러의 차이 그리고 각각의 장단점을 알고 있는 상태였습니다.**

### 학습 이전

- 인터프리터 방식
    
    프로그램을 실행하는 상황에서 코드를 한 줄씩 읽어나가며 실행하는 방식으로 주로 Python과 SQL 등에서 주로 사용되고 있습니다. run-time에 해석한다.
    
    - 장점:
        - 오류 발생시 해당 부분에서 실행이 중단 되기에 오류 발견이 쉬운편이다.
        - 동적 기능 활용에 유리하다.
    - 단점 :
        - 매 코드 한 줄마다 매번 해석하기에 실행속도가 느리다.
- 컴파일러 방식
    
    코드를 기계어로 번역하고, 실행하는 방식으로 실행 전 compile-time에 진행된다. 즉 high level의 언어를 low level 언어로 변환하는 과정으로 알고 있으며, 주로 C, C++, JAVA가 사용되고 있습니다.
    
    - 장점 :
        - 실행 속도가 빠르다. compile-time에 전체 코드에 대해 번역을 진행한 후 하기에 인터프리터 방식에 비해 빠르다.
        - 컴파일 이후 생성된 실행 결과물을 재활용이 가능하기에 재실행시 매우 빠른 속도로 실행이 가능하다.
    - 단점 :
        - 컴파일된 코드는 사람이 이해하기 어려운 형태로 기계어 형태이기 때문에 사람이 직접 오류를 발견하기엔 어렵다.
- **컴파일러의 동작방식**
    1. **어휘 분석 :** 해당 소스 코드를 읽어 들여 토큰 단위로 분해하는 과정
    2. **구문 분석 :** 토큰들을 분석하여 읽어 들여온 전체 프로그램의 문법 구조를 파악하고 구문 트리 형태로 표현하는 과정
    3. **의미 분석 :** 생성된 구문 트리가 올바르게 되었는 지, 변수의 타입, 함수 호출 등이 올바른지 확인하는 과정
    4. **중간 코드 생성 :** 기계어와 중간 코드를 생성하며, 다양한 플랫폼에 이식 가능하도록 한다.
    5. **코드 최적화 :** 중간 코드에서의 불필요한 연산을 제거하며 최적화하는 과정
    6. **목적 코드 생성 :** 코드 최적화를 통해 만들어진 중간 코드를 실행 가능한 형태인 기계어 코드로 변환하는 과정
    

---

### 학습 이후

- **“JavaScript는 어떤 과정을 통해 실행까지 도달하는 가?”**
    
    > https://mathiasbynens.be/notes/shapes-ics
    > 
    
    JavaScript 엔진은 소스 코드를 Lexing 이후 Parsing하여 AST 형태로 변환한다. 이후 AST를 기반으로 인터프리터는 작업을 시작하고 바이트 코드를 생성한다.
    
    ![image.png](/day05/image.png)
    
    → 위의 그림에서 볼 수 있다 싶이 인터프리터로 인해 생성된 최적화되 않은 바이트 코드는 “optimizing compiler”에게 바이트 코드의 프로프파일링된 데이터와 함께 전달된다. bytecode를 프로파일링을 하는 이유는 JavaScript는 약한 동적 타입 언어로 컴파일 과정에서의 타입 지정이 불가하다. 그렇기에 프로파일링 데이터를 통해 타입 추론하고 이를 기반으로 최적화된 바이트 코드를 최적화 컴파일러를 통해 실행 속도를 높인다.
    
    → 최적화 컴파일러(Optimizing Compiler) 과정에서 바이트 코드는 IR이며, 만약 interperter모드라면 바이트 코드를 하나씩 읽어서 실행하고 JIT 모드라면 바이트 코드를 기반으로 컴파일하여 수행한다.
    
    **위의 내용의 학습을 통해 JavaScript 엔진 파이프 라인의 각 구성 요소의 역할 및 실행 흐름에 대해 학습할 수 있었습니다.**
    
- **“ JIT 컴파일이란?(Just- in-Time compilation)”**
    
    > https://developer.mozilla.org/en-US/docs/Glossary/Just_In_Time_Compilation
    > 
    
    JIT는 즉시 컴파일이란 듯으로, 코드가 실행되기 전에 미리 기계어로 벼환되는 것이 아닌, runtime 중간에 IR이나 High Level 언어로부터 기계어로 변환되는 컴파일 과정이다. 이러한 부분은 인터프리터 방식과 정적 커파일 방식의 장점을 모두 결합한 형태이다.
    
    JIT 컴파일러는 일반적으로 코드를 실행하면서 지속적으로 분석하며, 자주 실행되는 부분(hot spot)을 식별한다. 만약 해당 부분을 기계어로 컴파일 했을 때의 성능 향상이 그 컴파일 비용을 상회한다면, JIT 컴파일러는 해당 부분을 컴파일한다. 이렇게 컴파일된 코드는 이후에는 프로세서가 직접 실행하게 되어, 성능 향상을 가져올 수 있으며, JIT는 특히 현대 웹 브라우저에서 JavaScript 코드의 실행 성능을 최적화하기 위해 널리 사용된다.
    
- **“Profiling은 어떤 과정으로 이루어지는 가”**
    
    > https://webkit.org/blog/10308/speculation-in-javascriptcore/
    > 
    
    JavaScriptCore는 LLInt와 Baseline 단계를 통해 코드를 프로파일링한다.
    
    LLInt는 바이트 코드를 해석하며, Baseline JIT는 바이트 코드를 컴파일한다.
    

**→ 기존의 컴파일 동작 방식을 기반하여 JavaScript의 컴파일 동작 방식과 흐름의 전반에 이해할 수 있었으며, JavaScript의 특징인 약한 동적 타입 언어의 내부 원리를 추론, Profiling 등을 통해 이해할 수 있었습니다.**

**→ 기존에는 구글링을 통해 흔히 말하는 입맛에 맞는 블로그를 찾아 필요한 정보를 빼내와 사용했다면, 이번 기회를 통해 공식 문서는 어떻게 이루어져있는 지에 알 수 있었던 기회였습니다.**

---

## AST 구조 설계

### 분석 대상 코드

```jsx
var a = new A.init();
```

### 어휘 분석

소스 코드를 토큰 단위로 나누는 단계이다.

| **순서** | **토큰** | **종류** |
| --- | --- | --- |
| 1 | **`var`** | 키워드 |
| 2 | **`a`** | 식별자(Identifier) |
| 3 | **`=`** | 연산자(Operator) |
| 4 | **`new`** | 키워드 |
| 5 | **`A`** | 식별자 |
| 6 | **`.`** | 연산자 (멤버 접근) |
| 7 | **`init`** | 식별자 |
| 8 | **`(`** | 구문 기호 (괄호) |
| 9 | **`)`** | 구문 기호 (괄호) |
| 10 | **`;`** | 구문 기호 (세미콜론) |

### 구문 분석

1. var a = … → **`VariableDeclaration`** 
    - 여기서 a는 식별자를 의미하는 **Identifier**이다.
    - **`new A.init()` AssignmentExpression이자 NewExpression가 된다.**
    - 결과적으로 여기선 VariableDeclaration 노드가 생성된다.
2. new A.init() → **`NewExpression`**
    - A.init()는 **`MemberExpreesion`** 이다.
    - 괄호가 붙었있으므로 Arguments → ‘(’, ‘)’
    - 결과적으로 여기선 NewExpression(callee = MemberExpression, arguments=[])
3. A.int() → **`MemberExpression`** 
    - A는 객체이다.
    - init()은 해당 객체의 속성을 나타낸다.
    - 점 표기법 . 은 computed: false
    

### AST Tree 구조

**먼저 트리 형태의 구조를 시각적으로 표현해보았습니다.**

```jsx
VariableDeclaration (kind: var)
└── VariableDeclarator
    ├── Identifier (name: "a")
    └── NewExpression
        ├── MemberExpression (computed: false)
        │   ├── Identifier (name: "A")
        │   └── Identifier (name: "init")
        └── arguments: []
```

| 노드 타입 | 예시 | 역할 및 이유 |
| --- | --- | --- |
| `VariableDeclaration` | `var a = ...` | JavaScript에서 `var` 키워드로 변수 선언은 VariableDeclaration 노드로 표현됨. |
| `VariableDeclarator` | `a = ...` | 선언된 변수와 초기화 값을 연결. 하나의 선언 안에 이름(`id`)과 초기값(`init`)을 포함. |
| `Identifier` | `"a"` | 변수의 이름을 나타냄. 변수를 `var a`처럼 선언하면 `a`는 식별자. |
| `NewExpression` | `new A.init()` | `new` 키워드가 등장하는 표현식은 `NewExpression`. 이는 `A.init` 생성자를 호출함을 의미. |
| `MemberExpression` | `A.init` | 점 표기법은 객체 접근이므로 `MemberExpression`으로 표현함. `A`라는 객체의 `init` 속성을 접근. |
| `Identifier` | `"A"`, `"init"` | 각각 `MemberExpression` 내에서 객체와 속성 이름을 나타냄. |
| `arguments` | `[]` | 생성자 함수에 인자가 없기 때문에 빈 배열. |

**→ 트리 구조는 구문 구조를 시각적으로 파악하는데 매우 효과적이라고 느꼈습니다. 코드의 논리적 흐름을 부모-자식 관계로 표현하기 때문에, 어떤 것이 무엇을 포함하고 있는 지에 대해 쉽게 확인할 수 있었습니다.**

### json 구조 형태 AST (ESTree 표준 기반)

> https://astexplorer.net/을 참고하여 설계하였습니다.
> 

```json
{
  "type": "VariableDeclaration",
  "kind": "var",
  "declarations": [
    {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "a"
      },
      "init": {
        "type": "NewExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "A"
          },
          "property": {
            "type": "Identifier",
            "name": "init"
          }
        },
        "arguments": []
      }
    }
  ]
}

```

## 느낀점

**AST를 트리로 설계하며 구조의 의미를 직관적으로 이해하고, JSON으로 옮기며그 의미를 명확하고 기계적으로 표현하는 과정을 거치면,단순히 코드의 표면적 문법이 아니라언어 처리 전반의 추상화 메커니즘을 깊이 이해할 수 있었습니다. 평소 아무렇지 않게 사용하던 한 줄의 코드가 실제로는 여러 단계의 추상화 구조를 거친 복잡한 구성이라는 사실을 크게 체감할 수 있었던 좋은 기회였었습니다.**

**또한 AST 설게는 단순한 문법 파싱을 넘어서, 최적화, 추론, 실행 전략 등 모든 컴파일러 구조 기반이 되는 표현 방식을 학습할 수 있었습니다.**