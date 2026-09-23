import { useState, useEffect } from 'react';
import { useCharacters } from './hooks/useCharacters';
import { fetchCollectables, fetchRelicWeaponsData, type RelicWeaponEntry } from './api/ffxivcollect';
import CharacterManager from './components/CharacterManager';
import ViewHost from './components/ViewHost';
import ProfilePanel from './components/ProfilePanel';
import type { Collectable, CollectableType, SourceTypeMap } from './types';

export default function App() {
  const { characters, loading: charsLoading, syncing: charsSyncing, syncProgress: charsSyncProgress, addCharacter, removeCharacter, syncCharacters } = useCharacters();
  const [collectableType, setCollectableType] = useState<CollectableType>('mounts');
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  const [sourceTypes, setSourceTypes] = useState<SourceTypeMap>({});
  const [relicWeaponsData, setRelicWeaponsData] = useState<Record<number, RelicWeaponEntry>>({});
  const [loadingData, setLoadingData] = useState(true);

  // Fetch relic weapon data once (the one enrichment pass still needed,
  // since relics map achievements to series/stages for the grid view)
  useEffect(() => {
    fetchRelicWeaponsData()
      .then(setRelicWeaponsData)
      .catch((err) => console.error('Failed to load relic weapons data:', err));
  }, []);

  // Fetch collectables when type changes; FFXIV Collect ships icons,
  // ownership % and source info inline, and the source-type names are
  // derived from the same payload.
  useEffect(() => {
    let cancelled = false;
    setLoadingData(true);
    fetchCollectables(collectableType)
      .then((data) => {
        if (cancelled) return;
        setCollectables(data);
        const st: SourceTypeMap = {};
        for (const c of data) {
          if (c.sourceTypeId != null && c.sourceTypeName) {
            st[c.sourceTypeId] = c.sourceTypeName;
          }
        }
        setSourceTypes(st);
        setLoadingData(false);
      })
      .catch((err) => {
        console.error(`Failed to load ${collectableType}:`, err);
        if (!cancelled) setLoadingData(false);
      });
    return () => { cancelled = true; };
  }, [collectableType]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-branding">
              <img src="/ffxivggkcollect.png" alt="FFXIV GGK Collect" className="header-logo" />
              <h1>GGK Figment - FFXIV Collectable Planner</h1>
            </div>
            <p className="header-subtitle">Track your mount, minion, title &amp; achievement collection across characters</p>
          </div>
          <div className="type-toggle">
            <button
              id="toggle-mounts"
              className={`toggle-btn ${collectableType === 'mounts' ? 'active' : ''}`}
              onClick={() => setCollectableType('mounts')}
            >
              🐎 Mounts
            </button>
            <button
              id="toggle-minions"
              className={`toggle-btn ${collectableType === 'minions' ? 'active' : ''}`}
              onClick={() => setCollectableType('minions')}
            >
              🐣 Minions
            </button>
            <button
              id="toggle-titles"
              className={`toggle-btn ${collectableType === 'titles' ? 'active' : ''}`}
              onClick={() => setCollectableType('titles')}
            >
              👑 Titles
            </button>
            <button
              id="toggle-achievements"
              className={`toggle-btn ${collectableType === 'achievements' ? 'active' : ''}`}
              onClick={() => setCollectableType('achievements')}
            >
              🏆 Achievements
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="characters-section">
          <h2>Characters</h2>
          <CharacterManager
            characters={characters}
            loading={charsLoading}
            syncing={charsSyncing}
            syncProgress={charsSyncProgress}
            onAdd={addCharacter}
            onRemove={removeCharacter}
            onSync={syncCharacters}
          />
        </section>

        <section className="table-section">
          <ViewHost
            collectables={collectables}
            characters={characters}
            sourceTypes={sourceTypes}
            loading={loadingData}
            collectableType={collectableType}
            relicWeaponsData={relicWeaponsData}
          />
        </section>
      </main>

      <ProfilePanel />
    </div>
  );
}
