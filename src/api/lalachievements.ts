import type { Character, Collectable, SourceType, SourceTypeMap, CollectableType } from '../types';

const BASE = '/api';

export async function fetchCharacter(id: number | string): Promise<Character> {
  const res = await fetch(`${BASE}/charcache/${id}`);
  if (!res.ok) throw new Error(`Character ${id} not found (${res.status})`);
  return res.json();
}

export async function fetchCharacterRealtime(id: number | string): Promise<Character> {
  const res = await fetch(`${BASE}/charrealtime/${id}`);
  if (!res.ok) throw new Error(`Character ${id} not found (${res.status})`);
  return res.json();
}

export interface CharacterSearchResult {
  id: number;
  name: string;
  iconUrl: string;
  worldId: number;
}

export async function searchCharacters(text: string): Promise<CharacterSearchResult[]> {
  const res = await fetch(`${BASE}/charsearch/${encodeURIComponent(text)}`);
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchCollectables(type: CollectableType = 'mounts'): Promise<Collectable[]> {
  const res = await fetch(`${BASE}/game/en/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  const data: { tables: Record<string, any[]> } = await res.json();
  const raw = data.tables[type] || [];

  // Normalize data for titles and achievements
  if (type === 'titles') {
    // Titles have no direct ownership in the char cache — they're derived from achievements.
    // Fetch achievements to build a titleId → achievementId map.
    const achRes = await fetch(`${BASE}/game/en/achievements`);
    const achData: { tables: { achievements: any[] } } = achRes.ok ? await achRes.json() : { tables: { achievements: [] } };
    const titleToAchMap: Record<number, number> = {};
    for (const ach of achData.tables.achievements || []) {
      if (ach.titleId) titleToAchMap[ach.titleId] = ach.id;
    }
    return raw.map(item => ({
      ...item,
      name: item.masculine || 'Unknown Title',
      sourceTypeId: 1,
      obtainable: true,
      howTo: item.feminine && item.feminine !== item.masculine ? `Feminine: ${item.feminine}` : null,
      patch: null,
      achievementId: titleToAchMap[item.id] ?? null,
    })) as Collectable[];
  }

  return raw.map(item => {
    if (type === 'achievements') {
      return {
        ...item,
        sourceTypeId: item.achievementCategoryId, // Map to Achievement Categories
        howTo: item.description || null,
        patch: null
      };
    } else {
      return {
        ...item,
        sourceTypeId: item.sourceTypeId,
        howTo: item.howTo,
        patch: item.patch
      };
    }
  }) as Collectable[];
}

export async function fetchSourceTypes(): Promise<SourceTypeMap> {
  const res = await fetch(`${BASE}/game/en/sourceTypes`);
  if (!res.ok) throw new Error('Failed to fetch source types');
  const data: { tables: { sourceTypes: SourceType[] } } = await res.json();
  const map: SourceTypeMap = {};
  for (const st of data.tables.sourceTypes) {
    map[st.id] = st.name;
  }
  return map;
}

export async function fetchAchievementCategories(): Promise<SourceTypeMap> {
  const res = await fetch(`https://xivapi.com/AchievementCategory?limit=100`);
  if (!res.ok) throw new Error('Failed to fetch achievement categories');
  const data = await res.json();
  const map: SourceTypeMap = {};
  for (const cat of data.Results) {
    map[cat.ID] = cat.Name;
  }
  return map;
}
