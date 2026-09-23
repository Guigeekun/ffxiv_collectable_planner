import { useState } from 'react';
import type { Character } from '../types';
import { searchCharacters, type CharacterSearchResult } from '../api/ffxivcollect';

function formatUpdatedAgo(updatedAt?: number): string {
  if (!updatedAt) return 'unknown';
  const seconds = Math.floor((Date.now() - updatedAt) / 1000);
  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];
  for (const [unitSeconds, name] of units) {
    const value = Math.floor(seconds / unitSeconds);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

function formatPrivateCollections(keys: NonNullable<Character['privateCollections']>): string {
  return keys.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ');
}

interface CharacterManagerProps {
  characters: Character[];
  loading: boolean;
  syncing: boolean;
  syncProgress: { current: number; total: number } | null;
  onAdd: (id: string) => void;
  onRemove: (id: number) => void;
  onSync: () => void;
}

export default function CharacterManager({ characters, loading, syncing, syncProgress, onAdd, onRemove, onSync }: CharacterManagerProps) {
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
      alert(
        err instanceof DOMException && err.name === 'TimeoutError'
          ? 'Search timed out — the Lodestone lookup is slow right now. Try again, or enter the Lodestone ID directly.'
          : 'Failed to search characters. Please try again.'
      );
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
            <p>Searches FFXIV Collect's tracked characters first, then falls back to a live Lodestone search.</p>
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
                <span
                  className="char-updated"
                  title={char.updatedAt ? `Last updated: ${new Date(char.updatedAt).toLocaleString()}` : undefined}
                >
                  Updated {formatUpdatedAgo(char.updatedAt)}
                </span>
                {(char.privateCollections?.length ?? 0) > 0 && (
                  <span
                    className="char-private-badge"
                    title={`${formatPrivateCollections(char.privateCollections!)} ${char.privateCollections!.length > 1 ? 'are' : 'is'} set to private on FFXIV Collect. This data can't be tracked and shows as unknown; everything else was loaded normally.`}
                  >
                    🔒 {formatPrivateCollections(char.privateCollections!)} private
                  </span>
                )}
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
                {syncing
                  ? syncProgress ? `Syncing ${syncProgress.current}/${syncProgress.total}...` : 'Syncing...'
                  : '🔄 Sync All'}
              </button>
              <div className="tooltip-wrapper">
                <span className="tooltip-icon">ⓘ</span>
                <div className="tooltip-content">
                  <strong>Sync</strong>
                  <p>Pulls fresh data from Lodestone via FFXIV Collect.</p>
                  <p>Characters are re-scraped at most every 6 hours; fresher data is returned as-is.</p>
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
              <p><strong>Note:</strong> Search goes through FFXIV Collect — its tracked characters first, then a live Lodestone search.</p>
              <p>If your character is missing, please enter their Lodestone ID directly.</p>
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
                      <span className="search-result-id">{char.worldName ? `${char.worldName} · ` : ''}ID: {char.id}</span>
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
              <a href={`https://ffxivcollect.com/characters/${optionsChar.id}`} target="_blank" rel="noreferrer" className="option-btn">
                View on FFXIV Collect
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
