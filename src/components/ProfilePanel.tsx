import { useState, useRef, useEffect, useCallback, DragEvent } from 'react';
import { useProfiles } from '../hooks/useProfiles';
import type { Profile } from '../hooks/useProfiles';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// ─── ProfileCard ─────────────────────────────────────────────────────────────

interface ProfileCardProps {
  profile: Profile;
  isActive: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onExport: () => void;
}

function ProfileCard({ profile, isActive, onLoad, onDelete, onRename, onExport }: ProfileCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const handleRenameSubmit = () => {
    if (editName.trim() && editName.trim() !== profile.name) {
      onRename(editName.trim());
    }
    setEditing(false);
    setEditName(profile.name);
  };

  return (
    <div className={`profile-card ${isActive ? 'profile-card--active' : ''}`}>
      <div className="profile-card-header">
        {editing ? (
          <input
            ref={inputRef}
            className="profile-rename-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') { setEditing(false); setEditName(profile.name); }
            }}
          />
        ) : (
          <span
            className="profile-card-name"
            onDoubleClick={() => { setEditing(true); setEditName(profile.name); }}
            title="Double-click to rename"
          >
            {isActive && <span className="profile-active-dot" title="Currently active" />}
            {profile.name}
          </span>
        )}

        <button
          className="profile-icon-btn"
          onClick={() => { setEditing(true); setEditName(profile.name); }}
          title="Rename profile"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>

      <div className="profile-card-meta">
        <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {formatDate(profile.savedAt)}
      </div>

      <div className="profile-card-actions">
        <button className="profile-btn profile-btn--load" onClick={onLoad}>
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Load
        </button>

        <button className="profile-btn profile-btn--export" onClick={onExport} title="Export as JSON">
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Export
        </button>

        {confirmDelete ? (
          <div className="profile-confirm-delete">
            <span>Delete?</span>
            <button className="profile-btn profile-btn--danger" onClick={onDelete}>Yes</button>
            <button className="profile-btn profile-btn--ghost" onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        ) : (
          <button className="profile-btn profile-btn--danger" onClick={() => setConfirmDelete(true)} title="Delete profile">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ProfilePanel ────────────────────────────────────────────────────────────

export default function ProfilePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    profiles,
    activeProfile,
    saveProfile,
    loadProfile,
    deleteProfile,
    renameProfile,
    exportProfile,
    importProfile,
  } = useProfiles();

  // Pre-fill save input with active profile name
  useEffect(() => {
    if (isOpen && activeProfile && !newName) {
      setNewName(activeProfile);
    }
  }, [isOpen, activeProfile]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleSave = () => {
    if (newName.trim()) {
      saveProfile(newName.trim());
    }
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.json')) importProfile(file);
  }, [importProfile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importProfile(file);
    e.target.value = '';
  };

  return (
    <>
      {/* Toggle button — always visible on the right edge */}
      <button
        id="profile-panel-toggle"
        className={`profile-toggle-btn ${isOpen ? 'profile-toggle-btn--open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        title="Profiles"
        aria-label="Open profile panel"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="profile-toggle-label">Profiles</span>
        {profiles.length > 0 && (
          <span className="profile-toggle-count">{profiles.length}</span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && <div className="profile-backdrop" onClick={() => setIsOpen(false)} />}

      {/* Drawer */}
      <div
        ref={panelRef}
        className={`profile-panel ${isOpen ? 'profile-panel--open' : ''}`}
        aria-hidden={!isOpen}
      >
        {/* Panel header */}
        <div className="profile-panel-header">
          <div className="profile-panel-title">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Profiles
          </div>
          <button className="profile-close-btn" onClick={() => setIsOpen(false)} aria-label="Close panel">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="profile-panel-body">
          {/* Save section */}
          <div className="profile-save-section">
            <p className="profile-section-label">Save current settings as a profile</p>
            <div className="profile-save-row">
              <input
                id="profile-name-input"
                type="text"
                className="profile-name-input"
                placeholder="Profile name…"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                maxLength={48}
              />
              <button
                className="profile-save-btn"
                onClick={handleSave}
                disabled={!newName.trim()}
                title="Save profile"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {profiles.some(p => p.name === newName.trim()) ? 'Overwrite' : 'Save'}
              </button>
            </div>
          </div>

          <div className="profile-divider" />

          {/* Profiles list */}
          <div className="profile-list-section">
            <p className="profile-section-label">
              Saved profiles
              {profiles.length > 0 && <span className="profile-count-badge">{profiles.length}</span>}
            </p>

            {profiles.length === 0 ? (
              <div className="profile-empty">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <p>No profiles saved yet.</p>
                <p>Save your current settings above to get started.</p>
              </div>
            ) : (
              <div className="profile-list">
                {profiles.map(profile => (
                  <ProfileCard
                    key={profile.name}
                    profile={profile}
                    isActive={profile.name === activeProfile}
                    onLoad={() => loadProfile(profile.name)}
                    onDelete={() => deleteProfile(profile.name)}
                    onRename={newName => renameProfile(profile.name, newName)}
                    onExport={() => exportProfile(profile.name)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="profile-divider" />

          {/* Import section */}
          <div className="profile-import-section">
            <p className="profile-section-label">Import a profile</p>
            <div
              className={`profile-drop-zone ${isDragging ? 'profile-drop-zone--active' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              </svg>
              <span>Drop a <code>.json</code> file here or <u>click to browse</u></span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
          </div>
        </div>
      </div>
    </>
  );
}
