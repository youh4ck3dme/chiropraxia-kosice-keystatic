import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from './BookingForm';
import { BookingSkeleton } from './react/Skeleton';

/**
 * Simplified Booking Flow
 * Select Date -> Select Time -> Fill Form
 */
export function NewBookingFlow() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Fetch availability when date changes
  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true);
      setError(null);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const res = await fetch(`/api/get-availability?date=${dateStr}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setSlots([]);
        } else if (data.slots) {
          setSlots(data.slots);
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        setError('Nepodarilo sa načítať dostupnosť. Skontrolujte pripojenie.');
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [selectedDate]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const isSuspended = Boolean(error && error.includes('dočasne nedostupné'));

  if (isSuspended) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="glass-card border-white/10 p-8 text-center">
          <p className="text-chrome mb-4 text-lg">
            Online rezervácia je dočasne pozastavená. Kontaktujte nás telefónom alebo e-mailom.
          </p>
          <p className="text-chrome-gray text-sm">
            <a href="/#kontakt" className="text-aurora hover:underline">
              Kontakt
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Date Picker (Simple Input for now) */}
            <div className="glass-card border-white/10 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="text-aurora">1.</span> Vyberte dátum
              </h3>
              <label htmlFor="booking-date" className="sr-only">
                Vyberte dátum rezervácie
              </label>
              <input
                id="booking-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="input-glass w-full py-3 text-lg"
              />
            </div>

            {/* Time Slots grid */}
            <div className="glass-card border-white/10 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="text-aurora">2.</span> Vyberte čas
              </h3>

              {loading ? (
                <BookingSkeleton />
              ) : error ? (
                <div className="p-8 text-center text-red-400">
                  <p className="mb-2">⚠️ {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-white underline"
                  >
                    Skúsiť znova
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`rounded-xl border py-3 text-sm font-medium transition-all ${
                        slot.available
                          ? 'border-aurora/30 bg-aurora/5 hover:bg-aurora hover:border-aurora text-white hover:text-black active:scale-95'
                          : 'text-chrome-gray cursor-not-allowed border-white/5 bg-white/5 opacity-40'
                      } `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}

              {!loading && !error && slots.length === 0 && (
                <p className="text-chrome-gray py-8 text-center">
                  Na tento deň nie sú dostupné žiadne termíny.
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <div key="form" className="flex justify-center">
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime!}
              onCancel={() => setShowForm(false)}
              onSuccess={() => {
                alert('Rezervácia bola úspešne odoslaná!');
                window.location.reload();
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
