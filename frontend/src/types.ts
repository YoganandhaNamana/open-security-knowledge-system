export type NavTab = 'dashboard' | 'modules' | 'learning-journey' | 'labs' | 'terminal' | 'threat-intel' | 'knowledge-base' | 'profile';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ModuleCategory = 'Offensive Security' | 'Defensive & SOC' | 'Web Exploitation' | 'Reverse Engineering' | 'Cloud & DevSecOps';

export type LearningStageId = 
  | 'introduction' 
  | 'why-it-matters' 
  | 'concept' 
  | 'interactive-diagram' 
  | 'example' 
  | 'quiz' 
  | 'hands-on-lab' 
  | 'review';

export interface LearningStageInfo {
  id: LearningStageId;
  title: string;
  shortLabel: string;
  stepNumber: number;
  estimatedMinutes: number;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CertMapping {
  certName: string;
  code: string;
  relevance: string;
}

export interface DiagramStep {
  stepNumber: number;
  title: string;
  sender: string;
  receiver: string;
  action: string;
  payload?: string;
  explanation: string;
  highlightNodes?: string[];
}

export interface InteractiveDiagramData {
  title: string;
  description: string;
  nodes: { id: string; label: string; type: 'attacker' | 'gateway' | 'server' | 'database' | 'client'; ip?: string }[];
  steps: DiagramStep[];
}

export interface ModuleStageData {
  introduction: {
    overview: string;
    learningObjectives: string[];
    prerequisites: string[];
    certifications: CertMapping[];
    difficulty: Difficulty;
    estimatedTotalTime: string;
  };
  whyItMatters: {
    realWorldImpact: string;
    famousBreaches: { title: string; year: string; company: string; summary: string; impact: string }[];
    threatMetrics: { label: string; value: string; source: string }[];
    businessRisk: string;
  };
  concept: {
    corePrinciples: { title: string; explanation: string; icon?: string }[];
    detailedTheory: string;
    keyTerminology: { term: string; definition: string }[];
    defenseMechanisms: string[];
  };
  interactiveDiagram: InteractiveDiagramData;
  example: {
    scenario: string;
    commandOrCode: string;
    language: string;
    stepByStepBreakdown: { lineOrCommand: string; explanation: string }[];
    expectedOutput: string;
  };
  quiz: {
    title: string;
    description: string;
    questions: QuizQuestion[];
    passingScore: number;
  };
  handsOnLabId: string;
  review: {
    summaryTakeaways: string[];
    cheatSheet: { command: string; description: string; example: string }[];
    mitreTechniques: { id: string; name: string; tactic: string }[];
    interviewQuestionsPlaceholder: { question: string; answerHint: string }[];
  };
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'reading' | 'lab' | 'quiz';
  completed: boolean;
}

export interface SecurityModule {
  id: string;
  title: string;
  category: ModuleCategory;
  description: string;
  longDescription: string;
  icon: string;
  difficulty: Difficulty;
  lessonsCount: number;
  labsCount: number;
  progressPercent: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED' | 'NOT_STARTED';
  xpReward: number;
  prerequisite?: string;
  mitreMapping?: string[];
  lessons: Lesson[];
  stageData?: ModuleStageData;
  completedStages?: LearningStageId[];
}

export interface InteractiveLab {
  id: string;
  title: string;
  targetIp?: string;
  scenario: string;
  difficulty: Difficulty;
  estimatedTime: string;
  category: string;
  status: 'available' | 'in_progress' | 'completed';
  flag?: string;
  hints: string[];
  tasks: {
    id: string;
    description: string;
    commandHint?: string;
    completed: boolean;
  }[];
  initialTerminalLogs: string[];
}

export interface CVEItem {
  id: string;
  cveId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvssScore: number;
  summary: string;
  affectedSystem: string;
  mitigation: string;
  publishedDate: string;
}

export interface MitreTechnique {
  id: string;
  tactics: string;
  name: string;
  description: string;
  detection: string;
  mitigation: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  tags: string[];
  readTime: string;
  summary: string;
  content: string;
  codeSnippet?: string;
}

export interface UserStats {
  username: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  threatScore: number;
  labsPwned: number;
  rank: number;
  streakDays: number;
  recentActivity: {
    id: string;
    action: string;
    timestamp: string;
    xpEarned: number;
  }[];
  skills: {
    name: string;
    score: number; // 0 - 100
  }[];
}

/**
 * Canonical curriculum data that can be represented without inventing product
 * semantics. This is intentionally distinct from the legacy Gemini UI model
 * above, whose lesson, XP, progress, stage, and lab fields are not part of
 * the OSKS v1 export contract.
 */
export type CanonicalSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;

export interface CanonicalTaxonomy {
  domain: string;
  discipline: string;
  technology: string;
  skillLevel?: CanonicalSkillLevel;
}

export interface CanonicalEvidenceSource {
  id: string;
  type: string;
  authority: 'Primary' | 'Secondary' | 'Supporting';
  uri?: string | null;
  control?: string | null;
}

export interface CanonicalModuleViewModel {
  id: string;
  title: string;
  volume: string;
  chapter: string;
  taxonomy: CanonicalTaxonomy;
  learningOutcomes: string[];
  prerequisites: string[];
  nextTopics: string[];
  glossaryTerms: string[];
  labReferences: string[];
  mitreReferences: string[];
  evidenceSources: CanonicalEvidenceSource[];
  lifecycleStatus?: string;
}
