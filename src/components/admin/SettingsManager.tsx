import React from 'react';
import type { OpeningHours, SmsConfig } from './types';
import { DAY_ORDER, DAY_NAMES } from './types';

interface SettingsManagerProps {
  openingHours: OpeningHours;
  setOpeningHours: React.Dispatch<React.SetStateAction<OpeningHours>>;
  smsConfig: SmsConfig;
  setSmsConfig: React.Dispatch<React.SetStateAction<SmsConfig>>;
  onSave: () => Promise<void>;
  loading: boolean;
}

export function SettingsManager({
  openingHours,
  setOpeningHours,
  smsConfig,
  setSmsConfig,
  onSave,
  loading,
}: SettingsManagerProps) {
  return (
    <>
      <h2 className="mb-6 text-xl font-bold text-white">⚙️ Nastavenia</h2>

      {/* SMS Settings */}
      <div className="glass-card mb-6 p-6">
        <h3 className="mb-4 text-lg font-bold text-white">📱 SMS Notifikácie</h3>
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
            <div className="relative inline-block h-6 w-12 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={smsConfig.enabled}
                onChange={(e) => setSmsConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="peer absolute h-0 w-0 opacity-0"
              />
              <span
                className={`block h-6 w-12 rounded-full transition-colors duration-200 ${smsConfig.enabled ? 'bg-aurora' : 'bg-gray-600'}`}
              ></span>
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${smsConfig.enabled ? 'translate-x-6' : 'translate-x-0'}`}
              ></span>
            </div>
            <div>
              <span className="block font-medium text-white">Povoliť odosielanie SMS</span>
              <span className="text-chrome-gray text-sm">
                Automaticky poslať SMS zákazníkovi po rezervácii
              </span>
            </div>
          </label>

          <div
            className={`transition-all duration-300 ${smsConfig.enabled ? 'opacity-100' : 'pointer-events-none opacity-50'}`}
          >
            <label className="text-chrome-gray mb-2 block text-sm font-medium">
              Šablóna správy
            </label>
            <textarea
              value={smsConfig.template}
              onChange={(e) => setSmsConfig((prev) => ({ ...prev, template: e.target.value }))}
              rows={3}
              className="input-glass w-full text-base"
              placeholder="Dobrý deň {name}, vaša rezervácia na {date} o {time} bola potvrdená."
            />
            <p className="text-chrome-gray mt-2 text-xs">
              Dostupné premenné: <code className="text-aurora">{'{name}'}</code>,{' '}
              <code className="text-aurora">{'{date}'}</code>,{' '}
              <code className="text-aurora">{'{time}'}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-bold text-white">🕐 Otváracie hodiny</h3>
        <div className="space-y-3">
          {DAY_ORDER.map((day) => {
            const hours = openingHours[day];
            if (!hours) return null;
            return (
              <div
                key={day}
                className="flex flex-col gap-3 rounded-xl bg-white/5 p-3 sm:flex-row sm:items-center"
              >
                <div className="w-24 font-medium text-white">{DAY_NAMES[day]}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={() =>
                      setOpeningHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], closed: !prev[day].closed },
                      }))
                    }
                    className="accent-aurora h-5 w-5 rounded"
                  />
                  <span className="text-chrome-gray text-sm">Otvorené</span>
                </label>
                {!hours.closed && (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="time"
                      aria-label={`Otvárací čas pre ${DAY_NAMES[day]}`}
                      value={hours.open}
                      onChange={(e) =>
                        setOpeningHours((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], open: e.target.value },
                        }))
                      }
                      className="input-glass px-3 py-2 text-sm"
                    />
                    <span className="text-chrome-gray">-</span>
                    <input
                      type="time"
                      aria-label={`Zatvárací čas pre ${DAY_NAMES[day]}`}
                      value={hours.close}
                      onChange={(e) =>
                        setOpeningHours((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], close: e.target.value },
                        }))
                      }
                      className="input-glass px-3 py-2 text-sm"
                    />
                  </div>
                )}
                {hours.closed && <span className="text-sm text-red-400">Zatvorené</span>}
              </div>
            );
          })}
        </div>
        <button onClick={onSave} disabled={loading} className="btn-aurora mt-6">
          {loading ? 'Ukladám...' : 'Uložiť otváracie hodiny'}
        </button>
      </div>
    </>
  );
}
