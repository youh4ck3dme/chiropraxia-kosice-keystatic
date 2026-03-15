import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingWidget } from '../../components/react/BookingWidget';
import * as supabase from '../../lib/supabase';

// Mock supabase client module
vi.mock('../../lib/supabase');

// Mock child components to simplify test
vi.mock('./ServiceCard', () => ({
  ServiceCard: ({ name, onSelect }: any) => (
    <button onClick={onSelect} data-testid="service-card">{name}</button>
  ),
}));

// Mock fetch globally so the booking submission doesn't throw
const mockFetch = vi.fn();

describe('BookingWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Provide a default successful fetch response for /api/book
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'booking-123' }),
    });

    // Setup default mock data
    vi.mocked(supabase.getServices).mockResolvedValue([
      { 
        id: '1', 
        name: 'Test Service', 
        description: 'Desc', 
        duration_min: 30, 
        price: 30,
        buffer_time_min: 0,
        sort_order: 1
      }
    ]);
    vi.mocked(supabase.getStaff).mockResolvedValue([
      { id: '1', name: 'Dr. Test', role: 'Chiropractor', bio: '', photo_url: '' }
    ]);
    vi.mocked(supabase.getAvailableSlots).mockResolvedValue([
      { slot_time: '10:00:00', slot_end_time: '10:30:00', staff_id: '1', staff_name: 'Dr. Test' }
    ]);
  });

  it('loads and displays services on mount', async () => {
    render(<BookingWidget />);
    
    // Initially shows loading or directly loads if fast
    await waitFor(() => {
      expect(screen.getByText('Test Service')).toBeDefined();
    });
  });

  it('shows services from initialServices prop without calling getServices', async () => {
    const initialServices = [
      {
        id: 'cms-1',
        name: 'CMS Služba',
        description: 'Popis zo CMS',
        duration_min: 50,
        buffer_time_min: 10,
        price: 55,
        sort_order: 1,
      },
    ];

    render(<BookingWidget initialServices={initialServices} />);

    // No loading skeleton should appear — services are provided synchronously via props
    expect(screen.queryByText(/načítavam/i)).toBeNull();

    // Service from CMS should appear immediately
    await waitFor(() => {
      expect(screen.getByText('CMS Služba')).toBeDefined();
    });

    // getServices must NOT have been called because props were provided
    expect(supabase.getServices).not.toHaveBeenCalled();
  });

  it('flows through booking steps', async () => {
    render(<BookingWidget />);
    
    // 1. Select Service
    await waitFor(() => screen.getByText('Test Service'));
    fireEvent.click(screen.getByText('Test Service'));
    
    // 2. Select Date (mocked date gen might be needed or just checking UI)
    // We expect to see "Vyberte termín"
    await waitFor(() => expect(screen.getByText('Vyberte termín')).toBeDefined());
    
    // Select a date — date buttons carry the Tailwind class 'shrink-0'
    const allButtons = screen.getAllByRole('button');
    const firstDateButton = allButtons.find(b => b.className.includes('shrink-0'));
    expect(firstDateButton).toBeDefined();
    fireEvent.click(firstDateButton!);
    
    // 3. Select Time
    await waitFor(() => expect(screen.getByText('10:00')).toBeDefined());
    fireEvent.click(screen.getByText('10:00'));
    
    // 4. Input Details
    await waitFor(() => expect(screen.getByText('Vaše údaje')).toBeDefined());
    
    fireEvent.change(screen.getByPlaceholderText('Ján Novák'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jan@example.sk'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('checkbox')); // GDPR
    
    fireEvent.click(screen.getByText('Pokračovať'));
    
    // 5. Confirm
    await waitFor(() => expect(screen.getByText('Potvrďte rezerváciu')).toBeDefined());
    fireEvent.click(screen.getByText('Potvrdiť rezerváciu'));
    
    // 6. Success
    await waitFor(() => expect(screen.getByText('Rezervácia úspešná!')).toBeDefined());
  });
});


