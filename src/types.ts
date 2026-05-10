// Character data from /api/charcache/:id
export interface CharacterMount {
  id: number;
  date: number;
}

export interface CharacterMinion {
  id: number;
  date: number;
}

export interface CharacterTitle {
  id: number;
  date: number;
}

export interface CharacterAchievement {
  id: number;
  date: number;
}

export interface Character {
  id: number;
  name: string;
  titleId: number;
  worldId: number;
  iconUrl: string;
  imageUrl: string;
  clanId: number;
  genderId: number;
  gcId: number;
  city: string;
  fcId: string;
  fcName: string;
  worldName: string;
  dcName: string;
  dcId: number;
  raceName: string;
  tribeName: string;
  genderName: string;
  mounts: CharacterMount[];
  minions: CharacterMinion[];
  titles: CharacterTitle[];
  achievements: CharacterAchievement[];
  [key: string]: unknown;
}

// Collectable data from /api/game/en/mounts or /api/game/en/minions
export interface Collectable {
  id: number;
  name: string;
  sourceTypeId: number;
  obtainable: boolean;
  patch: string | null;
  howTo: string | null;
  sort: number;
  updatedAt: number;
  deleted: boolean | null;
  iconUrl?: string;
  globalOwned?: string;
  [key: string]: unknown;
}

// Extended with computed missing count for the table
export interface CollectableRow extends Collectable {
  missingCount: number;
}

// Source type from /api/game/en/sourceTypes
export interface SourceType {
  id: number;
  name: string;
  updatedAt: number;
  deleted: boolean | null;
}

// Map of sourceTypeId -> name
export type SourceTypeMap = Record<number, string>;

// Collectable type toggle
export type CollectableType = 'mounts' | 'minions' | 'titles' | 'achievements';
