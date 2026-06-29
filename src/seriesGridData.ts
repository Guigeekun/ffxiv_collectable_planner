/**
 * Generic data types and builder functions for SeriesGridView.
 *
 * Both relic weapons (series × job × stage) and trial mounts
 * (expansion × boss × mount) are expressed in this common format.
 * Adding a new data source means writing one builder function here
 * and registering a view in the registry — no component wiring needed.
 */

import type { Collectable } from './types';
import type { RelicWeaponEntry } from './api/ffxivcollect';
import { RELIC_SERIES, JOB_NAMES, JOB_SORT_ORDER } from './relicWeaponData';
import { TRIAL_MOUNTS_BY_EXPANSION } from './trialMountData';
import { RAID_MOUNTS_BY_EXPANSION } from './raidMountData';

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

// ── Relic weapon builder ──────────────────────────────────────────────────────

/**
 * Transforms achievement collectables + FFXIV Collect relic data into the
 * generic GridGroup[] format for SeriesGridView.
 *
 * Groups by series → job (columns) → stage (rows), sorted by expansion.
 */
export function buildRelicWeaponGroups(
  collectables: Collectable[],
  relicWeaponsData: Record<number, RelicWeaponEntry>,
  seriesFilter?: string[],
): GridGroup[] {
  const relicAchIds = new Set(Object.keys(relicWeaponsData).map(Number));
  const relicAchs = collectables.filter((c) => relicAchIds.has(c.id));

  // First pass: group by series → job → entries
  const groups = new Map<
    string,
    {
      expansion: number;
      jobGroups: Map<string, Array<{ collectable: Collectable; relic: RelicWeaponEntry }>>;
    }
  >();

  for (const ach of relicAchs) {
    const relic = relicWeaponsData[ach.id];
    if (!relic) continue;
    const seriesName = relic.series;
    if (seriesFilter && seriesFilter.length > 0 && !seriesFilter.includes(seriesName)) continue;

    if (!groups.has(seriesName)) {
      groups.set(seriesName, { expansion: relic.expansion, jobGroups: new Map() });
    }
    const sg = groups.get(seriesName)!;
    const job = relic.job || 'Unknown';
    if (!sg.jobGroups.has(job)) sg.jobGroups.set(job, []);
    sg.jobGroups.get(job)!.push({ collectable: ach, relic });
  }

  // Sort series by expansion ascending (oldest first)
  const sorted = [...groups.entries()].sort(([, a], [, b]) => a.expansion - b.expansion);

  return sorted.map(([seriesName, { expansion, jobGroups }]) => {
    const stageLabels = RELIC_SERIES[seriesName]?.stages ?? [];
    const numStages = Math.max(stageLabels.length, 1);

    // Sort jobs by canonical role order
    const sortedJobs = [...jobGroups.keys()].sort((a, b) => {
      const ai = JOB_SORT_ORDER.indexOf(a);
      const bi = JOB_SORT_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    const columns: GridColumn[] = sortedJobs.map((job) => ({
      key: job,
      header: job,
      title: JOB_NAMES[job] ?? job,
    }));

    const cells = new Map<string, Array<GridCell | null>>();
    for (const job of sortedJobs) {
      const entries = [...(jobGroups.get(job) ?? [])].sort(
        (a, b) => a.relic.order - b.relic.order,
      );
      cells.set(
        job,
        Array.from({ length: numStages }, (_, i) => {
          const entry = entries[i];
          if (!entry) return null;
          return {
            collectableId: entry.collectable.id,
            label: entry.relic.relicName,
            icon: entry.relic.icon || undefined,
            globalOwned: entry.relic.owned || undefined,
          };
        }),
      );
    }

    return {
      key: seriesName,
      title: seriesName,
      expansionLabel: expansionName(expansion),
      expansionClass: expansionCssClass(expansion),
      rowLabels: stageLabels,
      columns,
      cells,
    };
  });
}

// ── Trial mount builder ───────────────────────────────────────────────────────

/**
 * Transforms mount collectables + static TRIAL_MOUNTS_BY_EXPANSION data into
 * the generic GridGroup[] format for SeriesGridView.
 *
 * Groups by expansion → boss (columns) → mount slot (rows).
 * Icon and globalOwned are read from collectable.iconUrl / collectable.globalOwned,
 * which are already merged into enrichedCollectables by App.tsx.
 */
export function buildTrialMountGroups(collectables: Collectable[]): GridGroup[] {
  const mountMap = new Map<number, Collectable>();
  for (const m of collectables) mountMap.set(m.id, m);

  return TRIAL_MOUNTS_BY_EXPANSION.map((expansion) => {
    // Max mounts per boss determines the number of rows
    const maxMounts = Math.max(...expansion.bosses.map((b) => b.mountIds.length), 1);
    // Empty strings → the label column is hidden in the renderer
    const rowLabels = Array.from({ length: maxMounts }, () => '');

    const columns: GridColumn[] = expansion.bosses.map((boss) => ({
      key: String(boss.instanceId),
      header: boss.shortName,
      title: boss.name,
    }));

    const cells = new Map<string, Array<GridCell | null>>();
    for (const boss of expansion.bosses) {
      cells.set(
        String(boss.instanceId),
        Array.from({ length: maxMounts }, (_, i) => {
          const mountId = boss.mountIds[i];
          if (mountId === undefined) return null;
          const mount = mountMap.get(mountId);
          if (!mount) return null;
          return {
            collectableId: mountId,
            label: mount.name,
            icon: (mount as any).iconUrl ?? undefined,
            globalOwned: (mount as any).globalOwned ?? undefined,
          };
        }),
      );
    }

    return {
      key: expansion.expansion,
      title: expansion.expansion,
      expansionLabel: expansion.expansion,
      expansionClass: expansion.expansionClass,
      rowLabels,
      columns,
      cells,
    };
  });
}

/**
 * Transforms mount collectables + static RAID_MOUNTS_BY_EXPANSION data into
 * the generic GridGroup[] format for SeriesGridView.
 *
 * Groups by expansion → raid fight (columns) → mount slot (rows).
 */
export function buildRaidMountGroups(collectables: Collectable[]): GridGroup[] {
  const mountMap = new Map<number, Collectable>();
  for (const m of collectables) mountMap.set(m.id, m);

  return RAID_MOUNTS_BY_EXPANSION.map((expansion) => {
    // Max mounts per raid fight determines the number of rows
    const maxMounts = Math.max(...expansion.fights.map((f) => f.mountIds.length), 1);
    const rowLabels = Array.from({ length: maxMounts }, () => '');

    const columns: GridColumn[] = expansion.fights.map((fight) => ({
      key: String(fight.instanceId),
      header: fight.shortName,
      title: fight.name,
    }));

    const cells = new Map<string, Array<GridCell | null>>();
    for (const fight of expansion.fights) {
      cells.set(
        String(fight.instanceId),
        Array.from({ length: maxMounts }, (_, i) => {
          const mountId = fight.mountIds[i];
          if (mountId === undefined) return null;
          const mount = mountMap.get(mountId);
          if (!mount) return null;
          return {
            collectableId: mountId,
            label: mount.name,
            icon: (mount as any).iconUrl ?? undefined,
            globalOwned: (mount as any).globalOwned ?? undefined,
          };
        }),
      );
    }

    return {
      key: expansion.expansion,
      title: expansion.expansion,
      expansionLabel: expansion.expansion,
      expansionClass: expansion.expansionClass,
      rowLabels,
      columns,
      cells,
    };
  });
}

