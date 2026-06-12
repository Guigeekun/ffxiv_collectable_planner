import { useState, useCallback } from 'react';
import { useToasts } from './useToasts';

// All localStorage keys that belong to a profile snapshot
const PROFILE_KEYS = [
  'ffxiv_char_ids',
  'ffxiv_sorting_mounts',
  'ffxiv_sorting_minions',
  'ffxiv_sorting_titles',
  'ffxiv_sorting_achievements',
  'ffxiv_filters_mounts',
  'ffxiv_filters_minions',
  'ffxiv_filters_titles',
  'ffxiv_filters_achievements',
  'ffxiv_col_visibility_mounts',
  'ffxiv_col_visibility_minions',
  'ffxiv_col_visibility_titles',
  'ffxiv_col_visibility_achievements',
] as const;

const PROFILES_STORAGE_KEY = 'ffxiv_profiles';
const ACTIVE_PROFILE_KEY = 'ffxiv_active_profile';

export interface Profile {
  name: string;
  savedAt: string; // ISO date string
  data: Partial<Record<string, string | null>>;
}

function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistProfiles(profiles: Profile[]): void {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [activeProfile, setActiveProfile] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_PROFILE_KEY)
  );
  const { addToast } = useToasts();

  const saveProfile = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const snapshot: Profile['data'] = {};
    for (const key of PROFILE_KEYS) {
      snapshot[key] = localStorage.getItem(key);
    }

    const newProfile: Profile = {
      name: trimmed,
      savedAt: new Date().toISOString(),
      data: snapshot,
    };

    setProfiles(prev => {
      const updated = prev.some(p => p.name === trimmed)
        ? prev.map(p => (p.name === trimmed ? newProfile : p))
        : [...prev, newProfile];
      persistProfiles(updated);
      return updated;
    });

    localStorage.setItem(ACTIVE_PROFILE_KEY, trimmed);
    setActiveProfile(trimmed);
    addToast(`Profile "${trimmed}" saved!`, 'success');
  }, [addToast]);

  const loadProfile = useCallback((name: string) => {
    const profile = loadProfiles().find(p => p.name === name);
    if (!profile) return;

    // Write all profile keys back to localStorage
    for (const key of PROFILE_KEYS) {
      const val = profile.data[key];
      if (val !== undefined && val !== null) {
        localStorage.setItem(key, val);
      } else {
        localStorage.removeItem(key);
      }
    }

    localStorage.setItem(ACTIVE_PROFILE_KEY, name);
    // Reload the page so all hooks re-hydrate from the restored localStorage state
    window.location.reload();
  }, []);

  const deleteProfile = useCallback((name: string) => {
    setProfiles(prev => {
      const updated = prev.filter(p => p.name !== name);
      persistProfiles(updated);
      return updated;
    });

    if (activeProfile === name) {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
      setActiveProfile(null);
    }

    addToast(`Profile "${name}" deleted.`, 'info');
  }, [activeProfile, addToast]);

  const renameProfile = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;

    setProfiles(prev => {
      if (prev.some(p => p.name === trimmed)) {
        addToast(`A profile named "${trimmed}" already exists.`, 'error');
        return prev;
      }
      const updated = prev.map(p =>
        p.name === oldName ? { ...p, name: trimmed } : p
      );
      persistProfiles(updated);
      return updated;
    });

    if (activeProfile === oldName) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, trimmed);
      setActiveProfile(trimmed);
    }

    addToast(`Renamed to "${trimmed}".`, 'success');
  }, [activeProfile, addToast]);

  const exportProfile = useCallback((name: string) => {
    const profile = profiles.find(p => p.name === name);
    if (!profile) return;

    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ffxiv-profile-${name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Profile "${name}" exported!`, 'success');
  }, [profiles, addToast]);

  const importProfile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed: Profile = JSON.parse(e.target?.result as string);
        if (!parsed.name || typeof parsed.data !== 'object') throw new Error('Invalid format');

        // Ensure a unique name if already exists
        let importName = parsed.name;
        setProfiles(prev => {
          if (prev.some(p => p.name === importName)) {
            importName = `${importName} (imported)`;
          }
          const imported: Profile = { ...parsed, name: importName, savedAt: new Date().toISOString() };
          const updated = [...prev, imported];
          persistProfiles(updated);
          addToast(`Profile "${importName}" imported!`, 'success');
          return updated;
        });
      } catch {
        addToast('Failed to import: invalid profile file.', 'error');
      }
    };
    reader.readAsText(file);
  }, [addToast]);

  return {
    profiles,
    activeProfile,
    saveProfile,
    loadProfile,
    deleteProfile,
    renameProfile,
    exportProfile,
    importProfile,
  };
}
