import React from 'react';
import { ArrowLeft, Cpu, Github, ExternalLink } from 'lucide-react';
import { WebAppProject } from '../types';
import { useSound } from '../hooks/useSound';

interface AppShowcaseProps {
  projects: WebAppProject[];
  githubUsername: string;
  onBack: () => void;
}

export default function AppShowcase({ projects, onBack }: AppShowcaseProps) {
  const { playSound } = useSound();

  return (
    <div id="showcase_view" className="flex flex-col gap-6 text-zinc-800 font-sans">
      
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
        <span className="text-xs font-mono font-black text-emerald-600">APPLICATIONS_CENTER.SYS</span>
      </div>

      {/* 1. Core Vibe Apps Introduction Section */}
      <div>
        <h3 className="text-xs font-mono font-black text-zinc-550 tracking-widest uppercase mb-4 flex items-center gap-2 select-none">
          <Cpu className="w-4 h-4 text-emerald-500" /> CREATED RETRO WEbAPPS (나의 바이브코딩 앱들)
        </h3>

        <div id="apps_grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(proj => (
            <div 
              key={proj.id}
              className={`p-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between gap-4 ${
                proj.isVibeApp ? 'border-emerald-300 bg-emerald-50/20' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start select-none">
                  <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase border ${
                    proj.isVibeApp 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  }`}>
                    {proj.isVibeApp ? '✨ Vibe App' : '📦 Project'}
                  </span>
                </div>

                <h4 className="text-base font-black text-zinc-805 mt-2.5 tracking-tight">{proj.title}</h4>
                <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed font-sans font-medium">{proj.description}</p>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5 select-none">
                  {proj.tags.map(t => (
                    <span key={t} className="text-[9.5px] font-mono font-black px-1.5 py-0.2 bg-zinc-100 border border-zinc-200 rounded text-zinc-500">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Anchors */}
                <div className="flex gap-2 text-[10.5px] font-bold font-mono">
                  {proj.url && (
                    <a 
                      href={proj.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded text-zinc-650 hover:text-zinc-900 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3 h-3" /> DEMO
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a 
                      href={proj.githubUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded text-zinc-650 hover:text-zinc-900 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Github className="w-3 h-3 text-zinc-500" /> REPO
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
