# Day06

## 이벤트 히스토리 설계하기

### 학습 목표

- 주어진 상황을 파악하고 문제 해결을 위한 적절한 데이터 구조와 프로그래밍 흐름을 설계할 수 있다.
- 구현 단계 이전에 문제 해결에 필요한 데이터 구조와 샘플 데이터를 구조화할 수 있다.
- 데이터 구조에 필요한 데이터 타입을 적절하게 선택할 수 있다.

### 기능 요구 사항

다음과 같은 흐름으로 동작하는 웹 혹은 앱 서비스를 개발하려고 있다고 가정한다.

가칭 ACME 서비스를 사용하는 사용자들의 화면별 사용 이력을 히스토리 데이터로 보관하려고 한다. 액션에 따라 보여주는 화면, 해당 화면에서 동작 이벤트, 특정화면에서 전환하는 화면을 기록하는 데이터 구조와 타입을 스스로 판단해서 결정한다.

![image.png](/day06/image.png)

동작에 대한 설명은 다음과 같다. 글로 명시되지 않은 흐름은 그림을 보고 스스로 파악해 본다.

- **~~시작화면 로그인되어 있는 상태인지 아닌지에 따라 <로그인 화면>을 보여주거나 바로 <메인 화면>으로 전환된다.~~**
- **~~로그인 화면에서 성공한 경우에만 <메인 화면>으로 전환한다.~~**
- <메인 화면>에서 이벤트 영역을 선택하면, 5가지 광고 중에 하나를 랜덤하게 표시한다.
- <메인 화면>에서 콘텐츠를 보기 위해 [NEXT 버튼]을 누르면 다음 화면을 기존 화면에 위로 쌓아 둔다. 이렇게 다음 화면을 쌓는(푸시) 동작과 다음 화면으로 넘어가는 (전환) 동작은 구분해야 한다.
- 콘텐츠 화면 중에 마지막 화면에서는 페이지 스크롤이 가능하며, 몇 번째 페이지까지 스크롤했는 지 저장한다.
- <메인 화면> 하단에는 1번, 2번, 3번으로 3개의 메뉴가 있어서 각 메뉴를 선택하면 서로 다른 화면으로 전환한다.
- 메뉴 1, 2, 3번 화면에서는 <메인 화면>을 포함해서 상호 전환이 가능하다.
- 각 메뉴 화면에서 컨텐츠를 선택하면 다음 상세 화면을 (푸시)한다.
- 메뉴 1번 상세화면에서는 상하좌우 스크롤이 가능하고, 스크롤 횟수를 저장한다. 이 화면에서는 [BACK] 버튼을 눌러야 이전할 수 있다.
- 메뉴 2번 상세 화면에서는 숫자값을 입력하고 [SAVE 버튼]을 누르면, 값을 저장하고 <메인 화면>으로 모두 이전한다.
- 메뉴 3번 상세 화면은 두 단계로 (푸시) 가능하며, 마지막 상세화면에서는 ON/OFF 중에 선택할 수 있다. 선택하면 바로 이전 화면으로 돌아간다.

### 프로그래밍 요구사항

위 서비스 동작에 대한 이력을 저장하기 위해서 데이터 구조와 저장하는 프록그램구조를 설계한다. 설계 결과는 자신의 생각을 가장 적절하게 표현하는 형식을 스스로 선택한다. 왜 선택했는 지도 설명하는 게 좋다.

저장한 데이터는 설계한 그대로 값들이 반복적으로 데이터베이스에 보관되어있다고 가정하고 다음과 같은 결과를 찾을 수 있도록 데이터 타입과 반복되는 데이터 구조를 설계해야 한다.

1. 하루 동안 얼마나 많은 사용자들이 <로그인 화면>에 접속하는 가
2. <이벤트 광고>화면을 가장 많이 본 사용자는 누구인가
3. <메인 화면>을 가장 많이 보는 시간대는 하루 중에 언제인가
4. 메뉴 1-2-3 화면 중에서 가장 전환을 많이하는 화면은 어디서/어디로 전환하는 경우인가.
5. 지난 일주일 동안 메뉴2 마지막 화면에서 값을 저장하고 <메인 화면>으로 이동한 횟수는 몇 번인가
6. 하루 동안 메뉴3 마지막화면에서 ON/OFF 설정을 선택한 사용자는 몇 명인가
7. 최근 일주일 기간에 가장 화면 노출이 적은 화면은 어느 화면인가

## 설계

### **데이터 구조**

각 사용자에 대한 기록 즉, 로그를 남겨야 된다는 취지로 문제를 이해하고 진행하였습니다. 각 사용자의 ID 및 각 화면에 대해 객체 배열에 view를 정의하여 각 특성에 맞게 관리하였습니다.

```jsx
const userInfo = [
  {
    id: 1,
    timeStamp: ["2025-07-01T09:00:00Z"],
    views: [
      { view: "menu1", scroll: 2, from: "menu2", count: 1 },
      { view: "menu2", value: 20, save: true, action: "push", from: "main", count: 1 },
      { view: "menu3", action1: "push", action2: "push", from: "menu1", "on/off": "on", count: 1 },
      { view: "event", detailView: 3, count: 1 }
    ]
  },
  {
    id: 2,
    timeStamp: ["2025-07-01T10:30:00Z", "2025-07-01T15:00:00Z"
],
    views: [
      { view: "menu1", scroll: 0, from: "main", count: 1 },
      { view: "menu3", action1: "push", action2: "push", from: "menu2", "on/off": "off", count: 2 },
      { view: "event", detailView: 1, count: 2 },
      { view: "menu2", value: 42, save: false, action: "back", from: "main", count: 1 }
    ]
  },
  {
    id: 3,
    timeStamp: ["2025-07-01T12:00:00Z"],
    views: [
      { view: "menu2", value: 77, save: true, action: "push", from: "main", count: 1 },
      { view: "event", detailView: 4, count: 3 },
      { view: "menu1", scroll: 1, from: "menu3", count: 2 }
    ]
  },
  {
    id: 4,
    timeStamp: ["2025-06-01T13:45:00Z"],"2025-07-01T16:00:00Z"
    views: [
      { view: "menu1", scroll: 3, from: "menu2", count: 1 },
      { view: "menu2", value: 10, save: false, action: "push", from: "main", count: 2 },
      { view: "menu3", action1: "push", action2: "push", from: "menu1", "on/off": "on", count: 1 },
      { view: "event", detailView: 2, count: 2 }
    ]
  },
  {
    id: 5,
    timeStamp: ["2025-07-01T15:00:00Z"],"2025-07-01T09:00:00Z", "2025-07-01T11:20:00Z"
    views: [
      { view: "event", detailView: 5, count: 4 },
      { view: "menu2", value: 99, save: true, action: "push", from: "main", count: 1 },
      { view: "menu3", action1: "push", action2: null, from: "menu2", "on/off": "off", count: 2 }
    ]
  }
];
```

---

## 메서드

### **`getLoginAccessCount`**

“하루 동안 얼마나 많은 사용자들이 <로그인 화면>에 접속하는 가”를 나타내는 로직으로

날짜는 임의로 풀이 당시 날짜인 2025-07-01로 설정하였습니다.  각 사용자는 마지막 로그인 접속 시간을 데이터 구조에 저장되어 있는 형태로 구현하였습니다.

“하루 동안 얼마나 많은 사용자들”이라고 하였기에 저는 한 사용자가 여러 번 접속하는 경우이기에 여러 번 접속하여도 1번으로 카운트하였습니다. 이렇게 정의하는 다른 근거는 “사용자가 이미 로그인 되어 있는 경우” 라는 문제의 조건 또한 존재하였기에 이러한 가정을 기반으로 코드를 작성하였습니다.

각 사용자들의 미리 저장되어있는 데이터 구조에 접근하여 targetDateStr(프로그래머가 임의로 지정)에 시작하는 확인 후 해당 인원들의 수를 세어 반환하는 형식으로 작성하였습니다.

이때 사용된 startsWith 함수는 문자열이 특정 문자열로 시작하는 지를 검사하는 것으로 true or false를 반환합니다. 이를 토대로 찾고자 하는 년, 월, 일, 시간까지 구체적으로 확인할 수 있습니다

```jsx
const getLoginAccessCount = (userInfo, targetDateStr) => {
  return userInfo.filter(user =>
    user.timeStamp.some(ts => ts.startsWith(targetDateStr))
  ).length;
};
```

### **`getTopEventAdViewer`**

“<이벤트 광고>화면을 가장 많이 본 사용자는 누구인가” 각 사용자들 데이터 구조에 기록된 내용을 기반으로 각 사용자의 <이벤트 광고> 화면에 접속한 횟수 즉, 본 횟수를 기록하는 형태로 하였습니다. 

정의된 json 형태의 데이터 구조를 순회하며 각 사용자마다 **`id`**, **`views`**를 추출하였고 이름 기반으로 각 사용자의 **`views`**에서 {**`event`**, **`count`**}를 추출하였습니다. 이 과정을 거친 이유는 각 사용자마다 event를 보지 않은 사용자도 있을 것을 고려하였기 때문입니다.

<이벤트 광고>는 총 5개로 5개의 화면에 대한 접근횟수를 각각으로 기록하였습니다. 한 사용자의 단순 이벤트 광고에 대한 접근을 집계하기 위해 각 광고들에 대한 횟수를 모두 더 하여 반환하였습니다.

```jsx
const getTopEventAdViewer = (userInfo) => {
  const counts = userInfo.map(user => ({
    id: user.id,
    count: user.views
      .filter(v => v.view === "event")
      .reduce((sum, v) => sum + (v.count || 1), 0)
  }));
  return counts.sort((a, b) => b.count - a.count)[0]?.id || null;
};

```

### **`getMainViewPeakHour`**

“<메인 화면>을 가장 많이 보는 시간대는 하루 중에 언제인가”에 대해 사용자들의 접속 시간을 기록해둔 **`TimeStamp`**를 통해 구하였습니다. 사용자는 매 접근마다 메인 화면을 보기에 이와 같이 구현하였습니다.

각 사용자의 접속 기록 (**`timeStamp`**)를 순회하며 각각의 ‘시’ 단위 시간을 추출하고 이를 배열의 인덱스로 활용하여 저장하는 형식으로 구현하였습니다.

마지막에는 총 24번 각 시간별로 순회를 하며 배열의 요소값 중 가장 큰 값을 반환하여 메인화면이 가장 붐비는 시간을 반환하였습니다.

```
const getMainViewPeakHour = (userInfo) => {
  const hours = Array(24).fill(0);
  userInfo.forEach(user => {
    user.timeStamp.forEach(ts => {
      const h = new Date(ts).getUTCHours();
      hours[h]++;
    });
  });
  return hours.indexOf(Math.max(...hours));
};
```

### **`getMostFrequentTransition`**

“메뉴 1-2-3 화면 중에서 가장 전환을 많이하는 화면은 어디서/어디로 전환하는 경우인가.”에 대해 구현한 함수입니다. **`startsWith()`** 함수를 이용하여 menu로 시작하는 view들만 검사하였습니다. 이는 문제 제시 조건인 메뉴간 전환만을 확인하기 위함입니다.

예를 들어 `from: "menu1"`, `view: "menu2"` 같은 경우만 의미 있는 메뉴 전환으로 간주합니다.`?.`는 **옵셔널 체이닝**으로 `v.view` 또는 `v.from`이 없을 경우 에러 없이 `false`를 반환하게 합니다.

```jsx
const getMostFrequentTransition = (userInfo) => {
  const map = {};
  userInfo.forEach(user => {
    user.views.forEach(v => {
      if (v.view?.startsWith("menu") && v.from?.startsWith("menu")) {
        const key = `${v.from}->${v.view}`;
        map[key] = (map[key] || 0) + 1;
      }
    });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
};
```

### **`getMenu2SaveToMainCount`**

“지난 일주일 동안 메뉴2 마지막 화면에서 값을 저장하고 <메인 화면>으로 이동한 횟수는 몇 번인가”에 대한 구현을 진행하였습니다. 메뉴 2 화면에서 사용자가 값을 저장(save: true) 하고, 메인 화면(main)에서 진입한 경우가 며칠 간 총 몇 번 있었는지를 계산합니다.

`user.views` 배열에서 다음 조건을 모두 만족하는 요소들만 필터링합니다:

1. `v.view === "menu2"`: 메뉴2 화면이어야 하고,
2. `v.save === true`: 저장(save) 동작이 수행돼야 하며,
3. `v.from === "main"`: 메인 화면에서 메뉴2로 진입해야 합니다.

→ 이 조건을 만족하는 항목의 개수를 `length`로 구해서 `acc`에 누적합니다.

```jsx
const getMenu2SaveToMainCount = (userInfo) => {
  return userInfo.reduce((acc, user) => (
    acc + user.views.filter(v => v.view === "menu2" && v.save && v.from === "main").length
  ), 0);
};
```

### **`getMenu3ToggleUserCount`**

“하루 동안 메뉴3 마지막화면에서 ON/OFF 설정을 선택한 사용자는 몇 명인가”에 대한 구현을 진행하였습니다. 하루 동안 menu3의 마지막 화면에서 “on” 또는 “off”를 선택한 고유 사용자 수(중복 제거)를 구합니다.

```jsx
const getMenu3ToggleUserCount = (userInfo, targetDateStr) => {
  const users = new Set();
  userInfo.forEach(user => {
    if (user.timeStamp.some(ts => ts.startsWith(targetDateStr))) {
      if (user.views.some(v => v.view === "menu3" && ["on", "off"].includes(v["on/off"]))) {
        users.add(user.id);
      }
    }
  });
  return users.size;
};
```

### **`getLeastViewedScreen`**

“최근 일주일 기간에 가장 화면 노출이 적은 화면은 어느 화면인가”에 대한 구현을 진행하였습니다. `userInfo`  데이터 배열을 바탕으로 각 화면 (view)이 얼마나 자주 등장했는 지 집계하여, 가장 적은 횟수로 노출된 화면을 찾아 반환합니다. 

```jsx
const getLeastViewedScreen = (userInfo) => {
  const count = {};
  userInfo.forEach(user => {
    user.views.forEach(v => {
      count[v.view] = (count[v.view] || 0) + (v.count || 1);
    });
  });
  return Object.entries(count).sort((a, b) => a[1] - b[1])[0]?.[0] || null;
};

```

---

### 후기

문제를 읽고 과제를 하며 문제에 대한 이해가 부족했던 탓인지, 웹으로 구현하진 않지만 마치 웹처럼 하는.. 그럼 느낌이라고 생각이 들어 CLI 형태로 구현을  몇시간 가량 진행하다 문득 아닌 거 같단 생각에 문제를 곱씹으며 읽다 보니 저의 접근 방향이 잘못된 것을 하고 다시 진행하였습니다. 앞으로는 문제를 잘 읽고 이해하는 부분에도 신경을 써야겠네요.. 매 문제마다 항상 느끼지만 부족한 거 같습니다.

이번 미션에서는 되게 포괄적으로? 확장성을 고려하며 진행하며 좋을 거 같단 생각에 주어진 기능만 구현하긴 보단 나중에 내가 이 메서드들을 재활용하여 하면 보다 좋은 코드가 나올 것이라고 생각을 중점으로 진행하였습니다. 

추가적으로 여러 내장 함수들과 키워드에 대해 많이 알 수 있었던 거 같습니다.