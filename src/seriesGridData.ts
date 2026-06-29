/**
 * Generic data types for SeriesGridView.
 *
 * Generic types and helpers for 2D grids (expansion × column × stage/row).
 */

// ── Generic grid types ────────────────────────────────────────────────────────

/** A single item rendered in a grid cell. */
export interface GridCell {
  /** Collectable ID used for ownership lookup against the ownershipMap. */
  collectableId: number;
  /** Display name (shown below the icon when showCardLabels is true). */
  label: string;
  /** Icon URL. */
  icon?: string;
  /** Global ownership percentage string from FFXIV Collect, e.g. "5.1%". */
  globalOwned?: string;
}

/** One column header in the grid (job / boss fight / etc.). */
export interface GridColumn {
  /** Unique column identifier (job code / stringified instance ID). */
  key: string;
  /**
   * Short label rendered in the column header.
   * For weapons: 3-letter job code (PLD, WAR, …).
   * For trial mounts: boss short name (Ifrit, Garuda, …).
   */
  header: string;
  /** Full label shown as a sub-header or tooltip. */
  title?: string;
}

/**
 * A collapsible group within the view (weapon series / trial expansion).
 * Each group renders as a card with a header + 2-D grid of items.
 */
export interface GridGroup {
  key: string;
  /** Primary title shown in the group header (series name / expansion name). */
  title: string;
  /** Expansion name shown in the expansion badge (may equal title). */
  expansionLabel?: string;
  /** CSS class for expansion colouring (exp-arr / exp-hw / …). */
  expansionClass?: string;
  /**
   * Labels for each row.
   * - Non-empty strings → shown as stage labels in the left column.
   * - Empty strings → row label column is hidden.
   * Length determines the number of rows in the grid.
   */
  rowLabels: string[];
  /** Ordered list of columns (left to right). */
  columns: GridColumn[];
  /**
   * Map: columnKey → per-row items.
   * Length of each array must equal rowLabels.length.
   * null = empty slot (renders a placeholder).
   */
  cells: Map<string, Array<GridCell | null>>;
}

/** Display configuration forwarded from the ViewDefinition to SeriesGridView. */
export interface SeriesGridConfig {
  /**
   * Icon card size.
   * - 'sm': 52 × 52 px — compact, suits weapons / achievements
   * - 'md': 64 × 64 px — larger, suits mounts / minions
   * @default 'sm'
   */
  cardSize?: 'sm' | 'md';
  /**
   * Render the item name below the icon card.
   * @default false
   */
  showCardLabels?: boolean;
}

// ── Expansion helpers ─────────────────────────────────────────────────────────

export function expansionName(exp: number): string {
  switch (exp) {
    case 1: return 'Legacy';
    case 2: return 'A Realm Reborn';
    case 3: return 'Heavensward';
    case 4: return 'Stormblood';
    case 5: return 'Shadowbringers';
    case 6: return 'Endwalker';
    case 7: return 'Dawntrail';
    default: return `Expansion ${exp}`;
  }
}

export function expansionCssClass(exp: number): string {
  switch (exp) {
    case 1:
    case 2: return 'exp-arr';
    case 3: return 'exp-hw';
    case 4: return 'exp-sb';
    case 5: return 'exp-shb';
    case 6: return 'exp-ew';
    case 7: return 'exp-dt';
    default: return 'exp-dt';
  }
}
