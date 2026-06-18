import React, { useState } from 'react';
import { User, Library, Cpu, Shield, Github, Sliders, HelpCircle, Power, Swords, Heart, Zap, Award } from 'lucide-react';
import { RPGStats, AppConfig } from '../types';
import { useSound } from '../hooks/useSound';

interface HomeMenuProps {
  rpgStats: RPGStats;
  selectedCardIdx: number;
  setSelectedCardIdx: (idx: number) => void;
  onEnterCard: (tab: string) => void;
  config: AppConfig;
}

export default function HomeMenu({
  rpgStats,
  selectedCardIdx,
  setSelectedCardIdx,
  onEnterCard,
  config
}: HomeMenuProps) {
  const { playSound } = useSound();

  // Mini RPG Battle Simulator state (directly inside home)
  const [battleMode, setBattleMode] = useState<boolean>(false);
  const [playerHp, setPlayerHp] = useState<number>(150);
  const [playerMp, setPlayerMp] = useState<number>(80);
  const [monsterHp, setMonsterHp] = useState<number>(200);
  const [monsterMaxHp] = useState<number>(200);
  const [battleLogs, setBattleLogs] = useState<string[]>([
    "👾 야생의 [버그 몬스터]가 나타났다!",
    "🧙 조태현(Vibe Mage)은 전투 태세를 취합니다!"
  ]);
  const [isBattleOver, setIsBattleOver] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);

  const startBattle = () => {
    playSound('powerup');
    setPlayerHp(150);
    setPlayerMp(80);
    setMonsterHp(200);
    setBattleLogs([
      "👾 야생의 [버그 몬스터]가 나타났다!",
      "🧙 조태현(Vibe Mage)은 전투 태세를 취합니다!"
    ]);
    setIsBattleOver(false);
    setBattleResult(null);
    setBattleMode(true);
  };

  const handlePlayerAttack = (action: 'gas' | 'prompt' | 'refactor') => {
    if (isBattleOver) return;

    let dmg = 0;
    let cost = 0;
    let actionLog = "";

    if (action === 'gas') {
      cost = 15;
      if (playerMp < cost) {
        playSound('error');
        setBattleLogs((prev) => [...prev, "❌ 마나가 부족하여 초과근무 공격을 시전할 수 없습니다!"]);
        return;
      }
      playSound('select');
      dmg = 45;
      setPlayerMp((prev) => prev - cost);
      actionLog = `🧙 조태현이 [초과근무 공격! 무한 일하기] 기술을 폭발시켰다! (타격치 ${dmg} 데미지!)`;
    } else if (action === 'prompt') {
      cost = 25;
      if (playerMp < cost) {
        playSound('error');
        setBattleLogs((prev) => [...prev, "❌ 마나가 부족하여 노력노력 광선을 발사할 수 없습니다!"]);
        return;
      }
      playSound('select');
      const isCrit = Math.random() < 0.3;
      dmg = isCrit ? 80 : 50;
      setPlayerMp((prev) => prev - cost);
      actionLog = isCrit 
        ? `🔥 CRITICAL HIT! 조태현이 [노력노력 광선 극대화] 기술을 적중시켰다! (치명적 타격치 ${dmg} 데미지!)`
        : `🧙 조태현이 [노력노력 광선]을 발사했다! (타격치 ${dmg} 데미지!)`;
    } else if (action === 'refactor') {
      playSound('tick');
      const heal = 35;
      setPlayerHp((prev) => Math.min(150, prev + heal));
      setPlayerMp((prev) => Math.min(80, prev + 20));
      actionLog = `🛡️ 조태현이 [코딩 보호막]을 가동하여 치유막을 펼쳤다! (체력 +${heal} 회복, 마나 +20 충전!)`;
    }

    const nextMonsterHp = Math.max(0, monsterHp - dmg);
    setMonsterHp(nextMonsterHp);

    if (nextMonsterHp <= 0) {
      playSound('powerup');
      setBattleLogs((prev) => [
        ...prev,
        actionLog,
        "🎉 버그 몬스터가 소멸되고 컴파일에 성공했습니다!",
        "🏆 전투 승리! 경험치를 획득하여 마도사 마스터리에 도달했습니다!"
      ]);
      setIsBattleOver(true);
      setBattleResult('win');
      return;
    }

    setTimeout(() => {
      const monsterAttacks = [
        { name: "NullPointerException", dmg: 20, desc: "Null 크래시 탄막 투하!" },
        { name: "Infinite Re-render", dmg: 35, desc: "무한 리렌더러 루프 광선 발사!" },
        { name: "Merge Conflict", dmg: 15, desc: "브랜치 병합 꼬임 폭발 유발!" }
      ];
      const attack = monsterAttacks[Math.floor(Math.random() * monsterAttacks.length)];
      
      setPlayerHp((prevHp) => {
        const nextPlayerHp = Math.max(0, prevHp - attack.dmg);
        
        setBattleLogs((prevLogs) => [
          ...prevLogs,
          actionLog,
          `👾 버그 몬스터가 흉포한 [${attack.name}]을(를) 시전했다! (조태현에게 -${attack.dmg} 데미지!)`
        ]);

        if (nextPlayerHp <= 0) {
          playSound('error');
          setIsBattleOver(true);
          setBattleResult('lose');
          setBattleLogs((prev) => [...prev, "💀 조태현의 버퍼가 고갈되었습니다... 컴파일 에러 발생!"]);
        }
        return nextPlayerHp;
      });
    }, 600);
  };

  // Modules list: Exactly 3 select software cartridges
  const cards = [
    {
      id: 'blog',
      title: 'Lessons.rom',
      subtitle: '수업 기록 게시판',
      description: '다양한 수업 후기, 지식 나눔 및 강좌 정보 자료실',
      icon: <Library className="w-10 h-10 text-amber-500 animate-pulse" />,
      tag: 'BLOG MODULE',
      borderColor: 'border-amber-300',
      bgColor: 'from-amber-50/40 to-white',
    },
    {
      id: 'vibeapps',
      title: 'VibeApps.sys',
      subtitle: '바이브코딩 모음 게시판',
      description: '박선생이 제작한 웹앱 모음전',
      icon: <Cpu className="w-10 h-10 text-emerald-500" />,
      tag: 'SYS UTILITIES',
      borderColor: 'border-emerald-300',
      bgColor: 'from-emerald-50/40 to-white',
    },
    {
      id: 'training',
      title: 'Training.rom',
      subtitle: '연수 자료 모음 게시판',
      description: '교원 연수 등 자료 모음집',
      icon: <Library className="w-10 h-10 text-rose-500 animate-pulse" />,
      tag: 'TRAINING MODULE',
      borderColor: 'border-rose-300',
      bgColor: 'from-rose-50/40 to-white',
    }
  ];

  return (
    <div id="home_container" className="flex flex-col h-full gap-6 py-2 select-none">
      
      {/* 2-Column Main Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* LEFT COLUMN: Embedded Interactive RPG Profile Sheet */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase font-black px-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> USER CHARACTER STATUS
          </h3>

          <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-200 flex flex-col gap-4 relative shadow-sm">
            
            {battleMode ? (
              /* === embedded battle screen === */
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-[10px] font-mono font-black text-rose-600 tracking-widest uppercase">BATTLE FIELD</span>
                  <button 
                    onClick={() => { playSound('back'); setBattleMode(false); }}
                    className="text-[9px] bg-zinc-200 border border-zinc-350 hover:bg-zinc-250 text-zinc-700 px-2 py-0.5 rounded cursor-pointer font-bold transition shadow-xs"
                  >
                    🚪 퇴각
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200 shadow-xs">
                    <span className="text-[10px] font-bold text-zinc-700 block">🧙 {rpgStats.name}</span>
                    <div className="w-full h-2 bg-zinc-100 rounded-sm overflow-hidden p-[1px] mt-1.5 flex border border-zinc-200">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(playerHp / 150) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[8.5px] font-mono text-zinc-500 mt-1 font-bold">
                      <span>HP: {playerHp}/150</span>
                      <span>MP: {playerMp}/80</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-zinc-200 shadow-xs">
                    <span className="text-[10px] font-bold text-rose-600 block">👾 버그 몬스터</span>
                    <div className="w-full h-2 bg-zinc-100 rounded-sm overflow-hidden p-[1px] mt-1.5 flex border border-zinc-200">
                      <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(monsterHp / monsterMaxHp) * 100}%` }}></div>
                    </div>
                    <div className="text-[8.5px] font-mono text-zinc-500 mt-1 font-bold">
                      <span>HP: {monsterHp}/{monsterMaxHp}</span>
                    </div>
                  </div>
                </div>

                {/* mini logs */}
                <div className="bg-zinc-100 border border-zinc-250 rounded p-2 h-24 overflow-y-auto font-mono text-[10.5px] text-zinc-700 flex flex-col gap-1 select-text">
                  {battleLogs.map((log, i) => (
                    <div key={i} className="border-b border-zinc-200/40 pb-0.5">{log}</div>
                  ))}
                </div>

                {/* Battle commands */}
                <div className="flex gap-1.5 justify-end">
                  {isBattleOver ? (
                    <button 
                      onClick={startBattle}
                      className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black rounded border-b-2 border-sky-800 cursor-pointer shadow-sm transition"
                    >
                      🔄 다시 도전하기
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => handlePlayerAttack('gas')}
                        className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-[9.5px] font-black rounded border-b-2 border-sky-700 cursor-pointer shadow-sm"
                        title="초과근무 공격"
                      >
                        ⚡ 초과근무 (MP 15)
                      </button>
                      <button 
                        onClick={() => handlePlayerAttack('prompt')}
                        className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-[9.5px] font-black rounded border-b-2 border-amber-700 cursor-pointer shadow-sm"
                        title="노력노력 광선"
                      >
                        🔥 노력광선 (MP 25)
                      </button>
                      <button 
                        onClick={() => handlePlayerAttack('refactor')}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[9.5px] font-black rounded border-b-2 border-emerald-700 cursor-pointer shadow-sm"
                        title="코딩 보호막 가동"
                      >
                        🛡️ 코딩 보호막
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* === classic profile card detail === */
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-[2px] border border-zinc-200 flex items-center justify-center font-sans text-3xl shadow-sm shrink-0">
                    🧙
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-base font-black font-sans text-zinc-800 tracking-tight">{rpgStats.name}</h4>
                      <span className="text-[10px] font-mono font-black text-amber-600 bg-white border border-zinc-250 shadow-xs px-1.5 py-0.2 rounded-full">Lv.{rpgStats.level}</span>
                    </div>
                    <p className="text-[11px] text-sky-600 font-mono font-black mt-0.5">{rpgStats.classTitle}</p>
                    
                    {/* Experience Bar */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex-1 h-2 bg-zinc-200 border border-zinc-300 rounded-full overflow-hidden p-[1px] flex">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" 
                          style={{ width: `${(rpgStats.exp / rpgStats.maxExp) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-mono font-black text-zinc-500 shrink-0">EXP {rpgStats.exp}/{rpgStats.maxExp}</span>
                    </div>
                  </div>
                </div>

                {/* Bio약력 */}
                <p className="text-[11px] leading-relaxed text-zinc-600 text-justify font-sans border-t border-zinc-200 pt-3 select-text">
                  {rpgStats.bio}
                </p>

                {/* HP, MP status stats */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-white border border-zinc-200 rounded-xl font-mono text-[10.5px] shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span className="text-zinc-500">HP: <strong className="text-zinc-800">{rpgStats.hp}/{rpgStats.maxHp}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-zinc-500">MP: <strong className="text-zinc-800">{rpgStats.mp}/{rpgStats.maxMp}</strong></span>
                  </div>
                </div>

                {/* Skill stats bar */}
                <div className="flex flex-col gap-2 bg-zinc-50 border border-zinc-200 shadow-xs rounded-xl p-3">
                  <div className="text-[9px] font-mono font-black text-zinc-400 tracking-wider mb-1">SPECIFIC SKILLS</div>
                  {rpgStats.skills.slice(0, 3).map((skill) => (
                    <div key={skill.name} className="flex flex-col text-[10.5px]">
                      <div className="flex justify-between font-bold text-zinc-600">
                        <span>{skill.name}</span>
                        <span className="font-mono text-zinc-400 text-[9.5px]">Lv.{skill.level}/99</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 border border-zinc-250 rounded overflow-hidden p-[0.5px] flex mt-1">
                        <div className="h-full bg-indigo-500 rounded-sm" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Combat initiation button */}
                <button 
                  onClick={startBattle}
                  className="w-full py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-650 hover:to-rose-650 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 border-b-2 border-red-700 cursor-pointer shadow-sm transform hover:translate-y-[1px] active:translate-y-[2px] transition-all"
                >
                  <Swords className="w-3.5 h-3.5" /> 실시간 버그 소탕전 시작 (미니 RPG 게임)
                </button>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Selective Software Cartridges (lessons, projects, admin) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase font-black px-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> CHOOSE SOFTWARE ROMS
          </h3>

          <div id="cartridges_column" className="flex flex-col gap-3.5">
            {cards.map((card, idx) => {
              const isSelected = selectedCardIdx === idx;
              return (
                <div
                  key={card.id}
                  id={`cartridge_${card.id}`}
                  onClick={() => {
                    setSelectedCardIdx(idx);
                    onEnterCard(card.id);
                  }}
                  onMouseEnter={() => setSelectedCardIdx(idx)}
                  className={`relative p-4 rounded-2xl border flex gap-4 transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? `${card.borderColor} bg-gradient-to-r ${card.bgColor} translate-x-1 border-r-4 shadow-md z-10` 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 shadow-xs'
                  }`}
                >
                  {/* Visual Label Tag Ribbon */}
                  <div className="absolute top-3.5 right-3.5 text-[8px] font-mono font-black tracking-widest text-zinc-550 bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-xs uppercase">
                    {card.tag}
                  </div>

                  {/* Card Icon */}
                  <div className="shrink-0 flex items-center justify-center">
                    <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white border border-zinc-200 shadow-sm' : 'bg-zinc-100'} transition-colors`}>
                      {card.icon}
                    </div>
                  </div>

                  {/* Card Main Labels */}
                  <div className="flex-1 min-w-0 pr-16 self-center">
                    <h4 className="text-sm md:text-base font-black text-zinc-800 font-sans tracking-tight">{card.title}</h4>
                    <p className="text-xs font-bold text-zinc-500 mt-0.5">{card.subtitle}</p>
                    <p className="text-[10.5px] font-medium text-zinc-650 mt-1 line-clamp-2 leading-relaxed">{card.description}</p>
                  </div>

                  {/* Action Entry button */}
                  {isSelected && (
                    <div className="absolute bottom-3 right-3 text-[9px] font-black font-mono text-sky-650 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded shadow-xs animate-pulse uppercase">
                      ENTER (A)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Bottom Circle OS Utilities Bar */}
      <div id="quick_circle_utilities" className="border-t border-zinc-250 pt-4 flex items-center justify-between px-2 select-none">
        <div className="flex gap-4">

          {/* Admin settings */}
          <button 
            id="helper_settings"
            onClick={() => { playSound('select'); onEnterCard('admin'); }}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-zinc-250 flex items-center justify-center text-zinc-550 group-hover:bg-zinc-100 group-hover:text-indigo-555 group-hover:scale-105 transition-all shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-black text-zinc-500 group-hover:text-zinc-750 font-bold uppercase">SETTINGS</span>
          </button>

          {/* Guidelines support help */}
          <button 
            id="helper_manual"
            onClick={() => alert(config?.helpPopupText || `🎮 포트폴리오 콘솔 설명서\n\n1. 상단 'SOUND ON' 버튼을 눌러 레트로 전송 사운드를 들을 수 있습니다.\n2. 방향키(Left/Right, Up/Down)를 통해 우측 3가지 메뉴들을 순회하고 Enter로 접속할 수 있습니다.\n3. 관리자 비밀번호 리셋은 [AdminOS] 탭에서 가능하며 기본 패스워드는 '1234' 입니다.\n4. 좌측 캐릭터 프로필 카드에서 실시간으로 버그 몬스터와 RPG 모의 미니 전투를 즐겨 보세요.`)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-zinc-250 flex items-center justify-center text-zinc-550 group-hover:bg-zinc-100 group-hover:text-emerald-555 group-hover:scale-105 transition-all shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-black text-zinc-500 group-hover:text-zinc-750 uppercase">HELP</span>
          </button>
        </div>

        {/* Console physical system spec detail lines */}
        <div className="text-right text-[10px] font-mono text-zinc-400 font-bold">
          <div>PAGE Ver: PJH-001</div>
          <div>제작자: (@history_.p)</div>
        </div>
      </div>

    </div>
  );
}
