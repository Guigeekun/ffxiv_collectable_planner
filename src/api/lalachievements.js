const BASE = '/api';

export async function fetchCharacter(id) {
  const res = await fetch(`${BASE}/charcache/${id}`);
  if (!res.ok) throw new Error(`Character ${id} not found (${res.status})`);
  return res.json();
}

export async function fetchCollectables(type = 'mounts') {
  const res = await fetch(`${BASE}/game/en/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}`);
  const data = await res.json();
  return data.tables[type] || [];
}

export async function fetchSourceTypes() {
  const res = await fetch(`${BASE}/game/en/sourceTypes`);
  if (!res.ok) throw new Error('Failed to fetch source types');
  const data = await res.json();
  const map = {};
  for (const st of data.tables.sourceTypes) {
    map[st.id] = st.name;
  }
  return map;
}
