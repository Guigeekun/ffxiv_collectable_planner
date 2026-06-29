import { useState, useEffect } from 'react';
import { getViewsForType, getDefaultView } from '../views/registry';
import type { ViewDefinition } from '../views/types';
import type { CollectableType } from '../types';

const STORAGE_KEY_PREFIX = 'ffxiv_view_';

function readStoredViewId(type: CollectableType): string | null {
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${type}`);
  } catch {
    return null;
  }
}

function writeStoredViewId(type: CollectableType, id: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${type}`, id);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Manages the active view per collectable type.
 *
 * - Persists the last-selected view for each type to localStorage.
 * - Automatically resets to the stored (or default) view when the type changes.
 * - Returns the full ViewDefinition of the active view, not just the ID.
 */
export function useViewState(collectableType: CollectableType) {
  const resolveInitialId = (type: CollectableType): string => {
    const views = getViewsForType(type);
    const stored = readStoredViewId(type);
    if (stored && views.some((v) => v.id === stored)) return stored;
    return getDefaultView(type).id;
  };

  const [activeViewId, setActiveViewIdState] = useState<string>(() =>
    resolveInitialId(collectableType)
  );

  // When the collectable type changes, pick the stored/default view for that type
  useEffect(() => {
    setActiveViewIdState(resolveInitialId(collectableType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectableType]);

  const setActiveViewId = (id: string) => {
    setActiveViewIdState(id);
    writeStoredViewId(collectableType, id);
  };

  const views = getViewsForType(collectableType);
  const activeView: ViewDefinition =
    views.find((v) => v.id === activeViewId) ?? getDefaultView(collectableType);

  return {
    /** All views available for the current collectableType */
    views,
    /** The currently active view definition */
    activeView,
    /** Change the active view (also persists to localStorage) */
    setActiveViewId,
  };
}
