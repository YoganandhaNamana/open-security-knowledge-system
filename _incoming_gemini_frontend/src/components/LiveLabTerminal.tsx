import React, { useState, useRef, useEffect } from 'react';
import { InteractiveLab } from '../types';
import { Terminal as TerminalIcon, Play, RotateCcw, HelpCircle, CheckCircle2, Flag, AlertCircle, Copy, Shield, Sparkles, Send } from 'lucide-react';

interface LiveLabTerminalProps {
  lab: InteractiveLab;
  onFlagSubmitted: (labId: string, flag: string) => void;
}

export const LiveLabTerminal: React.FC<LiveLabTerminalProps> = ({ lab, onFlagSubmitted }) => {
  const [terminalLogs, setTerminalLogs] = useState<string[]>(lab.initialTerminalLogs);
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [userFlagInput, setUserFlagInput] = useState<string>('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showHints, setShowHints] = useState<boolean>(false);
  const [tasksState, setTasksState] = useState(lab.tasks);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    const newLogs = [...terminalLogs, `root@osks-sandbox:~# ${cmd}`];

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommandInput('');

    // Simulated CLI execution logic
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setTerminalLogs([]);
      return;
    }

    if (lower === 'help') {
      newLogs.push('Available tools in OSKS sandbox:');
      newLogs.push('  nmap -sV <ip>        : Scan target for open ports and service versions');
      newLogs.push('  gobuster dir -u <url>: Brute force directory endpoints');
      newLogs.push('  sqlmap -u <url>      : Test parameters for SQL injection');
      newLogs.push('  curl <url>           : Fetch HTTP response headers or web content');
      newLogs.push('  cat /flag.txt        : Print system flag file if accessed');
      newLogs.push('  ls -la               : List current sandbox files');
      newLogs.push('  whoami               : Display active user privileges');
      newLogs.push('  clear                : Clear terminal output screen');
    } else if (lower.includes('nmap')) {
      newLogs.push(`Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-04 04:50 UTC`);
      newLogs.push(`Nmap scan report for ${lab.targetIp}`);
      newLogs.push(`Host is up (0.0018s latency).`);
      newLogs.push(`Not shown: 997 closed tcp ports (reset)`);
      newLogs.push(`PORT     STATE SERVICE VERSION`);
      newLogs.push(`22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1`);
      newLogs.push(`80/tcp   open  http    nginx 1.18.0 (Ubuntu)`);
      newLogs.push(`8080/tcp open  http    Node.js Express / CyberCorp Core REST v1.2`);
      newLogs.push(`Service detection performed. Please report any suspicious endpoints.`);

      // Complete Task 1
      setTasksState(prev => prev.map((t, idx) => idx === 0 ? { ...t, completed: true } : t));
    } else if (lower.includes('gobuster')) {
      newLogs.push(`===============================================================`);
      newLogs.push(`Gobuster v3.5 - Directory Brute Forcing`);
      newLogs.push(`===============================================================`);
      newLogs.push(`[+] Url:                     http://${lab.targetIp}:8080/`);
      newLogs.push(`[+] Threads:                 10`);
      newLogs.push(`===============================================================`);
      newLogs.push(`/api                  (Status: 200) [Size: 1042]`);
      newLogs.push(`/login                (Status: 200) [Size: 2410]`);
      newLogs.push(`/flag.txt             (Status: 200) [Size: 44]`);
      newLogs.push(`===============================================================`);

      setTasksState(prev => prev.map((t, idx) => idx === 1 ? { ...t, completed: true } : t));
    } else if (lower.includes('curl') && lower.includes('flag.txt')) {
      newLogs.push(`HTTP/1.1 200 OK`);
      newLogs.push(`Content-Type: text/plain`);
      newLogs.push(`\n${lab.flag}\n`);

      setTasksState(prev => prev.map((t, idx) => idx === 2 ? { ...t, completed: true } : t));
    } else if (lower === 'cat /flag.txt' || lower === 'cat flag.txt') {
      newLogs.push(`[+] FLAG READ SUCCESS:`);
      newLogs.push(`${lab.flag}`);

      setTasksState(prev => prev.map(t => ({ ...t, completed: true })));
    } else if (lower === 'ls' || lower === 'ls -la') {
      newLogs.push(`total 32`);
      newLogs.push(`drwxr-xr-x 1 root root 4096 Aug  4 04:50 .`);
      newLogs.push(`drwxr-xr-x 1 root root 4096 Aug  4 04:50 ..`);
      newLogs.push(`-rw-r--r-- 1 root root   44 Aug  4 04:50 flag.txt`);
      newLogs.push(`-rwxr-xr-x 1 root root 2048 Aug  4 04:50 scan_script.py`);
    } else if (lower === 'whoami') {
      newLogs.push(`root (OSKS Cyber Lab Root Permissions)`);
    } else {
      newLogs.push(`bash: ${cmd}: command executed in simulated sandbox environment. Type "help" for valid tools.`);
    }

    setTerminalLogs(newLogs);
  };

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (userFlagInput.trim() === lab.flag) {
      setFlagStatus('success');
      onFlagSubmitted(lab.id, userFlagInput.trim());
    } else {
      setFlagStatus('error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase mb-1">
            <TerminalIcon size={14} />
            <span>Interactive Sandbox • {lab.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {lab.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-300">
            <span className="text-slate-500">TARGET_IP:</span>
            <span className="text-emerald-400 font-bold">{lab.targetIp}</span>
          </div>

          <button
            onClick={() => setTerminalLogs(lab.initialTerminalLogs)}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-colors"
            title="Reset Sandbox"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Sandbox Column (2 cols) */}
        <div className="lg:col-span-2 glass-panel border border-white/10 rounded-2xl flex flex-col h-[580px] overflow-hidden shadow-2xl">
          {/* Terminal Top Window Bar */}
          <div className="bg-slate-900/90 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">root@osks-sandbox:~ (bash)</span>
            </div>

            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CONTAINER ACTIVE
            </div>
          </div>

          {/* Terminal Screen Body */}
          <div className="flex-1 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-y-auto space-y-2 terminal-scrollbar">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                {log.startsWith('root@osks-sandbox:~#') ? (
                  <span className="text-sky-400 font-bold">{log}</span>
                ) : log.includes('FLAG') || log.includes('OSKS{') ? (
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 p-1 rounded">{log}</span>
                ) : log.includes('ERROR') ? (
                  <span className="text-rose-400">{log}</span>
                ) : (
                  <span className="text-slate-300">{log}</span>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          {/* Terminal Command Input Form */}
          <form onSubmit={handleExecuteCommand} className="bg-slate-900 border-t border-white/10 p-3 flex items-center gap-2">
            <span className="text-sky-400 font-mono text-xs font-bold pl-2">root@osks:~#</span>
            <input
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              placeholder="Type cybersecurity command (e.g., 'nmap -sV 10.10.14.88', 'help')..."
              className="flex-1 bg-transparent border-none text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="p-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Lab Briefing & Flag Submission Side Column */}
        <div className="space-y-6">
          {/* Scenario & Tasks */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4">
            <h3 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={14} />
              Mission Scenario
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lab.scenario}
            </p>

            {/* Task Checklist */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Task Objectives ({tasksState.filter(t => t.completed).length} / {tasksState.length})
              </div>

              {tasksState.map((task, idx) => (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    task.completed
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-300'
                      : 'bg-white/5 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={14}
                      className={task.completed ? 'text-emerald-400 shrink-0 mt-0.5' : 'text-slate-600 shrink-0 mt-0.5'}
                    />
                    <div className="space-y-1">
                      <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {task.description}
                      </span>
                      {task.commandHint && (
                        <div className="text-[10px] font-mono text-sky-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5 inline-block">
                          {task.commandHint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flag Submitter Widget */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
            <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Flag size={14} />
              Submit Captured Flag
            </h3>

            <p className="text-[11px] text-slate-400">
              Find the flag string in format <code className="text-sky-300 font-mono">OSKS&#123;...&#125;</code> inside target files.
            </p>

            <form onSubmit={handleVerifyFlag} className="space-y-2">
              <input
                type="text"
                value={userFlagInput}
                onChange={e => setUserFlagInput(e.target.value)}
                placeholder="OSKS{flag_string_here}"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />

              <button
                type="submit"
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
              >
                Submit & Claim XP (+250 XP)
              </button>
            </form>

            {flagStatus === 'success' && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>FLAG ACCEPTED! +250 XP Awarded to profile.</span>
              </div>
            )}

            {flagStatus === 'error' && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={16} />
                <span>INCORRECT FLAG. Verify target terminal output.</span>
              </div>
            )}
          </div>

          {/* Hints Toggle */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle size={14} className="text-sky-400" />
                Need Assistance? ({lab.hints.length} Hints)
              </span>
              <span>{showHints ? 'Hide' : 'Unlock'}</span>
            </button>

            {showHints && (
              <div className="pt-2 space-y-2 border-t border-white/10 text-xs text-slate-300">
                {lab.hints.map((hint, idx) => (
                  <div key={idx} className="p-2 bg-slate-900 rounded border border-white/5 font-mono text-[11px] leading-relaxed">
                    <span className="text-sky-400 font-bold">Hint {idx + 1}:</span> {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
