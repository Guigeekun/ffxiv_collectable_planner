import type { SourceTypeMap } from '../types';

export async function fetchAchievementCategories(): Promise<SourceTypeMap> {
    const res = await fetch(`https://xivapi.com/AchievementCategory?limit=100`, {
        headers: { 'User-Agent': 'ggkfigment' },
    });
    if (!res.ok) throw new Error('Failed to fetch achievement categories');
    const data = await res.json();
    const map: SourceTypeMap = {};
    for (const cat of data.Results) {
        map[cat.ID] = cat.Name;
    }
    return map;
}
