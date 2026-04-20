import { useState, useEffect, useCallback } from 'react';
import { fetchCharacter } from '../api/lalachievements';

const STORAGE_KEY = 'ffxiv_char_ids';

function loadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useCharacters() {
  const [charIds, setCharIds] = useState(loadIds);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist IDs
  useEffect(() => {
    saveIds(charIds);
  }, [charIds]);

  // Fetch character data whenever IDs change
  useEffect(() => {
    if (charIds.length === 0) {
      setCharacters([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(charIds.map(id => fetchCharacter(id).catch(() => null)))
      .then(results => {
        if (!cancelled) {
          setCharacters(results.filter(Boolean));
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [charIds]);

  const addCharacter = useCallback((id) => {
    const numId = Number(id);
    if (!numId || charIds.includes(numId)) return;
    setCharIds(prev => [...prev, numId]);
  }, [charIds]);

  const removeCharacter = useCallback((id) => {
    const numId = Number(id);
    setCharIds(prev => prev.filter(cid => cid !== numId));
    setCharacters(prev => prev.filter(c => c.id !== numId));
  }, []);

  return { characters, charIds, loading, error, addCharacter, removeCharacter };
}
