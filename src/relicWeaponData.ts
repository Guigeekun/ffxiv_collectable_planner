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
    stages: ['Penumbrae', 'Umbrae', 'Obscurum'],
    suffixes: ['Penumbrae', 'Umbrae', 'Obscurum'],
  },
  'Deep Dungeon Weapons': {
    jobs: ['PLD', 'MNK', 'WAR', 'DRG', 'BRD', 'NIN', 'DRK', 'MCH', 'WHM', 'BLM', 'SMN', 'SCH', 'AST', 'SAM', 'RDM', 'GNB', 'DNC', 'RPR', 'SGE', 'VPR', 'PCT'],
    stages: ['Padjali'],
    suffixes: ['Padjali'],
  },
  'Cosmic Tools': {
    // 11 jobs: 8 DoH (CRP BSM ARM GSM LTW WVR ALC CUL) + 3 DoL (MIN BTN FSH)
    // 4 stages × 11 jobs = 44 relics, orders 1-44
    jobs: ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'],
    stages: ['Cosmic', 'Stellar', 'Hyper', 'Stars'],
    suffixes: ['Cosmic', 'Stellar', 'Hyper', 'Stars'],
  },
  'Splendorous Tools': {
    // 11 jobs: 8 DoH (CRP BSM ARM GSM LTW WVR ALC CUL) + 3 DoL (MIN BTN FSH)
    // 3 achievement-granting stages (Crystalline, Brilliant, Lodestar) × 11 jobs = 33 achievements.
    jobs: ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'],
    stages: ['Crystalline', 'Brilliant', 'Lodestar'],
    suffixes: ['Crystalline', 'Brilliant', 'Lodestar'],
  },
  'Skysteel Tools': {
    jobs: ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL', 'MIN', 'BTN', 'FSH'],
    stages: ['Skysung', 'Skybuilders'],
    suffixes: ['Skysung', 'Skybuilders'],
  },
  // ── Ultimate Raids ─────────────────────────────────────────────────────────
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
  // ── Gold Saucer ────────────────────────────────────────────────────────────
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

// ---------------------------------------------------------------------------
// Convenience helpers derived from RELIC_SERIES
// ---------------------------------------------------------------------------

/** Set of every suffix word used across all series (for extractWeaponType). */
export const ALL_STAGE_SUFFIXES: Set<string> = new Set(
  Object.values(RELIC_SERIES).flatMap((s) => s.suffixes)
);

/**
 * Human-readable job names keyed by 3-letter job code.
 * Shared so both UI and any future utility code stay in sync.
 */
export const JOB_NAMES: Record<string, string> = {
  // Combat
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
  // Disciples of Hand
  CRP: 'Carpenter',
  BSM: 'Blacksmith',
  ARM: 'Armorer',
  GSM: 'Goldsmith',
  LTW: 'Leatherworker',
  WVR: 'Weaver',
  ALC: 'Alchemist',
  CUL: 'Culinarian',
  // Disciples of Land
  MIN: 'Miner',
  BTN: 'Botanist',
  FSH: 'Fisher',
};

/**
 * Job display order: Tanks → Healers → Melee DPS → Physical Ranged → Casters.
 * Shared so sort order is consistent wherever jobs are listed.
 */
export const JOB_SORT_ORDER: string[] = [
  // Tanks
  'PLD', 'WAR', 'DRK', 'GNB',
  // Healers
  'WHM', 'SCH', 'AST', 'SGE',
  // Melee DPS
  'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR',
  // Physical Ranged DPS
  'BRD', 'MCH', 'DNC',
  // Magic Ranged / Casters
  'BLM', 'SMN', 'RDM', 'PCT', 'BLU',
  // Disciples of Hand
  'CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL',
  // Disciples of Land
  'MIN', 'BTN', 'FSH',
];
