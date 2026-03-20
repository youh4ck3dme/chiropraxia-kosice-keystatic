/**
 * Supabase stub – databáza je momentálne pozastavená.
 * Rezervácie a admin z DB nie sú aktívne. Blog je plne statický (Astro content).
 * Pri opätovnom zapnutí obnovte @supabase/supabase-js a skutočný createClient.
 */

// Types (unchanged for imports)
export interface Staff {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  buffer_time_min: number;
  price: number;
  sort_order: number;
}

export interface AvailableSlot {
  slot_time: string;
  slot_end_time: string;
  staff_id: string;
  staff_name: string;
}

export interface BookingData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  staffId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  notes?: string;
}

export interface StaffInput {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
}

const emptyResult = { data: [] as unknown[], error: null };
const emptySingle = { data: null, error: null };
const noopChain: Record<string, (...args: unknown[]) => unknown> & {
  single: () => Promise<typeof emptySingle>;
  then: (resolve: (v: typeof emptyResult) => void) => void;
} = {
  select: (..._args: unknown[]) => noopChain,
  insert: (..._args: unknown[]) => noopChain,
  update: (..._args: unknown[]) => noopChain,
  upsert: (..._args: unknown[]) => noopChain,
  delete: (..._args: unknown[]) => noopChain,
  eq: (..._args: unknown[]) => noopChain,
  order: (..._args: unknown[]) => noopChain,
  single: () => Promise.resolve(emptySingle),
  then: (resolve: (v: typeof emptyResult) => void) => resolve(emptyResult),
};

const authStub = {
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  onAuthStateChange: (_event: string, callback: (session: null) => void) => {
    callback(null);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Auth je dočasne nedostupný.' } }),
  signOut: () => Promise.resolve({ error: null }),
  exchangeCodeForSession: () => Promise.resolve({ data: null, error: { message: 'Auth je dočasne nedostupný.' } }),
};

export const supabase = {
  auth: authStub,
  from: (_table: string) => noopChain,
  rpc: (_fn: string, _params?: Record<string, unknown>) => Promise.resolve(null),
};

export async function getServices(): Promise<Service[]> {
  return [];
}

export async function getStaff(): Promise<Staff[]> {
  return [];
}

export async function getAllStaff(): Promise<Staff[]> {
  return [];
}

export async function createStaff(_staff: StaffInput): Promise<Staff | null> {
  throw new Error('Rezervácie a admin sú dočasne nedostupné.');
}

export async function updateStaff(_id: string, _updates: Partial<StaffInput & { is_active?: boolean }>): Promise<Staff | null> {
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
}
