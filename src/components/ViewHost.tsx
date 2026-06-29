import type { Character, Collectable, CollectableType, SourceTypeMap } from '../types';
import type { RelicWeaponEntry } from '../api/ffxivcollect';
import { useViewState } from '../hooks/useViewState';
import ViewRenderer from './ViewRenderer';

interface ViewHostProps {
  collectables: Collectable[];
  characters: Character[];
  sourceTypes: SourceTypeMap;
  loading: boolean;
  collectableType: CollectableType;
  relicWeaponsData: Record<number, RelicWeaponEntry>;
}

/**
 * Top-level host for the view system.
 *
 * Responsibilities:
 *  1. Reads available views for the current collectableType from the registry.
 *  2. Manages the active view (persisted to localStorage via useViewState).
 *  3. Renders the view-switcher tab bar (hidden when there is only one view).
 *  4. Delegates rendering to ViewRenderer.
 */
export default function ViewHost({
  collectables,
  characters,
  sourceTypes,
  loading,
  collectableType,
  relicWeaponsData,
}: ViewHostProps) {
  const { views, activeView, setActiveViewId } = useViewState(collectableType);

  return (
    <div className="view-host">
      {views.length > 1 && (
        <div className="view-host-toolbar">
          <div className="achievement-view-switcher">
            {views.map((view) => (
              <button
                key={view.id}
                id={`view-btn-${view.id}`}
                className={`view-switch-btn ${activeView.id === view.id ? 'active' : ''}`}
                onClick={() => setActiveViewId(view.id)}
              >
                {view.icon} {view.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ViewRenderer
        view={activeView}
        collectables={collectables}
        characters={characters}
        sourceTypes={sourceTypes}
        loading={loading}
        collectableType={collectableType}
        relicWeaponsData={relicWeaponsData}
      />
    </div>
  );
}
