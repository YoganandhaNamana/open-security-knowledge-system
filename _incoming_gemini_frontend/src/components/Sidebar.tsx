import React from 'react';
import { NavTab, UserStats } from '../types';
import { LayoutDashboard, Radio, Layers, Terminal, BookOpen, User, Shield, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userStats: UserStats;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userStats,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'learning-journey',
      label: 'Learning Journey',
      icon: <BookOpen size={18} />,
      badge: '8 STAGES'
    },
    {
      id: 'modules',
      label: 'Security Curriculum',
      icon: <Layers size={18} />
    },
    {
      id: 'terminal',
      label: 'Learning Assistant CLI',
      icon: <Terminal size={18} />,
      badge: 'ASSISTANT'
    },
    {
      id: 'labs',
      label: 'Live Sandbox Labs',
      icon: <Radio size={18} />,
      badge: 'LABS'
    },
    {
      id: 'threat-intel',
      label: 'Threat Intelligence',
      icon: <Shield size={18} />,
      badge: 'LIVE'
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge Base',
      icon: <BookOpen size={18} />
    },
    {
      id: 'profile',
      label: 'User & Achievements',
      icon: <User size={18} />
    }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobileSidebar();
  };

  const xpPercentage = Math.min(100, Math.round((userStats.xp / userStats.xpToNextLevel) * 100));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={onCloseMobileSidebar}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col p-6 fixed md:static inset-y-0 left-0 z-50 transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-200 ease-in-out shrink-0`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between mb-8">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center font-mono font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] group-hover:scale-105 transition-transform">
              O
            </div>
            <div>
              <span className="font-mono font-bold tracking-tighter text-lg text-white">
                OSKS // <span className="text-sky-400">CORE</span>
              </span>
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Sec Knowledge
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3 px-3 font-mono">
            Learning Path
          </div>

          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.badge === 'LIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User XP & Level Card (Bottom) */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-white/10 hover:border-sky-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                <Shield size={12} className="text-sky-400" />
                {userStats.username}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden my-2 border border-white/5">
              <div
                className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)] transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>XP {userStats.xp} / {userStats.xpToNextLevel}</span>
              <span className="text-sky-400 font-bold">LVL {userStats.level}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
