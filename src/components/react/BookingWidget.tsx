import React, { useState, useEffect, useRef } from 'react';
import {
  getServices,
  getAvailableSlots,
  type Service,
  type AvailableSlot,
} from '../../lib/supabase';
import { ServiceCard } from './ServiceCard';
import { BookingSkeleton } from './Skeleton';
import { ErrorBoundary } from './ErrorBoundary';

type BookingStep = 'service' | 'datetime' | 'details' | 'confirm' | 'success';

/**
 * Booking Widget Component
 * Full booking flow with glassmorphism design and 3D tilt effects.
 * Handles service selection, date picking, and booking submission via secure API.
 */
export function BookingWidget(): React.ReactElement {
  return (
    <ErrorBoundary componentName="BookingWidget">
      <BookingWidgetContent />
    </ErrorBoundary>
  );
}

function BookingWidgetContent(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [step, setStep] = useState<BookingStep>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  // Form state
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookingFormData');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved form data', e);
        }
      }
    }
    return {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      notes: '',
      gdprConsent: false,
      honeypot: '', // Anti-spam
    };
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    async function loadData() {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (_err) {
        setError('Nepodarilo sa načítať služby');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    const handleOpenBooking = () => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        containerRef.current.classList.add(
          'ring-2',
          'ring-aurora',
          'ring-offset-2',
          'ring-offset-void'
        );
        setTimeout(
          () =>
            containerRef.current?.classList.remove(
              'ring-2',
              'ring-aurora',
              'ring-offset-2',
              'ring-offset-void'
            ),
          2000
        );
      }
    };

    window.addEventListener('open-booking-modal', handleOpenBooking);
    return () => window.removeEventListener('open-booking-modal', handleOpenBooking);
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedService) return;

    async function loadSlots() {
      setIsLoading(true);
      try {
        const slotsData = await getAvailableSlots(selectedDate, selectedService!.id);
        setSlots(slotsData);
      } catch (_err) {
        setError('Nepodarilo sa načítať voľné termíny');
      } finally {
        setIsLoading(false);
      }
    }
    loadSlots();
  }, [selectedDate, selectedService]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedSlot) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          service_id: selectedService.id,
          date: selectedDate,
          time: selectedSlot.slot_time.slice(0, 5),
          notes: formData.notes,
          website_url: formData.honeypot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Rezervácia zlyhala');
      }

      setStep('success');
    } catch (_err) {
      setError(err instanceof Error ? err.message : 'Rezervácia zlyhala');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sk-SK', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  const renderStep = () => {
    switch (step) {
      case 'service':
        if (services.length === 0 && !isLoading) {
          return (
            <div className="py-8 text-center">
              <p className="text-chrome mb-2">Online rezervácia je dočasne pozastavená.</p>
              <p className="text-chrome-gray text-sm">Kontaktujte nás telefónom alebo e-mailom.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h2 className="text-chrome-white mb-2 text-2xl font-bold">Vyberte službu</h2>
              <p className="text-chrome-gray">Aké ošetrenie potrebujete?</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  description={service.description}
                  duration={service.duration_min}
                  price={service.price}
                  isSelected={selectedService?.id === service.id}
                  onSelect={() => {
                    setSelectedService(service);
                    setStep('datetime');
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep('service')}
              className="text-chrome-gray hover:text-chrome-white flex items-center gap-2 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Späť
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-chrome-white mb-2 text-2xl font-bold">Vyberte termín</h2>
              <p className="text-chrome-gray">{selectedService?.name}</p>
            </div>

            <div className="mb-6">
              <label className="text-chrome-gray mb-3 block text-sm font-medium">Dátum</label>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                {getAvailableDates().map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`shrink-0 rounded-xl border px-4 py-3 transition-all duration-300 ${
                      selectedDate === date
                        ? 'bg-aurora-dim scale-105 text-white shadow-lg'
                        : 'bg-glass-medium border-glass-subtle text-chrome-gray hover:border-glass-strong'
                    } `}
                  >
                    <span className="text-sm font-medium">{formatDate(date)}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <label className="text-chrome-gray mb-3 block text-sm font-medium">Čas</label>
                {isLoading ? (
                  <BookingSkeleton />
                ) : slots.length === 0 ? (
                  <p className="text-chrome-gray py-8 text-center">
                    Žiadne voľné termíny pre tento deň
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setStep('details');
                          containerRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                        }}
                        className={`rounded-lg border px-3 py-2 transition-all duration-300 ${
                          selectedSlot === slot
                            ? 'bg-aurora-dim scale-105 text-white shadow-lg'
                            : 'bg-glass-medium border-glass-subtle text-chrome-gray hover:border-glass-strong'
                        } `}
                      >
                        <span className="text-sm font-medium">{formatTime(slot.slot_time)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep('datetime')}
              className="text-chrome-gray hover:text-chrome-white flex items-center gap-2 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Späť
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-chrome-white mb-2 text-2xl font-bold">Vaše údaje</h2>
              <p className="text-chrome-gray">
                {formatDate(selectedDate)} o {formatTime(selectedSlot?.slot_time || '')}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('confirm');
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-chrome-gray mb-2 block text-sm font-medium">
                  Meno a priezvisko *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="input-glass"
                  placeholder="Ján Novák"
                />
              </div>

              <div>
                <label className="text-chrome-gray mb-2 block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="input-glass"
                  placeholder="jan@example.sk"
                />
              </div>

              <div>
                <label className="text-chrome-gray mb-2 block text-sm font-medium">Telefón</label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="input-glass"
                  placeholder="+421 905 307 198"
                />
              </div>

              <div>
                <label className="text-chrome-gray mb-2 block text-sm font-medium">Poznámka</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-glass min-h-25 resize-none"
                  placeholder="Popíšte váš problém alebo špeciálne požiadavky..."
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="gdpr"
                  required
                  checked={formData.gdprConsent}
                  onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
                  className="border-glass-subtle bg-glass-dark text-aurora focus:ring-aurora/50 mt-1 h-4 w-4 rounded"
                />
                <label htmlFor="gdpr" className="text-chrome-gray text-sm leading-tight">
                  Súhlasím so spracovaním osobných údajov pre účely rezervácie termínu.
                  <a
                    href="/ochrana-udajov"
                    target="_blank"
                    className="text-aurora ml-1 hover:underline"
                  >
                    Viac info
                  </a>
                </label>
              </div>

              <input
                type="hidden"
                name="website_url"
                value={formData.honeypot || ''}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                autoComplete="off"
              />

              <button type="submit" className="btn-aurora mt-6 w-full">
                <span>Pokračovať</span>
              </button>
            </form>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <button
              onClick={() => setStep('details')}
              className="text-chrome-gray hover:text-chrome-white flex items-center gap-2 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Späť
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-chrome-white mb-2 text-2xl font-bold">Potvrďte rezerváciu</h2>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="flex justify-between">
                <span className="text-chrome-gray">Služba</span>
                <span className="text-chrome-white font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chrome-gray">Dátum</span>
                <span className="text-chrome-white font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chrome-gray">Čas</span>
                <span className="text-chrome-white font-medium">
                  {formatTime(selectedSlot?.slot_time || '')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-chrome-gray">Terapeut</span>
                <span className="text-chrome-white font-medium">{selectedSlot?.staff_name}</span>
              </div>
              <div className="border-glass-subtle flex justify-between border-t pt-4">
                <span className="text-chrome-gray">Cena</span>
                <span className="text-chrome text-2xl font-bold">
                  {selectedService?.price.toFixed(0)}€
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-aurora w-full">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Spracovávam...
                </span>
              ) : (
                <span>Potvrdiť rezerváciu</span>
              )}
            </button>
          </div>
        );

      case 'success':
        return (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/50">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#006fb8"
                strokeWidth="2"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h2 className="text-chrome-white mb-2 text-2xl font-bold">Rezervácia úspešná!</h2>
            <p className="text-chrome-gray mb-6">
              Potvrdenie sme vám zaslali na email
              <br />
              <span className="text-chrome-white">{formData.clientEmail}</span>
            </p>
            <button
              onClick={() => {
                setStep('service');
                setSelectedService(null);
                setSelectedDate('');
                setSelectedSlot(null);
                setFormData({
                  clientName: '',
                  clientEmail: '',
                  clientPhone: '',
                  notes: '',
                  gdprConsent: false,
                  honeypot: '',
                });
              }}
              className="btn-glass"
            >
              Nová rezervácia
            </button>
          </div>
        );
    }
  };

  if (isLoading && step === 'service') {
    return (
      <div className="glass-card p-6 md:p-8">
        <BookingSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="glass-card p-6 transition-transform duration-200 ease-out md:p-8"
    >
      <div className="mb-8 flex justify-center gap-2">
        {(['service', 'datetime', 'details', 'confirm'] as BookingStep[]).map((s) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-300 ${step === s ? 'bg-aurora w-8' : 'bg-glass-medium w-2'} `}
          />
        ))}
      </div>

      <div key={step} className="animate-fade-in">
        {renderStep()}
      </div>
    </div>
  );
}
