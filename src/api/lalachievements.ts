import type { Character, Collectable, SourceType, SourceTypeMap, CollectableType } from '../types';

const BASE = '/api';

export async function fetchCharacter(id: number | string): Promise<Character> {
  const res = await fetch(`${BASE}/charcache/${id}`);
  if (!res.ok) throw new Error(`Character ${id} not found (${res.status})`);
  return res.json();
}

export async function fetchCollectables(type: CollectableType = 'mounts'): Promise<Collectable[]> {
  const res = await fetch(`${BASE}/game/en/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  const data: { tables: Record<string, Collectable[]> } = await res.json();
  return data.tables[type] || [];
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
