import React, { useState, useMemo } from 'react';
import { StatusBadge } from './StatusBadge';
import { BookingCalendar } from './BookingCalendar';
import { BookingCardSkeleton, StatsCardSkeleton } from './Skeletons';
import type { Booking, AdminStats, StatusFilter, Service, Staff, OpeningHours } from './types';
import { DAY_ORDER, DAY_NAMES } from './types';

type ViewMode = 'list' | 'calendar';

interface BookingManagerProps {
  bookings: Booking[];
  stats: AdminStats;
  services: Service[];
  staffList: Staff[];
  openingHours: OpeningHours;
  onUpdateStatus: (booking: Booking, status: 'confirmed' | 'cancelled') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (booking: Booking) => Promise<void>;
  loading: boolean;
  onNavigateToSettings: () => void;
}

export function BookingManager({
  bookings,
  stats,
  services,
  staffList,
  openingHours,
  onUpdateStatus,
  onDelete,
  onEdit,
  loading,
  onNavigateToSettings,
}: BookingManagerProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Filter bookings by status and search query
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        b.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.client_phone.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    await onEdit(editingBooking);
    setEditingBooking(null);
  };

  const handleCalendarEventClick = (booking: Booking) => {
    setEditingBooking(booking);
  };

  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayHours = openingHours[DAY_ORDER[todayIndex]];

  return (
    <>
      {/* Quick Info Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Welcome Message */}
          <div className="glass-card p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-aurora/20 flex items-center justify-center text-3xl">
              👋
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Vitajte späť!</h3>
              <p className="text-chrome-gray text-sm">
                Dnes je {new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Daily Status */}
          <div className="glass-card p-6 flex flex-col justify-center">
            <p className="text-chrome-gray text-xs uppercase tracking-widest mb-2 font-black">Dnešný stav</p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${todayHours?.closed ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <span className="text-lg font-bold text-white">
                {todayHours?.closed ? 'Dnes máme zatvorené' : `Dnes otvorené: ${todayHours?.open} - ${todayHours?.close}`}
              </span>
            </div>
          </div>
        </div>

        {/* Opening Hours Short Summary */}
        <div className="glass-card p-6 bg-aurora/5 border-aurora/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Otváracie hodiny</h3>
            <button
              onClick={onNavigateToSettings}
              className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-chrome-white hover:bg-aurora transition-colors"
            >
              UPRAVIŤ
            </button>
          </div>
          <div className="space-y-1.5">
            {DAY_ORDER.map(day => (
              <div key={day} className="flex justify-between text-[11px]">
                <span className="text-chrome-gray">{DAY_NAMES[day].slice(0, 3)}:</span>
                <span className={`${openingHours[day]?.closed ? 'text-red-400' : 'text-white'} font-medium`}>
                  {openingHours[day]?.closed ? 'Zatv.' : `${openingHours[day]?.open}-${openingHours[day]?.close}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`glass-card p-4 text-left transition-all hover:scale-[1.02] ${statusFilter === 'all' ? 'ring-2 ring-aurora' : ''}`}
          >
            <div className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs sm:text-sm text-chrome-gray mt-1">Celkom</div>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`glass-card p-4 text-left transition-all hover:scale-[1.02] ${statusFilter === 'pending' ? 'ring-2 ring-amber-500' : ''}`}
          >
            <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-chrome-gray mt-1">⏳ Čakajúce</div>
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`glass-card p-4 text-left transition-all hover:scale-[1.02] ${statusFilter === 'confirmed' ? 'ring-2 ring-emerald-500' : ''}`}
          >
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.confirmed}</div>
            <div className="text-xs sm:text-sm text-chrome-gray mt-1">✓ Potvrdené</div>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`glass-card p-4 text-left transition-all hover:scale-[1.02] ${statusFilter === 'cancelled' ? 'ring-2 ring-red-500' : ''}`}
          >
            <div className="text-2xl sm:text-3xl font-bold text-red-400">{stats.cancelled}</div>
            <div className="text-xs sm:text-sm text-chrome-gray mt-1">✕ Zrušené</div>
          </button>
        </div>
      )}

      {/* Search & View Toggle Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="🔍 Hľadať podľa mena, emailu alebo telefónu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass w-full pl-4 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome-gray hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-aurora text-black' 
                : 'text-chrome-gray hover:text-white'
            }`}
          >
            📋 Zoznam
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'calendar' 
                ? 'bg-aurora text-black' 
                : 'text-chrome-gray hover:text-white'
            }`}
          >
            📅 Kalendár
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'calendar' ? (
        <BookingCalendar 
          bookings={filteredBookings} 
          onSelectEvent={handleCalendarEventClick}
        />
      ) : (
        <>
          {/* Bookings List */}
          {loading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
              <div className="text-chrome-gray">
                {searchQuery ? `Žiadne výsledky pre "${searchQuery}"` : 'Žiadne rezervácie.'}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="glass-card p-4 glass-card-lift">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status={booking.status} />
                        <span className="text-white font-bold">{booking.client_name}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-chrome-gray">Dátum: </span>
                          <span className="text-white">{new Date(booking.booking_date).toLocaleDateString('sk-SK')}</span>
                        </div>
                        <div>
                          <span className="text-chrome-gray">Čas: </span>
                          <span className="text-white">{booking.start_time?.slice(0, 5)}</span>
                        </div>
                        <div>
                          <span className="text-chrome-gray">Služba: </span>
                          <span className="text-white">{booking.services?.name}</span>
                        </div>
                        <div>
                          <span className="text-chrome-gray">Tel: </span>
                          <span className="text-white">{booking.client_phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(booking, 'confirmed')}
                            disabled={loading}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40"
                            title="Potvrdiť"
                          >✓</button>
                          <button
                            onClick={() => onUpdateStatus(booking, 'cancelled')}
                            disabled={loading}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40"
                            title="Zrušiť"
                          >✕</button>
                        </>
                      )}
                      <button
                        onClick={() => setEditingBooking(booking)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40"
                        title="Upraviť"
                      >✎</button>
                      <button
                        onClick={() => onDelete(booking.id)}
                        className="p-2 rounded-lg bg-white/5 text-chrome-gray hover:bg-white/10"
                        title="Zmazať"
                      >🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">✎ Upraviť rezerváciu</h2>
              <button onClick={() => setEditingBooking(null)} className="p-2 rounded-lg bg-white/5 text-chrome-gray hover:bg-white/10">✕</button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-white font-medium">{editingBooking.client_name}</div>
                <div className="text-sm text-chrome-gray">{editingBooking.client_phone}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-chrome-gray mb-2">Dátum</label>
                  <input type="date" value={editingBooking.booking_date} disabled className="input-glass w-full opacity-50" />
                </div>
                <div>
                  <label className="block text-sm text-chrome-gray mb-2">Čas</label>
                  <input
                    type="time"
                    value={editingBooking.start_time?.slice(0, 5)}
                    onChange={e => setEditingBooking({ ...editingBooking, start_time: e.target.value })}
                    className="input-glass w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-chrome-gray mb-2">Služba</label>
                <select
                  value={editingBooking.service_id}
                  onChange={e => setEditingBooking({ ...editingBooking, service_id: e.target.value })}
                  className="input-glass w-full bg-void-black"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-chrome-gray mb-2">Terapeut</label>
                <select
                  value={editingBooking.staff_id}
                  onChange={e => setEditingBooking({ ...editingBooking, staff_id: e.target.value })}
                  className="input-glass w-full bg-void-black"
                >
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingBooking(null)} className="btn-glass flex-1">Zrušiť</button>
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


