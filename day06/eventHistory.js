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
    timeStamp: ["2025-06-01T13:45:00Z"],
    views: [
      { view: "menu1", scroll: 3, from: "menu2", count: 1 },
      { view: "menu2", value: 10, save: false, action: "push", from: "main", count: 2 },
      { view: "menu3", action1: "push", action2: "push", from: "menu1", "on/off": "on", count: 1 },
      { view: "event", detailView: 2, count: 2 }
    ]
  },
  {
    id: 5,
    timeStamp: ["2025-07-01T15:00:00Z"],
    views: [
      { view: "event", detailView: 5, count: 4 },
      { view: "menu2", value: 99, save: true, action: "push", from: "main", count: 1 },
      { view: "menu3", action1: "push", action2: null, from: "menu2", "on/off": "off", count: 2 }
    ]
  }
];

const getLoginAccessCount = (userInfo, targetDateStr) => {
  return userInfo.filter(user =>
    user.timeStamp.some(ts => ts.startsWith(targetDateStr))
  ).length;
};

const getTopEventAdViewer = (userInfo) => {
  const counts = userInfo.map(user => ({
    id: user.id,
    count: user.views
      .filter(v => v.view === "event")
      .reduce((sum, v) => sum + (v.count || 1), 0)
  }));
  return counts.sort((a, b) => b.count - a.count)[0]?.id || null;
};

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

const getMenu2SaveToMainCount = (userInfo) => {
  return userInfo.reduce((acc, user) => (
    acc + user.views.filter(v => v.view === "menu2" && v.save && v.from === "main").length
  ), 0);
};

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

const getLeastViewedScreen = (userInfo) => {
  const count = {};
  userInfo.forEach(user => {
    user.views.forEach(v => {
      count[v.view] = (count[v.view] || 0) + (v.count || 1);
    });
  });
  return Object.entries(count).sort((a, b) => a[1] - b[1])[0]?.[0] || null;
};


const targetDate = "2025-07-01";

console.log("1. 로그인 화면 접속 수:", getLoginAccessCount(userInfo, targetDate));
console.log("2. 이벤트 광고 최다 시청자:", getTopEventAdViewer(userInfo));
console.log("3. 메인화면 최대 접속 시간:", getMainViewPeakHour(userInfo));
console.log("4. 최다 메뉴 전환:", getMostFrequentTransition(userInfo));
console.log("5. 메뉴2 저장 후 메인 이동 횟수:", getMenu2SaveToMainCount(userInfo));
console.log("6. 메뉴3 ON/OFF 선택 사용자 수:", getMenu3ToggleUserCount(userInfo, targetDate));
console.log("7. 가장 적게 노출된 화면:", getLeastViewedScreen(userInfo));
