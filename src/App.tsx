import { useState, useEffect } from 'react';
import { useCharacters } from './hooks/useCharacters';
import { fetchCollectables, fetchSourceTypes, fetchAchievementCategories } from './api/lalachievements';
import CharacterManager from './components/CharacterManager';
import CollectableTable from './components/CollectableTable';
import type { Collectable, CollectableType, SourceTypeMap } from './types';

export default function App() {
  const { characters, loading: charsLoading, syncing: charsSyncing, addCharacter, removeCharacter, syncCharacters } = useCharacters();
  const [collectableType, setCollectableType] = useState<CollectableType>('mounts');
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  const [sourceTypes, setSourceTypes] = useState<SourceTypeMap>({});
  const [achievementCategories, setAchievementCategories] = useState<SourceTypeMap>({});
  const [loadingData, setLoadingData] = useState(true);

  // Fetch source types once
  useEffect(() => {
    Promise.all([fetchSourceTypes(), fetchAchievementCategories()])
      .then(([st, ac]) => {
        setSourceTypes(st);
        setAchievementCategories(ac);
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch collectables when type changes
  useEffect(() => {
    setLoadingData(true);
    fetchCollectables(collectableType)
      .then((data) => {
        setCollectables(data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.error(`Failed to load ${collectableType}:`, err);
        setLoadingData(false);
      });
  }, [collectableType]);

  const activeSourceTypes = (() => {
    if (collectableType === 'achievements') return achievementCategories;
    if (collectableType === 'titles') return { 1: 'Achievement' };
    return sourceTypes;
  })();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>
              <span className="header-icon">✦</span>
              FFXIV Collectable Planner
            </h1>
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
            onAdd={addCharacter}
            onRemove={removeCharacter}
            onSync={syncCharacters}
          />
        </section>

        <section className="table-section">
          <CollectableTable
            collectables={collectables}
            characters={characters}
            sourceTypes={activeSourceTypes}
            loading={loadingData}
            collectableType={collectableType}
          />
        </section>
      </main>
    </div>
  );
}
