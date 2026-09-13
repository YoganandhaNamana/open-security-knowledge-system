import React, { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, FileText, Network, Search, ShieldCheck, Sparkles, Tag, X } from 'lucide-react';
import type { CanonicalModuleViewModel } from '../types';

interface ModulesViewProps {
  modules: CanonicalModuleViewModel[];
  onSelectModule: (module: CanonicalModuleViewModel) => void;
}

const ValueList: React.FC<{ title: string; values: string[] }> = ({ title, values }) => {
  if (values.length === 0) return null;

  return (
    <section className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {values.map(value => (
          <li key={value} className="flex gap-2">
            <span className="text-sky-400">•</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const ModulesView: React.FC<ModulesViewProps> = ({ modules, onSelectModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalModule, setActiveModalModule] = useState<CanonicalModuleViewModel | null>(null);

  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return modules;

    return modules.filter(module => {
      const searchable = [
        module.id,
        module.title,
        module.volume,
        module.chapter,
        module.taxonomy.domain,
        module.taxonomy.discipline,
        module.taxonomy.technology,
        module.taxonomy.skillLevel,
        ...module.learningOutcomes,
        ...module.prerequisites,
      ].join(' ').toLowerCase();

      return searchable.includes(query);
    });
  }, [modules, searchQuery]);

  const openModule = (module: CanonicalModuleViewModel) => {
    setActiveModalModule(module);
    onSelectModule(module);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-sky-400" />
            OSKS Modules
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Canonical curriculum modules exported from the OSKS v1 contract.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-lg text-sky-300">
          <Sparkles size={14} className="text-sky-400" />
          <span>{modules.length} modules</span>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl space-y-4 border border-white/10">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search modules by id, title, discipline, or technology..."
            className="w-full pl-9 pr-10 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <BookOpen size={18} className="text-sky-400" />
            Modules ({filteredModules.length})
          </h2>

          {filteredModules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-400">
              No modules match the current search.
            </div>
          ) : (
            filteredModules.map(module => (
              <button
                key={module.id}
                type="button"
                onClick={() => openModule(module)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-4 text-left transition-colors hover:border-sky-500/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] text-sky-400">{module.id}</p>
                    <h3 className="mt-1 text-base font-bold text-white">{module.title}</h3>
                  </div>
                  {module.taxonomy.skillLevel && (
                    <span className="rounded bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                      {module.taxonomy.skillLevel}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {module.volume} / {module.chapter} · {module.taxonomy.domain} · {module.taxonomy.discipline} · {module.taxonomy.technology}
                </p>

                {module.learningOutcomes.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-slate-300">
                    {module.learningOutcomes.slice(0, 2).map(outcome => (
                      <li key={outcome} className="flex gap-2">
                        <span className="text-sky-400">•</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-center gap-3 text-sky-400">
            <ShieldCheck size={18} />
            <span className="font-mono text-xs uppercase tracking-widest">Canonical module</span>
          </div>

          {activeModalModule ? (
            <div className="mt-4 space-y-5">
              <header>
                <p className="font-mono text-xs text-sky-400">{activeModalModule.id} · {activeModalModule.volume} / {activeModalModule.chapter}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{activeModalModule.title}</h2>
                {activeModalModule.lifecycleStatus && (
                  <p className="mt-2 text-xs text-slate-400">Lifecycle: {activeModalModule.lifecycleStatus}</p>
                )}
              </header>

              <section className="rounded-xl border border-white/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Tag size={15} className="text-sky-400" />
                  Taxonomy
                </h3>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Domain</dt>
                    <dd>{activeModalModule.taxonomy.domain}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Discipline</dt>
                    <dd>{activeModalModule.taxonomy.discipline}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Technology</dt>
                    <dd>{activeModalModule.taxonomy.technology}</dd>
                  </div>
                  {activeModalModule.taxonomy.skillLevel && (
                    <div>
                      <dt className="text-slate-500">Skill level</dt>
                      <dd>{activeModalModule.taxonomy.skillLevel}</dd>
                    </div>
                  )}
                </dl>
              </section>

              <div className="grid gap-4 xl:grid-cols-2">
                <ValueList
                  title="Learning outcomes"
                  values={activeModalModule.learningOutcomes}
                />
                <ValueList
                  title="Prerequisites"
                  values={activeModalModule.prerequisites}
                />
              </div>

              {activeModalModule.labReferences.length > 0 && (
                <section className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <FileText size={15} className="text-sky-400" />
                    Lab references
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {activeModalModule.labReferences.map(reference => (
                      <li key={reference} className="flex gap-2">
                        <span className="text-sky-400">•</span>
                        <span>{reference}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {activeModalModule.mitreReferences.length > 0 && (
                <section className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <Network size={15} className="text-sky-400" />
                    MITRE references
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {activeModalModule.mitreReferences.map(reference => (
                      <li key={reference} className="flex gap-2">
                        <span className="text-sky-400">•</span>
                        <span>{reference}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {activeModalModule.evidenceSources.length > 0 && (
                <section className="rounded-xl border border-white/10 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <FileText size={15} className="text-sky-400" />
                    Evidence sources
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {activeModalModule.evidenceSources.map(source => (
                      <li key={source.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sky-300">{source.id}</span>
                          {source.uri && (
                            <a
                              href={source.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                            >
                              Source <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {source.type} · {source.authority}
                          {source.control ? ` · ${source.control}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/15 p-8 text-sm text-slate-400">
              Select a module to inspect the exported metadata.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
