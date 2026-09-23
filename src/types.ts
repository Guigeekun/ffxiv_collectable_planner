// Character data, now served by FFXIV Collect (IDs are Lodestone IDs).
export interface OwnedCollectable {
  id: number;
  // Obtain dates are not exposed by FFXIV Collect; kept optional for
  // backward compatibility with persisted profiles.
  date?: number;
}

export interface Character {
  id: number;
  name: string;
  worldName: string;
  dcName: string;
  iconUrl: string;
  imageUrl?: string;
  verified?: boolean;
  mounts: OwnedCollectable[];
  minions: OwnedCollectable[];
  // Titles are derived from achievements (see CollectableTable); not fetched.
  titles: OwnedCollectable[];
  achievements: OwnedCollectable[];
  // Unix ms of FFXIV Collect's last completed Lodestone parse (`last_parsed`).
  // A sync that returns the same updatedAt means the character was still
  // "fresh" (<6h) on FFXIV Collect's side, or Lodestone had nothing new.
  updatedAt?: number;
  [key: string]: unknown;
}

// Collectable data, now served by FFXIV Collect's collection indexes.
export interface Collectable {
  id: number;
  name: string;
  sourceTypeId: number;
  // Display name for sourceTypeId (FFXIV Collect mount/minion sources are
  // strings; achievements/titles carry their category directly).
  sourceTypeName?: string | null;
  // Titles only: the achievement that grants the title (ownership lookup).
  achievementId?: number | null;
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

// Map of sourceTypeId -> name
export type SourceTypeMap = Record<number, string>;

// Collectable type toggle
export type CollectableType = 'mounts' | 'minions' | 'titles' | 'achievements';

// Sub-views are now driven by ViewDefinition in src/views/registry.ts
