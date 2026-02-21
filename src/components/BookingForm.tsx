import { useState, type FC, type FormEvent } from 'react';
import { motion } from 'framer-motion';

interface BookingFormProps {
    selectedDate: Date | null;
    selectedTime: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const BookingForm: FC<BookingFormProps> = ({ selectedDate, selectedTime, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    date: selectedDate?.toISOString().split('T')[0],
                    time: selectedTime,
                    service_id: 'chiropraxia', // Default service ID
                    website_url: honeypot // Honeypot field
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 3000);
            } else {
                alert(result.error || 'Chyba pri rezervácii');
            }
        } catch (err) {
            alert('Chyba spojenia so serverom');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 text-center border-aurora/30 bg-aurora/5"
            >
                <div className="w-20 h-20 bg-aurora/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-aurora" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-white text-2xl font-bold mb-4">Rezervácia úspešná!</h3>
                <p className="text-chrome-gray">Potvrdenie sme vám odoslali na email.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 w-full max-w-md border-white/10"
        >
            <div className="mb-6">
                <h3 className="text-white text-xl font-bold mb-1">Potvrdiť termín</h3>
                <p className="text-chrome-gray text-sm">
                    {selectedDate?.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' })} o {selectedTime}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-black text-chrome-gray uppercase tracking-widest mb-1.5 ml-1">Vaše meno</label>
                    <input
                        type="text"
                        placeholder="Meno a priezvisko"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-glass w-full"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-chrome-gray uppercase tracking-widest mb-1.5 ml-1">Telefón</label>
                    <input
                        type="tel"
                        placeholder="+421 9xx xxx xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="input-glass w-full"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-chrome-gray uppercase tracking-widest mb-1.5 ml-1">Email</label>
                    <input
                        type="email"
                        placeholder="vas@email.sk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-glass w-full"
                    />
                </div>

                <input
                    type="hidden"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                />

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-glass flex-1 justify-center py-3"
                    >
                        Zrušiť
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-aurora flex-1 justify-center py-3 font-bold"
                    >
                        {loading ? 'Spracúvam...' : 'Rezervovať'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default BookingForm;
