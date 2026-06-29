import type { CollectableType } from '../types';

/**
 * Layout engine used to render the view content.
 * - 'table'       : Standard filterable/sortable CollectableTable
 * - 'series-grid' : Series × Job 2D grid (relic weapons, crafting tools, …)
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

  // ── Optional pre-filters applied before the layout component receives data ─

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
   * For layout='series-grid': if provided, only the listed series names are
   * shown (matched against the series name from FFXIV Collect).
   * Omit to show all series that have relic data.
   */
  seriesFilter?: string[];
}
