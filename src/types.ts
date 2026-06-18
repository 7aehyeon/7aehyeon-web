export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  comments?: Comment[];
}

export interface WebAppProject {
  id: string;
  title: string;
  description: string;
  url?: string;
  githubUrl?: string;
  isVibeApp: boolean;
  tags: string[];
}

export interface GuestbookEntry {
  id: string;
  name: string;
  avatarId: string;
  message: string;
  createdAt: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0 to 99
  category: 'frontend' | 'backend' | 'gas' | 'general';
}

export interface RPGStats {
  name: string;
  classTitle: string;
  bio: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  skills: SkillItem[];
  achievements: {
    id: string;
    title: string;
    description: string;
    isUnlocked: boolean;
  }[];
}

export interface AppConfig {
  adminPasswordHash: string; // MD5/SHA or plain text for easy fallback
  githubUsername: string;
  gasWebappUrl: string;
  isFirebaseEnabled: boolean;
  consoleTheme: 'neon' | 'burgundy' | 'gameboy' | 'coal' | 'classic';
  customCategories?: string[];
  helpPopupText?: string;
}
