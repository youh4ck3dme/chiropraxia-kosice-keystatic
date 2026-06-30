// Shared types for Admin components
import type { Service, Staff, StaffInput } from '../../lib/supabase';

export type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';
export type TabType = 'bookings' | 'staff' | 'settings' | 'links' | 'clients';

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface SmsConfig {
  enabled: boolean;
  template: string;
}

export interface OpeningHours {
  [key: string]: DayHours;
}

export const DEFAULT_HOURS: OpeningHours = {
  monday: { open: '08:00', close: '17:00', closed: false },
  tuesday: { open: '08:00', close: '17:00', closed: false },
  wednesday: { open: '08:00', close: '17:00', closed: false },
  thursday: { open: '08:00', close: '17:00', closed: false },
  friday: { open: '08:00', close: '17:00', closed: false },
  saturday: { open: '09:00', close: '13:00', closed: false },
  sunday: { open: '00:00', close: '00:00', closed: true },
};

export const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAY_NAMES: Record<string, string> = {
  monday: 'Pondelok',
  tuesday: 'Utorok',
  wednesday: 'Streda',
  thursday: 'Štvrtok',
  friday: 'Piatok',
  saturday: 'Sobota',
  sunday: 'Nedeľa',
};

export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  booking_date: string;
  start_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  service_id: string;
  staff_id: string;
  services?: { name: string };
  staff?: { name: string };
  created_at?: string;
  confirmed_at?: string;
  cancelled_at?: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

export { type Service, type Staff, type StaffInput };
