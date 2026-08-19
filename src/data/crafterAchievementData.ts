import type { Collectable } from '../types';
import type { GridGroup, GridColumn, GridCell } from '../seriesGridData';

const romanToIdx = (roman: string) => {
  switch (roman) {
    case 'I': return 0;
    case 'II': return 1;
    case 'III': return 2;
    case 'IV': return 3;
    case 'V': return 4;
    case 'VI': return 5;
    default: return -1;
  }
};

const crafterCats: Record<number, string> = {
  24: 'Carpenter',
  25: 'Blacksmith',
  26: 'Armorer',
  27: 'Goldsmith',
  28: 'Leatherworker',
  29: 'Weaver',
  30: 'Alchemist',
  31: 'Culinarian'
};

const JOB_CODES: Record<number, string> = {
  24: 'CRP',
  25: 'BSM',
  26: 'ARM',
  27: 'GSM',
  28: 'LTW',
  29: 'WVR',
  30: 'ALC',
  31: 'CUL'
};

function getIconUrl(iconVal: string | number | undefined): string | undefined {
  if (!iconVal) return undefined;
  const iconId = typeof iconVal === 'number' ? iconVal : parseInt(iconVal, 10);
  if (isNaN(iconId)) return undefined;

  const paddedIcon = String(iconId).padStart(6, '0');
  const folder = String(Math.floor(iconId / 1000) * 1000).padStart(6, '0');
  return `https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F${folder}%2F${paddedIcon}_hr1.tex`;
}

export function buildCrafterAchievementGroups(collectables: Collectable[]): GridGroup[] {
  // Filter for achievements in the crafter categories
  const crafterAchs = collectables.filter(c => c.sourceTypeId >= 24 && c.sourceTypeId <= 31);

  // Group by jobId (sourceTypeId)
  const jobMap = new Map<number, Collectable[]>();
  for (const ach of crafterAchs) {
    const jobId = ach.sourceTypeId;
    if (!jobMap.has(jobId)) {
      jobMap.set(jobId, []);
    }
    jobMap.get(jobId)!.push(ach);
  }

  // Row labels (I to X)
  const rowLabels = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const maxStages = 10;

  // Columns definition
  const columns: GridColumn[] = [
    { key: 'recipes', header: 'Recipes', title: 'Unique Recipes (I Made That)' },
    { key: 'quality', header: 'Quality', title: 'High-Quality Crafts (An Eye for Detail)' },
    { key: 'synthesis', header: 'Synthesis', title: 'Synthesis progress' },
    { key: 'restoration', header: 'Restoration', title: 'Ishgardian Restoration / Expert Recipes' },
    { key: 'cosmic', header: 'Cosmic', title: 'Dawntrail Cosmic Restoration & Tool Mastery' },
    { key: 'resplendent', header: 'Resplendent', title: 'Resplendent Tools' },
  ];

  // We want to sort jobs in the order of Carpenter, Blacksmith, etc.
  const sortedJobIds = [24, 25, 26, 27, 28, 29, 30, 31];

  return sortedJobIds.map(jobId => {
    const achs = jobMap.get(jobId) || [];
    const jobName = crafterCats[jobId] || 'Unknown';
    const jobCode = JOB_CODES[jobId] || 'CRP';

    const cells = new Map<string, Array<GridCell | null>>();
    // Initialize columns with null arrays of length maxStages
    for (const col of columns) {
      cells.set(col.key, Array(maxStages).fill(null));
    }

    for (const ach of achs) {
      const description = ach.description as string | undefined;
      let colKey = '';
      let rowIdx = -1;

      if (ach.name.startsWith('I Made That:')) {
        colKey = 'recipes';
        const roman = ach.name.split(' ').pop() || '';
        rowIdx = romanToIdx(roman);
      } else if (ach.name.startsWith('An Eye for Detail:')) {
        colKey = 'quality';
        const roman = ach.name.split(' ').pop() || '';
        rowIdx = romanToIdx(roman);
      } else if (description && description.includes('Successfully synthesize')) {
        colKey = 'synthesis';
        const levelMatch = description.match(/level\s+(\d+)-(\d+)/i);
        if (levelMatch) {
          const startLevel = parseInt(levelMatch[1], 10);
          rowIdx = Math.floor(startLevel / 10);
        }
      } else if (description && (description.includes('skyward score') || description.includes('Ishgardian restoration'))) {
        colKey = 'restoration';
        if (description.includes('skyward score')) {
          const roman = ach.name.split(' ').pop() || '';
          rowIdx = romanToIdx(roman);
        } else if (description.includes('Ishgardian restoration')) {
          if (description.includes('second phase')) rowIdx = 3;
          else if (description.includes('third phase')) rowIdx = 4;
          else if (description.includes('fourth phase')) rowIdx = 5;
        }
      } else if (ach.name.includes('Rocket') || ach.name.includes('with the Stars') || (description && description.includes('tool mastery'))) {
        colKey = 'cosmic';
        if (ach.name.includes('Rocket')) {
          const roman = ach.name.split(' ').pop() || '';
          rowIdx = romanToIdx(roman);
        } else if (ach.name.includes('with the Stars')) {
          rowIdx = 2;
        } else if (description && description.includes('tool mastery')) {
          rowIdx = 3;
        }
      } else if (ach.name.startsWith('Retooled:')) {
        colKey = 'resplendent';
        rowIdx = 0;
      }

      if (colKey && rowIdx >= 0 && rowIdx < maxStages) {
        cells.get(colKey)![rowIdx] = {
          collectableId: ach.id,
          label: ach.name,
          icon: getIconUrl(ach.icon as string | number),
          globalOwned: ach.globalOwned as string || undefined,
          description: ach.howTo || description || undefined,
        };
      }
    }

    return {
      key: jobCode,
      title: jobName,
      rowLabels,
      columns,
      cells,
    };
  });
}
