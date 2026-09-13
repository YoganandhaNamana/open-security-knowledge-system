import React, { useState } from 'react';
import { CVEItem, MitreTechnique } from '../types';
import { Radio, AlertTriangle, ShieldAlert, FileText, ChevronRight, Activity, Cpu, ExternalLink, Search, RefreshCw } from 'lucide-react';

interface ThreatIntelProps {
  cves: CVEItem[];
  mitreTechniques: MitreTechnique[];
}

export const ThreatIntel: React.FC<ThreatIntelProps> = ({ cves, mitreTechniques }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [activeTechnique, setActiveTechnique] = useState<MitreTechnique | null>(mitreTechniques[0]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const filteredCVEs = cves.filter(c => selectedSeverity === 'ALL' || c.severity === selectedSeverity);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase mb-1">
            <Radio size={14} className="animate-pulse" />
            <span>REAL-TIME INTELLIGENCE FEED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Threat Intelligence & MITRE ATT&CK
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-bold">
            <AlertTriangle size={14} />
            <span>THREAT LEVEL 3 • ELEVATED</span>
          </div>

          <button
            onClick={triggerRefresh}
            className={`p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-all ${
              isRefreshing ? 'animate-spin text-sky-400' : ''
            }`}
            title="Refresh Intelligence Feed"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* MITRE ATT&CK Matrix Explorer */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Cpu size={18} className="text-sky-400" />
              MITRE ATT&CK Framework Navigator
            </h2>
            <p className="text-xs text-slate-400">
              Interactive database of adversary tactics, techniques, and defensive mitigation rules.
            </p>
          </div>

          <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded">
            v14.1 Enterprise Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Techniques Selection List */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              Selected Tactics & Techniques
            </div>

            {mitreTechniques.map(tech => (
              <button
                key={tech.id}
                onClick={() => setActiveTechnique(tech)}
                className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  activeTechnique?.id === tech.id
                    ? 'bg-sky-500/15 border-sky-500/30 text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-xs font-bold">
                  <span className="text-sky-400">{tech.id}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded">{tech.tactics}</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">{tech.name}</div>
              </button>
            ))}
          </div>

          {/* Technique Detail Breakdown */}
          {activeTechnique && (
            <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/10 space-y-4 bg-slate-900/60">
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="text-xs font-mono text-sky-400 font-bold">{activeTechnique.id} • {activeTechnique.tactics}</div>
                  <h3 className="text-xl font-bold text-white mt-0.5">{activeTechnique.name}</h3>
                </div>
                <span className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono text-xs rounded-md">
                  Active Threat Model
                </span>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{activeTechnique.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg space-y-1">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Activity size={14} />
                    Detection Method
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{activeTechnique.detection}</p>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-lg space-y-1">
                  <h4 className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                    <ShieldAlert size={14} />
                    Mitigation Strategy
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{activeTechnique.mitigation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CVE Live Advisory Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" />
            Zero-Day & Critical Vulnerability Advisories (CVEs)
          </h2>

          {/* Severity Filter Buttons */}
          <div className="flex gap-1">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCVEs.map(cve => (
            <div
              key={cve.id}
              className="glass-panel glass-panel-hover p-5 rounded-xl border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">{cve.cveId}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      cve.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    CVSS {cve.cvssScore} • {cve.severity}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white leading-snug">{cve.title}</h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{cve.summary}</p>
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] font-mono space-y-1">
                <div className="text-slate-500">Affected: <span className="text-slate-300">{cve.affectedSystem}</span></div>
                <div className="text-slate-500">Mitigation: <span className="text-emerald-400">{cve.mitigation}</span></div>
                <div className="text-slate-600 pt-1">Published: {cve.publishedDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
