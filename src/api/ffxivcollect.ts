import { RELIC_SERIES, ALL_STAGE_SUFFIXES } from '../data/relicWeaponData';
import type { Character, Collectable, CollectableType } from '../types';

const FFXIV_COLLECT_BASE = 'https://ffxivcollect.com/api';

/** Wraps fetch with the required User-Agent header for every API call. */
function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: { 'User-Agent': 'ggkfigment', ...(options?.headers as Record<string, string> ?? {}) },
  });
}

async function fetchJson<T>(path: string, errorLabel = path): Promise<T> {
  const res = await apiFetch(`${FFXIV_COLLECT_BASE}${path}`);
  if (!res.ok) {
    if (res.status === 403) throw new Error(`${errorLabel}: profile is private (403)`);
    if (res.status === 404) throw new Error(`${errorLabel}: not found (404)`);
    throw new Error(`Failed to fetch ${errorLabel} from FFXIV Collect (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch a full collection index in one request. The API ignores the `offset`
 * parameter entirely (every offset returns the same page), but honors large
 * `limit` values — all current collections fit well under 10000 rows.
 */
async function fetchCollection(path: string): Promise<any[]> {
  const sep = path.includes('?') ? '&' : '?';
  const data = await fetchJson<{ results: any[] }>(`${path}${sep}limit=10000`);
  const results = data.results ?? [];
  if (results.length >= 10000) {
    throw new Error(`FFXIV Collect collection ${path} exceeds the single-fetch limit`);
  }
  return results;
}

// ─── Character provider ─────────────────────────────────────────────────────
// Character IDs on FFXIV Collect are Lodestone IDs, so stored character IDs
// need no migration.

export interface CharacterSearchResult {
  id: number;
  name: string;
  iconUrl: string;
  worldName: string;
}

/**
 * Fetch a character profile plus the owned lists the planner uses.
 *
 * With `{ latest: true }` FFXIV Collect synchronously re-scrapes Lodestone
 * first — but only if the character's last parse is older than 6 hours;
 * otherwise cached data comes back immediately. A fresh parse takes ~2-3s
 * and advances `last_parsed`.
 */
export async function fetchCharacter(id: number | string, opts: { latest?: boolean } = {}): Promise<Character> {
  const show = await fetchJson<any>(`/characters/${id}${opts.latest ? '?latest=true' : ''}`, `character ${id}`);

  // Titles are derived from achievements in this app (see CollectableTable),
  // so /titles/owned is not needed.
  const [mounts, minions, achievements] = await Promise.all([
    fetchJson<any[]>(`/characters/${id}/mounts/owned`),
    fetchJson<any[]>(`/characters/${id}/minions/owned`),
    fetchJson<any[]>(`/characters/${id}/achievements/owned`),
  ]);

  const toOwned = (list: any[]) => (Array.isArray(list) ? list.map((item) => ({ id: item.id })) : []);

  return {
    id: show.id,
    name: show.name,
    worldName: show.server,
    dcName: show.data_center,
    iconUrl: show.avatar,
    imageUrl: show.portrait,
    verified: show.verified,
    mounts: toOwned(mounts),
    minions: toOwned(minions),
    titles: [],
    achievements: toOwned(achievements),
    // Unix ms of FFXIV Collect's last completed Lodestone parse.
    updatedAt: show.last_parsed ? Date.parse(show.last_parsed) : undefined,
  } as Character;
}

/**
 * Character search. FFXIV Collect has no JSON search endpoint — only their
 * website's HTML page (DB lookup, falling back to a live Lodestone search).
 * That page is fetched through the same-origin proxy (/characters/search in
 * vite.config.ts / nginx.conf) and parsed here.
 */
export async function searchCharacters(text: string): Promise<CharacterSearchResult[]> {
  const res = await fetch(`/characters/search?name=${encodeURIComponent(text)}`);
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const results: CharacterSearchResult[] = [];
  for (const row of Array.from(doc.querySelectorAll('div.character-name'))) {
    const name = row.querySelector('b')?.textContent?.trim();
    const worldName = row.querySelector('.fa5-text')?.textContent?.trim() ?? '';
    const container = row.parentElement;
    // First /characters/{id} link in the row is the "View" link (then /select, /peek)
    const href = container?.querySelector('a[href^="/characters/"]')?.getAttribute('href');
    const id = href ? Number(href.split('/')[2]) : NaN;
    const avatar = container?.querySelector('img.avatar')?.getAttribute('src') ?? '';
    if (name && !Number.isNaN(id)) {
      results.push({ id, name, worldName, iconUrl: avatar });
    }
  }
  return results;
}

// ─── Game data (collectable tables) ─────────────────────────────────────────

/**
 * Stable numeric sourceTypeId for mounts/minions, derived from the source
 * type string ("Achievement", "Trial", ...). FFXIV Collect has no numeric
 * source ids; the names travel alongside via `sourceTypeName` so filters
 * always label correctly.
 */
function sourceTypeIdFor(name: string | null | undefined): number {
  if (!name) return 0;
  let hash = 7;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return hash;
}

function joinSourceText(item: any): string | null {
  const texts = (item.sources ?? []).map((s: any) => s.text).filter(Boolean);
  return texts.length ? texts.join('\n') : null;
}

/**
 * Fetch the full collectable table for a type directly from FFXIV Collect.
 * Items come with icon, ownership %, patch and source info built in, so no
 * second provider is needed for enrichment.
 */
export async function fetchCollectables(type: CollectableType = 'mounts'): Promise<Collectable[]> {
  const items = await fetchCollection(`/${type}`);

  return items.map((item: any) => {
    if (type === 'achievements') {
      return {
        id: item.id,
        name: item.name,
        sourceTypeId: item.category?.id ?? 0,
        sourceTypeName: item.category?.name ?? null,
        obtainable: true,
        patch: item.patch ?? null,
        howTo: item.description ?? null,
        sort: item.order ?? 0,
        updatedAt: 0,
        deleted: null,
        iconUrl: item.icon ?? undefined,
        globalOwned: item.owned ?? undefined,
      };
    }
    if (type === 'titles') {
      return {
        id: item.id,
        name: item.name,
        sourceTypeId: item.achievement?.category?.id ?? 0,
        sourceTypeName: item.achievement?.category?.name ?? null,
        achievementId: item.achievement?.id ?? null,
        obtainable: true,
        patch: item.patch ?? null,
        howTo: item.female_name && item.female_name !== item.name ? `Feminine: ${item.female_name}` : null,
        sort: item.order ?? 0,
        updatedAt: 0,
        deleted: null,
        iconUrl: item.icon ?? undefined,
        globalOwned: item.owned ?? undefined,
      };
    }
    // mounts & minions
    return {
      id: item.id,
      name: item.name,
      sourceTypeId: sourceTypeIdFor(item.sources?.[0]?.type),
      sourceTypeName: item.sources?.[0]?.type ?? null,
      obtainable: true,
      patch: item.patch ?? null,
      howTo: joinSourceText(item),
      sort: item.order ?? 0,
      updatedAt: 0,
      deleted: null,
      iconUrl: item.icon ?? undefined,
      globalOwned: item.owned ?? undefined,
    };
  }) as Collectable[];
}

// ─── Relic weapons ──────────────────────────────────────────────────────────

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
 * Returns a map: achievement_id → RelicWeaponEntry.
 * When multiple relics share the same achievement ID, keeps the one with the highest order
 * (most advanced stage) so each achievement maps to its "best" relic entry.
 *
 * Uses Ransack's type_name_en_in parameter to fetch both combat weapons and crafting/gathering
 * tools in a single query since the default category filter is ignored by FFXIV Collect's API.
 */
export async function fetchRelicWeaponsData(): Promise<Record<number, RelicWeaponEntry>> {
  const map: Record<number, RelicWeaponEntry> = {};

  const seriesNames = Object.keys(RELIC_SERIES).map(encodeURIComponent).join(',');
  const url = `${FFXIV_COLLECT_BASE}/relics?type_name_en_in=${seriesNames}&limit=10000`;
  const res = await apiFetch(url);
  if (!res.ok) throw new Error(`Failed to fetch relic weapons data from FFXIV Collect (${res.status})`);

  const data = await res.json();
  const results = data.results as any[];

  for (const relic of results) {
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

  return map;
}
