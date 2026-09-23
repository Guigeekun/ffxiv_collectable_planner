import { useState, useEffect, useCallback } from 'react';
import { fetchCharacter } from '../api/ffxivcollect';
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
  syncProgress: { current: number; total: number } | null;
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
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);
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

        // Small stagger between characters to stay polite
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
    let updatedCount = 0;
    let freshCount = 0;
    let rateLimited = false;

    const prevById = new Map(characters.map(c => [c.id, c]));

    try {
      const results: (Character | null)[] = [];
      for (let i = 0; i < charIds.length; i++) {
        const id = charIds[i];
        // FFXIV Collect re-scrapes Lodestone synchronously (when the cached
        // parse is >6h old), so each sync can take a few seconds. Keep a
        // modest gap between characters.
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 750));
        }
        setSyncProgress({ current: i + 1, total: charIds.length });

        try {
          const char = await fetchCharacter(id, { latest: true });
          const prev = prevById.get(id);
          // A sync only produced new data if last_parsed advanced; an
          // unchanged timestamp means the cached parse was <6h old or
          // Lodestone had nothing new.
          if (!prev || (typeof char.updatedAt === 'number' && typeof prev.updatedAt === 'number' && char.updatedAt > prev.updatedAt)) {
            updatedCount++;
          } else {
            freshCount++;
          }
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

      const privateCount = updatedChars.filter(c => (c.privateCollections?.length ?? 0) > 0).length;
      if (privateCount > 0) {
        addToast(
          `🔒 ${privateCount} character${privateCount > 1 ? 's' : ''} keep some collections private on FFXIV Collect — that data can't be tracked.`,
          'info'
        );
      }

      if (rateLimited) {
        addToast('Rate limit hit (429). Some characters were not updated.', 'error');
      } else if (updatedCount > 0 && freshCount === 0) {
        addToast(`Successfully synced ${updatedCount} character${updatedCount > 1 ? 's' : ''}!`, 'success');
      } else if (updatedCount > 0) {
        addToast(`Synced ${updatedCount} character${updatedCount > 1 ? 's' : ''}; ${freshCount} ${freshCount > 1 ? 'were' : 'was'} already up to date (FFXIV Collect re-scrapes at most every 6h).`, 'info');
      } else if (freshCount > 0) {
        addToast('All characters were already up to date (FFXIV Collect re-scrapes at most every 6h).', 'info');
      } else {
        addToast('No characters could be synced.', 'error');
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to sync characters';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSyncing(false);
      setSyncProgress(null);
    }
  }, [charIds, characters, addToast]);

  return { characters, charIds, loading, syncing, syncProgress, error, addCharacter, removeCharacter, syncCharacters };
}
