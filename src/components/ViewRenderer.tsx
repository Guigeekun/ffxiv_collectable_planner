import { useMemo } from 'react';
import type { Character, Collectable, CollectableType, SourceTypeMap } from '../types';
import type { RelicWeaponEntry } from '../api/ffxivcollect';
import type { ViewDefinition } from '../views/types';
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
 * Also applies any view-level pre-filters (categoryIds, itemIds) before
 * handing data down so individual layout components stay filter-agnostic.
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
  // Apply view-level pre-filters declared in the ViewDefinition
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

    case 'series-grid':
      return (
        <SeriesGridView
          collectables={filtered}
          characters={characters}
          relicWeaponsData={relicWeaponsData}
          loading={loading}
          seriesFilter={view.seriesFilter}
        />
      );

    default:
      return (
        <div className="weapons-view-empty">
          <p>Unknown view layout: <code>{(view as any).layout}</code></p>
        </div>
      );
  }
}
