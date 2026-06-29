/**
 * SeriesGridView — generic 2-D grid for any collectable type.
 *
 * Accepts pre-built GridGroup[] data from the builder functions in
 * seriesGridData.ts, so it has zero knowledge of weapons, mounts, or any
 * other specific domain. All domain-specific logic lives in the builders.
 *
 * Layout:
 *   ┌─ Group card ─────────────────────────────────────────────┐
 *   │  [expansion badge]  Group Title              [chevron]   │
 *   │  [char progress bars…]                                   │
 *   ├──────────────────────────────────────────────────────────┤
 *   │          [col1]   [col2]   [col3]   …                   │
 *   │  [row1]   cell     cell     cell                         │
 *   │  [row2]   cell     ·        cell                         │
 *   └──────────────────────────────────────────────────────────┘
 *
 * When all rowLabels are empty strings the row-label column is hidden.
 */

import { useMemo, useState } from 'react';
import type { Character } from '../types';
import type { GridGroup, GridCell, SeriesGridConfig } from '../seriesGridData';

interface SeriesGridViewProps {
  groups: GridGroup[];
  /**
   * Ownership map: charId → Set<collectableId>.
   * Built by ViewRenderer from Character data using the current collectableType.
   */
  ownershipMap: Record<number, Set<number>>;
  characters: Character[];
  loading: boolean;
  config?: SeriesGridConfig;
  /** Singular/plural noun used in the summary line, e.g. "achievement" */
  itemLabel?: string;
}

// ── Column widths ──────────────────────────────────────────────────────────────

const COL_WIDTH = { sm: 72, md: 90 } as const;
const ICON_SIZE = { sm: 52, md: 64 } as const;
const LABEL_COL_WIDTH = 100;

// ── GridItemCard ──────────────────────────────────────────────────────────────

interface GridItemCardProps {
  cell: GridCell;
  characters: Character[];
  ownershipMap: Record<number, Set<number>>;
  cardSize: 'sm' | 'md';
  showLabel: boolean;
}

function GridItemCard({ cell, characters, ownershipMap, cardSize, showLabel }: GridItemCardProps) {
  const ownedCount = characters.filter((c) => ownershipMap[c.id]?.has(cell.collectableId)).length;
  const total = characters.length;
  const allOwned = total > 0 && ownedCount === total;
  const noneOwned = total > 0 && ownedCount === 0;
  const iconPx = ICON_SIZE[cardSize];

  const stateClass =
    total === 0 ? '' : allOwned ? 'all-owned' : noneOwned ? 'none-owned' : 'partial-owned';

  const modClass = cardSize === 'md' ? 'grid-card--md' : '';

  return (
    <div
      className={`weapon-ach-card ${stateClass} ${modClass}`}
      title={`${cell.label}${cell.globalOwned ? `\n${cell.globalOwned} of players own this` : ''}`}
    >
      <div className="weapon-card-icon-wrap" style={{ width: iconPx, height: iconPx }}>
        {cell.icon ? (
          <img
            src={cell.icon}
            alt={cell.label}
            className="weapon-card-icon"
            style={{ width: iconPx, height: iconPx }}
            loading="lazy"
          />
        ) : (
          <div className="weapon-card-icon-placeholder" style={{ width: iconPx, height: iconPx }}>
            {cardSize === 'md' ? '🐎' : '⚔️'}
          </div>
        )}

        {total > 0 && (
          <div className="weapon-card-char-dots">
            {characters.map((char) => {
              const owned = ownershipMap[char.id]?.has(cell.collectableId);
              return (
                <span
                  key={char.id}
                  className={`char-dot ${owned ? 'dot-owned' : 'dot-missing'}`}
                  title={`${char.name}: ${owned ? 'Owned' : 'Missing'}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {showLabel && (
        <div className="weapon-card-name" style={{ maxWidth: iconPx + 16 }}>
          {cell.label}
        </div>
      )}
      {cell.globalOwned && !showLabel && (
        <div className="weapon-card-global-owned">{cell.globalOwned}</div>
      )}
    </div>
  );
}

// ── GridGroupCard ─────────────────────────────────────────────────────────────

interface GridGroupCardProps {
  group: GridGroup;
  characters: Character[];
  ownershipMap: Record<number, Set<number>>;
  cardSize: 'sm' | 'md';
  showLabel: boolean;
  defaultExpanded?: boolean;
}

function GridGroupCard({
  group,
  characters,
  ownershipMap,
  cardSize,
  showLabel,
  defaultExpanded = true,
}: GridGroupCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const numRows = group.rowLabels.length;
  const numCols = group.columns.length;
  const hasRowLabels = group.rowLabels.some((l) => l !== '');
  const colWidth = COL_WIDTH[cardSize];
  const gridTemplate = hasRowLabels
    ? `${LABEL_COL_WIDTH}px repeat(${numCols}, ${colWidth}px)`
    : `repeat(${numCols}, ${colWidth}px)`;

  // Per-character progress within this group (de-duplicated cell IDs)
  const charProgress = useMemo(() => {
    const uniqueIds = [
      ...new Set(
        [...group.cells.values()]
          .flat()
          .filter((c): c is GridCell => c !== null)
          .map((c) => c.collectableId),
      ),
    ];
    return characters.map((char) => ({
      charId: char.id,
      owned: uniqueIds.filter((id) => ownershipMap[char.id]?.has(id)).length,
      total: uniqueIds.length,
    }));
  }, [group, characters, ownershipMap]);

  return (
    <div className="weapon-series-card">
      {/* ── Collapsible header ── */}
      <button
        className="weapon-series-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="weapon-series-title-row">
          {group.expansionLabel && (
            <span className={`expansion-badge ${group.expansionClass ?? ''}`}>
              {group.expansionLabel}
            </span>
          )}
          <h3 className="weapon-series-title">{group.title}</h3>
          <span className="expand-chevron">{expanded ? '▼' : '▶'}</span>
        </div>

        {characters.length > 0 && (
          <div className="weapon-series-progress-row">
            {charProgress.map(({ charId, owned, total }) => {
              const char = characters.find((c) => c.id === charId)!;
              const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
              return (
                <div
                  key={charId}
                  className="series-char-progress"
                  title={`${char.name}: ${owned}/${total}`}
                >
                  <img src={char.iconUrl} alt={char.name} className="series-char-avatar" />
                  <div className="series-progress-bar-wrap">
                    <div className="series-progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="series-progress-label">
                    {owned}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </button>

      {/* ── Grid body ── */}
      {expanded && (
        <div className="weapon-series-body">
          {/* Column headers */}
          <div className="weapon-grid-header" style={{ gridTemplateColumns: gridTemplate }}>
            {hasRowLabels && <div className="weapon-grid-header-stage-label-cell" />}
            {group.columns.map((col) => (
              <div key={col.key} className="weapon-grid-header-job-col" title={col.title ?? col.header}>
                <span className="weapon-job-code">{col.header}</span>
                {col.title && col.title !== col.header && (
                  <span className="weapon-job-name">{col.title}</span>
                )}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {Array.from({ length: numRows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="weapon-stage-row"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {hasRowLabels && (
                <div className="weapon-stage-label">
                  {group.rowLabels[rowIdx] ?? ''}
                </div>
              )}
              {group.columns.map((col) => {
                const cell = group.cells.get(col.key)?.[rowIdx] ?? null;
                if (!cell) {
                  return (
                    <div
                      key={col.key}
                      className="weapon-ach-slot-empty"
                      style={{ width: ICON_SIZE[cardSize], height: ICON_SIZE[cardSize] }}
                    />
                  );
                }
                return (
                  <GridItemCard
                    key={`${col.key}-${rowIdx}`}
                    cell={cell}
                    characters={characters}
                    ownershipMap={ownershipMap}
                    cardSize={cardSize}
                    showLabel={showLabel}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function SeriesGridView({
  groups,
  ownershipMap,
  characters,
  loading,
  config = {},
  itemLabel = 'items',
}: SeriesGridViewProps) {
  const cardSize = config.cardSize ?? 'sm';
  const showLabel = config.showCardLabels ?? false;

  const totalUniqueItems = useMemo(() => {
    const ids = new Set(
      groups
        .flatMap((g) => [...g.cells.values()])
        .flat()
        .filter((c): c is GridCell => c !== null)
        .map((c) => c.collectableId),
    );
    return ids.size;
  }, [groups]);

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="weapons-view-empty">
        <p>No data found. Make sure collectables are loaded.</p>
      </div>
    );
  }

  return (
    <div className="weapons-view">
      <div className="weapons-view-header">
        <div className="weapons-view-info">
          <span className="weapons-count">{totalUniqueItems} {itemLabel}</span>
          <span className="weapons-series-count">across {groups.length} groups</span>
        </div>
        {characters.length > 0 && (
          <div className="weapons-legend">
            <span className="legend-dot dot-owned" />
            <span>Owned</span>
            <span className="legend-dot dot-missing" />
            <span>Missing</span>
          </div>
        )}
      </div>

      <div className="weapons-series-list">
        {groups.map((group) => (
          <GridGroupCard
            key={group.key}
            group={group}
            characters={characters}
            ownershipMap={ownershipMap}
            cardSize={cardSize}
            showLabel={showLabel}
            defaultExpanded={true}
          />
        ))}
      </div>
    </div>
  );
}
