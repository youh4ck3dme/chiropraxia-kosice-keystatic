import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BookingWidget } from '../../components/react/BookingWidget';
<<<<<<< HEAD
import * as supabase from '../../lib/supabase';

// Mock supabase client module
vi.mock('../../lib/supabase');

// Mock child components to simplify test
vi.mock('./ServiceCard', () => ({
  ServiceCard: ({ name, onSelect }: any) => (
    <button onClick={onSelect} data-testid="service-card">
      {name}
    </button>
  ),
}));
=======
>>>>>>> origin/main

describe('BookingWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
<<<<<<< HEAD

    // Setup default mock data
    vi.mocked(supabase.getServices).mockResolvedValue([
      {
        id: '1',
        name: 'Test Service',
        description: 'Desc',
        duration_min: 30,
        price: 30,
        buffer_time_min: 0,
        sort_order: 1,
      },
    ]);
    vi.mocked(supabase.getStaff).mockResolvedValue([
      { id: '1', name: 'Dr. Test', role: 'Chiropractor', bio: '', photo_url: '' },
    ]);
    vi.mocked(supabase.getAvailableSlots).mockResolvedValue([
      { slot_time: '10:00:00', slot_end_time: '10:30:00', staff_id: '1', staff_name: 'Dr. Test' },
    ]);
=======
>>>>>>> origin/main
  });

  it('shows temporarily unavailable message after loading', async () => {
    render(<BookingWidget />);
<<<<<<< HEAD

    // Initially shows loading or directly loads if fast
=======
>>>>>>> origin/main
    await waitFor(() => {
      expect(screen.getByText('Online rezervácia je dočasne pozastavená')).toBeDefined();
    }, { timeout: 3000 });
  });

  it('shows phone contact link after loading', async () => {
    render(<BookingWidget />);
<<<<<<< HEAD

    // 1. Select Service
    await waitFor(() => screen.getByText('Test Service'));
    fireEvent.click(screen.getByText('Test Service'));

    // 2. Select Date (mocked date gen might be needed or just checking UI)
    // We expect to see "Vyberte termín"
    await waitFor(() => expect(screen.getByText('Vyberte termín')).toBeDefined());

    // Select a date (first available button in the list)
    const dateButtons = screen.getAllByRole('button');
    // Filter for date buttons (usually short weekday names)
    const firstDate = dateButtons.find((b) => b.className.includes('flex-shrink-0'));
    if (firstDate) fireEvent.click(firstDate);

    // 3. Select Time
    await waitFor(() => expect(screen.getByText('10:00')).toBeDefined());
    fireEvent.click(screen.getByText('10:00'));

    // 4. Input Details
    await waitFor(() => expect(screen.getByText('Vaše údaje')).toBeDefined());

    fireEvent.change(screen.getByPlaceholderText('Ján Novák'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jan@example.sk'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('checkbox')); // GDPR

    fireEvent.click(screen.getByText('Pokračovať'));

    // 5. Confirm
    await waitFor(() => expect(screen.getByText('Potvrďte rezerváciu')).toBeDefined());
    fireEvent.click(screen.getByText('Potvrdiť rezerváciu'));

    // 6. Success
    // Mock the success response
    vi.mocked(supabase.createBooking).mockResolvedValue('booking-123');

    // Check if we are in submitting state or ready to submit
    await waitFor(() => screen.getByRole('button', { name: /Potvrdiť rezerváciu|Spracovávam/ }));

    // Ensure we are clicking "Confirm" not "Processing" (if test is fast enough)
    // If it's already "Processing", then click happened previous step which is wrong logic in test flow
    // The previous click was to "Pokračovať" (which is step 4->5). Now we are at step 5.

    const confirmBtn = screen.getByText('Potvrdiť rezerváciu');
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(screen.getByText('Rezervácia úspešná!')).toBeDefined());
=======
    await waitFor(() => {
      const phoneLink = screen.getByRole('link', { name: /zavolať/i });
      expect((phoneLink as HTMLAnchorElement).href).toContain('tel:');
    }, { timeout: 3000 });
  });

  it('shows email contact link after loading', async () => {
    render(<BookingWidget />);
    await waitFor(() => {
      const emailLink = screen.getByRole('link', { name: /napísať e-mail/i });
      expect((emailLink as HTMLAnchorElement).href).toContain('mailto:');
    }, { timeout: 3000 });
>>>>>>> origin/main
  });
});
