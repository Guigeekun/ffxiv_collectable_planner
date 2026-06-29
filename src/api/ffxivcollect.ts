import { RELIC_SERIES, ALL_STAGE_SUFFIXES } from '../relicWeaponData';

const FFXIV_COLLECT_BASE = 'https://ffxivcollect.com/api';

/** Wraps fetch with the required User-Agent header for every API call. */
function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: { 'User-Agent': 'ggkfigment', ...(options?.headers as Record<string, string> ?? {}) },
  });
}

export interface FFXIVCollectData {
  icon?: string;
  owned?: string;
}

/**
 * Represents a single relic weapon entry from FFXIV Collect,
 * enriched with the extracted weapon type (job weapon kind) and job code.
 */
export interface RelicWeaponEntry {
  /** The raw item name from FFXIV Collect */
  relicName: string;
  /** Series name, e.g. "Phantom Weapons", "Zodiac Weapons" */
  series: string;
  /**
   * Extracted weapon type / job weapon class (legacy, kept for compatibility).
   * e.g. "Sword", "Knuckles", "Scholar Book", "Round Brush"
   */
  weaponType: string;
  /**
   * Job code derived from relic order within its series.
   * e.g. "PLD", "MNK", "WAR", "DRG", etc.
   */
  job: string;
  /** FFXIV Collect icon URL */
  icon: string;
  /** Global ownership percentage string, e.g. "5.1%" */
  owned: string;
  /** Sort order within the series */
  order: number;
  /** Expansion number */
  expansion: number;
}


/**
 * Fetch mount data from FFXIV Collect.
 * FFXIV Collect is updated faster than XIVAPI and provides direct PNG URLs and global ownership percentages.
 * Returns a map of mountId → FFXIVCollectData.
 */
export async function fetchMountData(): Promise<Record<number, FFXIVCollectData>> {
  const res = await apiFetch(`${FFXIV_COLLECT_BASE}/mounts`);
  if (!res.ok) throw new Error(`Failed to fetch mount data from FFXIV Collect (${res.status})`);

  const data = await res.json();
  const map: Record<number, FFXIVCollectData> = {};

  for (const mount of data.results) {
    map[mount.id] = {
      icon: mount.icon,
      owned: mount.owned
    };
  }

  return map;
}

/**
 * Fetch minion data from FFXIV Collect.
 * Returns a map of minionId → FFXIVCollectData.
 */
export async function fetchMinionData(): Promise<Record<number, FFXIVCollectData>> {
  const res = await apiFetch(`${FFXIV_COLLECT_BASE}/minions`);
  if (!res.ok) throw new Error(`Failed to fetch minion data from FFXIV Collect (${res.status})`);

  const data = await res.json();
  const map: Record<number, FFXIVCollectData> = {};

  for (const minion of data.results) {
    map[minion.id] = {
      icon: minion.icon,
      owned: minion.owned
    };
  }

  return map;
}

/**
 * Extracts the weapon type (job weapon class) from a relic weapon name.
 * Uses the shared ALL_STAGE_SUFFIXES set from relicWeaponData so suffix
 * definitions stay consistent with the UI stage labels.
 */
function extractWeaponType(name: string, seriesName: string): string {
  const seriesPrefix = seriesName.split(' ')[0];
  let tokens = name.split(' ');

  // Strip series prefix from start (if present)
  if (tokens[0] === seriesPrefix) {
    tokens = tokens.slice(1);
  }
  // Strip known stage suffix from end (up to two passes for compound suffixes)
  if (tokens.length > 1 && ALL_STAGE_SUFFIXES.has(tokens[tokens.length - 1])) {
    tokens = tokens.slice(0, -1);
  }
  if (tokens.length > 1 && ALL_STAGE_SUFFIXES.has(tokens[tokens.length - 1])) {
    tokens = tokens.slice(0, -1);
  }

  return tokens.join(' ');
}

/**
 * Fetch all relic entries from FFXIV Collect for the series defined in RELIC_SERIES.
 * Paginates through all results and returns a map: achievement_id → RelicWeaponEntry.
 * When multiple relics share the same achievement ID, keeps the one with the highest order
 * (most advanced stage) so each achievement maps to its "best" relic entry.
 *
 * Uses Ransack's type_name_en_in parameter to fetch both combat weapons and crafting/gathering
 * tools in a single query since the default category filter is ignored by FFXIV Collect's API.
 */
export async function fetchRelicWeaponsData(): Promise<Record<number, RelicWeaponEntry>> {
  const PAGE_SIZE = 1500;
  const map: Record<number, RelicWeaponEntry> = {};

  const seriesNames = Object.keys(RELIC_SERIES).map(encodeURIComponent).join(',');
  const seenIds = new Set<number>();
  let offset = 0;

  while (true) {
    const url = `${FFXIV_COLLECT_BASE}/relics?type_name_en_in=${seriesNames}&limit=${PAGE_SIZE}&offset=${offset}`;
    const res = await apiFetch(url);
    if (!res.ok) throw new Error(`Failed to fetch relic weapons data from FFXIV Collect (${res.status})`);

    const data = await res.json();
    const results = data.results as any[];

    if (!results || results.length === 0) break;

    // Prevent infinite loop if the API ignores offset and returns the same items
    if (results.some((r) => seenIds.has(r.id))) {
      break;
    }

    for (const relic of results) {
      seenIds.add(relic.id);
      const achievementId: number | null = relic.achievement_id ?? null;
      if (!achievementId) continue;

      const seriesName: string = relic.type?.name ?? 'Unknown';
      const weaponType = extractWeaponType(relic.name, seriesName);
      const order: number = relic.order ?? 0;

      // Resolve job from relic order using the shared series data
      const jobList = RELIC_SERIES[seriesName]?.jobs;
      let job = 'Unknown';
      if (jobList && jobList.length > 0) {
        const index = (order - 1) % jobList.length;
        job = jobList[index] ?? 'Unknown';
      }

      // Keep the highest-order relic for each achievement ID (most advanced stage)
      const existing = map[achievementId];
      if (!existing || order > existing.order) {
        map[achievementId] = {
          relicName: relic.name,
          series: seriesName,
          weaponType,
          job,
          icon: relic.icon ?? '',
          owned: relic.owned ?? '',
          order,
          expansion: relic.type?.expansion ?? 0,
        };
      }
    }

    offset += results.length;
    if (results.length < PAGE_SIZE) break;
  }

  return map;
}

/**
 * Fetch achievement data for Allied Society Quests (category 37) from FFXIV Collect.
 * Returns a map of achievementId → FFXIVCollectData.
 */
export async function fetchReputationAchievementsData(): Promise<Record<number, FFXIVCollectData>> {
  const res = await apiFetch(`${FFXIV_COLLECT_BASE}/achievements?category_id_eq=37&limit=100`);
  if (!res.ok) throw new Error(`Failed to fetch reputation achievements from FFXIV Collect (${res.status})`);

  const data = await res.json();
  const map: Record<number, FFXIVCollectData> = {};

  for (const ach of data.results) {
    map[ach.id] = {
      icon: ach.icon ?? '',
      owned: ach.owned ?? ''
    };
  }

  return map;
}
