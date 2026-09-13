import React from 'react';
import { SecurityModule, InteractiveLab, UserStats, NavTab } from '../types';
import { Shield, Play, ArrowRight, CheckCircle, Lock, Flame, Terminal, AlertTriangle, Zap, BarChart3, Award } from 'lucide-react';

interface DashboardProps {
  userStats: UserStats;
  modules: SecurityModule[];
  labs: InteractiveLab[];
  onSelectTab: (tab: NavTab) => void;
  onSelectModule: (module: SecurityModule) => void;
  onLaunchLab: (lab: InteractiveLab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userStats,
  modules,
  labs,
  onSelectTab,
  onSelectModule,
  onLaunchLab
}) => {
  const activeModule = modules.find(m => m.status === 'IN_PROGRESS') || modules[0];
  const activeLab = labs[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-2xl">
        {/* Glowing Background Accent */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-sky-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>{userStats.streakDays} DAY ATTACK STREAK</span>
              <span className="text-slate-500">•</span>
              <span>XP MULTIPLIER 1.25x</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-sky-400 font-mono">Infiltrator</span>.
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              You have <span className="text-sky-300 font-semibold">3 active modules</span> pending review. System security analysis suggests focusing on <span className="text-emerald-400 font-semibold">Network Scanning & Web Pentesting</span> labs this week.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => activeLab && onLaunchLab(activeLab)}
                className="px-5 py-2.5 bg-sky-500 text-slate-950 font-bold rounded-lg text-sm hover:bg-sky-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.4)] cursor-pointer"
              >
                <Play size={16} className="fill-current" />
                Continue Session
              </button>

              <button
                onClick={() => onSelectTab('modules')}
                className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                View Roadmap
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Active Challenge Widget */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 w-full lg:w-80 shrink-0 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                DAILY CHALLENGE
              </span>
              <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                +150 XP
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-white mb-1">Nmap SYN Stealth Probe</div>
              <div className="text-xs text-slate-400">Discover all open TCP ports on 10.10.14.88 using minimal packet footprint.</div>
            </div>

            <button
              onClick={() => activeLab && onLaunchLab(activeLab)}
              className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-mono font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal size={14} />
              Launch Terminal Sandbox
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield size={20} className="text-sky-400" />
            Core Learning Modules
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Select a module to review lessons and launch hands-on threat sandboxes.</p>
        </div>

        <button
          onClick={() => onSelectTab('modules')}
          className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline cursor-pointer"
        >
          View All Modules ({modules.length})
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Dashboard Modules Grid (3 Main Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.slice(0, 3).map(mod => {
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className={`glass-panel p-5 rounded-xl border border-white/10 hover:border-sky-500/40 transition-all cursor-pointer group flex flex-col justify-between ${
                mod.status === 'IN_PROGRESS' ? 'ring-1 ring-sky-500/30 bg-white/[0.06]' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-xl border border-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.15)] group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>

                  {mod.status === 'COMPLETED' && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2 py-1 rounded">
                      COMPLETED
                    </span>
                  )}

                  {mod.status === 'IN_PROGRESS' && (
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-400/10 border border-sky-500/20 px-2 py-1 rounded">
                      IN PROGRESS
                    </span>
                  )}

                  {mod.status === 'LOCKED' && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/5 border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                      <Lock size={10} />
                      LOCKED
                    </span>
                  )}

                  {mod.status === 'NOT_STARTED' && (
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
                      NOT STARTED
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-sky-400 transition-colors mb-1.5">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {mod.description}
                </p>
              </div>

              <div>
                {mod.status === 'IN_PROGRESS' ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Progress</span>
                      <span className="text-sky-400 font-bold">{mod.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)] transition-all duration-300"
                        style={{ width: `${mod.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ) : mod.status === 'LOCKED' ? (
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    Prereq: {mod.prerequisite || 'Complete previous level'}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                    <span>{mod.lessonsCount} Lessons</span>
                    <span>•</span>
                    <span>{mod.labsCount} Labs</span>
                    <span>•</span>
                    <span className="text-amber-400">{mod.xpReward} XP</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section (Frosted Glass Style from Metadata Prompt) */}
      <div className="glass-panel border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full md:w-auto">
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-mono tracking-widest mb-1">
              Threat Score
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center gap-2">
              {userStats.threatScore}
              <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+18</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-slate-500 font-mono tracking-widest mb-1">
              Labs Pwned
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {userStats.labsPwned}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-slate-500 font-mono tracking-widest mb-1">
              Global Rank
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-sky-400">
              #{userStats.rank}
            </div>
          </div>
        </div>

        {/* Activity Bar Chart Visualizer */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-200 font-mono">Weekly Attack Activity</div>
            <div className="text-[10px] text-slate-400 font-mono">7 Sessions Logged</div>
          </div>

          <div className="h-14 w-48 bg-slate-900/60 rounded-lg border border-white/10 flex items-center justify-center p-3">
            <div className="flex gap-2 items-end h-full w-full justify-around">
              <div className="w-2 bg-sky-500/40 rounded-sm hover:bg-sky-400 transition-colors" style={{ height: '40%' }} title="Mon: 30m"></div>
              <div className="w-2 bg-sky-500/60 rounded-sm hover:bg-sky-400 transition-colors" style={{ height: '70%' }} title="Tue: 1h 15m"></div>
              <div className="w-2 bg-sky-500/30 rounded-sm hover:bg-sky-400 transition-colors" style={{ height: '25%' }} title="Wed: 20m"></div>
              <div className="w-2 bg-sky-500/50 rounded-sm hover:bg-sky-400 transition-colors" style={{ height: '55%' }} title="Thu: 45m"></div>
              <div className="w-2 bg-sky-500 rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.8)] hover:bg-sky-300 transition-colors" style={{ height: '95%' }} title="Fri: 2h 10m"></div>
              <div className="w-2 bg-sky-500/40 rounded-sm hover:bg-sky-400 transition-colors" style={{ height: '45%' }} title="Sat: 35m"></div>
              <div className="w-2 bg-emerald-400 rounded-sm shadow-[0_0_8px_rgba(52,211,153,0.8)] hover:bg-emerald-300 transition-colors" style={{ height: '80%' }} title="Sun: 1h 40m"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="glass-panel border border-white/10 rounded-xl p-6">
        <h3 className="font-mono text-sm font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-sky-400" />
          RECENT AUDIT TRAILS & ACTIVITY
        </h3>

        <div className="space-y-3">
          {userStats.recentActivity.map(act => (
            <div
              key={act.id}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(14,165,233,0.8)]"></div>
                <span className="text-slate-200 font-medium">{act.action}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono">
                <span>{act.timestamp}</span>
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  +{act.xpEarned} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
