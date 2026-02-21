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

    return (
        <div className="max-w-4xl mx-auto p-4">
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
                        <div className="glass-card p-6 border-white/10">
                            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="text-aurora">1.</span> Vyberte dátum
                            </h3>
                            <label htmlFor="booking-date" className="sr-only">Vyberte dátum rezervácie</label>
                            <input
                                id="booking-date"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                className="input-glass w-full text-lg py-3"
                            />
                        </div>

                        {/* Time Slots grid */}
                        <div className="glass-card p-6 border-white/10">
                            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="text-aurora">2.</span> Vyberte čas
                            </h3>

                            {loading ? (
                                <BookingSkeleton />
                            ) : error ? (
                                <div className="p-8 text-center text-red-400">
                                    <p className="mb-2">⚠️ {error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-white underline text-sm"
                                    >Skúsiť znova</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            disabled={!slot.available}
                                            onClick={() => handleTimeSelect(slot.time)}
                                            className={`
                        py-3 rounded-xl border transition-all text-sm font-medium
                        ${slot.available
                                                    ? 'border-aurora/30 bg-aurora/5 text-white hover:bg-aurora hover:text-black hover:border-aurora active:scale-95'
                                                    : 'border-white/5 bg-white/5 text-chrome-gray opacity-40 cursor-not-allowed'
                                                }
                      `}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {!loading && !error && slots.length === 0 && (
                                <p className="text-center py-8 text-chrome-gray">Na tento deň nie sú dostupné žiadne termíny.</p>
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
