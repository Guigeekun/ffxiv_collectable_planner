import { useState, useEffect, useMemo } from 'react';
import { useCharacters } from './hooks/useCharacters';
import { fetchCollectables, fetchSourceTypes } from './api/lalachievements';
import { fetchAchievementCategories } from './api/xivapi';
import { fetchMountData, fetchMinionData, fetchRelicWeaponsData, fetchReputationAchievementsData, type FFXIVCollectData, type RelicWeaponEntry } from './api/ffxivcollect';
import CharacterManager from './components/CharacterManager';
import ViewHost from './components/ViewHost';
import ProfilePanel from './components/ProfilePanel';
import type { Collectable, CollectableType, SourceTypeMap } from './types';

export default function App() {
  const { characters, loading: charsLoading, syncing: charsSyncing, addCharacter, removeCharacter, syncCharacters } = useCharacters();
  const [collectableType, setCollectableType] = useState<CollectableType>('mounts');
  const [collectables, setCollectables] = useState<Collectable[]>([]);
  const [sourceTypes, setSourceTypes] = useState<SourceTypeMap>({});
  const [achievementCategories, setAchievementCategories] = useState<SourceTypeMap>({});
  const [mountData, setMountData] = useState<Record<number, FFXIVCollectData>>({});
  const [minionData, setMinionData] = useState<Record<number, FFXIVCollectData>>({});
  const [relicWeaponsData, setRelicWeaponsData] = useState<Record<number, RelicWeaponEntry>>({});
  const [reputationAchievementsData, setReputationAchievementsData] = useState<Record<number, FFXIVCollectData>>({});
  const [loadingData, setLoadingData] = useState(true);

  // Fetch source types and mount icons once
  useEffect(() => {
    Promise.all([fetchSourceTypes(), fetchAchievementCategories()])
      .then(([st, ac]) => {
        setSourceTypes(st);
        setAchievementCategories(ac);
      })
      .catch((err) => console.error('Failed to load categories:', err));

    fetchMountData()
      .then(setMountData)
      .catch((err) => console.error('Failed to load mount data:', err));

    fetchMinionData()
      .then(setMinionData)
      .catch((err) => console.error('Failed to load minion data:', err));

    fetchRelicWeaponsData()
      .then(setRelicWeaponsData)
      .catch((err) => console.error('Failed to load relic weapons data:', err));

    fetchReputationAchievementsData()
      .then(setReputationAchievementsData)
      .catch((err) => console.error('Failed to load reputation achievements data:', err));
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

  const enrichedCollectables = useMemo(() => {
    if (collectableType === 'mounts') {
      return collectables.map(c => ({
        ...c,
        iconUrl: mountData[c.id as number]?.icon,
        globalOwned: mountData[c.id as number]?.owned
      }));
    }
    if (collectableType === 'minions') {
      return collectables.map(c => ({
        ...c,
        iconUrl: minionData[c.id as number]?.icon,
        globalOwned: minionData[c.id as number]?.owned
      }));
    }
    if (collectableType === 'achievements') {
      return collectables.map(c => ({
        ...c,
        iconUrl: reputationAchievementsData[c.id as number]?.icon,
        globalOwned: reputationAchievementsData[c.id as number]?.owned
      }));
    }
    return collectables;
  }, [collectables, collectableType, mountData, minionData, reputationAchievementsData]);

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
            onAdd={addCharacter}
            onRemove={removeCharacter}
            onSync={syncCharacters}
          />
        </section>

        <section className="table-section">
          <ViewHost
            collectables={enrichedCollectables}
            characters={characters}
            sourceTypes={activeSourceTypes}
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
