import { useState, useMemo } from 'react';
import type { Booking } from './types';

interface ClientsManagerProps {
  bookings: Booking[];
}

export function ClientsManager({ bookings }: ClientsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group bookings by client email
  const clients = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string;
        bookingsCount: number;
        lastBooking: string;
        totalSpent: number; // Placeholder if we had price in booking
      }
    >();

    bookings.forEach((booking) => {
      // Normalize email
      const email = booking.client_email.toLowerCase().trim();

      if (!map.has(email)) {
        map.set(email, {
          name: booking.client_name,
          email: email,
          phone: booking.client_phone || '-',
          bookingsCount: 0,
          lastBooking: booking.booking_date,
          totalSpent: 0,
        });
      }

      const client = map.get(email)!;
      client.bookingsCount++;
      // simplistic date comparison
      if (booking.booking_date > client.lastBooking) {
        client.lastBooking = booking.booking_date;
        client.name = booking.client_name; // Update name to latest
        client.phone = booking.client_phone || client.phone;
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );
  }, [clients, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Databáza klientov</h2>
        <div className="text-chrome-gray text-sm">
          Celkom: <span className="font-bold text-white">{clients.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Hľadať podľa mena, emailu alebo telefónu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-glass-dark border-glass-subtle focus:ring-aurora w-full rounded-xl border px-4 py-3 pl-10 text-white transition-all outline-none focus:border-transparent focus:ring-2"
        />
        <svg
          className="absolute top-3.5 left-3 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-glass-subtle text-chrome-gray border-b bg-white/5 text-xs tracking-wider uppercase">
                <th className="px-6 py-4 font-semibold">Meno klienta</th>
                <th className="px-6 py-4 font-semibold">Kontakt</th>
                <th className="px-6 py-4 text-center font-semibold">Počet návštev</th>
                <th className="px-6 py-4 text-right font-semibold">Posledná návšteva</th>
              </tr>
            </thead>
            <tbody className="divide-glass-subtle divide-y">
              {filteredClients.map((client) => (
                <tr key={client.email} className="group transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="group-hover:text-aurora font-medium text-white transition-colors">
                      {client.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`mailto:${client.email}`}
                        className="text-chrome-gray flex items-center gap-2 text-sm transition-colors hover:text-white"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {client.email}
                      </a>
                      {client.phone && client.phone !== '-' && (
                        <a
                          href={`tel:${client.phone}`}
                          className="text-chrome-gray flex items-center gap-2 text-sm transition-colors hover:text-white"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {client.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-glass-medium inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-bold text-white">
                      {client.bookingsCount}
                    </span>
                  </td>
                  <td className="text-chrome-gray px-6 py-4 text-right text-sm">
                    {new Date(client.lastBooking).toLocaleDateString('sk-SK')}
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-chrome-gray px-6 py-12 text-center">
                    Nenašli sa žiadni klienti zodpovedajúci vyhľadávaniu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
