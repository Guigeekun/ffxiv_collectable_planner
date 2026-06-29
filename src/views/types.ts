import type { CollectableType } from '../types';

/**
 * Layout engine used to render the view content.
 * - 'table'       : Standard filterable/sortable CollectableTable
 * - 'series-grid' : Generic 2-D grid driven by a dataSource builder function
 */
export type ViewLayout = 'table' | 'series-grid';

/**
 * A ViewDefinition describes a single sub-view for a collectable type.
 * Adding a new view is as simple as appending one object to the registry —
 * no component wiring or new state is needed.
 */
export interface ViewDefinition {
  /** Unique stable key (used in localStorage and as React key). */
  id: string;
  /** Human-readable label shown in the view-switcher tab. */
  label: string;
  /** Emoji/icon prefix shown next to the label. */
  icon: string;
  /** The collectable type this view belongs to. */
  collectableType: CollectableType;
  /** Which layout engine renders this view. */
  layout: ViewLayout;

  // ── Optional pre-filters applied before the layout component receives data ──

  /**
   * If set, only items whose `sourceTypeId` is in this list are passed to the
   * layout component.
   */
  categoryIds?: number[];

  /**
   * If set, only items whose `id` is in this list are passed to the layout
   * component.
   */
  itemIds?: number[];

  // ── series-grid specific ──────────────────────────────────────────────────

  /**
   * For layout='series-grid': selects the builder function that transforms
   * collectables into the generic GridGroup[] format.
   * - 'relic-weapons' : relic/ultimate weapon series (default)
   * - 'trial-mounts'  : trial mounts organised by expansion + boss fight
   * @default 'relic-weapons'
   */
  dataSource?: 'relic-weapons' | 'trial-mounts';

  /**
   * For layout='series-grid', 'relic-weapons' dataSource only:
   * if provided, only the listed series names are shown.
   * Omit to show all series that have relic data.
   */
  seriesFilter?: string[];

  /**
   * For layout='series-grid': display configuration forwarded to SeriesGridView.
   */
  seriesGridConfig?: {
    /**
     * Icon card size.
     * - 'sm': 52 × 52 px — compact (weapons / achievements)
     * - 'md': 64 × 64 px — larger (mounts / minions)
     * @default 'sm'
     */
    cardSize?: 'sm' | 'md';
    /**
     * Show the item name below the icon.
     * @default false
     */
    showCardLabels?: boolean;
  };
}
