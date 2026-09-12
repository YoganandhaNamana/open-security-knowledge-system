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

      ...
    </div>
  );
};
