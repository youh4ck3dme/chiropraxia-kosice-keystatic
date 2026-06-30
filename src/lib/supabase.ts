// Supabase has been removed. Booking data helpers below are lightweight
// in-memory/static replacements used by the current UI.

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_min: number;
  buffer_time_min: number;
  price: number;
  sort_order: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  is_active?: boolean;
}

export interface StaffInput {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
}

<<<<<<< HEAD
const _emptyPromise = <T>(value: T): Promise<{ data: T; error: null }> =>
  Promise.resolve({ data: value, error: null });
=======
export interface AvailableSlot {
  slot_time: string;
  slot_end_time: string;
  staff_id: string;
  staff_name: string;
}
>>>>>>> origin/main

const STATIC_SERVICES: Service[] = [
  {
    id: 'chiroprakticka-masaz',
    name: 'Chiropraktická masáž',
    description: 'Uvoľnenie chrbtice a svalového napätia.',
    duration_min: 50,
    buffer_time_min: 10,
    price: 55,
    sort_order: 1,
  },
<<<<<<< HEAD
  signInWithPassword: () =>
    Promise.resolve({
      data: { user: null, session: null },
      error: { message: 'Auth je dočasne nedostupný.' },
    }),
  signOut: () => Promise.resolve({ error: null }),
  exchangeCodeForSession: () =>
    Promise.resolve({ data: null, error: { message: 'Auth je dočasne nedostupný.' } }),
};
=======
  {
    id: 'korekcia',
    name: 'Naprávanie/Chiropraxia',
    description: 'Cielená korekcia blokád chrbtice a kĺbov.',
    duration_min: 15,
    buffer_time_min: 10,
    price: 30,
    sort_order: 2,
  },
];
>>>>>>> origin/main

const STATIC_STAFF: Staff[] = [
  {
    id: 'staff-1',
    name: 'Chiropraxia Košice',
    role: 'Terapeut',
    is_active: true,
  },
];

const STATIC_SLOT_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const ARBITRARY_BASE_DATE_YEAR = 2000;

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(Date.UTC(ARBITRARY_BASE_DATE_YEAR, 0, 1, h, m + minutes, 0));
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const mins = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${mins}:00`;
}

export async function getServices(): Promise<Service[]> {
  return STATIC_SERVICES;
}

export async function getStaff(): Promise<Staff[]> {
  return STATIC_STAFF;
}

<<<<<<< HEAD
export async function getAllStaff(): Promise<Staff[]> {
  return [];
}

export async function createStaff(_staff: StaffInput): Promise<Staff | null> {
  throw new Error('Rezervácie a admin sú dočasne nedostupné.');
}

export async function updateStaff(
  _id: string,
  _updates: Partial<StaffInput & { is_active?: boolean }>
): Promise<Staff | null> {
  throw new Error('Rezervácie a admin sú dočasne nedostupné.');
}

export async function deactivateStaff(_id: string): Promise<boolean> {
  return false;
}

export async function reactivateStaff(_id: string): Promise<boolean> {
  return false;
}

export async function getAvailableSlots(
  _date: string,
  _serviceId: string,
  _staffId?: string
): Promise<AvailableSlot[]> {
  return [];
}

export async function createBooking(_booking: BookingData): Promise<string | null> {
  throw new Error('Rezervácie sú dočasne nedostupné.');
=======
export async function getAvailableSlots(_date: string, _serviceId: string): Promise<AvailableSlot[]> {
  return STATIC_SLOT_TIMES.map((time) => ({
    slot_time: `${time}:00`,
    slot_end_time: addMinutesToTime(time, 30),
    staff_id: STATIC_STAFF[0].id,
    staff_name: STATIC_STAFF[0].name,
  }));
>>>>>>> origin/main
}
