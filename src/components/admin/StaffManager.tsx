import React, { useState } from 'react';
import type { Staff, StaffInput } from './types';

interface StaffManagerProps {
  allStaff: (Staff & { is_active?: boolean })[];
  onAddStaff: (staff: StaffInput) => Promise<void>;
  onUpdateStaff: (id: string, staff: Partial<StaffInput>) => Promise<void>;
  onToggleActive: (staff: Staff & { is_active?: boolean }) => Promise<void>;
  loading: boolean;
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">👥 Zamestnanci</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-aurora text-sm">
          + Pridať
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allStaff.map((staff) => (
          <div
            key={staff.id}
            className={`glass-card p-4 ${staff.is_active === false ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="from-aurora to-aurora-glow flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl">
                {staff.photo_url ? (
                  <img
                    src={staff.photo_url}
                    alt={staff.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  staff.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-white">{staff.name}</div>
                <div className="text-chrome-gray text-sm">{staff.role}</div>
                <div
                  className={`mt-1 text-xs ${staff.is_active === false ? 'text-red-400' : 'text-emerald-400'}`}
                >
                  {staff.is_active === false ? '● Neaktívny' : '● Aktívny'}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
              <button
                onClick={() => setEditingStaff(staff)}
                className="flex-1 rounded-lg bg-blue-500/20 py-2 text-sm text-blue-400 hover:bg-blue-500/40"
              >
                Upraviť
              </button>
              <button
                onClick={() => onToggleActive(staff)}
                disabled={loading}
                className={`flex-1 rounded-lg py-2 text-sm ${
                  staff.is_active === false
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
          <div className="mb-4 text-4xl">👤</div>
          <div className="text-chrome-gray">Zatiaľ žiadni zamestnanci.</div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">+ Nový zamestnanec</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-chrome-gray rounded-lg bg-white/5 p-2 hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">Meno *</label>
                <input
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">Pozícia *</label>
                <input
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="input-glass w-full"
                  placeholder="napr. Chiropraktik, Fyzioterapeut"
                  required
                />
              </div>
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">Bio</label>
                <textarea
                  value={newStaff.bio || ''}
                  onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
                  className="input-glass min-h-[80px] w-full"
                  placeholder="Krátky popis..."
                />
              </div>
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">URL fotky</label>
                <input
                  value={newStaff.photo_url || ''}
                  onChange={(e) => setNewStaff({ ...newStaff, photo_url: e.target.value })}
                  className="input-glass w-full"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-glass flex-1"
                >
                  Zrušiť
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-aurora flex-1 justify-center"
                >
                  {loading ? 'Pridávam...' : 'Pridať'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">✎ Upraviť zamestnanca</h2>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-chrome-gray rounded-lg bg-white/5 p-2 hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">Meno *</label>
                <input
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">Pozícia *</label>
                <input
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  className="input-glass w-full"
                  required
                />
              </div>
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">Bio</label>
                <textarea
                  value={editingStaff.bio || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                  className="input-glass min-h-[80px] w-full"
                />
              </div>
              <div>
                <label className="text-chrome-gray mb-2 block text-sm">URL fotky</label>
                <input
                  value={editingStaff.photo_url || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, photo_url: e.target.value })}
                  className="input-glass w-full"
                />
              </div>
              <div className="flex gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="btn-glass flex-1"
                >
                  Zrušiť
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-aurora flex-1 justify-center"
                >
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
