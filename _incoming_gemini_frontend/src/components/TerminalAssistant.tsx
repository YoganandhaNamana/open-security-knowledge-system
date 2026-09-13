import React, { useState, useRef, useEffect } from 'react';
import { SecurityModule, UserStats, InteractiveLab } from '../types';
import { Terminal as TerminalIcon, Send, Sparkles, HelpCircle, CheckCircle2, Play, BookOpen, Layers, ShieldAlert, Award, RefreshCw, ChevronRight } from 'lucide-react';

interface TerminalAssistantProps {
  activeModule?: SecurityModule;
  allModules: SecurityModule[];
  userStats: UserStats;
  labs: InteractiveLab[];
  onNavigateStage?: (stageId: string) => void;
  onSelectModule?: (module: SecurityModule) => void;
  onLaunchLab?: (lab: InteractiveLab) => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalAssistant: React.FC<TerminalAssistantProps> = ({
  activeModule,
  allModules,
  userStats,
  labs,
  onNavigateStage,
  onSelectModule,
  onLaunchLab
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: (
        <div className="space-y-2 font-mono text-xs text-sky-300">
          <div className="text-emerald-400 font-bold">
            [OSKS LEARNING ASSISTANT CLI v2.0 READY]
          </div>
          <p className="text-slate-300">
            Welcome, <span className="text-sky-400 font-bold">{userStats.username}</span>. I am your structured Cybersecurity Learning Assistant.
          </p>
          <div className="bg-slate-900/80 p-3 rounded border border-slate-800 text-slate-300 space-y-1">
            <p className="text-amber-400 font-bold">Quick Command Reference:</p>
            <p>• <span className="text-sky-400 font-bold">learn &lt;topic&gt;</span> - Explore structured 8-stage learning journey</p>
            <p>• <span className="text-sky-400 font-bold">diagram &lt;topic&gt;</span> - Renders interactive sequence/network diagram</p>
            <p>• <span className="text-sky-400 font-bold">example &lt;topic&gt;</span> - Display annotated payload / code example</p>
            <p>• <span className="text-sky-400 font-bold">quiz &lt;topic&gt;</span> - Launch knowledge verification test</p>
            <p>• <span className="text-sky-400 font-bold">lab &lt;topic&gt;</span> - Connect to target sandbox environment</p>
            <p>• <span className="text-sky-400 font-bold">progress</span> - Display actual curriculum completion stats</p>
            <p>• <span className="text-sky-400 font-bold">cheatsheet</span> - Display security syntax cheat sheet</p>
            <p>• <span className="text-sky-400 font-bold">mitre</span> - Show mapped MITRE ATT&CK techniques</p>
            <p>• <span className="text-sky-400 font-bold">next</span> - Advance to the next stage in active topic</p>
            <p>• <span className="text-sky-400 font-bold">help</span> - Display full command guide</p>
          </div>
          {activeModule && (
            <p className="text-slate-400">
              Active Focus: <span className="text-emerald-400 font-bold">{activeModule.title}</span>
            </p>
          )}
        </div>
      )
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const findModuleByQuery = (query: string): SecurityModule | undefined => {
    if (!query) return activeModule || allModules[0];
    const q = query.toLowerCase().trim();
    return allModules.find(
      m =>
        m.id.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  };

  const handleCommandSubmit = (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    // Add to command history
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let outputContent: React.ReactNode = null;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    switch (mainCmd) {
      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'help':
        outputContent = (
          <div className="space-y-3 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-bold border-b border-slate-800 pb-1">
              OSKS LEARNING ASSISTANT - COMMAND DIRECTORY
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">learn [topic]</span>
                <p className="text-slate-400 mt-1">Starts or navigates to topic's 8-stage learning journey.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">diagram [topic]</span>
                <p className="text-slate-400 mt-1">Generates visual sequence diagram & packet flow.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">example [topic]</span>
                <p className="text-slate-400 mt-1">Displays annotated command/payload walkthroughs.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">quiz [topic]</span>
                <p className="text-slate-400 mt-1">Runs immediate knowledge check questions.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">lab [topic]</span>
                <p className="text-slate-400 mt-1">Launches interactive sandbox target environment.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">progress</span>
                <p className="text-slate-400 mt-1">Displays actual user level, XP, pwned labs & stage count.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">cheatsheet</span>
                <p className="text-slate-400 mt-1">Renders CLI syntax & security command matrix.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">mitre</span>
                <p className="text-slate-400 mt-1">Displays mapped MITRE ATT&CK techniques.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">next</span>
                <p className="text-slate-400 mt-1">Steps forward to next stage in active topic.</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold">clear</span>
                <p className="text-slate-400 mt-1">Clears the assistant console buffer.</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'learn': {
        const mod = findModuleByQuery(arg);
        if (!mod) {
          outputContent = (
            <div className="text-xs font-mono text-red-400">
              Module not found matching query "{arg}". Try: <span className="text-sky-300 font-bold">learn recon</span> or <span className="text-sky-300 font-bold">learn webapp</span>.
            </div>
          );
        } else {
          if (onSelectModule) onSelectModule(mod);
          outputContent = (
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="text-emerald-400 font-bold">
                [EXPLORING TOPIC: {mod.title}]
              </div>
              <p>{mod.description}</p>
              <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1">
                <p className="text-sky-400 font-bold">Curriculum Stage Progress:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-[11px]">
                  {['1. Intro', '2. Why Matters', '3. Concept', '4. Diagram', '5. Example', '6. Quiz', '7. Lab', '8. Review'].map((stg, i) => (
                    <div key={stg} className="bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800">
                      {stg}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  if (onSelectModule) onSelectModule(mod);
                  if (onNavigateStage) onNavigateStage('introduction');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold rounded text-xs transition-colors"
              >
                Launch 8-Stage Learning Journey <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        }
        break;
      }

      case 'diagram': {
        const mod = findModuleByQuery(arg);
        if (mod && mod.stageData) {
          const diag = mod.stageData.interactiveDiagram;
          if (onSelectModule) onSelectModule(mod);
          if (onNavigateStage) onNavigateStage('interactive-diagram');

          outputContent = (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="text-sky-400 font-bold">
                [VISUAL SEQUENCE DIAGRAM: {diag.title}]
              </div>
              <p className="text-slate-400">{diag.description}</p>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 text-slate-300 space-y-2 overflow-x-auto">
                <div className="text-amber-400 font-bold text-[11px]">ASCII Packet Sequence:</div>
                <pre className="text-[11px] text-emerald-400 leading-tight">
{`+-----------------------+     TCP SYN      +-----------------------+
| Attacker (10.10.0.5)  | --------------> | Gateway / Firewall    |
+-----------------------+                  +-----------------------+
            |                                           |
            |              SYN-ACK Packet               v
            + <---------------------------------- + Target Server +
            |                                     | (10.10.14.88) |
            |              TCP RST (Reset)        +---------------+
            + ----------------------------------------->`}
                </pre>
              </div>
              <div className="space-y-1">
                {diag.steps.map(s => (
                  <div key={s.stepNumber} className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                    <span className="text-sky-400 font-bold">{s.title}:</span> {s.explanation}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          outputContent = (
            <div className="text-xs font-mono text-amber-400">
              Diagram preview for "{arg || 'current topic'}". Switching to Interactive Diagram view...
            </div>
          );
          if (onNavigateStage) onNavigateStage('interactive-diagram');
        }
        break;
      }

      case 'example': {
        const mod = findModuleByQuery(arg);
        if (mod && mod.stageData) {
          const ex = mod.stageData.example;
          outputContent = (
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="text-emerald-400 font-bold">[REAL-WORLD EXECUTION EXAMPLE]</div>
              <p className="text-slate-400">{ex.scenario}</p>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 text-sky-300 font-mono">
                <code>{ex.commandOrCode}</code>
              </div>
              <div className="space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">Parameter Breakdown:</span>
                {ex.stepByStepBreakdown.map((b, i) => (
                  <div key={i} className="text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold">{b.lineOrCommand}</span>: {b.explanation}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          outputContent = (
            <div className="text-xs font-mono text-slate-300">
              Displaying command example for {activeModule?.title || 'active topic'}.
            </div>
          );
          if (onNavigateStage) onNavigateStage('example');
        }
        break;
      }

      case 'quiz': {
        const mod = findModuleByQuery(arg);
        if (mod && mod.stageData) {
          const qObj = mod.stageData.quiz.questions[0];
          outputContent = (
            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="text-amber-400 font-bold">[KNOWLEDGE VERIFICATION QUIZ]</div>
              <p className="text-slate-200 font-bold">{qObj.question}</p>
              <div className="space-y-1.5">
                {qObj.options.map((opt, idx) => (
                  <div key={idx} className="bg-slate-900 hover:bg-slate-800 p-2 rounded border border-slate-800 text-slate-300 text-[11px]">
                    <span className="text-sky-400 font-bold">[{idx + 1}]</span> {opt}
                  </div>
                ))}
              </div>
              <p className="text-slate-400 italic">Type command in terminal or click Stage 6 (Quiz) to answer interactively.</p>
            </div>
          );
        } else {
          if (onNavigateStage) onNavigateStage('quiz');
          outputContent = <div className="text-xs font-mono text-sky-400">Launching Stage 6 Quiz...</div>;
        }
        break;
      }

      case 'lab': {
        const matchedLab = labs.find(l => l.category.toLowerCase().includes(arg.toLowerCase())) || labs[0];
        if (onLaunchLab) onLaunchLab(matchedLab);
        if (onNavigateStage) onNavigateStage('hands-on-lab');
        outputContent = (
          <div className="text-xs font-mono text-emerald-400">
            Connecting to Sandbox Target Environment <span className="font-bold">[{matchedLab.title}]</span> at <span className="font-bold">{matchedLab.targetIp}</span>...
          </div>
        );
        break;
      }

      case 'progress': {
        const completedMods = allModules.filter(m => m.status === 'COMPLETED').length;
        outputContent = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-emerald-400 font-bold">[REAL LEARNER PROGRESS STATS]</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Level:</span> <span className="text-sky-400 font-bold">{userStats.level}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Total XP:</span> <span className="text-amber-400 font-bold">{userStats.xp} XP</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Modules Done:</span> <span className="text-emerald-400 font-bold">{completedMods} / {allModules.length}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Labs Pwned:</span> <span className="text-purple-400 font-bold">{userStats.labsPwned}</span>
              </div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
              <span className="text-sky-400 font-bold text-[11px]">Module Progression:</span>
              {allModules.map(m => (
                <div key={m.id} className="flex items-center justify-between text-[11px] border-b border-slate-900 pb-1">
                  <span>{m.title}</span>
                  <span className={m.status === 'COMPLETED' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {m.progressPercent}% ({m.status})
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      }

      case 'cheatsheet': {
        outputContent = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-sky-400 font-bold">[SECURITY CHEAT SHEET MATRIX]</div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-amber-400 border-b border-slate-800 pb-1 font-bold">
                <span>COMMAND</span>
                <span>PURPOSE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">nmap -sS -sV -T4 &lt;target&gt;</span>
                <span className="text-slate-400">SYN Stealth Version Scan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">curl -i http://&lt;target&gt;</span>
                <span className="text-slate-400">Inspect HTTP Banners</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">sqlmap -u &lt;url&gt; --dbs</span>
                <span className="text-slate-400">Automate SQL Injection Dump</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">wireshark -k -i eth0</span>
                <span className="text-slate-400">Live Packet Capture</span>
              </div>
            </div>
          </div>
        );
        break;

      }

      case 'mitre': {
        outputContent = (
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-purple-400 font-bold">[MITRE ATT&CK MAPPED TECHNIQUES]</div>
            {activeModule?.mitreMapping?.map((m, idx) => (
              <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-800 text-sky-300">
                • {m}
              </div>
            )) || <p className="text-slate-400">T1595 (Active Scanning), T1190 (Exploit Public Application)</p>}
          </div>
        );
        break;
      }

      case 'next': {
        if (onNavigateStage) onNavigateStage('next');
        outputContent = (
          <div className="text-xs font-mono text-emerald-400">
            Advancing learner to the next stage in active topic learning journey...
          </div>
        );
        break;
      }

      default:
        outputContent = (
          <div className="text-xs font-mono text-amber-400">
            Unknown command: "{trimmed}". Type <span className="text-sky-300 font-bold">help</span> to list valid commands.
          </div>
        );
        break;
    }

    setLogs(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        timestamp: timeStr,
        output: outputContent
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl flex flex-col h-[520px] overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 ml-2">
            <TerminalIcon className="w-4 h-4 text-sky-400" />
            OSKS Learning Assistant Terminal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase tracking-wider">
            CLI Assistant
          </span>
          <button
            onClick={() => handleCommandSubmit('clear')}
            className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Clear Console"
            id="terminal-clear-btn"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Log Output Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 terminal-scrollbar text-xs">
        {logs.map((log) => (
          <div key={log.id} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="text-emerald-400 font-bold">osks-assistant@learning:~$</span>
              <span className="text-sky-300 font-bold">{log.command}</span>
              <span className="text-slate-400 text-[10px] ml-auto">{log.timestamp}</span>
            </div>
            <div className="pl-4 border-l-2 border-slate-800/80 my-1">
              {log.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Interactive Command Buttons */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-2 flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Quick Commands:</span>
        {['help', 'learn recon', 'diagram', 'example', 'quiz', 'lab', 'progress', 'cheatsheet', 'mitre'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommandSubmit(cmd)}
            className="text-[11px] bg-slate-950 hover:bg-slate-800 text-sky-300 border border-slate-800 px-2 py-0.5 rounded transition-colors"
            id={`term-btn-${cmd.replace(/\s+/g, '-')}`}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Command Input Line */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center gap-2">
        <span className="text-emerald-400 font-bold text-xs">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command (e.g. 'learn recon', 'diagram', 'quiz', 'help')..."
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-400 text-xs focus:outline-none font-mono"
          autoFocus
          id="terminal-assistant-input"
        />
        <button
          onClick={() => handleCommandSubmit(inputVal)}
          className="p-1.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold rounded transition-colors"
          title="Submit Command"
          id="terminal-submit-btn"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
