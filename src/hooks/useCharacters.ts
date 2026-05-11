import { useState, useEffect, useCallback } from 'react';
import { fetchCharacter } from '../api/lalachievements';
import { useToasts } from './useToasts';
import type { Character } from '../types';

const STORAGE_KEY = 'ffxiv_char_ids';

function loadIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveIds(ids: number[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface UseCharactersReturn {
  characters: Character[];
  charIds: number[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
  addCharacter: (id: number | string) => void;
  removeCharacter: (id: number | string) => void;
  syncCharacters: () => Promise<void>;
}

export function useCharacters(): UseCharactersReturn {
  const [charIds, setCharIds] = useState<number[]>(loadIds);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const fetchAll = async () => {
      const results: (Character | null)[] = [];
      for (let i = 0; i < charIds.length; i++) {
        if (cancelled) return;
        
        // Add a small delay between requests (stagger)
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        const res = await fetchCharacter(charIds[i]).catch(() => null);
        results.push(res);
      }

      if (!cancelled) {
        setCharacters(results.filter((r): r is Character => r !== null));
        setLoading(false);
      }
    };

    fetchAll().catch(err => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [charIds]);

  const addCharacter = useCallback((id: number | string) => {
    const numId = Number(id);
    if (!numId || charIds.includes(numId)) return;
    setCharIds(prev => [...prev, numId]);
  }, [charIds]);

  const removeCharacter = useCallback((id: number | string) => {
    const numId = Number(id);
    setCharIds(prev => prev.filter(cid => cid !== numId));
    setCharacters(prev => prev.filter(c => c.id !== numId));
  }, []);

  const { addToast } = useToasts();

  const syncCharacters = useCallback(async () => {
    if (charIds.length === 0) return;
    
    setSyncing(true);
    setError(null);
    let successCount = 0;
    let rateLimited = false;
    
    try {
      const { fetchCharacterRealtime } = await import('../api/lalachievements');
      const results: (Character | null)[] = [];
      for (let i = 0; i < charIds.length; i++) {
        const id = charIds[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        try {
          const char = await fetchCharacterRealtime(id);
          successCount++;
          results.push(char);
        } catch (err: any) {
          if (err.message?.includes('429')) {
            rateLimited = true;
          }
          results.push(null);
        }
      }
      
      const updatedChars = results.filter((r): r is Character => r !== null);
      if (updatedChars.length > 0) {
        setCharacters(prev => {
          const charMap = new Map(prev.map(c => [c.id, c]));
          updatedChars.forEach(c => charMap.set(c.id, c));
          return Array.from(charMap.values());
        });
      }

      if (rateLimited) {
        addToast('Rate limit hit (429). Some characters were not updated.', 'error');
      } else if (successCount > 0) {
        addToast(`Successfully synced ${successCount} character${successCount > 1 ? 's' : ''}!`, 'success');
      } else {
        addToast('No characters could be synced.', 'error');
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to sync characters';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSyncing(false);
    }
  }, [charIds, addToast]);

  return { characters, charIds, loading, syncing, error, addCharacter, removeCharacter, syncCharacters };
}
