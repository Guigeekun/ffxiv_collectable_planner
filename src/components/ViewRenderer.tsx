import { useMemo } from 'react';
import type { Character, Collectable, CollectableType, SourceTypeMap } from '../types';
import type { RelicWeaponEntry } from '../api/ffxivcollect';
import type { ViewDefinition } from '../views/types';
import { buildRelicWeaponGroups } from '../data/relicWeaponData';
import { buildTrialMountGroups } from '../data/trialMountData';
import { buildRaidMountGroups } from '../data/raidMountData';
import { buildReputationAchievementGroups } from '../data/reputationAchievementData';
import { buildFieldOperationsGroups } from '../data/fieldOperationsData';
import { buildCrafterAchievementGroups } from '../data/crafterAchievementData';
import CollectableTable from './CollectableTable';
import SeriesGridView from './SeriesGridView';

interface ViewRendererProps {
  view: ViewDefinition;
  collectables: Collectable[];
  characters: Character[];
  sourceTypes: SourceTypeMap;
  loading: boolean;
  collectableType: CollectableType;
  relicWeaponsData: Record<number, RelicWeaponEntry>;
}

/**
 * Routes a ViewDefinition to the correct layout component.
 *
 * For 'series-grid' views this component:
 *  1. Applies view-level pre-filters (categoryIds / itemIds)
 *  2. Builds the generic GridGroup[] using the appropriate builder function
 *  3. Builds the ownership map from Character data for the active collectableType
 *  4. Passes the result to the generic SeriesGridView
 *
 * Adding a new series-grid data source only requires:
 *  - A builder function in seriesGridData.ts
 *  - A registry entry with the matching dataSource key
 *  - No changes here
 */
export default function ViewRenderer({
  view,
  collectables,
  characters,
  sourceTypes,
  loading,
  collectableType,
  relicWeaponsData,
}: ViewRendererProps) {
  // ── 1. Apply view-level pre-filters ────────────────────────────────────────
  const filtered = useMemo(() => {
    let items = collectables;
    if (view.categoryIds && view.categoryIds.length > 0) {
      const catSet = new Set(view.categoryIds);
      items = items.filter((c) => catSet.has(c.sourceTypeId));
    }
    if (view.itemIds && view.itemIds.length > 0) {
      const idSet = new Set(view.itemIds);
      items = items.filter((c) => idSet.has(c.id));
    }
    return items;
  }, [collectables, view]);

  // ── 2. Ownership map (only needed for series-grid) ─────────────────────────
  const ownershipMap = useMemo(() => {
    if (view.layout !== 'series-grid') return {};
    const map: Record<number, Set<number>> = {};
    for (const char of characters) {
      const owned: any[] = (() => {
        switch (collectableType) {
          case 'mounts':   return (char.mounts as any[])        || [];
          case 'minions':  return (char.minions as any[])        || [];
          case 'achievements':
          case 'titles':   return (char.achievements as any[])   || [];
          default:         return [];
        }
      })();
      map[char.id] = new Set(
        owned.map((m: any) => (typeof m === 'object' && m !== null ? (m.id ?? m) : m)),
      );
    }
    return map;
  }, [view.layout, characters, collectableType]);

  // ── 3. Route to layout ─────────────────────────────────────────────────────
  switch (view.layout) {
    case 'table':
      return (
        <CollectableTable
          collectables={filtered}
          characters={characters}
          sourceTypes={sourceTypes}
          loading={loading}
          collectableType={collectableType}
        />
      );

    case 'series-grid': {
      const dataSource = view.dataSource ?? 'relic-weapons';

      const groups = (() => {
        switch (dataSource) {
          case 'trial-mounts':
            return buildTrialMountGroups(filtered);
          case 'raid-mounts':
            return buildRaidMountGroups(filtered);
          case 'reputation-achievements':
            return buildReputationAchievementGroups(filtered);
          case 'field-operations':
            return buildFieldOperationsGroups(filtered);
          case 'crafter-achievements':
            return buildCrafterAchievementGroups(filtered);
          case 'relic-weapons':
          default:
            return buildRelicWeaponGroups(filtered, relicWeaponsData, view.seriesFilter);
        }
      })();

      const itemLabel =
        (dataSource === 'trial-mounts' || dataSource === 'raid-mounts') ? 'mounts' : 'achievements';

      return (
        <SeriesGridView
          groups={groups}
          ownershipMap={ownershipMap}
          characters={characters}
          loading={loading}
          config={view.seriesGridConfig}
          itemLabel={itemLabel}
        />
      );
    }

    default:
      return (
        <div className="weapons-view-empty">
          <p>Unknown view layout: <code>{(view as any).layout}</code></p>
        </div>
      );
  }
}
