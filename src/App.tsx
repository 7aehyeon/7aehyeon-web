import React, { useState, useEffect } from 'react';
import ConsoleShell from './components/ConsoleShell';
import HomeMenu from './components/HomeMenu';
import BlogView from './components/BlogView';
import AppShowcase from './components/AppShowcase';
import AdminPanel from './components/AdminPanel';
import { BlogPost, WebAppProject, RPGStats, AppConfig, Comment } from './types';
import { useSound } from './hooks/useSound';
import {
  getRPGStats,
  saveRPGStats,
  getPosts,
  savePosts,
  getProjects,
  saveProjects,
  getConfig,
  saveConfig
} from './lib/store';

export default function App() {
  const { playSound } = useSound();

  // Primary navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Game pad selected card (0 to 2 for the three main software ROMs)
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);

  // States synchronized with store APIs on mount
  const [rpgStats, setRpgStats] = useState<RPGStats>(() => getRPGStats());
  const [posts, setPosts] = useState<BlogPost[]>(() => getPosts());
  const [projects, setProjects] = useState<WebAppProject[]>(() => getProjects());
  const [config, setConfig] = useState<AppConfig>(() => getConfig());

  // Global toast state for gorgeous console alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastTimeoutId, setToastTimeoutId] = useState<any>(null);

  const triggerToast = (message: string) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setToastMessage(message);
    setToastVisible(true);
    
    const id = setTimeout(() => {
      setToastVisible(false);
    }, 4000);
    setToastTimeoutId(id);
  };

  // Intercept all native alerts and map them to our custom fancy Gamepad UI Toast in-app overlay
  useEffect(() => {
    window.alert = (message: string) => {
      triggerToast(message);
    };
    return () => {
      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
      }
    };
  }, [toastTimeoutId]);

  // Save actions which safely synchronizes local storage state
  const handleSavePosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const handleSaveProjects = (updatedProjects: WebAppProject[]) => {
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const handleSaveRPGStats = (updatedStats: RPGStats) => {
    setRpgStats(updatedStats);
    saveRPGStats(updatedStats);
  };

  const handleSaveConfig = (updatedConfig: AppConfig) => {
    setConfig(updatedConfig);
    saveConfig(updatedConfig);
  };

  const handlePostComment = (postId: string, comment: Comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [comment, ...(post.comments || [])]
        };
      }
      return post;
    });
    handleSavePosts(updatedPosts);
  };

  // Maps physical controller gamepad buttons to app routing
  const handleDpadPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (activeTab === 'home') {
      if (direction === 'left' || direction === 'up') {
        setSelectedCardIdx((prev) => (prev - 1 + 3) % 3);
      } else if (direction === 'right' || direction === 'down') {
        setSelectedCardIdx((prev) => (prev + 1) % 3);
      }
    }
  };

  const handleButtonPress = (button: 'A' | 'B' | 'X' | 'Y' | 'home') => {
    if (activeTab === 'home') {
      if (button === 'A') {
        const tabs = ['blog', 'vibeapps', 'training'];
        setActiveTab(tabs[selectedCardIdx]);
      }
    } else {
      if (button === 'B') {
        // Safe exit current rom back to main board
        setActiveTab('home');
      }
    }
  };

  const handleEnterCard = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <ConsoleShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDpadPress={handleDpadPress}
        onButtonPress={handleButtonPress}
      >
        {/* 1. Home Dashboard Menu (with integrated profile card on left) */}
        {activeTab === 'home' && (
          <HomeMenu
            rpgStats={rpgStats}
            selectedCardIdx={selectedCardIdx}
            setSelectedCardIdx={setSelectedCardIdx}
            onEnterCard={handleEnterCard}
            config={config}
          />
        )}

        {/* 2. Personal Lectures Journal & Blog (수업 기록) */}
        {activeTab === 'blog' && (
          <BlogView
            posts={posts.filter(p => p.category !== '연수 자료')}
            categories={(config.customCategories || ['수업 이야기', '코드 연구실', '아이디어']).filter(c => c !== '연수 자료')}
            onSaveComment={handlePostComment}
            onBack={() => setActiveTab('home')}
            title="수업 기록 게시판"
            subTitle="LES_JOURNAL_LOGS_v1.0"
          />
        )}

        {/* 5. Teacher Training Resources Blog (연수 자료 모음) */}
        {activeTab === 'training' && (
          <BlogView
            posts={posts.filter(p => p.category === '연수 자료')}
            categories={['연수 자료']}
            onSaveComment={handlePostComment}
            onBack={() => setActiveTab('home')}
            title="연수 자료 모음 게시판"
            subTitle="TRAINING_RESOURCES_v1.0"
          />
        )}

        {/* 3. Webapps Showcase & Cartridges ROM Grid (바이브코딩 모음) */}
        {activeTab === 'vibeapps' && (
          <AppShowcase
            projects={projects}
            githubUsername={config.githubUsername}
            onBack={() => setActiveTab('home')}
          />
        )}

        {/* 4. Admin settings configuration Desk (관리자 모드) */}
        {activeTab === 'admin' && (
          <AdminPanel
            posts={posts}
            projects={projects}
            rpgStats={rpgStats}
            config={config}
            onSavePosts={handleSavePosts}
            onSaveProjects={handleSaveProjects}
            onSaveRPGStats={handleSaveRPGStats}
            onSaveConfig={handleSaveConfig}
            onBack={() => setActiveTab('home')}
          />
        )}
      </ConsoleShell>

      {/* Global Fancy Floating Retro Toast Popup Overlay */}
      <div 
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none transition-all duration-300 transform ${
          toastVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-6 scale-95'
        }`}
      >
        <div className="bg-zinc-950 border-2 border-amber-400 font-bold px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm pointer-events-auto select-none">
          <span className="text-amber-400 animate-pulse text-lg">✨</span>
          <p className="text-xs font-sans tracking-tight text-white leading-relaxed">{toastMessage}</p>
        </div>
      </div>
    </>
  );
}
