import React, { useState, useEffect } from 'react';
import { NavTab, SecurityModule, InteractiveLab, UserStats } from './types';
import { INITIAL_USER_STATS, SECURITY_MODULES, INTERACTIVE_LABS, LIVE_CVES, MITRE_TECHNIQUES, KNOWLEDGE_ARTICLES, initCurriculum } from './data/osksData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ModulesView } from './components/ModulesView';
import { LearningJourney } from './components/LearningJourney';
import { TerminalAssistant } from './components/TerminalAssistant';
import { LiveLabTerminal } from './components/LiveLabTerminal';
import { ThreatIntel } from './components/ThreatIntel';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ProfileView } from './components/ProfileView';
import { QuickSearchModal } from './components/QuickSearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [modules, setModules] = useState<SecurityModule[]>(SECURITY_MODULES);
  const [selectedModule, setSelectedModule] = useState<SecurityModule>(SECURITY_MODULES[0]);
  const [labs, setLabs] = useState<InteractiveLab[]>(INTERACTIVE_LABS);
  const [activeLab, setActiveLab] = useState<InteractiveLab>(INTERACTIVE_LABS[0]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Load canonical curriculum on mount and replace placeholders
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await initCurriculum('/osks/exported/v1');
      if (!mounted) return;
      if (res.modules) setModules(res.modules);
      if (res.labs) {
        setLabs(res.labs);
        if (res.labs.length) setActiveLab(res.labs[0]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleFlagSubmitted = (labId: string, flag: string) => {
    setUserStats(prev => {
      const newXp = prev.xp + 250;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        newXpToNext += 1000;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        threatScore: prev.threatScore + 35,
        labsPwned: prev.labsPwned + 1,
        recentActivity: [
          {
            id: `act-${Date.now()}`,
            action: `Captured Flag on Sandbox Lab: ${flag}`,
            timestamp: 'Just now',
            xpEarned: 250
          },
          ...prev.recentActivity
        ]
      };
    });
  };

  const handleSelectModule = (mod: SecurityModule) => {
    setSelectedModule(mod);
    setActiveTab('learning-journey');
    const matchedLab = labs.find(l => l.id === mod.stageData?.handsOnLabId) || labs[0];
    setActiveLab(matchedLab);
  };

  const handleLaunchLab = (lab: InteractiveLab) => {
    setActiveLab(lab);
    setActiveTab('labs');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <div className="flex h-screen w-full overflow-hidden">
        {/* Frosted Glass Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userStats={userStats}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden terminal-scrollbar">
          {/* Header Bar */}
          <Header
            activeTab={activeTab}
            userStats={userStats}
            onOpenSearch={() => setIsSearchOpen(true)}
            onSelectTab={setActiveTab}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isMobileSidebarOpen={isMobileSidebarOpen}
          />

          {/* Tab Views */}
          <main className="flex-1 pb-12">
            {activeTab === 'dashboard' && (
              <Dashboard
                userStats={userStats}
                modules={modules}
                labs={labs}
                onSelectTab={setActiveTab}
                onSelectModule={handleSelectModule}
                onLaunchLab={handleLaunchLab}
              />
            )}

            {activeTab === 'learning-journey' && (
              <LearningJourney
                module={selectedModule}
                allModules={modules}
                userStats={userStats}
                labs={labs}
                onLaunchLab={handleLaunchLab}
                onFlagSubmitted={handleFlagSubmitted}
                onSelectModule={handleSelectModule}
              />
            )}

            {activeTab === 'modules' && (
              <ModulesView
                modules={modules}
                onSelectModule={handleSelectModule}
              />
            )}

            {activeTab === 'terminal' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
                <div className="border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-white font-mono">OSKS Command-Driven Learning Assistant</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Enter structured security commands like <span className="text-sky-400 font-bold">learn &lt;topic&gt;</span>, <span className="text-sky-400 font-bold">diagram</span>, <span className="text-sky-400 font-bold">quiz</span>, <span className="text-sky-400 font-bold">progress</span>, or <span className="text-sky-400 font-bold">help</span> to navigate curriculum content.
                  </p>
                </div>
                <TerminalAssistant
                  activeModule={selectedModule}
                  allModules={modules}
                  userStats={userStats}
                  labs={labs}
                  onNavigateStage={(stg) => {
                    setActiveTab('learning-journey');
                  }}
                  onSelectModule={handleSelectModule}
                  onLaunchLab={handleLaunchLab}
                />
              </div>
            )}

            {activeTab === 'labs' && (
              <LiveLabTerminal
                lab={activeLab}
                onFlagSubmitted={handleFlagSubmitted}
              />
            )}

            {activeTab === 'threat-intel' && (
              <ThreatIntel
                cves={LIVE_CVES}
                mitreTechniques={MITRE_TECHNIQUES}
              />
            )}

            {activeTab === 'knowledge-base' && (
              <KnowledgeBase
                articles={KNOWLEDGE_ARTICLES}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                userStats={userStats}
              />
            )}
          </main>
        </div>
      </div>

      {/* Quick Search Ctrl+K Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        modules={modules}
        labs={labs}
        cves={LIVE_CVES}
        articles={KNOWLEDGE_ARTICLES}
        onSelectTab={setActiveTab}
        onSelectModule={handleSelectModule}
      />
    </div>
  );
}
