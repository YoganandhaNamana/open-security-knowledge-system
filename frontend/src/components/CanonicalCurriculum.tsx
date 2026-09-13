import React from 'react';
import { BookOpen, ExternalLink, FileText, FlaskConical, Network, ShieldCheck, Tag } from 'lucide-react';
import type { CanonicalModuleViewModel } from '../types';

interface CurriculumProps {
  modules: CanonicalModuleViewModel[];
  selectedModule?: CanonicalModuleViewModel;
  onSelectModule: (module: CanonicalModuleViewModel) => void;
}

const ValueList: React.FC<{ title: string; values: string[]; empty: string }> = ({ title, values, empty }) => (
  <section className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
    <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">{title}</h3>
    {values.length > 0 ? (
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {values.map(value => <li key={value} className="flex gap-2"><span className="text-sky-400">•</span>{value}</li>)}
      </ul>
    ) : <p className="mt-3 text-sm text-slate-500">{empty}</p>}
  </section>
);

export const CanonicalCurriculum: React.FC<CurriculumProps> = ({ modules, selectedModule, onSelectModule }) => (
  <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
    <section className="rounded-2xl border border-sky-500/20 bg-slate-900/90 p-6 shadow-2xl">
      <div className="flex items-center gap-3 text-sky-400"><ShieldCheck /><span className="font-mono text-xs uppercase tracking-widest">Canonical OSKS export v1</span></div>
      <h1 className="mt-3 text-3xl font-bold text-white">Security Knowledge Curriculum</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">This view displays metadata and learning outcomes validated from the exported OSKS curriculum. Labs, learner progress, XP, quizzes, diagrams, and threat feeds are unavailable in the current export contract.</p>
    </section>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white"><BookOpen size={20} className="text-sky-400" /> Modules ({modules.length})</h2>
        {modules.map(module => (
          <button key={module.id} onClick={() => onSelectModule(module)} className={`w-full rounded-xl border p-4 text-left transition-colors ${selectedModule?.id === module.id ? 'border-sky-400 bg-sky-500/10' : 'border-white/10 bg-slate-900/60 hover:border-sky-500/40'}`}>
            <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs text-sky-400">{module.id}</p><h3 className="mt-1 font-bold text-white">{module.title}</h3></div>{module.taxonomy.skillLevel && <span className="rounded bg-white/5 px-2 py-1 text-xs text-slate-300">{module.taxonomy.skillLevel}</span>}</div>
            <p className="mt-2 text-xs text-slate-400">{module.taxonomy.discipline} · {module.taxonomy.technology}</p>
          </button>
        ))}
      </section>

      {selectedModule ? <ModuleDetail module={selectedModule} /> : <section className="rounded-xl border border-dashed border-white/15 p-8 text-slate-400">Select a canonical module to inspect its exported metadata.</section>}
    </div>
  </div>
);

const ModuleDetail: React.FC<{ module: CanonicalModuleViewModel }> = ({ module }) => (
  <article className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
    <header><p className="font-mono text-xs text-sky-400">{module.id} · {module.volume} / {module.chapter}</p><h2 className="mt-2 text-2xl font-bold text-white">{module.title}</h2>{module.lifecycleStatus && <p className="mt-2 text-xs text-slate-400">Lifecycle: {module.lifecycleStatus}</p>}</header>
    <section className="rounded-xl border border-white/10 p-4"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><Tag size={15} className="text-sky-400" /> Taxonomy</h3><dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">Domain</dt><dd>{module.taxonomy.domain}</dd></div><div><dt className="text-slate-500">Discipline</dt><dd>{module.taxonomy.discipline}</dd></div><div><dt className="text-slate-500">Technology</dt><dd>{module.taxonomy.technology}</dd></div>{module.taxonomy.skillLevel && <div><dt className="text-slate-500">Skill level</dt><dd>{module.taxonomy.skillLevel}</dd></div>}</dl></section>
    <ValueList title="Learning outcomes" values={module.learningOutcomes} empty="No learning outcomes were exported." />
    <div className="grid gap-4 sm:grid-cols-2"><ValueList title="Prerequisites" values={module.prerequisites} empty="No prerequisites listed." /><ValueList title="Next topics" values={module.nextTopics} empty="No next topics listed." /><ValueList title="Glossary terms" values={module.glossaryTerms} empty="No glossary terms listed." /><ValueList title="MITRE references" values={module.mitreReferences} empty="No MITRE references listed." /></div>
    <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><h3 className="flex items-center gap-2 text-sm font-bold text-amber-200"><FlaskConical size={15} /> Canonical lab references</h3>{module.labReferences.length > 0 ? <ul className="mt-3 space-y-1 text-sm text-amber-100">{module.labReferences.map(reference => <li key={reference}>{reference} <span className="text-amber-300/70">— metadata unavailable in export v1</span></li>)}</ul> : <p className="mt-2 text-sm text-slate-500">No lab references listed.</p>}</section>
    <section className="rounded-xl border border-white/10 p-4"><h3 className="flex items-center gap-2 text-sm font-bold text-white"><FileText size={15} className="text-sky-400" /> Evidence sources</h3><ul className="mt-3 space-y-2 text-sm">{module.evidenceSources.map(source => <li key={source.id}><span className="font-mono text-sky-300">{source.id}</span> <span className="text-slate-400">({source.type}, {source.authority})</span>{source.uri && <a className="ml-2 inline-flex text-sky-400 hover:underline" href={source.uri} target="_blank" rel="noreferrer">source <ExternalLink size={12} /></a>}</li>)}</ul></section>
    <p className="flex items-center gap-2 text-xs text-slate-500"><Network size={14} /> No stage, lesson, XP, learner-progress, or operational-lab data is represented as it is not part of the canonical export.</p>
  </article>
);
