import { useState } from 'react';

export default function CharacterManager({ characters, loading, onAdd, onRemove }) {
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    const id = input.trim();
    if (!id) return;
    setAdding(true);
    onAdd(id);
    setInput('');
    setAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="character-manager">
      <div className="char-input-row">
        <input
          id="char-id-input"
          type="text"
          placeholder="Enter Lodestone Character ID..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={adding}
        />
        <button id="add-char-btn" onClick={handleAdd} disabled={adding || !input.trim()}>
          {adding ? 'Adding...' : '+ Add Character'}
        </button>
      </div>

      {loading && characters.length === 0 && (
        <div className="char-loading">Loading characters...</div>
      )}

      <div className="char-cards">
        {characters.map((char) => (
          <div key={char.id} className="char-card">
            <img
              src={char.iconUrl}
              alt={char.name}
              className="char-avatar"
            />
            <div className="char-info">
              <span className="char-name">{char.name}</span>
              <span className="char-world">{char.worldName} · {char.dcName}</span>
            </div>
            <button
              className="char-remove-btn"
              onClick={() => onRemove(char.id)}
              title="Remove character"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
