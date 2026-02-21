import { createClient } from '@supabase/supabase-js';

// Environment variables (set in Vercel Project Settings)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Booking features will be disabled.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types
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

// API Functions

/**
 * Fetch all active services
 */
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all active staff members
 */
export async function getStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching staff:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all staff members (including inactive)
 */
export async function getAllStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all staff:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new staff member
 */
export interface StaffInput {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
}

export async function createStaff(staff: StaffInput): Promise<Staff | null> {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      name: staff.name,
      role: staff.role,
      bio: staff.bio || null,
      photo_url: staff.photo_url || null,
      is_active: true,
    })
    .select();

  if (error) {
    console.error('Error creating staff:', error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
}

/**
 * Update an existing staff member
 */
export async function updateStaff(id: string, updates: Partial<StaffInput & { is_active?: boolean }>): Promise<Staff | null> {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating staff:', error);
    throw new Error(error.message);
  }

  return data && data.length > 0 ? data[0] : null;
}

/**
 * Soft delete (deactivate) a staff member
 */
export async function deactivateStaff(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('staff')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deactivating staff:', error);
    return false;
  }

  return true;
}

/**
 * Reactivate a staff member
 */
export async function reactivateStaff(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('staff')
    .update({ is_active: true })
    .eq('id', id);

  if (error) {
    console.error('Error reactivating staff:', error);
    return false;
  }

  return true;
}

/**
 * Get available time slots for a specific date and service
 */
export async function getAvailableSlots(
  date: string,
  serviceId: string,
  staffId?: string
): Promise<AvailableSlot[]> {
  const { data, error } = await supabase.rpc('get_available_slots', {
    p_date: date,
    p_service_id: serviceId,
    p_staff_id: staffId || null,
  });

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new booking
 */
export async function createBooking(booking: BookingData): Promise<string | null> {
  const { data, error } = await supabase.rpc('create_booking', {
    p_client_name: booking.clientName,
    p_client_email: booking.clientEmail,
    p_client_phone: booking.clientPhone || null,
    p_staff_id: booking.staffId,
    p_service_id: booking.serviceId,
    p_booking_date: booking.bookingDate,
    p_start_time: booking.startTime,
    p_notes: booking.notes || null,
  });

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }

  return data;
}

// Notifications moved to notifications.server.ts to prevent build issues.
