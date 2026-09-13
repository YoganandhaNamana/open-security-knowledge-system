import React, { useState, useEffect } from 'react';
import { InteractiveDiagramData } from '../types';
import { Play, Pause, ChevronLeft, ChevronRight, Shield, Server, Database, Terminal, Laptop, ArrowRight, Activity, CheckCircle, Info } from 'lucide-react';

interface InteractiveDiagramProps {
  data: InteractiveDiagramData;
}

export const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({ data }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps = data.steps;
  const activeStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'attacker':
        return <Terminal className="w-6 h-6 text-red-400" />;
      case 'gateway':
        return <Shield className="w-6 h-6 text-amber-400" />;
      case 'server':
        return <Server className="w-6 h-6 text-sky-400" />;
      case 'database':
        return <Database className="w-6 h-6 text-purple-400" />;
      default:
        return <Laptop className="w-6 h-6 text-emerald-400" />;
    }
  };

  const isHighlighted = (nodeId: string) => {
    return activeStep.highlightNodes?.includes(nodeId);
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-6">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">
            <Activity className="w-4 h-4 animate-pulse" />
            Interactive Sequence Simulator
          </div>
          <h3 className="text-xl font-bold text-slate-100 mt-1">{data.title}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{data.description}</p>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg p-1.5 self-start md:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-md transition-colors ${
              isPlaying ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
            }`}
            title={isPlaying ? 'Pause Auto-playback' : 'Play Auto-playback'}
            id="diagram-play-pause-btn"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
            }}
            className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Previous Step"
            id="diagram-prev-step-btn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono px-2 text-slate-300">
            Step {currentStepIndex + 1} of {steps.length}
          </span>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
            }}
            className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Next Step"
            id="diagram-next-step-btn"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative py-2">
        {data.nodes.map((node) => {
          const highlighted = isHighlighted(node.id);
          return (
            <div
              key={node.id}
              onClick={() => {
                // Find step highlighting this node
                const stepIdx = steps.findIndex((s) => s.highlightNodes?.includes(node.id));
                if (stepIdx !== -1) setCurrentStepIndex(stepIdx);
              }}
              className={`relative rounded-xl p-4 border transition-all cursor-pointer ${
                highlighted
                  ? 'bg-slate-800/90 border-sky-500/80 shadow-lg shadow-sky-500/10 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-80'
              }`}
              id={`diagram-node-${node.id}`}
            >
              {highlighted && (
                <div className="absolute -top-2 -right-2 bg-sky-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                  Active
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${highlighted ? 'bg-sky-500/20 border border-sky-500/30' : 'bg-slate-900 border border-slate-800'}`}>
                  {getNodeIcon(node.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{node.label}</h4>
                  {node.ip && <span className="text-xs font-mono text-slate-400">{node.ip}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Packet Transmission Inspector */}
      <div className="bg-slate-950 rounded-xl border border-sky-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-ping" />
            <h4 className="text-sm font-bold text-sky-300 font-mono">{activeStep.title}</h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{activeStep.sender}</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            <span>{activeStep.receiver}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action & Protocol</span>
            <p className="text-sm font-mono font-bold text-emerald-400">{activeStep.action}</p>
            {activeStep.payload && (
              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400">Payload / Headers:</span>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded mt-1 overflow-x-auto border border-slate-800">
                  {activeStep.payload}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              Technical Explanation
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{activeStep.explanation}</p>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {steps.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-8 bg-sky-400'
                  : idx < currentStepIndex
                  ? 'w-2.5 bg-emerald-500'
                  : 'w-2.5 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Go to Step ${step.stepNumber}: ${step.title}`}
              id={`diagram-step-dot-${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
