import type {
  CanonicalEvidenceSource,
  CanonicalModuleViewModel,
  CanonicalSkillLevel,
} from '../types';

export const OSKS_SCHEMA_VERSION = 'osks-export/v1';

export class OSKSContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OSKSContractError';
  }
}

type UnknownRecord = Record<string, unknown>;

export interface CurriculumIndexContract {
  schemaVersion: string;
  volumes: Array<{
    id: string;
    title: string;
    chapters: Array<{
      id: string;
      title: string;
      modules: Array<{ id: string; title?: string }>;
    }>;
  }>;
}

export interface ModuleContract {
  schemaVersion: string;
  id: string;
  title: string;
  volume: string;
  chapter: string;
  stability: 'static' | 'time_sensitive';
  status?: string;
  taxonomy: {
    domain: string;
    discipline: string;
    technology: string;
    skill_level?: string;
  };
  learning_outcomes: string[];
  evidence: { sources: CanonicalEvidenceSource[] };
  knowledge_graph: {
    prerequisites?: string[];
    next_topics?: string[];
    lab_references?: string[];
    glossary_terms?: string[];
    mitre_attack?: string[];
  };
}

const canonicalModuleId = /^[A-Z]{2,4}-\d{3}$/;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new OSKSContractError(`${field} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(value: unknown, field: string, minimum = 0): string[] {
  if (!Array.isArray(value) || value.length < minimum || value.some(item => typeof item !== 'string')) {
    throw new OSKSContractError(`${field} must be an array of strings`);
  }
  return value;
}

function requireSchemaVersion(value: UnknownRecord): void {
  if (value.schemaVersion !== OSKS_SCHEMA_VERSION) {
    throw new OSKSContractError(`Unsupported OSKS schema version: ${String(value.schemaVersion)}`);
  }
}

function optionalStringArray(value: unknown, field: string): string[] {
  return value === undefined ? [] : requireStringArray(value, field);
}

export function parseCurriculumIndex(payload: unknown): CurriculumIndexContract {
  if (!isRecord(payload)) throw new OSKSContractError('Curriculum index must be an object');
  requireSchemaVersion(payload);
  if (!Array.isArray(payload.volumes)) throw new OSKSContractError('volumes must be an array');

  return {
    schemaVersion: OSKS_SCHEMA_VERSION,
    volumes: payload.volumes.map((volume, volumeIndex) => {
      if (!isRecord(volume)) throw new OSKSContractError(`volumes[${volumeIndex}] must be an object`);
      if (!Array.isArray(volume.chapters)) throw new OSKSContractError(`volumes[${volumeIndex}].chapters must be an array`);
      return {
        id: requireString(volume.id, `volumes[${volumeIndex}].id`),
        title: requireString(volume.title, `volumes[${volumeIndex}].title`),
        chapters: volume.chapters.map((chapter, chapterIndex) => {
          if (!isRecord(chapter)) throw new OSKSContractError(`chapters[${chapterIndex}] must be an object`);
          if (!Array.isArray(chapter.modules)) throw new OSKSContractError(`chapters[${chapterIndex}].modules must be an array`);
          return {
            id: requireString(chapter.id, `chapters[${chapterIndex}].id`),
            title: requireString(chapter.title, `chapters[${chapterIndex}].title`),
            modules: chapter.modules.map((module, moduleIndex) => {
              if (!isRecord(module)) throw new OSKSContractError(`modules[${moduleIndex}] must be an object`);
              const id = requireString(module.id, `modules[${moduleIndex}].id`);
              if (!canonicalModuleId.test(id)) throw new OSKSContractError(`Non-canonical module ID: ${id}`);
              return typeof module.title === 'string' ? { id, title: module.title } : { id };
            }),
          };
        }),
      };
    }),
  };
}

export function parseModuleContract(payload: unknown): ModuleContract {
  if (!isRecord(payload)) throw new OSKSContractError('Module export must be an object');
  requireSchemaVersion(payload);
  const id = requireString(payload.id, 'id');
  if (!canonicalModuleId.test(id)) throw new OSKSContractError(`Non-canonical module ID: ${id}`);
  if (!isRecord(payload.taxonomy)) throw new OSKSContractError('taxonomy must be an object');
  if (!isRecord(payload.evidence) || !Array.isArray(payload.evidence.sources) || payload.evidence.sources.length === 0) {
    throw new OSKSContractError('evidence.sources must be a non-empty array');
  }
  if (!isRecord(payload.knowledge_graph)) throw new OSKSContractError('knowledge_graph must be an object');

  const sources = payload.evidence.sources.map((source, index) => {
    if (!isRecord(source)) throw new OSKSContractError(`evidence.sources[${index}] must be an object`);
    const authority = requireString(source.authority, `evidence.sources[${index}].authority`);
    if (!['Primary', 'Secondary', 'Supporting'].includes(authority)) {
      throw new OSKSContractError(`Invalid evidence authority: ${authority}`);
    }
    return {
      id: requireString(source.id, `evidence.sources[${index}].id`),
      type: requireString(source.type, `evidence.sources[${index}].type`),
      authority: authority as CanonicalEvidenceSource['authority'],
      uri: source.uri === undefined || source.uri === null ? source.uri as null | undefined : requireString(source.uri, `evidence.sources[${index}].uri`),
      control: source.control === undefined || source.control === null ? source.control as null | undefined : requireString(source.control, `evidence.sources[${index}].control`),
    };
  });

  return {
    schemaVersion: OSKS_SCHEMA_VERSION,
    id,
    title: requireString(payload.title, 'title'),
    volume: requireString(payload.volume, 'volume'),
    chapter: requireString(payload.chapter, 'chapter'),
    stability: payload.stability === 'static' || payload.stability === 'time_sensitive'
      ? payload.stability
      : (() => { throw new OSKSContractError('stability must be static or time_sensitive'); })(),
    status: payload.status === undefined ? undefined : requireString(payload.status, 'status'),
    taxonomy: {
      domain: requireString(payload.taxonomy.domain, 'taxonomy.domain'),
      discipline: requireString(payload.taxonomy.discipline, 'taxonomy.discipline'),
      technology: requireString(payload.taxonomy.technology, 'taxonomy.technology'),
      skill_level: payload.taxonomy.skill_level === undefined ? undefined : requireString(payload.taxonomy.skill_level, 'taxonomy.skill_level'),
    },
    learning_outcomes: requireStringArray(payload.learning_outcomes, 'learning_outcomes', 1),
    evidence: { sources },
    knowledge_graph: {
      prerequisites: optionalStringArray(payload.knowledge_graph.prerequisites, 'knowledge_graph.prerequisites'),
      next_topics: optionalStringArray(payload.knowledge_graph.next_topics, 'knowledge_graph.next_topics'),
      lab_references: optionalStringArray(payload.knowledge_graph.lab_references, 'knowledge_graph.lab_references'),
      glossary_terms: optionalStringArray(payload.knowledge_graph.glossary_terms, 'knowledge_graph.glossary_terms'),
      mitre_attack: optionalStringArray(payload.knowledge_graph.mitre_attack, 'knowledge_graph.mitre_attack'),
    },
  };
}

export function presentSkillLevel(skillLevel: string | undefined): CanonicalSkillLevel | undefined {
  if (skillLevel === undefined) return undefined;
  return skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1);
}

export function toCanonicalModuleViewModel(module: ModuleContract): CanonicalModuleViewModel {
  return {
    id: module.id,
    title: module.title,
    volume: module.volume,
    chapter: module.chapter,
    taxonomy: {
      domain: module.taxonomy.domain,
      discipline: module.taxonomy.discipline,
      technology: module.taxonomy.technology,
      skillLevel: presentSkillLevel(module.taxonomy.skill_level),
    },
    learningOutcomes: [...module.learning_outcomes],
    prerequisites: [...(module.knowledge_graph.prerequisites ?? [])],
    nextTopics: [...(module.knowledge_graph.next_topics ?? [])],
    glossaryTerms: [...(module.knowledge_graph.glossary_terms ?? [])],
    labReferences: [...(module.knowledge_graph.lab_references ?? [])],
    mitreReferences: [...(module.knowledge_graph.mitre_attack ?? [])],
    evidenceSources: [...module.evidence.sources],
    lifecycleStatus: module.status,
  };
}
