const FFXIV_COLLECT_BASE = 'https://ffxivcollect.com/api';

export interface FFXIVCollectData {
  icon?: string;
  owned?: string;
}

/**
 * Fetch mount data from FFXIV Collect.
 * FFXIV Collect is updated faster than XIVAPI and provides direct PNG URLs and global ownership percentages.
 * Returns a map of mountId → FFXIVCollectData.
 */
export async function fetchMountData(): Promise<Record<number, FFXIVCollectData>> {
  const res = await fetch(`${FFXIV_COLLECT_BASE}/mounts`);
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
  const res = await fetch(`${FFXIV_COLLECT_BASE}/minions`);
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
