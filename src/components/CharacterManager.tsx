import { useState } from 'react';
import type { Character } from '../types';
import { searchCharacters, CharacterSearchResult } from '../api/lalachievements';

interface CharacterManagerProps {
  characters: Character[];
  loading: boolean;
  syncing: boolean;
  onAdd: (id: string) => void;
  onRemove: (id: number) => void;
  onSync: () => void;
}

export default function CharacterManager({ characters, loading, syncing, onAdd, onRemove, onSync }: CharacterManagerProps) {
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CharacterSearchResult[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [optionsChar, setOptionsChar] = useState<Character | null>(null);

  const handleAdd = async () => {
    const query = input.trim();
    if (!query) return;

    // If it's pure numbers, assume it's a Lodestone ID and add directly
    if (/^\d+$/.test(query)) {
      setAdding(true);
      onAdd(query);
      setInput('');
      setAdding(false);
      return;
    }

    // Otherwise, perform a search
    setIsSearching(true);
    try {
      const results = await searchCharacters(query);
      setSearchResults(results);
      setShowSearchModal(true);
    } catch (err) {
      console.error('Failed to search characters:', err);
      alert('Failed to search characters. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (charId: number) => {
    setShowSearchModal(false);
    setAdding(true);
    onAdd(charId.toString());
    setInput('');
    setAdding(false);
  };

  const handleSync = () => {
    onSync();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="character-manager">
      <div className="char-input-row">
        <input
          id="char-id-input"
          type="text"
          placeholder="Search character name or enter Lodestone ID..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={adding || isSearching}
        />
        <button id="add-char-btn" onClick={handleAdd} disabled={adding || isSearching || !input.trim()}>
          {adding ? 'Adding...' : isSearching ? 'Searching...' : '+ Add/Search Character'}
        </button>

        <div className="tooltip-wrapper" style={{ marginLeft: '8px' }}>
          <span className="tooltip-icon">ⓘ</span>
          <div className="tooltip-content">
            <strong>Character Search</strong>
            <p>Enter a name to search or a direct Lodestone ID.</p>
            <p className="tooltip-warning">⚠ Name searches consume 3 API points.</p>
          </div>
        </div>

        {loading && characters.length === 0 && (
          <div className="char-loading">Loading characters...</div>
        )}

        <div className="char-cards">
          {characters.map((char) => (
            <div key={char.id} className="char-card" onClick={() => setOptionsChar(char)} style={{ cursor: 'pointer' }}>
              <img
                src={char.iconUrl}
                alt={char.name}
                className="char-avatar"
              />
              <div className="char-info">
                <span className="char-name">{char.name}</span>
                <span className="char-world">{char.worldName} · {char.dcName}</span>
              </div>
            </div>
          ))}
          {characters.length > 0 && (
            <div className="sync-container">
              <button
                id="sync-chars-btn"
                onClick={handleSync}
                disabled={syncing}
                className={syncing ? 'syncing' : ''}
              >
                {syncing ? 'Syncing...' : '🔄 Sync All'}
              </button>
              <div className="tooltip-wrapper">
                <span className="tooltip-icon">ⓘ</span>
                <div className="tooltip-content">
                  <strong>Realtime Sync</strong>
                  <p>Fetches fresh data directly from Lodestone.</p>
                  <p className="tooltip-warning">⚠ Consumes 5 API points per character.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSearchModal && (
        <div className="search-modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3>Search Results</h3>
              <button className="search-modal-close" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>

            <div className="search-modal-disclaimer">
              <p><strong>Note:</strong> This search only queries the Lalachievements database, not Lodestone directly.</p>
              <p>If your character is missing, please look them up on <a href="https://lalachievements.com" target="_blank" rel="noreferrer">Lalachievements.com</a> first.</p>
            </div>

            <div className="search-results-list">
              {searchResults.length === 0 ? (
                <div className="search-no-results">No characters found matching "{input}".</div>
              ) : (
                searchResults.map(char => (
                  <div key={char.id} className="search-result-item" onClick={() => handleSelectSearchResult(char.id)}>
                    <img src={char.iconUrl} alt={char.name} className="search-result-avatar" />
                    <div className="search-result-info">
                      <span className="search-result-name">{char.name}</span>
                      <span className="search-result-id">ID: {char.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {optionsChar && (
        <div className="search-modal-overlay" onClick={() => setOptionsChar(null)}>
          <div className="search-modal options-modal" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3>{optionsChar.name}</h3>
              <button className="search-modal-close" onClick={() => setOptionsChar(null)}>✕</button>
            </div>
            <div className="options-list">
              <a href={`https://www.lalachievements.com/char/${optionsChar.id}/`} target="_blank" rel="noreferrer" className="option-btn">
                View on Lalachievements
              </a>
              <a href={`https://eu.finalfantasyxiv.com/lodestone/character/${optionsChar.id}/`} target="_blank" rel="noreferrer" className="option-btn">
                View on Lodestone
              </a>
              <button className="option-btn danger" onClick={() => {
                onRemove(optionsChar.id);
                setOptionsChar(null);
              }}>
                Remove Character
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
