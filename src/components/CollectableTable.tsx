import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Character, Collectable, CollectableRow, CollectableType, SourceTypeMap } from '../types';

interface CollectableTableProps {
  collectables: Collectable[];
  characters: Character[];
  sourceTypes: SourceTypeMap;
  loading: boolean;
  collectableType: CollectableType;
}

export default function CollectableTable({
  collectables,
  characters,
  sourceTypes,
  loading,
  collectableType,
}: CollectableTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [hideOwned, setHideOwned] = useState(false);

  // Build ownership lookup: charId -> Set of collectable IDs
  const ownershipMap = useMemo(() => {
    const map: Record<number, Set<number>> = {};
    for (const char of characters) {
      const owned = char[collectableType] as { id: number; date: number }[] || [];
      map[char.id] = new Set(owned.map((m) => m.id));
    }
    return map;
  }, [characters, collectableType]);

  // Available source types for filter dropdown
  const availableSources = useMemo(() => {
    const ids = new Set(collectables.map((c) => c.sourceTypeId));
    return [...ids]
      .map((id) => ({ id, name: sourceTypes[id] || `Unknown (${id})` }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [collectables, sourceTypes]);

  // Table data with missing count baked in
  const data = useMemo(() => {
    let items: CollectableRow[] = collectables.map((c) => {
      const missingCount = characters.filter(
        (char) => !ownershipMap[char.id]?.has(c.id)
      ).length;
      return { ...c, missingCount };
    });

    // Source filter
    if (sourceFilter) {
      items = items.filter((c) => String(c.sourceTypeId) === sourceFilter);
    }

    // Hide fully owned
    if (hideOwned && characters.length > 0) {
      items = items.filter((c) => c.missingCount > 0);
    }

    return items;
  }, [collectables, characters, ownershipMap, sourceFilter, hideOwned]);

  // Column definitions
  const columns = useMemo((): ColumnDef<CollectableRow>[] => {
    const cols: ColumnDef<CollectableRow>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 220,
        cell: (info) => (
          <span className="collectable-name">{info.getValue<string>()}</span>
        ),
      },
      {
        id: 'source',
        accessorFn: (row) => sourceTypes[row.sourceTypeId] || 'Unknown',
        header: 'Source',
        size: 140,
        cell: (info) => (
          <span className={`source-badge source-${info.row.original.sourceTypeId}`}>
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'obtainable',
        header: 'Obtainable',
        size: 100,
        cell: (info) => {
          const val = info.getValue<boolean>();
          return (
            <span className={val ? 'obtainable-yes' : 'obtainable-no'}>
              {val ? '✓ Yes' : '✗ No'}
            </span>
          );
        },
      },
      {
        accessorKey: 'patch',
        header: 'Patch',
        size: 80,
        cell: (info) => info.getValue<string | null>() || '—',
      },
      {
        accessorKey: 'howTo',
        header: 'How to Obtain',
        size: 280,
        cell: (info) => {
          const val = info.getValue<string | null>();
          return (
            <span className="howto-cell" title={val || undefined}>
              {val || '—'}
            </span>
          );
        },
      },
    ];

    // Per-character ownership columns
    for (const char of characters) {
      cols.push({
        id: `char_${char.id}`,
        header: () => (
          <div className="char-col-header" title={`${char.name} — ${char.worldName}`}>
            <img src={char.iconUrl} alt={char.name} className="char-col-avatar" />
            <span className="char-col-name">{char.name.split(' ')[0]}</span>
          </div>
        ),
        accessorFn: (row) => (ownershipMap[char.id]?.has(row.id) ? 1 : 0),
        size: 90,
        cell: (info) => {
          const val = info.getValue<number>();
          return (
            <span className={val ? 'owned-yes' : 'owned-no'}>
              {val ? '✓' : '✗'}
            </span>
          );
        },
      });
    }

    // Missing count column
    if (characters.length > 0) {
      cols.push({
        accessorKey: 'missingCount',
        header: 'Missing',
        size: 80,
        cell: (info) => {
          const v = info.getValue<number>();
          return (
            <span className={`missing-count ${v === 0 ? 'missing-zero' : v === characters.length ? 'missing-all' : ''}`}>
              {v}
            </span>
          );
        },
      });
    }

    return cols;
  }, [characters, ownershipMap, sourceTypes]);

  const table = useReactTable<CollectableRow>({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Loading {collectableType}...</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <input
          id="global-filter"
          type="text"
          placeholder={`Search ${collectableType}...`}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
        <select
          id="source-filter"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="source-select"
        >
          <option value="">All Sources</option>
          {availableSources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {characters.length > 0 && (
          <label className="hide-owned-toggle">
            <input
              type="checkbox"
              checked={hideOwned}
              onChange={(e) => setHideOwned(e.target.checked)}
            />
            <span>Hide fully owned</span>
          </label>
        )}
        <span className="table-count">
          {table.getRowModel().rows.length} / {collectables.length} {collectableType}
        </span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    <div className="th-content">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && ' ↑'}
                      {header.column.getIsSorted() === 'desc' && ' ↓'}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
