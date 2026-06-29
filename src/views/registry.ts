import type { ViewDefinition } from './types';
import type { CollectableType } from '../types';

/**
 * Central registry of all views in the application.
 *
 * To add a new view: append a single ViewDefinition object here.
 * No other code changes are required — ViewHost and ViewRenderer pick it up
 * automatically.
 *
 * Rules:
 *  - Every CollectableType must have at least one view.
 *  - The first entry for a type is the default view for that type.
 *  - IDs must be globally unique.
 */
export const VIEW_REGISTRY: ViewDefinition[] = [
  // ── Mounts ────────────────────────────────────────────────────────────────
  {
    id: 'mounts-all',
    label: 'All',
    icon: '📋',
    collectableType: 'mounts',
    layout: 'table',
  },

  // ── Minions ───────────────────────────────────────────────────────────────
  {
    id: 'minions-all',
    label: 'All',
    icon: '📋',
    collectableType: 'minions',
    layout: 'table',
  },

  // ── Titles ────────────────────────────────────────────────────────────────
  {
    id: 'titles-all',
    label: 'All',
    icon: '📋',
    collectableType: 'titles',
    layout: 'table',
  },

  // ── Achievements ──────────────────────────────────────────────────────────
  {
    id: 'achievements-all',
    label: 'All',
    icon: '📋',
    collectableType: 'achievements',
    layout: 'table',
  },
  {
    id: 'achievements-weapons',
    label: 'Weapons',
    icon: '⚔️',
    collectableType: 'achievements',
    layout: 'series-grid',
    // categoryIds restricts what's passed to the grid; the grid also cross-
    // references relicWeaponsData so either filter alone would work.
    categoryIds: [62, 63, 64, 65, 66, 68, 71, 75],
  },
  // Example future views — uncomment and fill seriesFilter as needed:
  // {
  //   id: 'achievements-crafting',
  //   label: 'Crafting Tools',
  //   icon: '🔨',
  //   collectableType: 'achievements',
  //   layout: 'series-grid',
  //   seriesFilter: ['Splendorous Tools', 'Skysteel Tools', 'Cosmic Tools'],
  // },
  // {
  //   id: 'achievements-pvp',
  //   label: 'PvP',
  //   icon: '🛡️',
  //   collectableType: 'achievements',
  //   layout: 'table',
  //   categoryIds: [42],
  // },
];

/**
 * Returns all views registered for a given collectable type, in declaration
 * order (first entry = default view for that type).
 */
export function getViewsForType(type: CollectableType): ViewDefinition[] {
  return VIEW_REGISTRY.filter((v) => v.collectableType === type);
}

/**
 * Returns the default (first) view for a type.
 * Safe to call before the component mounts — always returns a valid entry
 * as long as the registry has at least one view per type.
 */
export function getDefaultView(type: CollectableType): ViewDefinition {
  const views = getViewsForType(type);
  if (views.length === 0) {
    throw new Error(`No views registered for collectableType "${type}"`);
  }
  return views[0];
}
