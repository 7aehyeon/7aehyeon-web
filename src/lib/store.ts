import { BlogPost, WebAppProject, GuestbookEntry, RPGStats, AppConfig } from '../types';

// Pre-seeded contents for instant, beautiful experience
const DEFAULT_RPG_STATS: RPGStats = {
  name: "조태현 (Taehyeon)",
  classTitle: "Vibe Scripting Mage",
  bio: "Google Apps Script(GAS)와 Web Front-end 기술을 결합하여, 복잡한 업무를 자동화하고 독창적인 웹 솔루션을 신속하게 만드는 풀스택 모험가입니다.",
  level: 42,
  exp: 760,
  maxExp: 1000,
  hp: 240,
  maxHp: 240,
  mp: 180,
  maxMp: 180,
  skills: [
    { name: "Google Apps Script", level: 95, category: "gas" },
    { name: "React / TS Core", level: 88, category: "frontend" },
    { name: "Tailwind UI Layouts", level: 92, category: "frontend" },
    { name: "Node.js & Express", level: 80, category: "backend" },
    { name: "Firebase Firestore", level: 85, category: "backend" },
    { name: "Vibe Prompt Magic", level: 99, category: "general" },
  ],
  achievements: [
    { id: "vibe_pioneer", title: "바이브 파이어니어", description: "Vibe coding 방식으로 첫 멀티모듈 레트로 앱 구축 완료", isUnlocked: true },
    { id: "gas_master", title: "GAS 마스터", description: "Google Sheets와 Web App을 연동하여 API 파이프라인 형성", isUnlocked: true },
    { id: "retro_nintendo", title: "64-Bit 레전드", description: "닌텐도 테마 콘솔을 직접 구현하고 8비트 사운드 칩셋 장착", isUnlocked: true },
    { id: "full_deployment", title: "클라우드 챔피언", description: "포트폴리오를 Cloud Run에 배포하고 실시간 연동 성공", isUnlocked: false },
  ]
};

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "post_1",
    title: "Google Apps Script(GAS)와 React 연동을 통한 효율적인 개인 DB 구축하기",
    content: "구글 시트(Google Sheets)를 백엔드 DB로 사용하면 무료이면서도 간편한 관리자 대시보드를 얻는 것과 같습니다.\n\nGAS에서 `doGet()`과 `doPost()` 함수를 트리거하여 REST API처럼 활용할 수 있는데, 여기에 React를 연결하면 멋진 풀스택 웹앱을 순식간에 구현할 수 있습니다.\n\n### GAS 코드 예시:\n```javascript\nfunction doGet(e) {\n  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\n  var data = sheet.getDataRange().getValues();\n  return ContentService.createTextOutput(JSON.stringify(data))\n    .setMimeType(ContentService.MimeType.JSON);\n}\n```\n이렇게 작성하여 배포 기능을 사용하면, 전 세계 어디서든 시트 데이터를 조회하고 삽입할 수 있는 놀라운 서버리스 DB가 완성됩니다! 이 웹사이트의 관리자 페이지에서도 이와 유사한 자동화 안내를 제공하고 있습니다.",
    category: "수업 이야기",
    tags: ["GAS", "GoogleSheets", "Automation", "React"],
    createdAt: "2026-06-15T14:30:00Z",
    comments: [
      { id: "c1", author: "열공학생", avatar: "koopa", content: "수업에서 꼭 한번 다뤄보고 싶던 주제였는데 정리 감사합니다! 코드 복사해서 해보겠습니다.", createdAt: "2026-06-15T16:20:00Z" }
    ]
  },
  {
    id: "post_2",
    title: "AI와 함께하는 Vibe Coding: 개발의 패러다임이 달라지다",
    content: "최근 프롬프트 기반으로 완벽한 UI와 인터랙션을 설계하는 '바이브 코딩(Vibe Coding)'이 기하급수적으로 성장하고 있습니다.\n\n바이브 코딩은 개발 속도를 극한으로 끌어올리는 혁신입니다. 단지 명령어를 던지는 것을 넘어, 의도를 정교하게 조율하고, 최적화된 컴포넌트 단위로 결과물을 병합하는 고도의 기획력이 핵심 역량으로 자리잡고 있습니다.\n\n여러분도 자신만의 아이디어를 즉석에서 코딩해주고 배포하는 웹앱들을 디자인해보세요. 이번 콘솔 사이트 역시 바이브 코딩으로 수십 개 모듈을 유기적으로 엮어 신속히 제작되었습니다.",
    category: "코드 연구실",
    tags: ["VibeCoding", "Gemini", "AI-Development", "NextGen"],
    createdAt: "2026-06-14T09:15:00Z",
    comments: [
      { id: "c2", author: "코딩스타터", avatar: "link", content: "바이브 코딩으로 만든 웹앱 소개 코너 보고 깜짝 놀랐습니다! 인터랙션이 대박이네요.", createdAt: "2026-06-14T11:45:00Z" }
    ]
  },
  {
    id: "post_3",
    title: "이번 학기 강의 및 수업 후기: 인터랙티브 웹 디자인 세션",
    content: "학생들과 레트로 게임기 컨셉의 컴포넌트 레이아웃을 배우는 세션을 가졌습니다.\n\n단순히 모던하고 플랫한 버튼보다, 왜 햅틱 느낌을 자아내는 프레임워크나 누르는 모션, 그리고 8비트 사운드 이펙트가 사용자 경험(UX)에 특별한 '재미'를 부여하는지 몸소 체험하는 수업이었죠.\n\n학생들은 닌텐도 스위치와 게임보이 어드밴스 디자인을 모티브로 삼으며 놀라운 응용력들을 보여주었습니다. 앞으로 더 다이내믹한 기술 주제로 수업 이야기를 확장해 가도록 하겠습니다.",
    category: "아이디어",
    tags: ["WebDesign", "Lesson", "UX", "NintendoTheme"],
    createdAt: "2026-06-10T18:00:00Z",
    comments: []
  }
];

const DEFAULT_PROJECTS: WebAppProject[] = [
  {
    id: "proj_1",
    title: "Vibe Paint & Ambient Sound-Shop",
    description: "사용자가 레트로 그레이드 화판에 픽셀 아트를 그리고, 사운드 시퀀서 패널에서 직접 8비트 노트를 조합해 자신만의 BGM을 믹싱할 수 있는 가상 사운드 아트 워크숍 웹앱.",
    url: "https://example.com/soundspot",
    githubUrl: "https://github.com/7aehyeon-01/vibe-sound-pad",
    isVibeApp: true,
    tags: ["AudioContext", "Canvas", "Tailwind", "Responsive"]
  },
  {
    id: "proj_2",
    title: "GAS Smart Excel Form Automator",
    description: "구글 스프레드시트 템플릿과 GAS 코드를 자동 발행하여, 수백 개의 엑셀 영수증이나 이메일 통지서를 원클릭으로 가공하고 메일 발송하는 마켓 비즈니스 워크플로우 툴.",
    url: "https://example.com/gas-automation",
    githubUrl: "https://github.com/7aehyeon-01/smart-gas-form",
    isVibeApp: true,
    tags: ["GAS", "Google-Auth", "TypeScript", "Automation"]
  },
  {
    id: "proj_3",
    title: "Interactive Nintendo Retro Portfolio",
    description: "우리가 현재 작동시키고 있는 바로 이 닌텐도 디자인 웹앱! 8비트로 인코딩된 주파수 음향과 RPG식 숙련도 캐릭터 시트, 완벽한 포스팅 관리가 포함된 콘솔 포트폴리오 플러스 블로그.",
    url: "https://example.com/retro-console-web",
    githubUrl: "https://github.com/7aehyeon-01/retro-nintendo-portfolio",
    isVibeApp: false,
    tags: ["WebAudio", "Framer-Motion", "LocalStore", "Tailwind"]
  }
];

const DEFAULT_GUESTBOOK: GuestbookEntry[] = [
  {
    id: "g_1",
    name: "마리오 (Mario)",
    avatarId: "mario",
    message: "It's-a-me, Mario! 🍄 정말 굉장한 웹사이트군요! 닌텐도 스위치 UI를 웹 브라우저에서 그대로 사용하는 듯한 착각이 듭니다! 바이브 코딩 실력이 정말 최고예요!",
    createdAt: "2026-06-15T22:05:00Z"
  },
  {
    id: "g_2",
    name: "젤다 (Zelda)",
    avatarId: "zelda",
    message: "지혜의 트라이포스와 함께 이 아름다운 블로그를 축복합니다. 🛡️ 특히 수업 이야기 섹션에서 배울 점이 많아 보여요. 종종 들러서 글 정독하고 가겠습니다.",
    createdAt: "2026-06-15T11:40:00Z"
  },
  {
    id: "g_3",
    name: "커비 (Kirby)",
    avatarId: "kirby",
    message: "포야오! (Poyo!) 🌟 8비트 클릭 소리가 너무 귀여워서 게시글마다 다 눌러보고 있어요! 방명록의 도트 프로필 이미지들도 마음에 쏙 들어요!",
    createdAt: "2026-06-14T19:50:00Z"
  }
];

const DEFAULT_CONFIG: AppConfig = {
  adminPasswordHash: "1234", // Simplified password setup, customizable
  githubUsername: "7aehyeon-01",
  gasWebappUrl: "https://script.google.com/macros/s/AKfycbzexample/exec",
  isFirebaseEnabled: false,
  consoleTheme: 'neon',
  customCategories: ['수업 이야기', '코드 연구실', '아이디어'],
  helpPopupText: "🎮 포트폴리오 콘솔 설명서\n\n1. 상단 'SOUND ON' 버튼을 눌러 레트로 전송 사운드를 들을 수 있습니다.\n2. 방향키(Left/Right, Up/Down)를 통해 우측 3가지 메뉴들을 순회하고 Enter로 접속할 수 있습니다.\n3. 관리자 비밀번호 리셋은 [AdminOS] 탭에서 가능하며 기본 패스워드는 '1234' 입니다.\n4. 좌측 캐릭터 프로필 카드에서 실시간으로 버그 몬스터와 RPG 모의 미니 전투를 즐겨 보세요."
};

// Local storage names
const KEYS = {
  RPG_STATS: 'retro_portal_rpg_stats',
  POSTS: 'retro_portal_posts',
  PROJECTS: 'retro_portal_projects',
  GUESTBOOK: 'retro_portal_guestbook',
  CONFIG: 'retro_portal_config'
};

export function getRPGStats(): RPGStats {
  const data = localStorage.getItem(KEYS.RPG_STATS);
  if (!data) {
    saveRPGStats(DEFAULT_RPG_STATS);
    return DEFAULT_RPG_STATS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_RPG_STATS;
  }
}

export function saveRPGStats(stats: RPGStats): void {
  localStorage.setItem(KEYS.RPG_STATS, JSON.stringify(stats));
}

export function getPosts(): BlogPost[] {
  const data = localStorage.getItem(KEYS.POSTS);
  if (!data) {
    savePosts(DEFAULT_POSTS);
    return DEFAULT_POSTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_POSTS;
  }
}

export function savePosts(posts: BlogPost[]): void {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

export function getProjects(): WebAppProject[] {
  const data = localStorage.getItem(KEYS.PROJECTS);
  if (!data) {
    saveProjects(DEFAULT_PROJECTS);
    return DEFAULT_PROJECTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveProjects(projects: WebAppProject[]): void {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
}

export function getGuestbook(): GuestbookEntry[] {
  const data = localStorage.getItem(KEYS.GUESTBOOK);
  if (!data) {
    saveGuestbook(DEFAULT_GUESTBOOK);
    return DEFAULT_GUESTBOOK;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_GUESTBOOK;
  }
}

export function saveGuestbook(entries: GuestbookEntry[]): void {
  localStorage.setItem(KEYS.GUESTBOOK, JSON.stringify(entries));
}

export function getConfig(): AppConfig {
  const data = localStorage.getItem(KEYS.CONFIG);
  if (!data) {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: AppConfig): void {
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
}

// Google Apps Script payload generator and guide text
export function getGASCodeSnippet(): string {
  return `/**
 * Google Apps Script (GAS) 웹앱용 코드 스니펫
 * 구글 스프레드시트에 저장된 방명록/블로그 데이터를 
 * 본 닌텐도 포트폴리오 웹사이트와 양방향 동기화하기 위한 용도입니다.
 */

function doGet(e) {
  var action = e.parameter.action;
  var sheetName = e.parameter.sheet || "Guestbook";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var data = [];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    data.push(record);
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheetName = payload.sheet || "Guestbook";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (sheetName === "Guestbook") {
      sheet.appendRow([
        payload.id || Utilities.getUuid(),
        payload.name || "Anonymous",
        payload.avatarId || "mario",
        payload.message || "",
        payload.createdAt || new Date().toISOString()
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}`;
}
