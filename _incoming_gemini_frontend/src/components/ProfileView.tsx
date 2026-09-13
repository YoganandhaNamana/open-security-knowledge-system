import React from 'react';
import { UserStats } from '../types';
import { User, Shield, Award, Zap, Trophy, Flame, CheckCircle2, Star, Target, Activity } from 'lucide-react';

interface ProfileViewProps {
  userStats: UserStats;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userStats }) => {
  const badges = [
    { id: 'b1', title: 'First Recon', desc: 'Completed initial port scan on CyberCorp perimeter', icon: '📡', date: 'Jul 2026' },
    { id: 'b2', title: 'Flag Hunter', desc: 'Captured 20+ flags in terminal sandboxes', icon: '🚩', date: 'Jul 2026' },
    { id: 'b3', title: 'OWASP Specialist', desc: 'Passed all Web App Pentesting quizzes', icon: '🌐', date: 'Aug 2026' },
    { id: 'b4', title: '7-Day Attack Streak', desc: 'Maintained active hacking sessions for 7 consecutive days', icon: '🔥', date: 'Aug 2026' }
  ];

  const xpProgress = Math.round((userStats.xp / userStats.xpToNextLevel) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-900 via-slate-800 to-sky-600 border border-sky-500/40 flex items-center justify-center text-2xl font-mono font-bold text-sky-200 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
              RA
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{userStats.username}</h1>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED OPERATIVE
                </span>
              </div>

              <div className="text-xs font-mono text-sky-400 flex items-center gap-2">
                <Shield size={14} />
                <span>{userStats.title}</span>
                <span className="text-slate-500">•</span>
                <span>Global Rank #{userStats.rank}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-center min-w-[100px]">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Threat Score</div>
              <div className="text-xl font-mono font-bold text-white">{userStats.threatScore}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-center min-w-[100px]">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Labs Pwned</div>
              <div className="text-xl font-mono font-bold text-emerald-400">{userStats.labsPwned}</div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300">Level {userStats.level} Progress</span>
            <span className="text-sky-400 font-bold">{userStats.xp} / {userStats.xpToNextLevel} XP ({xpProgress}%)</span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.8)] transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Proficiency Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target size={16} className="text-sky-400" />
            Security Skill Matrix
          </h2>

          <div className="space-y-4">
            {userStats.skills.map(sk => (
              <div key={sk.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">{sk.name}</span>
                  <span className="text-sky-400 font-bold">{sk.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all duration-500"
                    style={{ width: `${sk.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            Earned Badges & Medals ({badges.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map(b => (
              <div key={b.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 hover:border-amber-400/30 transition-all">
                <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {b.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{b.title}</div>
                  <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{b.desc}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">{b.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
