import React, { useState, useEffect } from 'react';
import {
  supabase,
  getServices,
  getAllStaff,
  createStaff,
  updateStaff,
  deactivateStaff,
  reactivateStaff,
  type Service,
  type Staff,
  type StaffInput
} from '../../lib/supabase';

import {
  BookingManager,
  StaffManager,
  SettingsManager,
  LinksManager,
  ClientsManager,
  DEFAULT_HOURS,
  type OpeningHours,
  type SmsConfig,
  type TabType,
  type Booking,
  type AdminStats
} from '../admin';
import { Logo } from './Logo';

export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('bookings');

  // Staff State
  const [allStaff, setAllStaff] = useState<(Staff & { is_active?: boolean })[]>([]);

  // Settings State
  const [openingHours, setOpeningHours] = useState<OpeningHours>(DEFAULT_HOURS);
  const [smsConfig, setSmsConfig] = useState<SmsConfig>({ enabled: false, template: '' });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Metadata
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchBookings();
        fetchMetadata();
        fetchAllStaff();
        loadSettings();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchBookings();
        fetchMetadata();
        fetchAllStaff();
        loadSettings();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchMetadata = async () => {
    const [sData, stData] = await Promise.all([getServices(), getAllStaff()]);
    setServices(sData);
    setStaffList(stData.filter(s => (s as any).is_active !== false));
  };

  const fetchAllStaff = async () => {
    const data = await getAllStaff();
    setAllStaff(data as any);
  };

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(name), staff(name)')
      .order('booking_date', { ascending: false })
      .order('start_time', { ascending: true });

    if (error) setError(error.message);
    else setBookings((data || []) as Booking[]);
    setLoading(false);
  };

  // Settings Functions
  const loadSettings = async () => {
    const { data: hoursData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'opening_hours')
      .single();

    if (hoursData?.value) {
      setOpeningHours(hoursData.value as OpeningHours);
    }

    const { data: smsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'sms_config')
      .single();

    if (smsData?.value) {
      setSmsConfig(smsData.value as SmsConfig);
    }
  };

  const saveSettings = async () => {
    setSettingsLoading(true);

    // Save Opening Hours
    const { error: hoursError } = await supabase
      .from('settings')
      .upsert({
        key: 'opening_hours',
        value: openingHours
      }, { onConflict: 'key' });

    // Save SMS Config
    const { error: smsError } = await supabase
      .from('settings')
      .upsert({
        key: 'sms_config',
        value: smsConfig
      }, { onConflict: 'key' });

    if (hoursError || smsError) {
      alert('Chyba pri ukladaní nastavení');
    } else {
      alert('Nastavenia boli uložené!');
    }
    setSettingsLoading(false);
  };

  // Staff CRUD
  const handleAddStaff = async (staff: StaffInput) => {
    setActionLoading(true);
    try {
      await createStaff(staff);
      fetchAllStaff();
      fetchMetadata();
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    }
    setActionLoading(false);
  };

  const handleUpdateStaff = async (id: string, staff: Partial<StaffInput>) => {
    setActionLoading(true);
    try {
      await updateStaff(id, staff);
      fetchAllStaff();
      fetchMetadata();
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    }
    setActionLoading(false);
  };

  const handleToggleStaffActive = async (staff: Staff & { is_active?: boolean }) => {
    const isActive = staff.is_active !== false;
    const action = isActive ? 'deaktivovať' : 'aktivovať';
    if (!confirm(`Naozaj chcete ${action} zamestnanca ${staff.name}?`)) return;

    setActionLoading(true);
    try {
      if (isActive) {
        await deactivateStaff(staff.id);
      } else {
        await reactivateStaff(staff.id);
      }
      fetchAllStaff();
      fetchMetadata();
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    }
    setActionLoading(false);
  };

  // Booking Functions
  const updateStatus = async (booking: Booking, newStatus: 'confirmed' | 'cancelled') => {
    if (!confirm(`Naozaj chcete zmeniť stav na: ${newStatus === 'confirmed' ? 'Potvrdená' : 'Zrušená'}?`)) return;

    setActionLoading(true);
    const { error } = await supabase
      .from('bookings')
      .update({
        status: newStatus,
        confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : null,
        cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : null
      })
      .eq('id', booking.id);

    if (error) {
      alert(error.message);
    } else {
      await fetch('/api/admin/send-status-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          details: {
            clientName: booking.client_name,
            clientEmail: booking.client_email,
            serviceId: booking.service_id,
            staffId: booking.staff_id,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
          },
          serviceName: booking.services?.name || 'Služba',
          staffName: booking.staff?.name || 'Terapeut',
          status: newStatus
        })
      });
      fetchBookings();
    }
    setActionLoading(false);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Naozaj chcete zmazať túto rezerváciu?')) return;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) alert(error.message);
    else fetchBookings();
  };

  const editBooking = async (booking: Booking) => {
    setActionLoading(true);

    const { error } = await supabase
      .from('bookings')
      .update({
        start_time: booking.start_time,
        service_id: booking.service_id,
        staff_id: booking.staff_id,
        notes: booking.notes
      })
      .eq('id', booking.id);

    if (error) {
      alert('Chyba pri aktualizácii: ' + error.message);
    } else {
      await fetch('/api/admin/send-status-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          details: {
            clientName: booking.client_name,
            clientEmail: booking.client_email,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
          },
          serviceName: services.find(s => s.id === booking.service_id)?.name || 'Služba',
          staffName: staffList.find(s => s.id === booking.staff_id)?.name || 'Terapeut',
          status: 'updated'
        })
      });
      fetchBookings();
    }
    setActionLoading(false);
  };

  // Stats
  const stats: AdminStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  // Login Screen
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="w-64 h-auto mx-auto text-white" />
          </div>

          <div className="glass-card shadow-3d p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-chrome-gray mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@chiropraxiakosice.eu"
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chrome-gray mb-2">Heslo</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass w-full text-base py-3"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn-aurora w-full justify-center py-3 text-base font-bold"
                disabled={loading}
              >
                {loading ? 'Prihlasujem...' : 'Prihlásiť sa'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Logo className="w-48 sm:w-64 h-auto" />
        </div>
        <button onClick={handleLogout} className="btn-glass text-sm text-red-400 hover:bg-red-500/10">
          Odhlásiť
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'bookings'
            ? 'bg-aurora text-black font-bold'
            : 'bg-white/40 text-chrome-gray hover:bg-white/60'
            }`}
        >
          📋 Rezervácie
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'staff'
            ? 'bg-aurora text-black font-bold'
            : 'bg-white/40 text-chrome-gray hover:bg-white/60'
            }`}
        >
          👥 Zamestnanci
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'settings'
            ? 'bg-aurora text-black font-bold'
            : 'bg-white/40 text-chrome-gray hover:bg-white/60'
            }`}
        >
          ⚙️ Nastavenia
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'links'
            ? 'bg-aurora text-black font-bold'
            : 'bg-white/5 text-chrome-gray hover:bg-white/10'
            }`}
        >
          🔗 Odkazy
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'clients'
            ? 'bg-aurora text-black font-bold'
            : 'bg-white/5 text-chrome-gray hover:bg-white/10'
            }`}
        >
          📂 Klienti
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' && (
        <BookingManager
          bookings={bookings}
          stats={stats}
          services={services}
          staffList={staffList}
          openingHours={openingHours}
          onUpdateStatus={updateStatus}
          onDelete={deleteBooking}
          onEdit={editBooking}
          loading={actionLoading}
          onNavigateToSettings={() => setActiveTab('settings')}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsManager bookings={bookings} />
      )}

      {activeTab === 'staff' && (
        <StaffManager
          allStaff={allStaff}
          onAddStaff={handleAddStaff}
          onUpdateStaff={handleUpdateStaff}
          onToggleActive={handleToggleStaffActive}
          loading={actionLoading}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsManager
          openingHours={openingHours}
          setOpeningHours={setOpeningHours}
          smsConfig={smsConfig}
          setSmsConfig={setSmsConfig}
          onSave={saveSettings}
          loading={settingsLoading}
        />
      )}

      {activeTab === 'links' && (
        <LinksManager />
      )}
    </div>
  );
}



