import { describe, expect, it } from 'vitest';
import { OSKSContractError, parseModuleContract, toCanonicalModuleViewModel } from './osksAdapter';
import { OSKSCurriculumService } from '../services/osksCurriculumService';

const moduleExport = {
  schemaVersion: 'osks-export/v1', id: 'NET-101', title: 'TCP/IP Protocol Mechanics', volume: 'vol_01', chapter: 'ch_networking', stability: 'static', status: 'Research',
  taxonomy: { domain: 'defensive_security', discipline: 'network_security', technology: 'tcp_ip', skill_level: 'intermediate' },
  learning_outcomes: ['Explain TCP handshakes.'],
  evidence: { sources: [{ id: 'RFC-793', type: 'RFC', authority: 'Primary', uri: null, control: null }] },
  knowledge_graph: { prerequisites: ['NET-100'], next_topics: ['NET-102'], lab_references: ['LAB-001'], glossary_terms: ['tcp'], mitre_attack: ['T1046'] },
};

describe('OSKS adapter', () => {
  it('preserves canonical identity, title, taxonomy, outcomes, and references', () => {
    const model = toCanonicalModuleViewModel(parseModuleContract(moduleExport));
    expect(model.id).toBe('NET-101');
    expect(model.title).toBe('TCP/IP Protocol Mechanics');
    expect(model.taxonomy).toEqual({ domain: 'defensive_security', discipline: 'network_security', technology: 'tcp_ip', skillLevel: 'Intermediate' });
    expect(model.learningOutcomes).toEqual(['Explain TCP handshakes.']);
    expect(model.prerequisites).toEqual(['NET-100']);
    expect(model.labReferences).toEqual(['LAB-001']);
    expect(model.mitreReferences).toEqual(['T1046']);
  });

  it('does not fabricate legacy lesson, XP, lab, or progress fields', () => {
    const model = toCanonicalModuleViewModel(parseModuleContract(moduleExport));
    expect(model).not.toHaveProperty('lessons');
    expect(model).not.toHaveProperty('xpReward');
    expect(model).not.toHaveProperty('labsCount');
    expect(model).not.toHaveProperty('progressPercent');
  });

  it('handles missing optional knowledge graph arrays explicitly as empty references', () => {
    const input = { ...moduleExport, knowledge_graph: {} };
    const model = toCanonicalModuleViewModel(parseModuleContract(input));
    expect(model.labReferences).toEqual([]);
    expect(model.prerequisites).toEqual([]);
  });

  it('rejects malformed contract data with a controlled error', () => {
    expect(() => parseModuleContract({ ...moduleExport, id: 'mod-recon' })).toThrow(OSKSContractError);
    expect(() => parseModuleContract({ ...moduleExport, learning_outcomes: [] })).toThrow('learning_outcomes');
  });

  it('does not silently fall back when a canonical module request fails', async () => {
    const index = { schemaVersion: 'osks-export/v1', volumes: [{ id: 'vol_01', title: 'Volume', chapters: [{ id: 'ch_networking', title: 'Chapter', modules: [{ id: 'NET-101', title: 'TCP/IP Protocol Mechanics' }] }] }] };
    const service = new OSKSCurriculumService('/api/v1', async input => input.endsWith('curriculum-index.v1.json') ? { ok: true, status: 200, json: async () => index } : { ok: false, status: 404, json: async () => ({}) });
    await expect(service.loadModules()).rejects.toThrow('Unable to load module NET-101');
  });
});
