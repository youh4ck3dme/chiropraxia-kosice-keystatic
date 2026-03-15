import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  getServices: vi.fn(),
  getStaff: vi.fn(),
  getAvailableSlots: vi.fn(),
  createBooking: vi.fn(),
  sendConfirmationEmail: vi.fn(),
}));

// Mock ResizeObserver (needed for some React components)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ScrollIntoView
window.HTMLElement.prototype.scrollIntoView = function () {};
