import { SecurityModule, InteractiveLab, UserStats } from '../types';

// Minimal local UI-only user stats (kept local, not canonical)
export const INITIAL_USER_STATS: UserStats = {
  username: 'guest_user',
  title: 'Learner',
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  threatScore: 0,
  labsPwned: 0,
  rank: 0,
  streakDays: 0,
  recentActivity: [],
  skills: [],
};

// Placeholders until canonical data loads
export let SECURITY_MODULES: SecurityModule[] = [
  {
    id: 'NET-101',
    title: 'Loading...',
    category: 'Offensive Security',
    description: 'Loading curriculum...',
    longDescription: '',
    icon: '📘',
    difficulty: 'Beginner',
    lessonsCount: 0,
    labsCount: 0,
    progressPercent: 0,
    status: 'NOT_STARTED',
    xpReward: 0,
    lessons: [],
  },
];

export let INTERACTIVE_LABS: InteractiveLab[] = [];

export const LIVE_CVES: any[] = [];
export const MITRE_TECHNIQUES: any[] = [];
export const KNOWLEDGE_ARTICLES: any[] = [];

function mapModuleToSecurityModule(mod: any): SecurityModule {
  return {
    id: mod.id,
    title: mod.title || mod.id,
    category: (mod.taxonomy?.discipline as any) || 'Offensive Security',
    description: (mod.rendered_html && String(mod.rendered_html).slice(0, 300)) || mod.title || '',
    longDescription: '',
    icon: '📘',
    difficulty: 'Beginner',
    lessonsCount: (mod.learning_outcomes || []).length,
    labsCount: 0,
    progressPercent: 0,
    status: (mod.status as any) || 'NOT_STARTED',
    xpReward: 0,
    lessons: [],
  };
}

// initCurriculum fetches canonical exports and replaces placeholders.
export async function initCurriculum(basePath = '/osks/exported/v1') {
  try {
    const idxResp = await fetch(`${basePath}/curriculum-index.v1.json`);
    if (!idxResp.ok) throw new Error('Failed to fetch curriculum index');
    const idx = await idxResp.json();

    const modules: SecurityModule[] = [];
    const labs: InteractiveLab[] = [];

    // Flatten module ids from index
    for (const vol of idx.volumes || []) {
      for (const ch of vol.chapters || []) {
        for (const m of ch.modules || []) {
          try {
            const mid = m.id;
            const modResp = await fetch(`${basePath}/module-${mid}.v1.json`);
            if (!modResp.ok) continue;
            const mod = await modResp.json();
            const mapped = mapModuleToSecurityModule(mod);
            modules.push(mapped);

            // If module references a handsOnLabId, create a simulated lab marker
            if (mod.stageData?.handsOnLabId) {
              labs.push({
                id: mod.stageData.handsOnLabId,
                title: `${mapped.title} - Simulated Lab`,
                scenario: 'Simulated sandbox exercise',
                difficulty: 'Beginner',
                estimatedTime: '30 mins',
                category: mapped.category,
                status: 'available',
                hints: [],
                tasks: [],
                initialTerminalLogs: [],
              } as InteractiveLab);
            }
          } catch (e) {
            // skip missing modules
            console.warn('module fetch error', e);
            continue;
          }
        }
      }
    }

    SECURITY_MODULES = modules.length ? modules : SECURITY_MODULES;
    INTERACTIVE_LABS = labs;
    return { modules: SECURITY_MODULES, labs: INTERACTIVE_LABS };
  } catch (err) {
    console.error('initCurriculum failed', err);
    return { modules: SECURITY_MODULES, labs: INTERACTIVE_LABS };
  }
}
