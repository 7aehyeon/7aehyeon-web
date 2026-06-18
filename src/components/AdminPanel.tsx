import React, { useState } from 'react';
import { ArrowLeft, Shield, Check, Lock, AlertTriangle, Eye, EyeOff, Save, Plus, Trash2, Code, FileCode2, Copy, Cpu, Library } from 'lucide-react';
import { BlogPost, WebAppProject, RPGStats, AppConfig } from '../types';
import { useSound } from '../hooks/useSound';
import { getGASCodeSnippet } from '../lib/store';

interface AdminPanelProps {
  posts: BlogPost[];
  projects: WebAppProject[];
  rpgStats: RPGStats;
  config: AppConfig;
  onSavePosts: (posts: BlogPost[]) => void;
  onSaveProjects: (projects: WebAppProject[]) => void;
  onSaveRPGStats: (stats: RPGStats) => void;
  onSaveConfig: (config: AppConfig) => void;
  onBack: () => void;
}

export default function AdminPanel({
  posts,
  projects,
  rpgStats,
  config,
  onSavePosts,
  onSaveProjects,
  onSaveRPGStats,
  onSaveConfig,
  onBack
}: AdminPanelProps) {
  const { playSound } = useSound();

  // Custom toast notification states to replace default window.alerts
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
    }, 3000);
    setToastTimeoutId(id);
  };
  
  // Local override of window.alert to render as beautiful custom Toast popup
  const alert = (message: string) => {
    triggerToast(message);
  };

  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);

  // Administrative Panel internal states (for edits)
  const [tempConfig, setTempConfig] = useState<AppConfig>({ ...config });
  const [tempRpg, setTempRpg] = useState<RPGStats>({ ...rpgStats });
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostCategory, setNewPostCategory] = useState<string>(config.customCategories?.[0] || '수업 이야기');
  const [newPostTags, setNewPostTags] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  // States for webapps (projects) management
  const [newProjTitle, setNewProjTitle] = useState<string>('');
  const [newProjDesc, setNewProjDesc] = useState<string>('');
  const [newProjUrl, setNewProjUrl] = useState<string>('');
  const [newProjGithub, setNewProjGithub] = useState<string>('');
  const [newProjIsVibeApp, setNewProjIsVibeApp] = useState<boolean>(true);
  const [newProjTags, setNewProjTags] = useState<string>('');

  // States for training posts management
  const [newTrainingTitle, setNewTrainingTitle] = useState<string>('');
  const [newTrainingContent, setNewTrainingContent] = useState<string>('');
  const [newTrainingTags, setNewTrainingTags] = useState<string>('');

  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'boards' | 'vibeapps' | 'training_posts' | 'rpg' | 'credentials' | 'gas'>('posts');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Password Unlock verification
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === config.adminPasswordHash) {
      playSound('powerup');
      setIsUnlocked(true);
      setLoginError(false);
      // Synchronize edit fields
      setTempConfig({ ...config });
      setTempRpg({ ...rpgStats });
    } else {
      playSound('error');
      setLoginError(true);
      setIsUnlocked(false);
    }
  };

  // Administration Configuration Saves
  const handleSaveConfigCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(tempConfig);
    playSound('save');
    alert('🔐 관리 환경 설정 및 비밀번호가 성공적으로 업데이트되었습니다!');
  };

  const handleSaveCharacterStats = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRPGStats(tempRpg);
    playSound('save');
    alert('🧙 마도사 능력치 및 클래스 카드가 저장되었습니다!');
  };

  // Post CRUD
  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      playSound('error');
      return;
    }

    const tagsArr = newPostTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const newPost: BlogPost = {
      id: `post_${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      tags: tagsArr,
      createdAt: new Date().toISOString(),
      comments: []
    };

    const updated = [newPost, ...posts];
    onSavePosts(updated);
    playSound('save');

    // Reset fields
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    alert('📚 새로운 강의/개인 블로그 포스트가 업로드되었습니다!');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('🗑️ 정말로 이 게시포스트를 완전히 삭제하시겠습니까?')) {
      const updated = posts.filter(p => p.id !== id);
      onSavePosts(updated);
      playSound('back');
      alert('포스트가 성공적으로 삭제되었습니다.');
    }
  };

  // WebAppProject CRUDS
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) {
      playSound('error');
      return;
    }

    const tagsArr = newProjTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const newProject: WebAppProject = {
      id: `proj_${Date.now()}`,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      url: newProjUrl.trim() || undefined,
      githubUrl: newProjGithub.trim() || undefined,
      isVibeApp: newProjIsVibeApp,
      tags: tagsArr
    };

    const updated = [newProject, ...projects];
    onSaveProjects(updated);
    playSound('save');

    // Reset fields
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjUrl('');
    setNewProjGithub('');
    setNewProjIsVibeApp(true);
    setNewProjTags('');
    alert('💾 새로운 바이브코딩 앱이 등록되었습니다!');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('🗑️ 정말로 이 바이브코딩 앱을 완전히 삭제하시겠습니까?')) {
      const updated = projects.filter(p => p.id !== id);
      onSaveProjects(updated);
      playSound('back');
      alert('앱이 성공적으로 삭제되었습니다.');
    }
  };

  // Helper Training Resource Post addition
  const handleAddTrainingPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainingTitle.trim() || !newTrainingContent.trim()) {
      playSound('error');
      return;
    }

    const tagsArr = newTrainingTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const newPost: BlogPost = {
      id: `post_${Date.now()}`,
      title: newTrainingTitle.trim(),
      content: newTrainingContent.trim(),
      category: '연수 자료',
      tags: tagsArr,
      createdAt: new Date().toISOString(),
      comments: []
    };

    const updated = [newPost, ...posts];
    onSavePosts(updated);
    playSound('save');

    // Reset
    setNewTrainingTitle('');
    setNewTrainingContent('');
    setNewTrainingTags('');
    alert('📝 새로운 연수 자료가 성공적으로 등록 발행되었습니다!');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const currentCats = tempConfig.customCategories || ['수업 이야기', '코드 연구실', '아이디어'];
    if (currentCats.includes(newCategoryName.trim())) {
      playSound('error');
      alert('이미 존재하는 게시판 이름입니다.');
      return;
    }
    const updatedCats = [...currentCats, newCategoryName.trim()];
    const updatedConfig = { ...tempConfig, customCategories: updatedCats };
    setTempConfig(updatedConfig);
    onSaveConfig(updatedConfig);
    playSound('save');
    setNewCategoryName('');
    alert(`📋 '${newCategoryName.trim()}' 게시판이 성공적으로 추가되었습니다!`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (confirm(`🗑 '${catToDelete}' 게시판을 완전히 삭제하시겠습니까?\n이 게시판으로 분류된 글들은 삭제되지 않지만 분류가 비게 됩니다.`)) {
      const currentCats = tempConfig.customCategories || ['수업 이야기', '코드 연구실', '아이디어'];
      const updatedCats = currentCats.filter(c => c !== catToDelete);
      const updatedConfig = { ...tempConfig, customCategories: updatedCats };
      setTempConfig(updatedConfig);
      onSaveConfig(updatedConfig);
      playSound('back');
      alert('게시판이 정상적으로 삭제되었습니다.');
    }
  };

  const handleCopyGAS = () => {
    navigator.clipboard.writeText(getGASCodeSnippet());
    playSound('save');
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div id="admin_module" className="flex flex-col gap-6 text-zinc-800 font-sans">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 select-none">
        <button 
          onClick={() => {
            playSound('back');
            onBack();
          }}
          className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-3.5 py-1.5 rounded-full cursor-pointer border border-zinc-250 font-bold shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> B-BACK (홈으로)
        </button>
        <span className="text-xs font-mono font-black text-rose-600">ADMINISTRATIVE_CONTROL_OS</span>
      </div>

      {!isUnlocked ? (
        /* === PASSWORD GATE LOCK SCREEN === */
        <div id="password_lock_screen" className="max-w-md mx-auto w-full bg-white p-6 md:p-8 rounded-3xl border-2 border-rose-500/30 flex flex-col items-center shadow-lg relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/5 to-transparent pointer-events-none"></div>

          <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-300 flex items-center justify-center text-rose-500 mb-4 animate-pulse">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-black tracking-tight text-zinc-800 text-center">ADMIN SYSTEM LOCKED</h3>
          <p className="text-xs text-zinc-500 text-center mt-1.5 max-w-xs leading-relaxed">
            관리자 모드는 오로지 관리 비밀번호 인증을 통해서만 접속할 수 있습니다.
          </p>

          <form onSubmit={handleUnlockSubmit} className="w-full mt-6 flex flex-col gap-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="마스터 암호 키 패스워드"
                className="w-full bg-zinc-50 border border-zinc-250 rounded-xl px-4 py-3 pr-11 text-sm text-zinc-750 outline-none focus:border-rose-500 focus:bg-white transition-all font-mono text-center tracking-widest uppercase font-bold shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <div className="flex items-center gap-1.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-650 text-xs font-bold leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>비밀번호가 불일치합니다! 리셋이나 시도를 다시 해보세요.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 border-b-4 border-rose-700 transform active:translate-y-0.5 cursor-pointer shadow-xs transition-all"
            >
              진입하기 (A)
            </button>
          </form>
        
        </div>
      ) : (
        /* === FULL ADMINISTRATOR CONTROL DASHBOARD === */
        <div id="unlocked_admin" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sub menu Navigation bar */}
          <div className="lg:col-span-3 flex flex-col gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-950 shadow select-none">
            <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest px-2 mb-2">SYSTEM OPTIONS</span>
            
            <button
              onClick={() => { playSound('tick'); setActiveSubTab('posts'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'posts' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              📚 수업 기록 게시물 관리
            </button>

            <button
              onClick={() => { playSound('tick'); setActiveSubTab('training_posts'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'training_posts' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              📝 연수 자료 게시물 관리
            </button>

            <button
              onClick={() => { playSound('tick'); setActiveSubTab('vibeapps'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'vibeapps' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              💾 바이브코딩 앱 관리
            </button>

            <button
              onClick={() => { playSound('tick'); setActiveSubTab('boards'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'boards' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              📋 수업기록 분류 추가/관리
            </button>
            
            <button
              onClick={() => { playSound('tick'); setActiveSubTab('rpg'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'rpg' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              🧙 RPG 캐릭터 정보 수정
            </button>

            <button
              onClick={() => { playSound('tick'); setActiveSubTab('credentials'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'credentials' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              🔐 비밀번호 및 깃허브 설정
            </button>

            <button
              onClick={() => { playSound('tick'); setActiveSubTab('gas'); }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                activeSubTab === 'gas' 
                  ? 'bg-rose-550/15 border-rose-500/30 text-rose-400' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              ⚙ 구글 GAS 가이드 시트
            </button>

            <div className="border-t border-slate-900 mt-4 pt-3 text-center">
              <button 
                onClick={() => {
                  playSound('back');
                  setIsUnlocked(false);
                  setPasswordInput('');
                }}
                className="px-4 py-1.5 bg-rose-950/40 text-rose-450 hover:bg-rose-950/80 border border-rose-500/30 font-bold text-[10.5px] rounded-lg cursor-pointer transition"
              >
                🔒 관리자 로그아웃
              </button>
            </div>
          </div>

          {/* Sub menu details */}
          <div className="lg:col-span-9 bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
            
            {/* 1. Blog Post CRUD interface */}
            {activeSubTab === 'posts' && (
              <div className="flex flex-col gap-6">
                
                {/* Upload New post form */}
                <form onSubmit={handleAddBlogPost} className="flex flex-col gap-4 border-b border-rose-950/20 pb-6">
                  <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-rose-500" /> UPLOAD NEW LECTURE ARTICLE (새글 업로드하기)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mt-2">
                    {/* Title */}
                    <div className="sm:col-span-8 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">포스트 제목</label>
                      <input
                        type="text"
                        required
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="포스트의 고유한 학업/코드 제목"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                    {/* Category */}
                    <div className="sm:col-span-4 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">분류 카테고리</label>
                      <select
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-rose-500 transition-colors cursor-pointer font-bold"
                      >
                        {(config.customCategories || ['수업 이야기', '코드 연구실', '아이디어']).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">태그 검색용 (콤마로 구분)</label>
                    <input
                      type="text"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                      placeholder="React, GAS, Automation, 수업자료"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  {/* Content body */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">내용 텍스트 (줄바꿈 지원)</label>
                    <textarea
                      required
                      rows={5}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="블로그에 업로드할 내용을 자유롭게 기고해 보세요."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors resize-none font-sans"
                    ></textarea>
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    className="self-end px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all shadow border-b-2 border-rose-800"
                  >
                    <Check className="w-3.5 h-3.5" /> 블로그 등록 발행 (A)
                  </button>
                </form>

                {/* Existing Posts Listing for Deletion */}
                <div>
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest mb-3">
                    🗑️ ACTIVE ARTICLES LIST (업로드된 글 관리)
                  </h4>

                  <div className="flex flex-col gap-2 bg-slate-900/50 p-2 border border-slate-900 rounded-xl max-h-52 overflow-y-auto">
                    {posts.length === 0 ? (
                      <span className="text-slate-600 text-xs p-3 text-center block font-semibold italic">등록한 글이 없습니다.</span>
                    ) : (
                      posts.map(post => (
                        <div key={post.id} className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-850 rounded-lg hover:border-slate-800 transition">
                          <div className="flex-1 truncate pr-4">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase mr-1.5">[{post.category}]</span>
                            <span className="text-xs font-bold text-slate-200">{post.title}</span>
                          </div>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 px-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] font-black tracking-tight"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 1-A. Training Resource Post CRUD interface */}
            {activeSubTab === 'training_posts' && (
              <div className="flex flex-col gap-6">
                
                {/* Upload New training post form */}
                <form onSubmit={handleAddTrainingPost} className="flex flex-col gap-4 border-b border-rose-955/20 pb-6">
                  <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-rose-500" /> UPLOAD NEW TRAINING RESOURCE (새 연수 자료 등록하기)
                  </h4>

                  <div className="flex flex-col gap-1 mt-2 font-sans">
                    <label className="text-[10px] font-bold text-slate-400">연수 자료 제목</label>
                    <input
                      type="text"
                      required
                      value={newTrainingTitle}
                      onChange={(e) => setNewTrainingTitle(e.target.value)}
                      placeholder="예: 2026 에듀테크 연수 가이드, 인공지능 업무 지침"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-1 font-sans">
                    <label className="text-[10px] font-bold text-slate-400">태그 (콤마로 구분)</label>
                    <input
                      type="text"
                      value={newTrainingTags}
                      onChange={(e) => setNewTrainingTags(e.target.value)}
                      placeholder="에듀테크, 스마트러닝, 연수, 가이드"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  {/* Content body */}
                  <div className="flex flex-col gap-1 font-sans">
                    <label className="text-[10px] font-bold text-slate-400">내용 텍스트 (줄바꿈 지원)</label>
                    <textarea
                      required
                      rows={5}
                      value={newTrainingContent}
                      onChange={(e) => setNewTrainingContent(e.target.value)}
                      placeholder="연수 자료 내용을 기술해 주세요."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors resize-none font-sans"
                    ></textarea>
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    className="self-end px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all shadow border-b-2 border-rose-800"
                  >
                    <Check className="w-3.5 h-3.5" /> 연수 자료 발행 (A)
                  </button>
                </form>

                {/* Existing Training Posts Listing for Deletion */}
                <div className="font-sans">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest mb-3">
                    🗑️ ACTIVE TRAINING RESOURCES LIST (업로드된 연수 자료 관리)
                  </h4>

                  <div className="flex flex-col gap-2 bg-slate-900/50 p-2 border border-slate-900 rounded-xl max-h-52 overflow-y-auto">
                    {posts.filter(p => p.category === '연수 자료').length === 0 ? (
                      <span className="text-slate-600 text-xs p-3 text-center block font-semibold italic">등록한 연수 자료 문서가 없습니다.</span>
                    ) : (
                      posts.filter(p => p.category === '연수 자료').map(post => (
                        <div key={post.id} className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-850 rounded-lg hover:border-slate-800 transition">
                          <div className="flex-1 truncate pr-4">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase mr-1.5">[연수 자료]</span>
                            <span className="text-xs font-bold text-slate-200">{post.title}</span>
                          </div>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 px-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] font-black tracking-tight cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 1-V. WebApp Showcase Projects CRUDS */}
            {activeSubTab === 'vibeapps' && (
              <div className="flex flex-col gap-6">
                
                {/* Upload New Project application */}
                <form onSubmit={handleAddProject} className="flex flex-col gap-4 border-b border-rose-955/20 pb-6">
                  <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-rose-500" /> REGISTER NEW VIBE APP / PROJECT (새로운 바이브코딩 앱/프로젝트 등록)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mt-2 font-sans">
                    {/* Title */}
                    <div className="sm:col-span-8 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">앱 이름 / 프로젝트 제목</label>
                      <input
                        type="text"
                        required
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="예: 실시간 전력 사용량 분석기"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                    {/* VibeApp or Standard Project */}
                    <div className="sm:col-span-4 flex flex-col gap-1 select-none">
                      <label className="text-[10px] font-bold text-slate-400">분류 타겟</label>
                      <div className="flex items-center gap-2 h-full mt-1.5">
                        <input
                          type="checkbox"
                          id="is_vibe_app_check"
                          checked={newProjIsVibeApp}
                          onChange={(e) => setNewProjIsVibeApp(e.target.checked)}
                          className="w-4 h-4 rounded text-rose-505 bg-slate-950 border-slate-800 cursor-pointer accent-rose-500"
                        />
                        <label htmlFor="is_vibe_app_check" className="text-xs font-bold text-slate-350 cursor-pointer">✨ Vibe App으로 정규 지정</label>
                      </div>
                    </div>
                  </div>

                  {/* URLs & Repo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">데모 실행 주소 (선택)</label>
                      <input
                        type="url"
                        value={newProjUrl}
                        onChange={(e) => setNewProjUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/..."
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-205 outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400">깃허브 리포지토리/코드 주소 (선택)</label>
                      <input
                        type="url"
                        value={newProjGithub}
                        onChange={(e) => setNewProjGithub(e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-205 outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1 font-sans">
                    <label className="text-[10px] font-bold text-slate-400">앱 한 줄 및 내용 설명</label>
                    <textarea
                      required
                      rows={3}
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="인공지능과 스프레드시트로 구현된 웹 기반 실시간 보고서 분석 시스템..."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors resize-none font-sans"
                    ></textarea>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-col gap-1 font-sans">
                    <label className="text-[10px] font-bold text-slate-400">해시 태그 (콤마로 구분)</label>
                    <input
                      type="text"
                      value={newProjTags}
                      onChange={(e) => setNewProjTags(e.target.value)}
                      placeholder="GAS, Tailwind, React, Excel"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    className="self-end px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all border-b-2 border-rose-800"
                  >
                    <Check className="w-3.5 h-3.5" /> 신규 어플리케이션 추가 (A)
                  </button>
                </form>

                {/* Existing Webapp projects listed */}
                <div className="font-sans">
                  <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest mb-3 select-none">
                    💾 ACTIVE APPLICATIONS SHOWCASE (현재 전시된 앱 목록)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-72 overflow-y-auto p-1 bg-slate-900/40 rounded-xl border border-slate-900">
                    {projects.length === 0 ? (
                      <span className="text-slate-600 text-xs p-3 text-center col-span-2 block font-semibold italic">등록한 프로젝트가 존재하지 않습니다.</span>
                    ) : (
                      projects.map(proj => (
                        <div key={proj.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-start hover:border-slate-800 transition">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-sm border uppercase ${
                                proj.isVibeApp ? 'border-emerald-700 bg-emerald-900/20 text-emerald-400' : 'border-indigo-700 bg-indigo-900/20 text-indigo-400'
                              }`}>
                                {proj.isVibeApp ? 'VIBE APP' : 'PROJECT'}
                              </span>
                              <h5 className="text-xs font-black text-slate-200 truncate">{proj.title}</h5>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-normal">{proj.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1 px-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] font-black tracking-tight cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 1-B. Dynamic Board/Category management */}
            {activeSubTab === 'boards' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Plus className="w-4 h-4 text-rose-500" /> CREATE NEW BOARD CATEGORY (새로운 게시판/카테고리 추가)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                    블로그에서 글을 작성하고 분류할 새로운 종류의 게시판을 원할 때 아래에서 자유롭게 추가 및 관리하십시오. 추가된 게시판은 글 작성 화면과 블로그의 필터 탭에 즉각 반영됩니다.
                  </p>
                </div>

                {/* Add new board form */}
                <div className="flex gap-2 items-end bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
                  <div className="flex-1 flex flex-col gap-1 font-sans">
                    <label className="text-[10px] font-bold text-slate-400">추가할 게시판 이름</label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="예시: 2026학년도 학업 자료실, Vibe 연구"
                      maxLength={20}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-205 outline-none focus:border-rose-500 transition-colors font-sans font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs rounded border-b-2 border-rose-800 hover:translate-y-[1px] active:translate-y-[2px] transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> 추가 (A)
                  </button>
                </div>

                {/* Categories lists display */}
                <div className="flex flex-col gap-3 font-sans">
                  <h5 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                    📋 ACTIVE BOARDS LIST (현재 개설된 게시판 목록)
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(tempConfig.customCategories || ['수업 이야기', '코드 연구실', '아이디어']).map((cat) => (
                      <div 
                        key={cat} 
                        className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="text-xs font-bold text-slate-200">{cat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg cursor-pointer transition border border-transparent hover:border-rose-500/20"
                          title="게시판 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Character RPG elements adjustment */}
            {activeSubTab === 'rpg' && (
              <form onSubmit={handleSaveCharacterStats} className="flex flex-col gap-4">
                <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest select-none">
                  ⚔ RPG STATS & BIO CONFIGURATION (RPG 캐릭터 스탯과 약력 조절)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">마도사 이름</label>
                    <input
                      type="text"
                      required
                      value={tempRpg.name}
                      onChange={(e) => setTempRpg({ ...tempRpg, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">클래스 타이틀 이름</label>
                    <input
                      type="text"
                      required
                      value={tempRpg.classTitle}
                      onChange={(e) => setTempRpg({ ...tempRpg, classTitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Level / HP / MP */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">현재 레벨 (LV)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={99}
                      value={tempRpg.level}
                      onChange={(e) => setTempRpg({ ...tempRpg, level: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">최대 체력 (HP)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={999}
                      value={tempRpg.maxHp}
                      onChange={(e) => setTempRpg({ ...tempRpg, maxHp: parseInt(e.target.value) || 150, hp: parseInt(e.target.value) || 150 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400">최대 주파 수 (MP)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={999}
                      value={tempRpg.maxMp}
                      onChange={(e) => setTempRpg({ ...tempRpg, maxMp: parseInt(e.target.value) || 80, mp: parseInt(e.target.value) || 80 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Bio text */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400">자기소개 한 줄 카드 약력</label>
                  <textarea
                    required
                    rows={3}
                    value={tempRpg.bio}
                    onChange={(e) => setTempRpg({ ...tempRpg, bio: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors resize-none font-sans"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="self-end px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all shadow border-b-2 border-rose-800 select-none"
                >
                  <Save className="w-3.5 h-3.5" /> 스탯 설정 저장 (A)
                </button>
              </form>
            )}

            {/* 3. Password Settings / Config adjustments */}
            {activeSubTab === 'credentials' && (
              <form onSubmit={handleSaveConfigCredentials} className="flex flex-col gap-4">
                <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest select-none">
                  🛡 SECURITY KEY & ID CONFIGURATION (비밀번호와 연동 환경 설정)
                </h4>

                <div className="flex flex-col gap-4 mt-2">
                  {/* Master password reset */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">어드민 전용 접속 마스터 비밀번호</label>
                    <input
                      type="text"
                      required
                      value={tempConfig.adminPasswordHash}
                      onChange={(e) => setTempConfig({ ...tempConfig, adminPasswordHash: e.target.value })}
                      placeholder="비밀번호 설정"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors"
                    />
                    <p className="text-[9.5px] text-slate-500 mt-1 font-sans">비밀번호를 바꾼 후에는 오직 바뀐 암호로만 관리자 화면에 접근이 가능하며, 1-B-클릭으로 리셋하지 않는 한 저장됩니다.</p>
                  </div>

                  {/* GitHub ID reset */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">연동할 GitHub Username 아이디</label>
                    <input
                      type="text"
                      required
                      value={tempConfig.githubUsername}
                      onChange={(e) => setTempConfig({ ...tempConfig, githubUsername: e.target.value })}
                      placeholder="GitHub 아이디 (예: 7aehyeon-01)"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-300 outline-none focus:border-rose-500 transition-colors"
                    />
                    <p className="text-[9.5px] text-slate-500 mt-1 font-sans">설정한 아이디의 공개 Repository를 Applications_Center에서 실시간 스캔해 NES 팩으로 랜더링합니다.</p>
                  </div>

                  {/* Google GAS Webapp sync URL */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Google Apps Script (GAS) 웹앱 발행 URL</label>
                    <input
                      type="url"
                      value={tempConfig.gasWebappUrl}
                      onChange={(e) => setTempConfig({ ...tempConfig, gasWebappUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-slate-300 outline-none focus:border-rose-500 transition-colors"
                    />
                    <p className="text-[9.5px] text-slate-500 mt-1 font-sans">구글 GAS 웹앱과 연동하여 데이터를 시트와 동기화할 수 있도록 설정합니다. (실제 연결용 주소 입력)</p>
                  </div>

                  {/* Custom Help Popup Text */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">사용자 정의 HELP(설명서) 문구 작성</label>
                    <textarea
                      rows={5}
                      value={tempConfig.helpPopupText || ''}
                      onChange={(e) => setTempConfig({ ...tempConfig, helpPopupText: e.target.value })}
                      placeholder="HELP 버튼을 클릭했을 때 보여줄 팝업 내용 글을 작성해 주세요."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-rose-500 transition-colors font-sans"
                    ></textarea>
                    <p className="text-[9.5px] text-slate-500 mt-1 font-sans">대시보드 하단의 HELP 버튼을 누르면 이 설정에서 수정한 문구로 팝업에 나타납니다.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="self-end px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all shadow border-b-2 border-rose-800 select-none"
                >
                  <Save className="w-3.5 h-3.5" /> 보안 설정 변경 저장 (A)
                </button>
              </form>
            )}

            {/* 4. Google Apps Script (GAS) spreadsheet integration setup tutorial */}
            {activeSubTab === 'gas' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-mono font-black text-rose-500 uppercase tracking-widest select-none">
                  ⚙️ GOOGLE APPS SCRIPT (GAS) SPREADSHEET DATABASE INTEGRATION
                </h4>

                <div className="text-xs text-slate-400 leading-relaxed font-sans font-medium flex flex-col gap-3">
                  <p>
                    구글 드라이브의 스프레드시트를 실시간 백엔드로 연결하고 구글 Apps Script(GAS)를 통해 CRUD 데이터를 연동하는 명쾌한 가이드라인입니다.
                  </p>

                  <div className="bg-slate-900/50 p-4 border border-slate-900 rounded-xl">
                    <h5 className="font-bold text-slate-200 text-xs mb-1">🛠 연결 동구축 조작법 (3단계)</h5>
                    <ol className="list-decimal pl-4 mt-1 flex flex-col gap-1 font-medium font-sans">
                      <li>구글 드라이브에서 <strong>스프레드시트</strong>를 새롭게 생성합니다.</li>
                      <li>시트 상단 메뉴에서 <strong>확장 프로그램 ➔ Apps Script</strong>를 틀어 엽니다.</li>
                      <li>하단 코드를 그대로 복사하고 붙여 넣은 뒤, <strong>배포 ➔ 새 배포(웹앱 ➔ 전원 액세스 권한)</strong>로 URL 주소를 따옵니다.</li>
                    </ol>
                  </div>

                  {/* GAS code container with click copying feedback */}
                  <div className="relative border border-slate-850 bg-slate-950 rounded-xl overflow-hidden mt-2 select-text">
                    <div className="absolute top-2.5 right-2.5 z-10 select-none">
                      <button 
                        onClick={handleCopyGAS}
                        className="p-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold font-mono text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSnippet ? 'COPIED!' : 'COPY CODE'}
                      </button>
                    </div>

                    <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-850 flex items-center gap-1.5 select-none text-[10px] font-mono text-slate-400 uppercase font-bold">
                      <FileCode2 className="w-3.5 h-3.5 text-sky-400" /> code.gs (Google Apps Script Engine)
                    </div>

                    <pre className="p-4 overflow-x-auto text-[10.5px] font-mono text-slate-400 leading-relaxed max-h-56 bg-slate-950/80 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent select-text">
                      {getGASCodeSnippet()}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Fancy Floating Nintendo/RPG Toast Alert Panel */}
      <div 
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none transition-all duration-300 transform ${
          toastVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-4 scale-95'
        }`}
      >
        <div className="bg-zinc-900 border border-amber-400 font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm pointer-events-auto select-none">
          <span className="text-amber-400 text-sm">✨</span>
          <span className="text-xs font-sans tracking-tight text-white">{toastMessage}</span>
        </div>
      </div>

    </div>
  );
}
