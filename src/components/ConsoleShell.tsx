import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Smartphone, Monitor, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface ConsoleShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDpadPress?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onButtonPress?: (button: 'A' | 'B' | 'X' | 'Y' | 'home') => void;
}

export default function ConsoleShell({
  children,
  activeTab,
  setActiveTab,
  onDpadPress,
  onButtonPress
}: ConsoleShellProps) {
  const { isMuted, toggleMute, playSound } = useSound();
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false); // false = Handheld, true = Docked/Full Screen
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update real clock and simple simulated battery drain
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);

    // Simple random battery logic
    setBatteryLevel(94 + Math.floor(Math.random() * 6));

    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener to make it completely playable
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting inputs/textareas
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        playSound('tick');
        if (onDpadPress) onDpadPress('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        playSound('tick');
        if (onDpadPress) onDpadPress('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        playSound('tick');
        if (onDpadPress) onDpadPress('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        playSound('tick');
        if (onDpadPress) onDpadPress('right');
      } else if (e.key.toLowerCase() === 'a' || e.key === 'Enter') {
        playSound('select');
        if (onButtonPress) onButtonPress('A');
      } else if (e.key.toLowerCase() === 'b' || e.key === 'Backspace' || e.key === 'Escape') {
        playSound('back');
        if (onButtonPress) onButtonPress('B');
      } else if (e.key.toLowerCase() === 'x') {
        playSound('tick');
        if (onButtonPress) onButtonPress('X');
      } else if (e.key.toLowerCase() === 'y') {
        playSound('tick');
        if (onButtonPress) onButtonPress('Y');
      } else if (e.key.toLowerCase() === 'h') {
        playSound('powerup');
        setActiveTab('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDpadPress, onButtonPress, playSound, setActiveTab]);

  const handlePhysicalDpad = (direction: 'up' | 'down' | 'left' | 'right') => {
    playSound('tick');
    if (onDpadPress) onDpadPress(direction);
  };

  const handlePhysicalButton = (button: 'A' | 'B' | 'X' | 'Y' | 'home') => {
    if (button === 'A') playSound('select');
    else if (button === 'B') playSound('back');
    else if (button === 'home') {
      playSound('powerup');
      setActiveTab('home');
    } else {
      playSound('tick');
    }
    if (onButtonPress) onButtonPress(button);
  };

  return (
    <div id="console_wrap" className="w-full min-h-screen bg-[#ededf2] text-zinc-800 flex flex-col items-center justify-center p-2 md:p-6 transition-all duration-300 font-sans">
      
      {/* Top Console Bar / Quick Utilities */}
      <div className="w-full max-w-5xl mb-3 flex justify-between items-center px-4 py-1 text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-600 font-bold font-sans">ONLINE </span>
          </div>
          <span className="hidden sm:inline text-zinc-350">|</span>
          <span className="hidden sm:inline text-zinc-400">Connected</span>
        </div>

        {/* Quick Instructions & Sound Switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-zinc-400 mr-2 text-[10px]">
            <kbd className="px-1.5 py-0.5 bg-white text-zinc-650 rounded border border-zinc-250 shadow-sm font-sans font-bold">▲▼◀▶</kbd> D-Pad
            <kbd className="px-1.5 py-0.5 bg-white text-zinc-650 rounded border border-zinc-250 shadow-sm font-sans font-bold">Enter / A</kbd> Select
            <kbd className="px-1.5 py-0.5 bg-white text-zinc-650 rounded border border-zinc-250 shadow-sm font-sans font-bold">Esc / B</kbd> Back
            <kbd className="px-1.5 py-0.5 bg-white text-zinc-650 rounded border border-zinc-250 shadow-sm font-sans font-bold">H</kbd> Home
          </div>
          
          {/* Audio Chime Mute Selector */}
          <button 
            id="mute_toggle"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer border transition-all shadow-sm ${
              isMuted ? 'bg-rose-50/60 border-rose-200 text-rose-600' : 'bg-indigo-50/60 border-indigo-200 text-indigo-600'
            }`}
            title="소리 켜기/끄기"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-sans font-bold">{isMuted ? 'Sound OFF' : 'Sound ON'}</span>
          </button>

          {/* Mode Switcher: Desktop TV Dock vs Portable Handheld */}
          <button 
            id="view_toggle"
            onClick={() => {
              playSound('tick');
              setIsFullscreenMode(!isFullscreenMode);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer bg-white border border-zinc-250 hover:bg-zinc-50 text-zinc-700 transition shadow-sm font-bold"
            title="콘솔 모드 전환 (휴대기기 모드 / 독 TV 모드)"
          >
            {isFullscreenMode ? <Smartphone className="w-3.5 h-3.5 text-sky-500" /> : <Monitor className="w-3.5 h-3.5 text-amber-500" />}
            <span className="text-[10px] font-sans">{isFullscreenMode ? '휴대 모드' : 'TV 독 모드'}</span>
          </button>
        </div>
      </div>

      {/* Main interactive chassis */}
      <div className={`w-full max-w-6xl transition-all duration-500 ${
        isFullscreenMode ? 'max-w-4xl' : 'grid grid-cols-1 xl:grid-cols-[140px_1fr_140px] items-stretch gap-1 xl:gap-0'
      }`}>
        
        {/* === LEFT JOY-CON (Chalk White) === */}
        {!isFullscreenMode && (
          <div id="joycon_left" className="hidden xl:flex flex-col justify-between items-center p-4 bg-[#f8f9fa] text-zinc-800 rounded-l-3xl border-y-4 border-l-4 border-zinc-300 shadow-[inset_-6px_6px_10px_rgba(255,255,255,1.0),-4px_4px_8px_rgba(0,0,0,0.06)] relative overflow-hidden select-none">
            {/* Gloss Highlight */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
            
            {/* Top L and ZL Buttons */}
            <div className="w-full flex justify-between px-2 pt-1 z-10">
              <button 
                onClick={() => handlePhysicalButton('Y')}
                className="w-10 h-7 bg-zinc-250 active:bg-zinc-350 hover:bg-zinc-300 rounded-lg border border-zinc-350 text-[10px] font-bold flex items-center justify-center cursor-pointer shadow-sm transform active:translate-y-0.5 text-zinc-600"
              >
                ZL
              </button>
              <button 
                onClick={() => {
                  playSound('tick');
                  // Move tab left
                  const tabs = ['home', 'blog', 'vibeapps', 'training'];
                  const currentIndex = tabs.indexOf(activeTab);
                  const nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                  setActiveTab(tabs[nextIndex]);
                }}
                className="w-10 h-7 bg-zinc-250 active:bg-zinc-350 hover:bg-zinc-300 rounded-lg border border-zinc-350 text-[10px] font-bold flex items-center justify-center cursor-pointer shadow-sm transform active:translate-y-0.5 text-zinc-600"
              >
                L
              </button>
            </div>

            {/* Minus Button */}
            <div className="pt-2 z-10 self-end mr-2">
              <button 
                onClick={() => playSound('tick')}
                className="w-5 h-1.5 bg-zinc-350 hover:bg-zinc-450 rounded cursor-pointer transform active:scale-90"
              ></button>
            </div>

            {/* Joystick */}
            <div className="my-6 z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-200 border-2 border-zinc-300 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner transform hover:scale-102 transition">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-250 shadow-md"></div>
              </div>
            </div>

            {/* Physical D-Pad (Up, Down, Left, Right buttons) */}
            <div className="grid grid-cols-3 gap-1.5 w-24 aspect-square items-center justify-items-center z-10 my-4">
              <div></div>
              <button 
                onClick={() => handlePhysicalDpad('up')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400 flex items-center justify-center cursor-pointer border border-zinc-300 shadow-sm transform active:translate-y-0.5"
              >
                <ChevronUp className="w-3.5 h-3.5 text-zinc-650" />
              </button>
              <div></div>

              <button 
                onClick={() => handlePhysicalDpad('left')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400 flex items-center justify-center cursor-pointer border border-zinc-300 shadow-sm transform active:translate-x-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-zinc-650" />
              </button>
              <div className="w-6 h-6 rounded-full bg-zinc-300 border border-zinc-200 shadow-inner"></div>
              <button 
                onClick={() => handlePhysicalDpad('right')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400 flex items-center justify-center cursor-pointer border border-zinc-300 shadow-sm transform active:-translate-x-0.5"
              >
                <ChevronRight className="w-3.5 h-3.5 text-zinc-650" />
              </button>

              <div></div>
              <button 
                onClick={() => handlePhysicalDpad('down')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400 flex items-center justify-center cursor-pointer border border-zinc-300 shadow-sm transform active:-translate-y-0.5"
              >
                <ChevronDown className="w-3.5 h-3.5 text-zinc-650" />
              </button>
              <div></div>
            </div>

            {/* Square Screenshot Capture Button */}
            <button 
              onClick={() => {
                playSound('tick');
                alert('📸 화면이 캡처되었습니다! (기본 시뮬레이션)');
              }}
              className="w-6 h-6 bg-zinc-200 active:bg-zinc-300 hover:bg-zinc-250 rounded border border-zinc-300 cursor-pointer shadow-sm z-10 mt-2"
              title="스크린샷 촬영"
            ></button>
          </div>
        ) }

        {/* === SCREEN (The TV or Embedded Terminal) === */}
        <div id="console_screen_bezel" className={`bg-[#e4e4e9] p-2 md:p-3 xl:p-4 text-zinc-800 border-4 md:border-8 border-[#2d2d30] shadow-xl flex flex-col relative overflow-hidden ${
          isFullscreenMode 
            ? 'rounded-2xl border-zinc-300 shadow-[0_15px_30px_rgba(0,0,0,0.15)]' 
            : 'xl:rounded-none'
        }`}>
          {/* Inner Glare / Retro overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20"></div>

          {/* Screen Top-Bar OS Panel */}
          <div className="w-full flex justify-between items-center px-4 py-2 border-b border-zinc-250 bg-[#e4e4e9] text-xs font-semibold select-none z-10 text-zinc-700">
            {/* Left Info: System Status with active theme styling */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-zinc-300 shadow-sm rounded font-black font-mono tracking-wider text-rose-600">
                history_.p v1.0
              </span>
              <div className="hidden md:flex items-center gap-1 text-zinc-500">
                <span className="w-1.5 h-3 bg-sky-500 inline-block rounded-sm"></span>
                <span className="w-1.5 h-2 bg-sky-500 inline-block rounded-sm"></span>
                <span className="w-1.5 h-1.5 bg-sky-500 inline-block rounded-sm text-zinc-350"></span>
                <span className="font-bold">GNE-5G</span>
              </div>
            </div>

            {/* Center Info: Main Current Tab Display */}
            <div className="hidden sm:block text-zinc-700 font-mono text-[10px] uppercase font-black tracking-widest text-center px-2.5 py-1 bg-white border border-zinc-250 max-w-xs truncate rounded-full shadow-sm">
              {activeTab === 'home' ? '🕹️ HOME MENU' : ''}
              {activeTab === 'blog' ? '📚 LESSON JOURNAL' : ''}
              {activeTab === 'vibeapps' ? '💾 VIBE APPLICATIONS' : ''}
              {activeTab === 'training' ? '📝 TRAINING RESOURCES' : ''}
              {activeTab === 'admin' ? '🛡️ ADMIN DESK' : ''}
            </div>

            {/* Right Info: Real-time clock & Battery display */}
            <div className="flex items-center gap-3.5">
              <span className="font-mono text-zinc-800 tracking-wider text-sm font-bold">{currentTime || '12:00'}</span>
              
              <div className="flex items-center gap-1 text-zinc-600">
                <span className="font-mono text-[10px] font-bold text-zinc-600">{batteryLevel}%</span>
                <div className="w-6 h-3 bg-zinc-150 border border-zinc-300 rounded-sm p-0.5 flex relative">
                  <div 
                    className="h-full bg-emerald-500 rounded-2sm transition-all"
                    style={{ width: `${batteryLevel}%` }}
                  ></div>
                  <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1 h-1 bg-zinc-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Client application content slot */}
          <div className="flex-1 bg-white text-zinc-800 rounded-b-xl overflow-y-auto p-3 md:p-5 relative min-h-[500px] max-h-[720px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
            {children}
          </div>
        </div>

        {/* === RIGHT JOY-CON (Chalk White) === */}
        {!isFullscreenMode && (
          <div id="joycon_right" className="hidden xl:flex flex-col justify-between items-center p-4 bg-[#f8f9fa] text-zinc-800 rounded-r-3xl border-y-4 border-r-4 border-zinc-300 shadow-[inset_-6px_6px_10px_rgba(255,255,255,1.0),4px_4px_8px_rgba(0,0,0,0.06)] relative overflow-hidden select-none">
            {/* Gloss Highlight */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

            {/* Top R and ZR Buttons */}
            <div className="w-full flex justify-between px-2 pt-1 z-10">
              <button 
                onClick={() => {
                  playSound('tick');
                  // Move tab right
                  const tabs = ['home', 'blog', 'vibeapps', 'training'];
                  const currentIndex = tabs.indexOf(activeTab);
                  const nextIndex = (currentIndex + 1) % tabs.length;
                  setActiveTab(tabs[nextIndex]);
                }}
                className="w-10 h-7 bg-zinc-250 active:bg-zinc-350 hover:bg-zinc-300 rounded-lg border border-zinc-350 text-[10px] font-bold flex items-center justify-center cursor-pointer shadow-sm transform active:translate-y-0.5 text-zinc-600"
              >
                R
              </button>
              <button 
                onClick={() => handlePhysicalButton('X')}
                className="w-10 h-7 bg-zinc-250 active:bg-zinc-350 hover:bg-zinc-300 rounded-lg border border-zinc-350 text-[10px] font-bold flex items-center justify-center cursor-pointer shadow-sm transform active:translate-y-0.5 text-zinc-600"
              >
                ZR
              </button>
            </div>

            {/* Plus Button */}
            <div className="pt-2 z-10 self-start ml-2">
              <button 
                onClick={() => playSound('tick')}
                className="w-5 h-5 bg-zinc-300 flex items-center justify-center rounded-full text-zinc-700 text-sm font-black cursor-pointer leading-none hover:bg-zinc-400 active:scale-90 shadow-sm"
              >
                +
              </button>
            </div>

            {/* Action Buttons ABCX (Tactile circle game UI buttons) */}
            <div className="grid grid-cols-3 gap-1.5 w-24 aspect-square items-center justify-items-center z-10 my-4 relative">
              {/* Button X (Top) */}
              <div></div>
              <button 
                onClick={() => handlePhysicalButton('X')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-350 hover:text-blue-700 active:bg-zinc-400 flex items-center justify-center font-black text-blue-600 text-xs cursor-pointer border border-zinc-300 shadow-sm transform active:translate-y-0.5"
              >
                X
              </button>
              <div></div>

              {/* Button Y (Left) & Button A (Right) */}
              <button 
                onClick={() => handlePhysicalButton('Y')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-350 hover:text-amber-600 active:bg-zinc-400 flex items-center justify-center font-black text-amber-500 text-xs cursor-pointer border border-zinc-300 shadow-sm transform active:translate-x-0.5"
              >
                Y
              </button>
              <div className="w-5 h-5 text-[7px] font-black text-rose-500 flex items-center justify-center select-none bg-rose-50 rounded-full border border-rose-100">
                OK
              </div>
              <button 
                onClick={() => handlePhysicalButton('A')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-350 hover:text-emerald-700 active:bg-zinc-400 flex items-center justify-center font-black text-emerald-500 text-xs cursor-pointer border border-zinc-300 shadow-sm transform active:-translate-x-0.5"
              >
                A
              </button>

              {/* Button B (Bottom) */}
              <div></div>
              <button 
                onClick={() => handlePhysicalButton('B')}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-350 hover:text-red-700 active:bg-zinc-400 flex items-center justify-center font-black text-red-500 text-xs cursor-pointer border border-zinc-300 shadow-sm transform active:-translate-y-0.5"
              >
                B
              </button>
              <div></div>
            </div>

            {/* Joystick */}
            <div className="my-6 z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-200 border-2 border-zinc-300 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner transform hover:scale-102 transition">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-250 shadow-md"></div>
              </div>
            </div>

            {/* Home Menu Button (Black Circle) */}
            <button 
              onClick={() => handlePhysicalButton('home')}
              className="w-7 h-7 bg-zinc-100 hover:scale-105 rounded-full border-2 border-zinc-300 shadow-sm z-10 flex items-center justify-center group active:scale-95 cursor-pointer"
              title="홈으로 가기"
            >
              <div className="w-4 h-4 rounded-full bg-zinc-350 group-active:bg-zinc-450 shadow-inner"></div>
            </button>
          </div>
        )}

      </div>

      {/* Outer Instructions / Footer */}
      <p className="mt-4 text-[11px] text-zinc-550 font-mono tracking-tight text-center max-w-md bg-white/60 p-2.5 border border-zinc-200 shadow-sm rounded-xl">
        💻 데스크탑 사용자는 키보드 <kbd className="px-1.5 py-0.5 bg-zinc-150 text-zinc-700 rounded border border-zinc-250 font-sans shadow-sm font-bold">방향키</kbd>로 선택하고, <kbd className="px-1.5 py-0.5 bg-zinc-150 text-zinc-700 rounded border border-zinc-250 font-sans shadow-sm font-bold">Enter</kbd>로 메뉴를 여는 완전한 게임기 패드 조작이 지원됩니다!
      </p>

    </div>
  );
}
