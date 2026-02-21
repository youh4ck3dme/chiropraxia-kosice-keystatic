import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { sk } from 'date-fns/locale';
import type { Booking } from './types';

// Localization setup for Slovak
const locales = { 'sk': sk };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface BookingCalendarProps {
  bookings: Booking[];
  onSelectEvent?: (booking: Booking) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
}

const statusColors: Record<string, string> = {
  pending: '#f59e0b',    // amber
  confirmed: '#10b981',  // emerald
  cancelled: '#ef4444',  // red
};

export function BookingCalendar({ bookings, onSelectEvent }: BookingCalendarProps) {
  const events = useMemo<CalendarEvent[]>(() => {
    return bookings.map((booking) => {
      const [hours, minutes] = (booking.start_time || '09:00').split(':').map(Number);
      const start = new Date(booking.booking_date);
      start.setHours(hours, minutes, 0, 0);
      
      // Default duration: 1 hour
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      
      return {
        id: booking.id,
        title: `${booking.client_name} - ${booking.services?.name || 'Služba'}`,
        start,
        end,
        resource: booking,
      };
    });
  }, [bookings]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    return {
      style: {
        backgroundColor: statusColors[status] || '#6b7280',
        borderRadius: '8px',
        opacity: status === 'cancelled' ? 0.5 : 1,
        color: 'white',
        border: '0',
        fontSize: '12px',
        padding: '2px 6px',
      },
    };
  };

  return (
    <div className="glass-card p-4 overflow-hidden">
      <style>{`
        .rbc-calendar {
          background: transparent;
          font-family: inherit;
        }
        .rbc-toolbar {
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .rbc-toolbar button {
          color: #d1d5db;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 14px;
        }
        .rbc-toolbar button:hover {
          background: rgba(20, 184, 166, 0.2);
          color: #14b8a6;
        }
        .rbc-toolbar button.rbc-active {
          background: #14b8a6;
          color: black;
          font-weight: bold;
        }
        .rbc-header {
          color: #ffffff;
          font-weight: 600;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .rbc-month-view, .rbc-time-view {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
        }
        .rbc-day-bg {
          background: transparent;
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid rgba(255,255,255,0.05);
        }
        .rbc-off-range-bg {
          background: rgba(0,0,0,0.2);
        }
        .rbc-today {
          background: rgba(20, 184, 166, 0.1) !important;
        }
        .rbc-date-cell {
          color: #d1d5db;
          padding: 0.5rem;
        }
        .rbc-date-cell.rbc-now {
          color: #14b8a6;
          font-weight: bold;
        }
        .rbc-event {
          cursor: pointer;
        }
        .rbc-event:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
        .rbc-time-slot {
          color: #9ca3af;
          font-size: 11px;
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .rbc-time-content {
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .rbc-time-header-content {
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .rbc-agenda-view table {
          color: #d1d5db;
        }
        .rbc-agenda-date-cell, .rbc-agenda-time-cell {
          padding: 0.75rem;
          border: none;
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectEvent?.(event.resource)}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.WEEK}
        messages={{
          today: 'Dnes',
          previous: '←',
          next: '→',
          month: 'Mesiac',
          week: 'Týždeň',
          day: 'Deň',
          agenda: 'Agenda',
          noEventsInRange: 'Žiadne rezervácie v tomto období.',
        }}
        culture="sk"
      />
    </div>
  );
}


