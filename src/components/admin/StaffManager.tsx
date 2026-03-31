import React, { useState } from 'react';
import type { Staff, StaffInput } from './types';

interface StaffManagerProps {
  readonly allStaff: (Staff & { is_active?: boolean })[];
  readonly onAddStaff: (staff: StaffInput) => Promise<void>;
  readonly onUpdateStaff: (id: string, staff: Partial<StaffInput>) => Promise<void>;
  readonly onToggleActive: (staff: Staff & { is_active?: boolean }) => Promise<void>;
  readonly loading: boolean;
}

export function StaffManager({
  allStaff,
  onAddStaff,
  onUpdateStaff,
  onToggleActive,
  loading,
}: StaffManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<(Staff & { is_active?: boolean }) | null>(null);
  const [newStaff, setNewStaff] = useState<StaffInput>({ name: '', role: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddStaff(newStaff);
    setNewStaff({ name: '', role: '' });
    setShowAddModal(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    await onUpdateStaff(editingStaff.id, {
      name: editingStaff.name,
      role: editingStaff.role,
      bio: editingStaff.bio || undefined,
      photo_url: editingStaff.photo_url || undefined,
    });
    setEditingStaff(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">👥 Zamestnanci</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-aurora text-sm"
        >
          + Pridať
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allStaff.map((staff) => (
          <div key={staff.id} className={`glass-card p-4 ${staff.is_active === false ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-aurora to-aurora-glow flex items-center justify-center text-2xl shrink-0">
                {staff.photo_url ? (
                  <img src={staff.photo_url} alt={staff.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  staff.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">{staff.name}</div>
                <div className="text-sm text-chrome-gray">{staff.role}</div>
                <div className={`text-xs mt-1 ${staff.is_active === false ? 'text-red-400' : 'text-emerald-400'}`}>
                  {staff.is_active === false ? '● Neaktívny' : '● Aktívny'}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setEditingStaff(staff)}
                className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/40"
              >
                Upraviť
              </button>
              <button
                onClick={() => onToggleActive(staff)}
                disabled={loading}
                className={`flex-1 py-2 rounded-lg text-sm ${staff.is_active === false
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/40'
                  }`}
              >
                {staff.is_active === false ? 'Aktivovať' : 'Deaktivovať'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {allStaff.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">👤</div>
          <div className="text-chrome-gray">Zatiaľ žiadni zamestnanci.</div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">+ Nový zamestnanec</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg bg-white/5 text-chrome-gray hover:bg-white/10">✕</button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="add-name" className="block text-sm text-chrome-gray mb-2">Meno *</label>
                <input
                  id="add-name"
                  value={newStaff.name}
                  onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="add-role" className="block text-sm text-chrome-gray mb-2">Pozícia *</label>
                <input
                  id="add-role"
                  value={newStaff.role}
                  onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="input-glass w-full"
                  placeholder="napr. Chiropraktik, Fyzioterapeut"
                  required
                />
              </div>
              <div>
                <label htmlFor="add-bio" className="block text-sm text-chrome-gray mb-2">Bio</label>
                <textarea
                  id="add-bio"
                  value={newStaff.bio || ''}
                  onChange={e => setNewStaff({ ...newStaff, bio: e.target.value })}
                  className="input-glass w-full min-h-20"
                  placeholder="Krátky popis..."
                />
              </div>
              <div>
                <label htmlFor="add-photo" className="block text-sm text-chrome-gray mb-2">URL fotky</label>
                <input
                  id="add-photo"
                  value={newStaff.photo_url || ''}
                  onChange={e => setNewStaff({ ...newStaff, photo_url: e.target.value })}
                  className="input-glass w-full"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-glass flex-1">Zrušiť</button>
                <button type="submit" disabled={loading} className="btn-aurora flex-1 justify-center">
                  {loading ? 'Pridávam...' : 'Pridať'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">✎ Upraviť zamestnanca</h2>
              <button onClick={() => setEditingStaff(null)} className="p-2 rounded-lg bg-white/5 text-chrome-gray hover:bg-white/10">✕</button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm text-chrome-gray mb-2">Meno *</label>
                <input
                  id="edit-name"
                  value={editingStaff.name}
                  onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-role" className="block text-sm text-chrome-gray mb-2">Pozícia *</label>
                <input
                  id="edit-role"
                  value={editingStaff.role}
                  onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-bio" className="block text-sm text-chrome-gray mb-2">Bio</label>
                <textarea
                  id="edit-bio"
                  value={editingStaff.bio || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                  className="input-glass w-full min-h-20"
                />
              </div>
              <div>
                <label htmlFor="edit-photo" className="block text-sm text-chrome-gray mb-2">URL fotky</label>
                <input
                  id="edit-photo"
                  value={editingStaff.photo_url || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, photo_url: e.target.value })}
                  className="input-glass w-full"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingStaff(null)} className="btn-glass flex-1">Zrušiť</button>
                <button type="submit" disabled={loading} className="btn-aurora flex-1 justify-center">
                  {loading ? 'Ukladám...' : 'Uložiť'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


