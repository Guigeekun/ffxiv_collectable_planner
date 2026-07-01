/**
 * Static data for field operations achievements (Eureka, Save the Queen / Bozja, Occult Crescent).
 */
import type { Collectable } from '../types';
import type { GridGroup, GridColumn, GridCell } from '../seriesGridData';

export interface FieldOpColumnData {
  key: string;
  header: string;
  title: string;
  achmentIds: Array<number | null>;
}

export interface FieldOpGroupData {
  key: string;
  title: string;
  expansionLabel: string;
  expansionClass: string;
  columns: FieldOpColumnData[];
}

export const FIELD_OP_GROUPS: FieldOpGroupData[] = [
  {
    key: 'eureka',
    title: 'The Forbidden Land, Eureka',
    expansionLabel: 'Stormblood',
    expansionClass: 'exp-sb',
    columns: [
  {
    "key": "anemos",
    "header": "Anemos",
    "title": "Eureka Anemos",
    "achmentIds": [
      2046,
      2045,
      null,
      null
    ]
  },
  {
    "key": "pagos",
    "header": "Pagos",
    "title": "Eureka Pagos",
    "achmentIds": [
      2059,
      2097,
      null,
      null
    ]
  },
  {
    "key": "pyros",
    "header": "Pyros",
    "title": "Eureka Pyros",
    "achmentIds": [
      2158,
      2159,
      null,
      null
    ]
  },
  {
    "key": "hydatos",
    "header": "Hydatos",
    "title": "Eureka Hydatos",
    "achmentIds": [
      2230,
      2231,
      2242,
      null
    ]
  },
  {
    "key": "arsenal",
    "header": "Arsenal",
    "title": "Baldesion Arsenal",
    "achmentIds": [
      2227,
      2228,
      2229,
      null
    ]
  }
]
  },
  {
    key: 'bozja',
    title: 'Save the Queen (Bozja)',
    expansionLabel: 'Shadowbringers',
    expansionClass: 'exp-shb',
    columns: [
  {
    "key": "skirmish",
    "header": "Skirmish",
    "title": "Skirmishes Completed",
    "achmentIds": [
      2676,
      2677,
      2678,
      2679
    ]
  },
  {
    "key": "ce",
    "header": "CEs",
    "title": "Critical Engagements",
    "achmentIds": [
      2672,
      2673,
      2674,
      2675
    ]
  },
  {
    "key": "castrum",
    "header": "Castrum",
    "title": "Castrum Lacus Litore Clears",
    "achmentIds": [
      2680,
      2681,
      2682,
      null
    ]
  },
  {
    "key": "delubrum",
    "header": "Delubrum",
    "title": "Delubrum Reginae Clears",
    "achmentIds": [
      2762,
      2763,
      2764,
      null
    ]
  },
  {
    "key": "savage",
    "header": "Savage",
    "title": "Delubrum Reginae (Savage) Clears",
    "achmentIds": [
      2765,
      2766,
      2767,
      null
    ]
  },
  {
    "key": "dalriada",
    "header": "Dalriada",
    "title": "The Dalriada Clears",
    "achmentIds": [
      2874,
      2875,
      2876,
      null
    ]
  },
  {
    "key": "appraisal",
    "header": "Appraisal",
    "title": "Forgotten Fragments Appraised",
    "achmentIds": [
      2687,
      2688,
      2689,
      2690
    ]
  },
  {
    "key": "actions_duels",
    "header": "Actions/Duels",
    "title": "Lost Actions & Duel Wins",
    "achmentIds": [
      2686,
      2880,
      2881,
      2883
    ]
  },
  {
    "key": "support_map",
    "header": "Support/Map",
    "title": "Resurrects & Map Discovery",
    "achmentIds": [
      2691,
      2692,
      2693,
      2620
    ]
  },
  {
    "key": "zadnor_suns",
    "header": "Zadnor/Suns",
    "title": "Suns & Zadnor Map Discovery",
    "achmentIds": [
      2882,
      2891,
      null,
      null
    ]
  }
]
  },
  {
    key: 'occult',
    title: 'The Occult Crescent',
    expansionLabel: 'Dawntrail',
    expansionClass: 'exp-dt',
    columns: [
  {
    "key": "fate",
    "header": "FATEs",
    "title": "FATEs completed on South Horn",
    "achmentIds": [
      3664,
      3665,
      3666,
      3667
    ]
  },
  {
    "key": "ce",
    "header": "CEs",
    "title": "Critical Encounters completed",
    "achmentIds": [
      3660,
      3661,
      3662,
      3663
    ]
  },
  {
    "key": "fork",
    "header": "Forked Tower",
    "title": "Forked Tower: Blood Clears",
    "achmentIds": [
      3668,
      3669,
      3670,
      3671
    ]
  },
  {
    "key": "plenty",
    "header": "Plenty",
    "title": "Treasure Coffers Opened",
    "achmentIds": [
      3678,
      3679,
      3680,
      3681
    ]
  },
  {
    "key": "pots",
    "header": "Pots",
    "title": "Coffers revealed by Persistent Pots",
    "achmentIds": [
      3682,
      3683,
      3684,
      3685
    ]
  },
  {
    "key": "bunnies",
    "header": "Bunnies",
    "title": "Coffers revealed by Happy Bunnies",
    "achmentIds": [
      3686,
      3687,
      3688,
      3689
    ]
  },
  {
    "key": "phantomastery",
    "header": "Jobs",
    "title": "Phantom Jobs Mastered",
    "achmentIds": [
      3675,
      3676,
      3677,
      null
    ]
  },
  {
    "key": "medicine_map",
    "header": "Support/Map",
    "title": "Resurrects & Map Discovery",
    "achmentIds": [
      3672,
      3673,
      3674,
      3743
    ]
  },
  {
    "key": "meta_quest",
    "header": "Meta/Quest",
    "title": "Crescent Story, Records & Coffer Grind",
    "achmentIds": [
      3634,
      3659,
      4019,
      4020
    ]
  }
]
  }
];

/**
 * Transforms field operations achievements + static data into the generic GridGroup[] format for SeriesGridView.
 * Groups by field operation → activity columns → milestones (rows).
 */
export function buildFieldOperationsGroups(collectables: Collectable[]): GridGroup[] {
  const achMap = new Map<number, Collectable>();
  for (const c of collectables) achMap.set(c.id, c);

  return FIELD_OP_GROUPS.map((group) => {
    const numRows = 4;
    const rowLabels = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];

    const columns: GridColumn[] = group.columns.map((col) => ({
      key: col.key,
      header: col.header,
      title: col.title,
    }));

    const cells = new Map<string, Array<GridCell | null>>();

    for (const col of group.columns) {
      cells.set(
        col.key,
        Array.from({ length: numRows }, (_, i) => {
          const achId = col.achmentIds[i];
          if (!achId) return null;
          
          const collectable = achMap.get(achId);
          if (!collectable) return null;
          
          return {
            collectableId: achId,
            label: collectable.name,
            icon: collectable.iconUrl || undefined,
            globalOwned: collectable.globalOwned || undefined,
          };
        })
      );
    }

    return {
      key: group.key,
      title: group.title,
      expansionLabel: group.expansionLabel,
      expansionClass: group.expansionClass,
      rowLabels,
      columns,
      cells,
    };
  });
}
