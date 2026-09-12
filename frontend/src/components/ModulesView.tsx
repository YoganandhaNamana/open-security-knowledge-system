import React, { useState } from 'react';
import { SecurityModule, ModuleCategory, Difficulty } from '../types';
import { Search, Filter, BookOpen, Lock, CheckCircle, Play, Shield, Award, X, Sparkles, Clock, Target } from 'lucide-react';

interface ModulesViewProps {
  modules: SecurityModule[];
  onSelectModule: (module: SecurityModule) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({ modules, onSelectModule }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalModule, setActiveModalModule] = useState<SecurityModule | null>(null);

  const categories = ['ALL', 'Offensive Security', 'Web Exploitation', 'Reverse Engineering', 'Cloud & DevSecOps', 'Defensive & SOC'];
  const difficulties = ['ALL', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredModules = modules.filter(m => {
    const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || m.difficulty === selectedDifficulty;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-sky-400" />
            Security Knowledge Modules
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Structured hands-on pathways mapped to the MITRE ATT&CK framework and industry penetration testing standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-lg text-sky-300">
          <Sparkles size={14} className="text-sky-400" />
          <span>5 Core Curriculum Pathways</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-4 rounded-xl space-y-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by vulnerability, command, or module name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Difficulty:</span>
            <div className="flex gap-1">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 terminal-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {cat === 'ALL' ? 'All Pathways' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(mod => (
          <div
            key={mod.id}
            className="glass-panel glass-panel-hover p-6 rounded-xl border border-white/10 flex flex-col justify-between group cursor-pointer"
            onClick={() => setActiveModalModule(mod)}
          >
            <div>
              {/* Category & Status Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-2xl border border-sky-500/20 shadow-[0_0_12px_rgba(14,165,233,0.15)] group-hover:scale-110 transition-transform">
                  {mod.icon}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {mod.status === 'COMPLETED' && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} />
                      COMPLETED
                    </span>
                  )}
                  {mod.status === 'IN_PROGRESS' && (
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-400/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                      IN PROGRESS
                    </span>
                  )}
                  {mod.status === 'LOCKED' && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={10} />
                      LOCKED
                    </span>
                  )}
                  {mod.status === 'NOT_STARTED' && (
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      AVAILABLE
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-slate-500">{mod.difficulty}</span>
                </div>
              </div>

              {/* Title & Category Tag */}
              <div className="text-[10px] uppercase font-mono font-bold text-sky-400 tracking-wider mb-1">
                {mod.category}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                {mod.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                {mod.description}
              </p>
            </div>

            {/* Footer Stats & MITRE Tags */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {mod.mitreMapping && mod.mitreMapping.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {mod.mitreMapping.map(m => (
                    <span key={m} className="text-[9px] font-mono bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-sky-400" />
                    {mod.lessonsCount} lessons
                  </span>
                  <span>{mod.labsCount} labs</span>
                </div>

                <span className="text-amber-400 font-bold">+{mod.xpReward} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="p-12 text-center glass-panel border border-white/10 rounded-2xl space-y-3">
          <Shield size={32} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">No security modules found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or clear the category filters to discover more pathways.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedDifficulty('ALL');
            }}
            className="px-4 py-2 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-mono hover:bg-sky-500/20"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detail Modal for Selected Module */}
      {activeModalModule && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalModule(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-8">
              <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center text-3xl border border-sky-500/20 shrink-0">
                {activeModalModule.icon}
              </div>
              <div>
                <div className="text-xs font-mono text-sky-400 uppercase font-bold tracking-wider">
                  {activeModalModule.category} • {activeModalModule.difficulty}
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {activeModalModule.title}
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-sm text-slate-300 leading-relaxed border-y border-white/10 py-4">
              <p>{activeModalModule.longDescription}</p>
            </div>

            {/* Lessons Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} className="text-sky-400" />
                Curriculum Syllabus ({activeModalModule.lessons.length} Modules)
              </h3>

              <div className="space-y-2">
                {activeModalModule.lessons.map((les, idx) => (
                  <div
                    key={les.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        les.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-slate-400'
                      }`}>
                        {les.completed ? '✓' : idx + 1}
                      </div>
                      <span className={les.completed ? 'text-slate-400 line-through' : 'text-white font-medium'}>
                        {les.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span className="capitalize bg-white/5 px-2 py-0.5 rounded">{les.type}</span>
                      <span>{les.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveModalModule(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectModule(activeModalModule);
                  setActiveModalModule(null);
                }}
                className="px-5 py-2 bg-sky-500 text-slate-950 font-bold rounded-lg text-xs font-mono hover:bg-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Play size={14} className="fill-current" />
                Start Learning Pathway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
