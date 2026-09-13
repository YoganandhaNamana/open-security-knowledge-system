import { OSKSContractError, parseCurriculumIndex, parseModuleContract, toCanonicalModuleViewModel } from '../adapters/osksAdapter';
import type { CanonicalModuleViewModel } from '../types';

export interface FetchLike {
  (input: string): Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
}

export class OSKSCurriculumService {
  constructor(
    private readonly basePath = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/v1`,
    private readonly fetcher: FetchLike = input => fetch(input),
  ) {}

  async loadModules(): Promise<CanonicalModuleViewModel[]> {
    const indexResponse = await this.fetcher(`${this.basePath}/curriculum-index.v1.json`);
    if (!indexResponse.ok) throw new OSKSContractError(`Unable to load curriculum index (HTTP ${indexResponse.status})`);
    const index = parseCurriculumIndex(await indexResponse.json());
    const modules: CanonicalModuleViewModel[] = [];
    for (const volume of index.volumes) {
      for (const chapter of volume.chapters) {
        for (const reference of chapter.modules) {
          const response = await this.fetcher(`${this.basePath}/module-${reference.id}.v1.json`);
          if (!response.ok) throw new OSKSContractError(`Unable to load module ${reference.id} (HTTP ${response.status})`);
          const module = parseModuleContract(await response.json());
          if (module.id !== reference.id) throw new OSKSContractError(`Module export ID ${module.id} does not match index ID ${reference.id}`);
          if (module.volume !== volume.id || module.chapter !== chapter.id) throw new OSKSContractError(`Module ${module.id} does not match its index location`);
          modules.push(toCanonicalModuleViewModel(module));
        }
      }
    }
    return modules;
  }
}
