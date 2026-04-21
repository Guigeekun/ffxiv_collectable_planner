import { useMemo, useState, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type ColumnFiltersState,
  type Column,
} from '@tanstack/react-table';
import type { Character, Collectable, CollectableRow, CollectableType, SourceTypeMap } from '../types';

interface FilterPopoverProps {
  column: Column<CollectableRow, any>;
  options?: { label: string; value: any }[];
  type?: 'multi-select' | 'text';
  title?: string;
}

function FilterPopover({ column, options, type = 'text', title }: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const filterValue = column.getFilterValue() as any;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!options || !search) return options;
    return options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const isFiltered = filterValue !== undefined && (Array.isArray(filterValue) ? filterValue.length > 0 : filterValue !== '');

  return (
    <div className="filter-wrapper" ref={popoverRef} onClick={(e) => e.stopPropagation()}>
      <button
        className={`filter-trigger ${isFiltered ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Filter ${title}`}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      {isOpen && (
        <div className="filter-popover">
          <div className="filter-popover-header">
            <span>Filter {title}</span>
            <button className="filter-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          {type === 'text' ? (
            <div className="filter-popover-body">
              <input
                type="text"
                className="filter-search-input"
                placeholder="Search..."
                value={filterValue || ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                autoFocus
              />
            </div>
          ) : (
            <>
              <div className="filter-popover-toolbar">
                <input
                  type="text"
                  className="filter-search-input"
                  placeholder="Find option..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="filter-actions">
                  <button onClick={() => column.setFilterValue(options?.map(o => o.value))}>All</button>
                  <button onClick={() => column.setFilterValue([])}>None</button>
                </div>
              </div>
              <div className="filter-popover-body checklist">
                {filteredOptions?.map((opt) => {
                  const checked = Array.isArray(filterValue) && filterValue.includes(opt.value);
                  return (
                    <label key={opt.value} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const current = (filterValue as any[]) || [];
                          const next = checked
                            ? current.filter(v => v !== opt.value)
                            : [...current, opt.value];
                          column.setFilterValue(next.length ? next : undefined);
                        }}
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Build ownership lookup: charId -> Set of collectable IDs
  const ownershipMap = useMemo(() => {
    const map: Record<number, Set<number>> = {};
    for (const char of characters) {
      const owned = char[collectableType] as { id: number; date: number }[] || [];
      map[char.id] = new Set(owned.map((m) => m.id));
    }
    return map;
  }, [characters, collectableType]);

  // Unique values for filters
  const availableSources = useMemo(() => {
    const ids = new Set(collectables.map((c) => c.sourceTypeId));
    return [...ids]
      .map((id) => ({ id, name: sourceTypes[id] || `Unknown (${id})` }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [collectables, sourceTypes]);

  const availablePatches = useMemo(() => {
    const patches = new Set(collectables.map((c) => c.patch).filter(Boolean) as string[]);
    return [...patches].sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
  }, [collectables]);

  // Table data with missing count baked in
  const data = useMemo(() => {
    return collectables.map((c) => {
      const missingCount = characters.filter(
        (char) => !ownershipMap[char.id]?.has(c.id)
      ).length;
      return { ...c, missingCount };
    });
  }, [collectables, characters, ownershipMap]);

  // Column definitions
  const columns = useMemo((): ColumnDef<CollectableRow>[] => {
    const cols: ColumnDef<CollectableRow>[] = [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <div className="th-with-filter">
            <span>Name</span>
            <FilterPopover column={column} title="Name" type="text" />
          </div>
        ),
        size: 220,
        cell: (info) => (
          <span className="collectable-name">{info.getValue<string>()}</span>
        ),
      },
      {
        id: 'source',
        accessorFn: (row) => row.sourceTypeId,
        header: ({ column }) => (
          <div className="th-with-filter">
            <span>Source</span>
            <FilterPopover 
              column={column} 
              title="Source" 
              type="multi-select" 
              options={availableSources.map(s => ({ label: s.name, value: s.id }))} 
            />
          </div>
        ),
        size: 140,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
        cell: (info) => {
          const id = info.getValue<number>();
          return (
            <span className={`source-badge source-${id}`}>
              {sourceTypes[id] || 'Unknown'}
            </span>
          );
        },
      },
      {
        accessorKey: 'obtainable',
        header: ({ column }) => (
          <div className="th-with-filter">
            <span>Obtainable</span>
            <FilterPopover 
              column={column} 
              title="Obtainable" 
              type="multi-select" 
              options={[{ label: '✓ Yes', value: true }, { label: '✗ No', value: false }]} 
            />
          </div>
        ),
        size: 100,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
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
        header: ({ column }) => (
          <div className="th-with-filter">
            <span>Patch</span>
            <FilterPopover 
              column={column} 
              title="Patch" 
              type="multi-select" 
              options={availablePatches.map(p => ({ label: p, value: p }))} 
            />
          </div>
        ),
        size: 80,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
        cell: (info) => info.getValue<string | null>() || '—',
      },
      {
        accessorKey: 'howTo',
        header: ({ column }) => (
          <div className="th-with-filter">
            <span>How to Obtain</span>
            <FilterPopover column={column} title="Obtain" type="text" />
          </div>
        ),
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
        header: ({ column }) => (
          <div className="char-col-header" title={`${char.name} — ${char.worldName}`}>
            <img src={char.iconUrl} alt={char.name} className="char-col-avatar" />
            <div className="th-with-filter">
              <span className="char-col-name">{char.name.split(' ')[0]}</span>
              <FilterPopover 
                column={column} 
                title={char.name} 
                type="multi-select" 
                options={[
                  { label: 'Owned', value: 1 },
                  { label: 'Missing', value: 0 }
                ]}
              />
            </div>
          </div>
        ),
        accessorFn: (row) => (ownershipMap[char.id]?.has(row.id) ? 1 : 0),
        size: 90,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
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
        header: ({ column }) => (
          <div className="th-with-filter">
            <span>Missing</span>
            <FilterPopover 
              column={column} 
              title="Missing" 
              type="multi-select" 
              options={Array.from({ length: characters.length + 1 }, (_, i) => ({ label: String(i), value: i }))} 
            />
          </div>
        ),
        size: 80,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
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
  }, [characters, ownershipMap, sourceTypes, availableSources, availablePatches]);

  const table = useReactTable<CollectableRow>({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
        <div className="active-filters-summary">
          {columnFilters.length > 0 && (
            <button
              className="clear-all-filters"
              onClick={() => setColumnFilters([])}
            >
              ✕ Clear all filters
            </button>
          )}
        </div>
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
                    style={{ width: header.getSize() }}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    <div className="th-content">
                      <div 
                        className="th-label"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                      </div>
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
