import React, { useState } from 'react';
import { SecurityModule, LearningStageId, InteractiveLab, UserStats } from '../types';
import { InteractiveDiagram } from './InteractiveDiagram';
import { TerminalAssistant } from './TerminalAssistant';
import {
  BookOpen,
  Award,
  Clock,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  HelpCircle,
  FileCode,
  Terminal as TerminalIcon,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Layers,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  MessageSquare,
  Bookmark,
  Sparkles
} from 'lucide-react';

interface LearningJourneyProps {
  module: SecurityModule;
  allModules: SecurityModule[];
  userStats: UserStats;
  labs: InteractiveLab[];
  onLaunchLab: (lab: InteractiveLab) => void;
  onFlagSubmitted?: (labId: string, flag: string) => void;
  onSelectModule: (module: SecurityModule) => void;
}

const STAGES: { id: LearningStageId; title: string; shortLabel: string; stepNumber: number; icon: React.ReactNode }[] = [
  { id: 'introduction', title: '1. Introduction', shortLabel: 'Intro', stepNumber: 1, icon: <BookOpen className="w-4 h-4" /> },
  { id: 'why-it-matters', title: '2. Why It Matters', shortLabel: 'Context', stepNumber: 2, icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'concept', title: '3. Concept & Theory', shortLabel: 'Concept', stepNumber: 3, icon: <Layers className="w-4 h-4" /> },
  { id: 'interactive-diagram', title: '4. Interactive Diagram', shortLabel: 'Diagram', stepNumber: 4, icon: <Zap className="w-4 h-4" /> },
  { id: 'example', title: '5. Example & Code', shortLabel: 'Example', stepNumber: 5, icon: <FileCode className="w-4 h-4" /> },
  { id: 'quiz', title: '6. Quiz & Check', shortLabel: 'Quiz', stepNumber: 6, icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'hands-on-lab', title: '7. Hands-on Lab', shortLabel: 'Lab', stepNumber: 7, icon: <TerminalIcon className="w-4 h-4" /> },
  { id: 'review', title: '8. Review & Summary', shortLabel: 'Review', stepNumber: 8, icon: <Award className="w-4 h-4" /> }
];

export const LearningJourney: React.FC<LearningJourneyProps> = ({
  module,
  allModules,
  userStats,
  labs,
  onLaunchLab,
  onFlagSubmitted,
  onSelectModule
}) => {
  const [activeStage, setActiveStage] = useState<LearningStageId>('introduction');
  const [completedStages, setCompletedStages] = useState<LearningStageId[]>(
    module.completedStages || ['introduction']
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Lab flag state inside Stage 7
  const [flagInput, setFlagInput] = useState<string>('');
  const [flagResult, setFlagResult] = useState<{ success: boolean; message: string } | null>(null);

  // Interview Question toggle state inside Stage 8
  const [openInterviewIdx, setOpenInterviewIdx] = useState<number | null>(null);

  const stageData = module.stageData;
  const currentStageIndex = STAGES.findIndex((s) => s.id === activeStage);

  const markStageCompleted = (stageId: LearningStageId) => {
    if (!completedStages.includes(stageId)) {
      setCompletedStages((prev) => [...prev, stageId]);
    }
  };

  const goToNextStage = () => {
    markStageCompleted(activeStage);
    if (currentStageIndex < STAGES.length - 1) {
      setActiveStage(STAGES[currentStageIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStage = () => {
    if (currentStageIndex > 0) {
      setActiveStage(STAGES[currentStageIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matchedLab = labs.find((l) => l.id === stageData?.handsOnLabId) || labs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Learner Awareness Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">OSKS Curriculum</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sky-400 font-semibold">{module.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-200 font-bold">{module.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-400 font-bold">{STAGES[currentStageIndex].title}</span>
          </div>

          {/* Certification Mapping Badges */}
          <div className="flex items-center gap-2">
            {stageData?.introduction.certifications.slice(0, 2).map((cert) => (
              <span
                key={cert.certName}
                className="bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
              >
                <Award className="w-3 h-3 text-sky-400" />
                {cert.certName}
              </span>
            ))}
          </div>
        </div>

        {/* Module Title & Stage Progress Info */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{module.icon}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">{module.title}</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">{module.description}</p>
          </div>

          {/* Stage Progress Counter */}
          <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 min-w-[240px] space-y-2 self-start lg:self-auto">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Learning Journey Progress</span>
              <span className="text-emerald-400 font-bold">
                {Math.round(((completedStages.length) / 8) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${((completedStages.length) / 8) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>{completedStages.length} of 8 Stages Done</span>
              <span className="text-amber-400">+{module.xpReward} XP Reward</span>
            </div>
          </div>
        </div>

        {/* 8-Stage Interactive Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {STAGES.map((stg, index) => {
            const isActive = stg.id === activeStage;
            const isDone = completedStages.includes(stg.id);

            return (
              <button
                key={stg.id}
                onClick={() => {
                  setActiveStage(stg.id);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center border transition-all ${
                  isActive
                    ? 'bg-sky-500/20 border-sky-500 text-sky-200 shadow-lg shadow-sky-500/10 scale-105 font-bold'
                    : isDone
                    ? 'bg-slate-950/80 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                id={`stage-nav-btn-${stg.id}`}
              >
                <div className="flex items-center gap-1">
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : stg.icon}
                  <span className="text-xs font-mono font-bold">Stage {stg.stepNumber}</span>
                </div>
                <span className="text-[11px] mt-1 line-clamp-1">{stg.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage View Renderer */}
      <div className="min-h-[450px]">
        {/* ================= STAGE 1: INTRODUCTION ================= */}
        {activeStage === 'introduction' && stageData && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Stage 1 of 8</span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">Introduction & Overview</h2>
              <p className="text-sm text-slate-400 mt-1">{stageData.introduction.overview}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Learning Objectives */}
              <div className="lg:col-span-2 bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Learning Objectives
                </h3>
                <ul className="space-y-2.5">
                  {stageData.introduction.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Module Metadata Sidebar */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Module Information</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Difficulty:</span>
                      <span className="text-emerald-400 font-bold">{stageData.introduction.difficulty}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">Estimated Duration:</span>
                      <span className="text-slate-200 font-bold">{stageData.introduction.estimatedTotalTime}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">XP Reward:</span>
                      <span className="text-amber-400 font-bold">+{module.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prerequisite Skills</h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stageData.introduction.prerequisites.map((pre) => (
                      <span key={pre} className="bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded text-xs font-mono">
                        {pre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Certifications Section */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-400" />
                Industry Certifications Supported
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stageData.introduction.certifications.map((cert) => (
                  <div key={cert.certName} className="bg-slate-900/80 rounded-lg p-3.5 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{cert.certName}</span>
                      <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">{cert.code}</span>
                    </div>
                    <p className="text-xs text-slate-400">{cert.relevance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 2: WHY IT MATTERS ================= */}
        {activeStage === 'why-it-matters' && stageData && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Stage 2 of 8</span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">Why It Matters - Real-World Relevance</h2>
              <p className="text-sm text-slate-400 mt-1">{stageData.whyItMatters.realWorldImpact}</p>
            </div>

            {/* Threat Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stageData.whyItMatters.threatMetrics.map((metric, i) => (
                <div key={i} className="bg-slate-950 rounded-xl p-5 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{metric.label}</span>
                    <p className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{metric.value}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    {metric.source}
                  </span>
                </div>
              ))}
            </div>

            {/* Famous Case Studies Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Historic Security Incident Case Studies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stageData.whyItMatters.famousBreaches.map((breach) => (
                  <div key={breach.title} className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-200">{breach.title}</h4>
                      <span className="text-xs font-mono text-amber-400 font-bold">{breach.year}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{breach.summary}</p>
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Impact:</span>
                      <span className="text-red-400 font-bold font-mono">{breach.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Risk Box */}
            <div className="bg-red-950/30 rounded-xl p-5 border border-red-900/50 space-y-2">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                Business & Operational Risk Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{stageData.whyItMatters.businessRisk}</p>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: CONCEPT ================= */}
        {activeStage === 'concept' && stageData && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Stage 3 of 8</span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">Core Technical Concepts & Principles</h2>
              <p className="text-sm text-slate-400 mt-1">{stageData.concept.detailedTheory}</p>
            </div>

            {/* Core Principles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stageData.concept.corePrinciples.map((p, i) => (
                <div key={i} className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.explanation}</p>
                </div>
              ))}
            </div>

            {/* Key Terminology Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Key Terminology Glossary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stageData.concept.keyTerminology.map((t) => (
                  <div key={t.term} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{t.term}</span>
                    <p className="text-xs text-slate-300">{t.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Defense Mechanisms */}
            <div className="bg-emerald-950/20 rounded-xl p-5 border border-emerald-900/40 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Defensive Controls & Safeguards
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {stageData.concept.defenseMechanisms.map((def, i) => (
                  <li key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{def}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ================= STAGE 4: INTERACTIVE DIAGRAM ================= */}
        {activeStage === 'interactive-diagram' && stageData && (
          <InteractiveDiagram data={stageData.interactiveDiagram} />
        )}

        {/* ================= STAGE 5: EXAMPLE ================= */}
        {activeStage === 'example' && stageData && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Stage 5 of 8</span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">Real-World Execution Example</h2>
              <p className="text-sm text-slate-400 mt-1">{stageData.example.scenario}</p>
            </div>

            {/* Code / Command Display Box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden space-y-0">
              <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">{stageData.example.language} Command Payload</span>
                <button
                  onClick={() => copyToClipboard(stageData.example.commandOrCode)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  id="copy-example-code-btn"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
                <code>{stageData.example.commandOrCode}</code>
              </pre>
            </div>

            {/* Line-by-Line Parameter Breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Parameter Breakdown</h3>
              <div className="space-y-2">
                {stageData.example.stepByStepBreakdown.map((b, i) => (
                  <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
                      {b.lineOrCommand}
                    </span>
                    <span className="text-xs text-slate-300 flex-1 sm:ml-4">{b.explanation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Console Output */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2 font-mono">
              <span className="text-xs text-slate-400 uppercase font-bold">Expected Terminal Output:</span>
              <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded border border-slate-800 overflow-x-auto">
                {stageData.example.expectedOutput}
              </pre>
            </div>
          </div>
        )}

        {/* ================= STAGE 6: QUIZ ================= */}
        {activeStage === 'quiz' && stageData && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Stage 6 of 8</span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">{stageData.quiz.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{stageData.quiz.description}</p>
            </div>

            <div className="space-y-6">
              {stageData.quiz.questions.map((q, qIndex) => {
                const selectedOpt = quizAnswers[q.id];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div key={q.id} className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-200">
                        Q{qIndex + 1}: {q.question}
                      </h3>
                      {quizSubmitted && (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-sky-500/20 border-sky-500 text-sky-200 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => {
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            }}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${btnStyle}`}
                            id={`quiz-q${qIndex}-opt${optIdx}`}
                          >
                            <span className="font-mono font-bold mr-2">[{optIdx + 1}]</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-sky-400">Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Quiz Submit & Reset Buttons */}
              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={() => {
                      let correctCount = 0;
                      stageData.quiz.questions.forEach((q) => {
                        if (quizAnswers[q.id] === q.correctIndex) correctCount++;
                      });
                      const scorePct = Math.round((correctCount / stageData.quiz.questions.length) * 100);
                      setQuizScore(scorePct);
                      setQuizSubmitted(true);
                      if (scorePct >= stageData.quiz.passingScore) {
                        markStageCompleted('quiz');
                      }
                    }}
                    disabled={Object.keys(quizAnswers).length < stageData.quiz.questions.length}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg"
                    id="submit-quiz-btn"
                  >
                    Submit Quiz Answers
                  </button>
                ) : (
                  <div className="flex items-center gap-4 w-full justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">Quiz Score:</span>
                      <span className={`text-base font-extrabold font-mono ${quizScore >= stageData.quiz.passingScore ? 'text-emerald-400' : 'text-red-400'}`}>
                        {quizScore}% {quizScore >= stageData.quiz.passingScore ? '(Passed)' : '(Failed - Try Again)'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
                      id="retry-quiz-btn"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 7: HANDS-ON LAB ================= */}
        {activeStage === 'hands-on-lab' && matchedLab && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">Stage 7 of 8</span>
                <h2 className="text-2xl font-bold text-slate-100 mt-1">{matchedLab.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{matchedLab.scenario}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 self-start md:self-auto">
                <span className="text-slate-400">Target IP:</span>{' '}
                <span className="text-emerald-400 font-bold">{matchedLab.targetIp}</span>
              </div>
            </div>

            {/* Lab Tasks Checklist & Flag Submission */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Lab Tasks</h3>
                <div className="space-y-2.5">
                  {matchedLab.tasks.map((task) => (
                    <div key={task.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <p className="text-xs font-bold text-slate-200">{task.description}</p>
                      {task.commandHint && (
                        <p className="text-[11px] font-mono text-sky-400">Hint: {task.commandHint}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Flag Form */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono">Submit Captured Flag</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      placeholder="e.g. OSKS{flag_value_here}"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                      id="lab-flag-input"
                    />
                    <button
                      onClick={() => {
                        if (flagInput.trim() === matchedLab.flag) {
                          setFlagResult({ success: true, message: 'Correct Flag Captured! +250 XP Awarded.' });
                          markStageCompleted('hands-on-lab');
                          if (onFlagSubmitted) onFlagSubmitted(matchedLab.id, flagInput.trim());
                        } else {
                          setFlagResult({ success: false, message: 'Invalid flag string. Re-examine terminal logs.' });
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                      id="submit-flag-btn"
                    >
                      Submit
                    </button>
                  </div>
                  {flagResult && (
                    <p className={`text-xs font-mono font-bold mt-1 ${flagResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {flagResult.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Integrated Terminal Assistant CLI */}
              <div>
                <TerminalAssistant
                  activeModule={module}
                  allModules={allModules}
                  userStats={userStats}
                  labs={labs}
                  onNavigateStage={(stg) => {
                    if (stg === 'next') goToNextStage();
                    else setActiveStage(stg as LearningStageId);
                  }}
                  onSelectModule={onSelectModule}
                  onLaunchLab={onLaunchLab}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STAGE 8: REVIEW ================= */}
        {activeStage === 'review' && stageData && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Stage 8 of 8</span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">Review & Key Takeaways</h2>
              <p className="text-sm text-slate-400 mt-1">Summary of concepts, command cheat sheet, and certification review points.</p>
            </div>

            {/* Key Summary Takeaways */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Learning Takeaways
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stageData.review.summaryTakeaways.map((take, i) => (
                  <li key={i} className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                    {take}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Reference Command Cheat Sheet Table */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                Command Reference Cheat Sheet
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Command Syntax</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Example Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stageData.review.cheatSheet.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="p-2.5 text-emerald-400 font-bold">{item.command}</td>
                        <td className="p-2.5 text-slate-300">{item.description}</td>
                        <td className="p-2.5 text-sky-300">{item.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXTENSION PLACEHOLDERS / FUTURE STAGES */}
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Module Extensions & Interview Preparation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Interview Questions Card */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      Technical Interview Questions
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                      Extension Point
                    </span>
                  </div>

                  {stageData.review.interviewQuestionsPlaceholder.map((iq, idx) => (
                    <div key={idx} className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-slate-200">{iq.question}</p>
                      <button
                        onClick={() => setOpenInterviewIdx(openInterviewIdx === idx ? null : idx)}
                        className="text-[11px] font-mono text-sky-400 hover:underline flex items-center gap-1"
                        id={`toggle-interview-ans-${idx}`}
                      >
                        {openInterviewIdx === idx ? 'Hide Model Answer' : 'Reveal Model Answer'}
                      </button>
                      {openInterviewIdx === idx && (
                        <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                          {iq.answerHint}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Tutor & Certification Mapping Extensions */}
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-sky-400" />
                      Certification Alignment Summary
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Completing this module satisfies certification domain requirements for CompTIA Security+, OffSec OSCP, and CEH v12.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-slate-950 to-sky-950/40 rounded-xl p-5 border border-sky-900/40 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      AI Security Tutor Assistant
                    </span>
                    <p className="text-xs text-slate-300">
                      Need clarification on any concept or command payload? Use the CLI assistant command <span className="text-sky-300 font-mono font-bold">learn {module.id}</span> anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stage Navigation Action Bar */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
        <button
          onClick={goToPrevStage}
          disabled={currentStageIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold rounded-xl text-xs transition-colors"
          id="journey-prev-stage-btn"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Stage
        </button>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
          Stage {currentStageIndex + 1} of 8: <span className="text-slate-200 font-bold">{STAGES[currentStageIndex].shortLabel}</span>
        </span>

        <button
          onClick={goToNextStage}
          disabled={currentStageIndex === STAGES.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-sky-600/20"
          id="journey-next-stage-btn"
        >
          {currentStageIndex === STAGES.length - 1 ? 'Module Completed' : 'Next Stage'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
