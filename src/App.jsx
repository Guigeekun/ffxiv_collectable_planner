import { useState, useEffect } from 'react';
import { useCharacters } from './hooks/useCharacters';
import { fetchCollectables, fetchSourceTypes } from './api/lalachievements';
import CharacterManager from './components/CharacterManager';
import CollectableTable from './components/CollectableTable';

export default function App() {
  const { characters, loading: charsLoading, addCharacter, removeCharacter } = useCharacters();
  const [collectableType, setCollectableType] = useState('mounts');
  const [collectables, setCollectables] = useState([]);
  const [sourceTypes, setSourceTypes] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  // Fetch source types once
  useEffect(() => {
    fetchSourceTypes()
      .then(setSourceTypes)
      .catch((err) => console.error('Failed to load source types:', err));
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>
              <span className="header-icon">✦</span>
              FFXIV Collectable Planner
            </h1>
            <p className="header-subtitle">Track your mount &amp; minion collection across characters</p>
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
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="characters-section">
          <h2>Characters</h2>
          <CharacterManager
            characters={characters}
            loading={charsLoading}
            onAdd={addCharacter}
            onRemove={removeCharacter}
          />
        </section>

        <section className="table-section">
          <CollectableTable
            collectables={collectables}
            characters={characters}
            sourceTypes={sourceTypes}
            loading={loadingData}
            collectableType={collectableType}
          />
        </section>
      </main>
    </div>
  );
}
