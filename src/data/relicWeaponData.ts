import type { Collectable } from '../types';
import type { RelicWeaponEntry } from '../api/ffxivcollect';
import type { GridGroup, GridColumn, GridCell } from '../seriesGridData';
import { expansionName, expansionCssClass } from '../seriesGridData';

/**
 * Shared relic weapon data — single source of truth for both the API layer
 * (ffxivcollect.ts) and the UI (AchievementsWeaponsView.tsx).
 *
 * Every entry describes one weapon series by:
 *  - jobs      : ordered list of job codes (position = (relic.order-1) % jobs.length)
 *  - stages    : ordered display labels for each stage column in the UI
 *  - suffixes  : item-name suffixes that `extractWeaponType` must strip to get
 *                the bare weapon-type string (e.g. "Round Brush", "Curtana")
 */

export interface RelicSeriesData {
  /** Job codes in the exact order they appear in the FFXIV Collect API */
  jobs: string[];
  /** Human-readable stage labels shown as column headers in the UI */
  stages: string[];
  /**
   * Item-name suffix words belonging to this series that must be stripped
   * when extracting the bare weapon-type string from a relic name.
   */
  suffixes: string[];
}

/**
 * All known relic weapon series, keyed by the series name returned by the
 * FFXIV Collect API (`relic.type.name`).
 */
export const RELIC_SERIES: Record<string, RelicSeriesData> = {
  'A Relic Reborn': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'WHM', 'BLM', 'SMN', 'SCH', 'NIN'],
    stages: ['Zenith'],
    suffixes: ['Zenith'],
  },
  'Zodiac Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'WHM', 'BLM', 'SMN', 'SCH', 'NIN'],
    stages: ['Atma', 'Animus', 'Novus', 'Nexus', 'Zodiac', 'Zeta'],
    suffixes: ['Atma', 'Animus', 'Novus', 'Nexus', 'Zodiac', 'Zeta'],
  },
  'Anima Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST'],
    stages: ['Anima', 'Hyperconductive', 'Reconditioned', 'Sharpened', 'Complete', 'Lux'],
    suffixes: ['Anima', 'Hyperconductive', 'Reconditioned', 'Sharpened', 'Complete', 'Lux'],
  },
  'Eureka Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST', 'SAM', 'RDM'],
    stages: ['Anemos', 'Pagos', 'Pyros', 'Hydatos'],
    suffixes: ['Anemos', 'Pagos', 'Pyros', 'Hydatos'],
  },
  'Resistance Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST', 'SAM', 'RDM', 'GNB', 'DNC'],
    stages: ['Base', 'Recollection', "Law's Order", "Blade's"],
    suffixes: ['Resistance', 'Recollection', "Law's", 'Augmented', "Blade's"],
  },
  'Manderville Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST', 'SAM', 'RDM', 'GNB', 'DNC', 'SGE', 'RPR'],
    stages: ['Manderville', 'Amazing', 'Majestic', 'Mandervillous'],
    suffixes: ['Manderville', 'Amazing', 'Majestic', 'Mandervillous'],
  },
  'Phantom Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST', 'SAM', 'RDM', 'GNB', 'DNC', 'SGE', 'RPR', 'VPR', 'PCT'],
    stages: ['Penumbrae', 'Umbrae', 'Obscurum', 'Eclipticum', 'Occultum'],
    suffixes: ['Penumbrae', 'Umbrae', 'Obscurum', 'Eclipticum', 'Occultum'],
  },
  'Deep Dungeon Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST', 'SAM', 'RDM', 'GNB', 'DNC', 'RPR', 'SGE', 'VPR', 'PCT'],
    stages: ['Padjali'],
    suffixes: ['Padjali'],
  },
  'Cosmic Tools': {
    jobs: ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'],
    stages: ['Cosmic', 'Stellar', 'Hyper', 'Stars'],
    suffixes: ['Cosmic', 'Stellar', 'Hyper', 'Stars'],
  },
  'Splendorous Tools': {
    jobs: ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'],
    stages: ['Crystalline', 'Brilliant', 'Lodestar'],
    suffixes: ['Crystalline', 'Brilliant', 'Lodestar'],
  },
  'Skysteel Tools': {
    jobs: ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'],
    stages: ['Skysung', 'Skybuilders'],
    suffixes: ['Skysung', 'Skybuilders'],
  },
  'The Unending Coil of Bahamut': {
    jobs: ['PLD', 'WAR', 'WHM', 'SCH', 'MNK', 'DRG', 'NIN', 'BRD', 'BLM', 'SMN', 'AST', 'MCH', 'DRK', 'SAM', 'RDM'],
    stages: ['Ultimate'],
    suffixes: ['Ultimate'],
  },
  "The Weapon's Refrain": {
    jobs: ['PLD', 'WAR', 'WHM', 'SCH', 'MNK', 'DRG', 'NIN', 'BRD', 'BLM', 'SMN', 'AST', 'MCH', 'DRK', 'SAM', 'RDM'],
    stages: ['Ultima'],
    suffixes: ['Ultima'],
  },
  'The Epic of Alexander': {
    jobs: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM'],
    stages: ['Ultimate'],
    suffixes: ['Ultimate'],
  },
  "Dragonsong's Reprise": {
    jobs: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'MNK', 'DRG', 'NIN', 'SAM', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'SGE', 'RPR'],
    stages: ['Ultimate'],
    suffixes: ['Ultimate'],
  },
  'The Omega Protocol': {
    jobs: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'VPR', 'PCT'],
    stages: ['Ultimate'],
    suffixes: ['Ultimate'],
  },
  'Futures Rewritten': {
    jobs: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'VPR', 'PCT'],
    stages: ['Ultimate'],
    suffixes: ['Ultimate'],
  },
  'Exquisite Weapons': {
    jobs: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'PCT', 'BLU'],
    stages: ['Exquisite'],
    suffixes: ['Exquisite'],
  },
  'Figmental Weapons': {
    jobs: ['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'SCH', 'AST', 'SGE', 'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR', 'BRD', 'MCH', 'DNC', 'BLM', 'SMN', 'RDM', 'PCT', 'BLU'],
    stages: ['Figmental'],
    suffixes: ['Figmental', 'Figment'],
  },
};

export const ALL_STAGE_SUFFIXES: Set<string> = new Set(
  Object.values(RELIC_SERIES).flatMap((s) => s.suffixes)
);

export const JOB_NAMES: Record<string, string> = {
  PLD: 'Paladin',
  MNK: 'Monk',
  WAR: 'Warrior',
  DRG: 'Dragoon',
  BRD: 'Bard',
  WHM: 'White Mage',
  BLM: 'Black Mage',
  SMN: 'Summoner',
  SCH: 'Scholar',
  NIN: 'Ninja',
  DRK: 'Dark Knight',
  MCH: 'Machinist',
  AST: 'Astrologian',
  SAM: 'Samurai',
  RDM: 'Red Mage',
  GNB: 'Gunbreaker',
  DNC: 'Dancer',
  SGE: 'Sage',
  RPR: 'Reaper',
  VPR: 'Viper',
  PCT: 'Pictomancer',
  BLU: 'Blue Mage',
  CRP: 'Carpenter',
  BSM: 'Blacksmith',
  ARM: 'Armorer',
  GSM: 'Goldsmith',
  LTW: 'Leatherworker',
  WVR: 'Weaver',
  ALC: 'Alchemist',
  CUL: 'Culinarian',
  MIN: 'Miner',
  BTN: 'Botanist',
  FSH: 'Fisher',
};

export const JOB_SORT_ORDER: string[] = [
  'PLD', 'WAR', 'DRK', 'GNB',
  'WHM', 'SCH', 'AST', 'SGE',
  'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR',
  'BRD', 'MCH', 'DNC',
  'BLM', 'SMN', 'RDM', 'PCT', 'BLU',
  'CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL',
  'MIN', 'BTN', 'FSH',
];

/**
 * Transforms achievement collectables + FFXIV Collect relic data into the
 * generic GridGroup[] format for SeriesGridView.
 *
 * Groups by series → job (columns) → stage (rows), sorted by expansion.
 */
export function buildRelicWeaponGroups(
  collectables: Collectable[],
  relicWeaponsData: Record<number, RelicWeaponEntry>,
  seriesFilter?: string[],
): GridGroup[] {
  const relicAchIds = new Set(Object.keys(relicWeaponsData).map(Number));
  const relicAchs = collectables.filter((c) => relicAchIds.has(c.id));

  const groups = new Map<
    string,
    {
      expansion: number;
      jobGroups: Map<string, Array<{ collectable: Collectable; relic: RelicWeaponEntry }>>;
    }
  >();

  for (const ach of relicAchs) {
    const relic = relicWeaponsData[ach.id];
    if (!relic) continue;
    const seriesName = relic.series;
    if (seriesFilter && seriesFilter.length > 0 && !seriesFilter.includes(seriesName)) continue;

    if (!groups.has(seriesName)) {
      groups.set(seriesName, { expansion: relic.expansion, jobGroups: new Map() });
    }
    const sg = groups.get(seriesName)!;
    const job = relic.job || 'Unknown';
    if (!sg.jobGroups.has(job)) sg.jobGroups.set(job, []);
    sg.jobGroups.get(job)!.push({ collectable: ach, relic });
  }

  const sorted = [...groups.entries()].sort(([, a], [, b]) => a.expansion - b.expansion);

  return sorted.map(([seriesName, { expansion, jobGroups }]) => {
    const stageLabels = RELIC_SERIES[seriesName]?.stages ?? [];
    const numStages = Math.max(stageLabels.length, 1);

    const sortedJobs = [...jobGroups.keys()].sort((a, b) => {
      const ai = JOB_SORT_ORDER.indexOf(a);
      const bi = JOB_SORT_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    const columns: GridColumn[] = sortedJobs.map((job) => ({
      key: job,
      header: job,
      title: JOB_NAMES[job] ?? job,
    }));

    const cells = new Map<string, Array<GridCell | null>>();
    for (const job of sortedJobs) {
      const entries = [...(jobGroups.get(job) ?? [])].sort(
        (a, b) => a.relic.order - b.relic.order,
      );
      cells.set(
        job,
        Array.from({ length: numStages }, (_, i) => {
          const entry = entries[i];
          if (!entry) return null;
          return {
            collectableId: entry.collectable.id,
            label: entry.relic.relicName,
            icon: entry.relic.icon || undefined,
            globalOwned: entry.relic.owned || undefined,
            description: entry.collectable.howTo || undefined,
          };
        }),
      );
    }

    return {
      key: seriesName,
      title: seriesName,
      expansionLabel: expansionName(expansion),
      expansionClass: expansionCssClass(expansion),
      rowLabels: stageLabels,
      columns,
      cells,
    };
  });
}
