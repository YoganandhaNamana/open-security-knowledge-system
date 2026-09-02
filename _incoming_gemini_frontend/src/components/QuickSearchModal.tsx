import React, { useState, useEffect } from 'react';
import { SecurityModule, InteractiveLab, CVEItem, KnowledgeArticle, NavTab } from '../types';
import { Search, X, Shield, Terminal, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: SecurityModule[];
  labs: InteractiveLab[];
  cves: CVEItem[];
  articles: KnowledgeArticle[];
  onSelectTab: (tab: NavTab) => void;
  onSelectModule: (module: SecurityModule) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  modules,
  labs,
  cves,
  articles,
  onSelectTab,
  onSelectModule
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedModules = modules.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedLabs = labs.filter(l =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedArticles = articles.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="glass-panel border border-white/10 rounded-2xl max-w-2xl w-full p-4 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="relative flex items-center border-b border-white/10 pb-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search OSKS modules, terminal labs, CVEs, cheat sheets..."
            className="w-full bg-transparent pl-3 pr-8 text-sm text-white placeholder-slate-500 font-mono focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1 terminal-scrollbar">
          {/* Modules */}
          {matchedModules.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold">
                Security Modules ({matchedModules.length})
              </div>
              {matchedModules.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectModule(m);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-sky-400" />
                    <div>
                      <div className="text-white font-semibold group-hover:text-sky-300">{m.title}</div>
                      <div className="text-[10px] text-slate-400">{m.category} • {m.difficulty}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-white" />
                </div>
              ))}
            </div>
          )}

          {/* Labs */}
          {matchedLabs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold">
                Live Terminal Labs ({matchedLabs.length})
              </div>
              {matchedLabs.map(l => (
                <div
                  key={l.id}
                  onClick={() => {
                    onSelectTab('labs');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-emerald-400" />
                    <div>
                      <div className="text-white font-semibold group-hover:text-emerald-300">{l.title}</div>
                      <div className="text-[10px] text-slate-400">Target IP: {l.targetIp} • {l.difficulty}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-white" />
                </div>
              ))}
            </div>
          )}

          {/* Knowledge Articles */}
          {matchedArticles.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold">
                Knowledge Base Articles ({matchedArticles.length})
              </div>
              {matchedArticles.map(a => (
                <div
                  key={a.id}
                  onClick={() => {
                    onSelectTab('knowledge-base');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={16} className="text-sky-400" />
                    <div>
                      <div className="text-white font-semibold group-hover:text-sky-300">{a.title}</div>
                      <div className="text-[10px] text-slate-400">{a.category} • {a.readTime}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-white" />
                </div>
              ))}
            </div>
          )}

          {!matchedModules.length && !matchedLabs.length && !matchedArticles.length && (
            <div className="text-center py-8 text-xs text-slate-500 font-mono">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
