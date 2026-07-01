import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BookingWidget } from '../../components/react/BookingWidget';

describe('BookingWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows temporarily unavailable message after loading', async () => {
    render(<BookingWidget />);
    await waitFor(() => {
      expect(screen.getByText('Online rezervácia je dočasne pozastavená')).toBeDefined();
    }, { timeout: 3000 });
  });

  it('shows phone contact link after loading', async () => {
    render(<BookingWidget />);
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
  });
});
