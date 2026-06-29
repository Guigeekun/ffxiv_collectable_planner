import type { Collectable } from '../types';
import type { GridGroup, GridColumn, GridCell } from '../seriesGridData';

export interface RaidFight {
  /** Full raid fight name (shown as a tooltip in the grid). */
  name: string;
  /**
   * Short raid/boss name shown as the column header.
   * Keep under ~12 characters so it fits the grid column width.
   */
  shortName: string;
  /** FFXIV Collect instance ID for cross-referencing. */
  instanceId: number;
  /** IDs of the mount(s) that drop from this fight, in display order. */
  mountIds: number[];
}

export interface RaidExpansion {
  /** Expansion name (used as the group title and expansion badge label). */
  expansion: string;
  /** CSS class for expansion-specific theming (exp-arr / exp-hw / …). */
  expansionClass: string;
  /** Ordered list of raid fights (chronologically within the expansion). */
  fights: RaidFight[];
}

export const RAID_MOUNTS_BY_EXPANSION: RaidExpansion[] = [
  // ── Heavensward ─────────────────────────────────────────────────────────────
  {
    expansion: 'Heavensward',
    expansionClass: 'exp-hw',
    fights: [
      {
        name: 'Alexander - The Burden of the Father (Savage)',
        shortName: 'A4S',
        instanceId: 119,
        mountIds: [58], // Gobwalker
      },
      {
        name: 'Alexander - The Soul of the Creator (Savage)',
        shortName: 'A12S',
        instanceId: 193,
        mountIds: [101], // Arrhidaeus
      },
    ],
  },

  // ── Stormblood ──────────────────────────────────────────────────────────────
  {
    expansion: 'Stormblood',
    expansionClass: 'exp-sb',
    fights: [
      {
        name: 'Deltascape V4.0 (Savage)',
        shortName: 'O4S',
        instanceId: 259,
        mountIds: [126], // Alte Roite
      },
      {
        name: 'Sigmascape V4.0 (Savage)',
        shortName: 'O8S',
        instanceId: 295,
        mountIds: [156], // Air Force
      },
      {
        name: 'Alphascape V4.0 (Savage)',
        shortName: 'O12S',
        instanceId: 594,
        mountIds: [173], // Model O
      },
    ],
  },

  // ── Shadowbringers ──────────────────────────────────────────────────────────
  {
    expansion: 'Shadowbringers',
    expansionClass: 'exp-shb',
    fights: [
      {
        name: "Eden's Gate: Sepulture (Savage)",
        shortName: 'E4S',
        instanceId: 690,
        mountIds: [188], // Skyslipper
      },
      {
        name: "Eden's Verse: Refulgence (Savage)",
        shortName: 'E8S',
        instanceId: 729,
        mountIds: [219], // Ramuh
      },
      {
        name: "Eden's Promise: Eternity (Savage)",
        shortName: 'E12S',
        instanceId: 759,
        mountIds: [234], // Eden
      },
    ],
  },

  // ── Endwalker ───────────────────────────────────────────────────────────────
  {
    expansion: 'Endwalker',
    expansionClass: 'exp-ew',
    fights: [
      {
        name: 'Asphodelos: The Fourth Circle (Savage)',
        shortName: 'P4S',
        instanceId: 801,
        mountIds: [265], // Demi-Phoinix
      },
      {
        name: 'Abyssos: The Eighth Circle (Savage)',
        shortName: 'P8S',
        instanceId: 884,
        mountIds: [305], // Sunforged
      },
      {
        name: 'Anabaseios: The Twelfth Circle (Savage)',
        shortName: 'P12S',
        instanceId: 943,
        mountIds: [319], // Megaloambystoma
      },
    ],
  },

  // ── Dawntrail ───────────────────────────────────────────────────────────────
  {
    expansion: 'Dawntrail',
    expansionClass: 'exp-dt',
    fights: [
      {
        name: 'AAC Light-heavyweight M4 (Savage)',
        shortName: 'M4S',
        instanceId: 992,
        mountIds: [349], // Monowheel S1
      },
      {
        name: 'AAC Cruiserweight M4 (Savage)',
        shortName: 'M8S',
        instanceId: 1026,
        mountIds: [382], // Air-wheeler C9
      },
      {
        name: 'AAC Heavyweight M4 (Savage)',
        shortName: 'M12S',
        instanceId: 1075,
        mountIds: [413], // Lowrider T1RANT
      },
    ],
  },
];

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
