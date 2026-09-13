import React, { useState } from 'react';
import { NavTab, UserStats } from '../types';
import { Search, Bell, Shield, Terminal, Menu, X, Cpu, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  userStats: UserStats;
  onOpenSearch: () => void;
  onSelectTab: (tab: NavTab) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  userStats,
  onOpenSearch,
  onSelectTab,
  onToggleMobileSidebar,
  isMobileSidebarOpen
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const tabPaths: Record<NavTab, string> = {
    'dashboard': '/home/command-center',
    'learning-journey': '/curriculum/learning-journey',
    'modules': '/security/modules-catalog',
    'terminal': '/assistant/learning-cli',
    'labs': '/terminal/live-sandbox',
    'threat-intel': '/intel/live-threat-feed',
    'knowledge-base': '/docs/osks-knowledge',
    'profile': '/user/root_access'
  };

  const notifications = [
    { id: 1, title: 'New CVE Published', desc: 'CVE-2026-21849 Kernel eBPF LPE released', time: '10m ago', unread: true },
    { id: 2, title: 'Lab XP Awarded', desc: '+150 XP for completing Network Recon lab', time: '2h ago', unread: true },
    { id: 3, title: 'System Security Audit', desc: 'Perimeter scan complete. Zero open vulnerable proxies.', time: '1d ago', unread: false }
  ];

  return (
    <header className="h-16 border-b border-white/10 px-4 md:px-8 flex items-center justify-between bg-white/[0.02] backdrop-blur-md sticky top-0 z-30">
      {/* Left side: Mobile menu toggle + Path breadcrumb + System Health */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-xs">
          <Terminal size={14} className="text-sky-400" />
          <span className="text-slate-500">PATH:</span>
          <span className="text-sky-300 font-medium">{tabPaths[activeTab]}</span>
        </div>

        <div className="hidden lg:block h-4 w-px bg-white/10"></div>

        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">SYSTEM_HEALTH:</span> OPTIMAL
        </div>
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-sky-500/30 transition-all text-xs group"
        >
          <Search size={14} className="group-hover:text-sky-400 transition-colors" />
          <span className="hidden md:inline">Search OSKS knowledge or CTRL+K</span>
          <span className="md:hidden">Search</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-slate-300 font-mono">⌘K</kbd>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                  <Shield size={14} className="text-sky-400" />
                  SECURITY NOTIFICATIONS
                </span>
                <span className="text-[10px] text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full font-mono">2 NEW</span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Rank Badge */}
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2.5 p-1 rounded-full border border-sky-500/30 hover:border-sky-400 transition-all bg-slate-900 group"
          title="View Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-900 to-slate-700 flex items-center justify-center font-mono font-bold text-sky-300 text-xs shadow-[0_0_10px_rgba(14,165,233,0.3)]">
            RA
          </div>
          <div className="hidden lg:block text-left pr-2">
            <div className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors">{userStats.username}</div>
            <div className="text-[10px] text-sky-400 font-mono">LVL {userStats.level} • #{userStats.rank}</div>
          </div>
        </button>
      </div>
    </header>
  );
};
