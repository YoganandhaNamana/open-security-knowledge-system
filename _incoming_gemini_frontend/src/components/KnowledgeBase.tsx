import React, { useState } from 'react';
import { KnowledgeArticle } from '../types';
import { BookOpen, Search, Copy, Check, Tag, Clock, ChevronRight, FileText, Bookmark, Share2 } from 'lucide-react';

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle>(articles[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase mb-1">
            <BookOpen size={14} />
            <span>OSKS DOCUMENTATION & CHEAT SHEETS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Field Knowledge Base
          </h1>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search OWASP, Nmap, Wireshark..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Article Navigation List */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
            Field Guides ({filteredArticles.length})
          </div>

          <div className="space-y-2">
            {filteredArticles.map(art => {
              const isSelected = selectedArticle.id === art.id;
              const isBookmarked = bookmarkedIds.includes(art.id);
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500/30 text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                    <span className="text-sky-400 font-semibold">{art.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {art.readTime}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(art.id);
                        }}
                        className={`p-1 hover:text-amber-400 transition-colors ${isBookmarked ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        <Bookmark size={12} className={isBookmarked ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-sky-300 transition-colors mb-1.5 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {art.summary}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {art.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono bg-slate-900/80 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Article Reader Box */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 bg-slate-900/80 shadow-2xl">
          {/* Article Header */}
          <div className="border-b border-white/10 pb-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-sky-400 font-bold">
              <span>{selectedArticle.category}</span>
              <span className="text-slate-400 font-normal">{selectedArticle.readTime}</span>
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight">
              {selectedArticle.title}
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed italic">
              "{selectedArticle.summary}"
            </p>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-invert prose-xs max-w-none space-y-4 text-slate-300 leading-relaxed">
            <div className="whitespace-pre-line text-xs leading-relaxed font-sans">
              {selectedArticle.content}
            </div>
          </div>

          {/* Code Snippet Block */}
          {selectedArticle.codeSnippet && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileText size={14} className="text-sky-400" />
                  Code / Payload Snippet
                </span>
                <button
                  onClick={() => handleCopyCode(selectedArticle.codeSnippet)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-white/10 font-mono text-xs text-sky-300 overflow-x-auto terminal-scrollbar leading-relaxed">
                <code>{selectedArticle.codeSnippet}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
