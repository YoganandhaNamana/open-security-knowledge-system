import React, { useEffect, useState } from 'react';
import { BookOpen, Database, FlaskConical, Gauge, ShieldAlert, Terminal } from 'lucide-react';
import { OSKSCurriculumService } from './services/osksCurriculumService';
import { CanonicalCurriculum } from './components/CanonicalCurriculum';
import type { CanonicalModuleViewModel } from './types';

type View = 'curriculum' | 'unavailable';

const unavailableFeatures = [
  ['Learning journey', 'Structured stage, quiz, diagram, and review data are not in export v1.'],
  ['Sandbox labs', 'Only canonical lab references are exported; operational lab metadata is unavailable.'],
  ['Learning assistant', 'Its lesson and stage commands require unavailable structured stage data.'],
  ['Threat intelligence', 'No vetted CVE or detailed MITRE feed is exported.'],
  ['Knowledge base', 'No canonical knowledge-article export is available.'],
  ['Profile and achievements', 'Learner progress, XP, ranks, and achievements are user-state data and are unavailable.'],
] as const;

export default function App() {
  const [modules, setModules] = useState<CanonicalModuleViewModel[]>([]);
  const [selectedModule, setSelectedModule] = useState<CanonicalModuleViewModel>();
  const [error, setError] = useState<string>();
  const [view, setView] = useState<View>('curriculum');
  const [unavailable, setUnavailable] = useState<(typeof unavailableFeatures)[number]>(unavailableFeatures[0]);

  useEffect(() => {
    const service = new OSKSCurriculumService();
    service.loadModules()
      .then(loaded => { setModules(loaded); setSelectedModule(loaded[0]); })
      .catch(loadError => setError(loadError instanceof Error ? loadError.message : 'Unable to load canonical curriculum.'));
  }, []);

  const showUnavailable = (feature: (typeof unavailableFeatures)[number]) => {
    setUnavailable(feature);
    setView('unavailable');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><button onClick={() => setView('curriculum')} className="flex items-center gap-3 text-left"><span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-500 font-mono font-bold text-white">O</span><span><span className="font-mono font-bold text-white">OSKS // <span className="text-sky-400">CORE</span></span><span className="block text-[10px] uppercase tracking-widest text-slate-500">Canonical curriculum viewer</span></span></button><span className="hidden rounded border border-sky-500/20 bg-sky-500/10 px-2 py-1 font-mono text-[10px] text-sky-300 sm:inline">EXPORT v1</span></div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/40 p-4 md:min-h-[calc(100vh-73px)] md:border-b-0 md:border-r">
          <nav className="space-y-2"><button onClick={() => setView('curriculum')} className="flex w-full items-center gap-2 rounded-lg bg-sky-500/10 px-3 py-2 text-left text-sm text-sky-300"><BookOpen size={16} /> Curriculum</button>{unavailableFeatures.map((feature, index) => <button key={feature[0]} onClick={() => showUnavailable(feature)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white">{[Gauge, FlaskConical, Terminal, ShieldAlert, Database, Gauge][index]({ size: 16 })}{feature[0]}</button>)}</nav>
        </aside>
        <main>{error ? <div className="m-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-100"><h1 className="font-bold">Canonical curriculum unavailable</h1><p className="mt-2 text-sm">{error}</p></div> : view === 'curriculum' ? <CanonicalCurriculum modules={modules} selectedModule={selectedModule} onSelectModule={setSelectedModule} /> : <section className="m-4 rounded-2xl border border-amber-500/20 bg-slate-900/70 p-6 sm:m-8"><h1 className="text-2xl font-bold text-white">{unavailable[0]} unavailable</h1><p className="mt-3 max-w-2xl text-slate-400">{unavailable[1]}</p><p className="mt-4 text-xs text-amber-200">This UI is intentionally disabled rather than populated with mock data.</p></section>}</main>
      </div>
    </div>
  );
}
