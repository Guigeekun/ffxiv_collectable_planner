import { useMemo, useState } from 'react';
import type { Character, Collectable, SourceTypeMap } from '../types';
import type { RelicWeaponEntry } from '../api/ffxivcollect';
import { RELIC_SERIES, JOB_NAMES, JOB_SORT_ORDER } from '../relicWeaponData';

interface AchievementsWeaponsViewProps {
  /** All achievements (unfiltered) */
  collectables: Collectable[];
  characters: Character[];
  achievementCategories: SourceTypeMap;
  /** Map: achievementId → RelicWeaponEntry (from FFXIV Collect) */
  relicWeaponsData: Record<number, RelicWeaponEntry>;
  loading: boolean;
}

/** Weapon category IDs that belong to weapon achievements */
const WEAPON_CATEGORY_IDS = new Set([62, 63, 64, 65, 66, 68, 71, 75]);

/**
 * Map FFXIV Collect expansion number to expansion name.
 * Numbers come from the FFXIV Collect API's relic.type.expansion field.
 */
function expansionName(exp: number): string {
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

/** Map FFXIV Collect expansion number to a CSS class */
function expansionClass(exp: number): string {
  switch (exp) {
    case 1: return 'exp-arr';   // Legacy — reuse ARR colour
    case 2: return 'exp-arr';
    case 3: return 'exp-hw';
    case 4: return 'exp-sb';
    case 5: return 'exp-shb';
    case 6: return 'exp-ew';
    case 7: return 'exp-dt';
    default: return 'exp-dt';
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface WeaponSeriesGroupProps {
  seriesName: string;
  expansion: number;
  /**
   * Map: job code → achievements sorted by stage order.
   * All jobs present in this series are keys.
   */
  jobGroups: Map<string, Array<{ achievement: Collectable; relic: RelicWeaponEntry }>>;
  characters: Character[];
  ownershipMap: Record<number, Set<number>>;
  defaultExpanded?: boolean;
}

function WeaponSeriesGroup({
  seriesName,
  expansion,
  jobGroups,
  characters,
  ownershipMap,
  defaultExpanded = true,
}: WeaponSeriesGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const stageHeaders = RELIC_SERIES[seriesName]?.stages ?? [];
  const numStages = stageHeaders.length || 1;

  // Sort jobs by role order
  const sortedJobs = useMemo(() => {
    return Array.from(jobGroups.keys()).sort((a, b) => {
      const ai = JOB_SORT_ORDER.indexOf(a);
      const bi = JOB_SORT_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [jobGroups]);

  // Pre-sort each job's entries by stage order
  const sortedJobEntries = useMemo(() => {
    return sortedJobs.map((job) => ({
      job,
      entries: [...(jobGroups.get(job) ?? [])].sort((a, b) => a.relic.order - b.relic.order),
    }));
  }, [sortedJobs, jobGroups]);

  // Total achievements and owned count per character
  const totals = useMemo(() => {
    const allAchs = Array.from(jobGroups.values()).flat();
    return characters.map((char) => {
      const owned = allAchs.filter(({ achievement }) =>
        ownershipMap[char.id]?.has(achievement.id)
      ).length;
      return { charId: char.id, owned, total: allAchs.length };
    });
  }, [jobGroups, characters, ownershipMap]);

  // Grid template: stage-label column + one column per job
  const gridTemplate = `100px repeat(${sortedJobs.length}, 72px)`;

  return (
    <div className="weapon-series-card">
      <button
        className="weapon-series-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="weapon-series-title-row">
          <span className={`expansion-badge ${expansionClass(expansion)}`}>
            {expansionName(expansion)}
          </span>
          <h3 className="weapon-series-title">{seriesName}</h3>
          <span className="expand-chevron">{expanded ? '▼' : '▶'}</span>
        </div>

        {characters.length > 0 && (
          <div className="weapon-series-progress-row">
            {totals.map(({ charId, owned, total }) => {
              const char = characters.find((c) => c.id === charId)!;
              const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
              return (
                <div key={charId} className="series-char-progress" title={`${char.name}: ${owned}/${total}`}>
                  <img src={char.iconUrl} alt={char.name} className="series-char-avatar" />
                  <div className="series-progress-bar-wrap">
                    <div
                      className="series-progress-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="series-progress-label">{owned}/{total}</span>
                </div>
              );
            })}
          </div>
        )}
      </button>

      {expanded && (
        <div className="weapon-series-body">
          {/* Job header row — one column per job */}
          <div
            className="weapon-grid-header"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="weapon-grid-header-stage-label-cell" />
            {sortedJobEntries.map(({ job }) => (
              <div key={job} className="weapon-grid-header-job-col">
                <span className="weapon-job-code">{job}</span>
                <span className="weapon-job-name">{JOB_NAMES[job] ?? job}</span>
              </div>
            ))}
          </div>

          {/* Stage rows — one row per stage */}
          {Array.from({ length: numStages }).map((_, stageIdx) => (
            <div
              key={stageIdx}
              className="weapon-stage-row"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {/* Stage label */}
              <div className="weapon-stage-label">
                {stageHeaders[stageIdx] ?? `Stage ${stageIdx + 1}`}
              </div>

              {/* One card per job for this stage */}
              {sortedJobEntries.map(({ job, entries }) => {
                const entry = entries[stageIdx];
                if (!entry) {
                  return <div key={job} className="weapon-ach-slot-empty" />;
                }
                return (
                  <WeaponAchievementCard
                    key={entry.achievement.id}
                    achievement={entry.achievement}
                    relic={entry.relic}
                    characters={characters}
                    ownershipMap={ownershipMap}
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

interface WeaponAchievementCardProps {
  achievement: Collectable;
  relic: RelicWeaponEntry;
  characters: Character[];
  ownershipMap: Record<number, Set<number>>;
}

function WeaponAchievementCard({ achievement, relic, characters, ownershipMap }: WeaponAchievementCardProps) {
  const ownedByChars = characters.filter((c) => ownershipMap[c.id]?.has(achievement.id));
  const missingCount = characters.length - ownedByChars.length;
  const allOwned = missingCount === 0 && characters.length > 0;
  const noneOwned = ownedByChars.length === 0 && characters.length > 0;

  return (
    <div
      className={`weapon-ach-card ${allOwned ? 'all-owned' : noneOwned ? 'none-owned' : 'partial-owned'}`}
      title={`${relic.relicName}\n${achievement.howTo ?? ''}`}
    >
      <div className="weapon-card-icon-wrap">
        {relic.icon ? (
          <img
            src={relic.icon}
            alt={relic.relicName}
            className="weapon-card-icon"
            loading="lazy"
          />
        ) : (
          <div className="weapon-card-icon-placeholder">⚔️</div>
        )}
        {/* Ownership overlay dots for each character */}
        {characters.length > 0 && (
          <div className="weapon-card-char-dots">
            {characters.map((char) => {
              const owned = ownershipMap[char.id]?.has(achievement.id);
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
      {relic.owned && (
        <div className="weapon-card-global-owned">{relic.owned}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function AchievementsWeaponsView({
  collectables,
  characters,
  relicWeaponsData,
  loading,
}: AchievementsWeaponsViewProps) {
  // Build ownership map: charId → Set<achievementId>
  const ownershipMap = useMemo(() => {
    const map: Record<number, Set<number>> = {};
    for (const char of characters) {
      const owned = (char.achievements as any[]) || [];
      const ids = owned.map((m: any) => {
        if (typeof m === 'object' && m !== null) {
          return m.id ?? m.achievementId ?? m;
        }
        return m;
      });
      map[char.id] = new Set(ids);
    }
    return map;
  }, [characters]);

  // Filter to weapon-category achievements that appear in the relic weapons data
  const weaponAchievements = useMemo(() => {
    const relicAchIds = new Set(Object.keys(relicWeaponsData).map(Number));
    return collectables.filter(
      (c) =>
        (WEAPON_CATEGORY_IDS.has(c.sourceTypeId) || relicAchIds.has(c.id))
        && relicAchIds.has(c.id)
    );
  }, [collectables, relicWeaponsData]);

  // Group achievements by series → job → sorted entries
  const seriesGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        expansion: number;
        jobGroups: Map<string, Array<{ achievement: Collectable; relic: RelicWeaponEntry }>>;
      }
    >();

    for (const ach of weaponAchievements) {
      const relic = relicWeaponsData[ach.id];
      if (!relic) continue;

      const seriesName = relic.series;
      if (!groups.has(seriesName)) {
        groups.set(seriesName, {
          expansion: relic.expansion,
          jobGroups: new Map(),
        });
      }

      const seriesGroup = groups.get(seriesName)!;
      const job = relic.job || 'Unknown';

      if (!seriesGroup.jobGroups.has(job)) {
        seriesGroup.jobGroups.set(job, []);
      }
      seriesGroup.jobGroups.get(job)!.push({ achievement: ach, relic });
    }

    // Sort entries within each job by relic order (stage ascending)
    for (const [, seriesGroup] of groups) {
      for (const [, entries] of seriesGroup.jobGroups) {
        entries.sort((a, b) => a.relic.order - b.relic.order);
      }
    }

    // Sort series by expansion ascending (oldest first)
    return [...groups.entries()].sort(([, a], [, b]) => a.expansion - b.expansion);
  }, [weaponAchievements, relicWeaponsData]);

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner" />
        <p>Loading weapon achievements...</p>
      </div>
    );
  }

  if (Object.keys(relicWeaponsData).length === 0) {
    return (
      <div className="weapons-view-empty">
        <div className="weapons-loading-info">
          <div className="spinner" />
          <p>Loading weapon data from FFXIV Collect...</p>
        </div>
      </div>
    );
  }

  if (seriesGroups.length === 0) {
    return (
      <div className="weapons-view-empty">
        <p>No weapon achievements found. Make sure achievements are loaded.</p>
      </div>
    );
  }

  const totalWeaponAchs = weaponAchievements.length;

  return (
    <div className="weapons-view">
      <div className="weapons-view-header">
        <div className="weapons-view-info">
          <span className="weapons-count">{totalWeaponAchs} weapon achievements</span>
          <span className="weapons-series-count">across {seriesGroups.length} series</span>
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

      <div className="weapons-view-note">
        <span className="weapons-view-note-icon">ℹ️</span>
        <span>
          This view is tied to the <strong>achievements</strong> system — only relic weapons
          that have an associated in-game achievement are shown. Stages or series without
          achievements will not appear.
        </span>
      </div>

      <div className="weapons-series-list">
        {seriesGroups.map(([seriesName, { expansion, jobGroups }]) => (
          <WeaponSeriesGroup
            key={seriesName}
            seriesName={seriesName}
            expansion={expansion}
            jobGroups={jobGroups}
            characters={characters}
            ownershipMap={ownershipMap}
            defaultExpanded={true}
          />
        ))}
      </div>
    </div>
  );
}
