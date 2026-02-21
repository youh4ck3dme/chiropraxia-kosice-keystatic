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
  loading
}: SettingsManagerProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-white mb-6">⚙️ Nastavenia</h2>

      {/* SMS Settings */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">📱 SMS Notifikácie</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                checked={smsConfig.enabled}
                onChange={(e) => setSmsConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="peer absolute opacity-0 w-0 h-0"
              />
              <span className={`block w-12 h-6 rounded-full transition-colors duration-200 ${smsConfig.enabled ? 'bg-aurora' : 'bg-gray-600'}`}></span>
              <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${smsConfig.enabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </div>
            <div>
              <span className="font-medium text-white block">Povoliť odosielanie SMS</span>
              <span className="text-sm text-chrome-gray">Automaticky poslať SMS zákazníkovi po rezervácii</span>
            </div>
          </label>

          <div className={`transition-all duration-300 ${smsConfig.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label className="block text-sm font-medium text-chrome-gray mb-2">
              Šablóna správy
            </label>
            <textarea
              value={smsConfig.template}
              onChange={(e) => setSmsConfig(prev => ({ ...prev, template: e.target.value }))}
              rows={3}
              className="input-glass w-full text-base"
              placeholder="Dobrý deň {name}, vaša rezervácia na {date} o {time} bola potvrdená."
            />
            <p className="text-xs text-chrome-gray mt-2">
              Dostupné premenné: <code className="text-aurora">{'{name}'}</code>, <code className="text-aurora">{'{date}'}</code>, <code className="text-aurora">{'{time}'}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">🕐 Otváracie hodiny</h3>
        <div className="space-y-3">
          {DAY_ORDER.map((day) => {
            const hours = openingHours[day];
            if (!hours) return null;
            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className="w-24 font-medium text-white">{DAY_NAMES[day]}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={() => setOpeningHours(prev => ({
                      ...prev,
                      [day]: { ...prev[day], closed: !prev[day].closed }
                    }))}
                    className="w-5 h-5 rounded accent-aurora"
                  />
                  <span className="text-sm text-chrome-gray">Otvorené</span>
                </label>
                {!hours.closed && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      aria-label={`Otvárací čas pre ${DAY_NAMES[day]}`}
                      value={hours.open}
                      onChange={(e) => setOpeningHours(prev => ({
                        ...prev,
                        [day]: { ...prev[day], open: e.target.value }
                      }))}
                      className="input-glass py-2 px-3 text-sm"
                    />
                    <span className="text-chrome-gray">-</span>
                    <input
                      type="time"
                      aria-label={`Zatvárací čas pre ${DAY_NAMES[day]}`}
                      value={hours.close}
                      onChange={(e) => setOpeningHours(prev => ({
                        ...prev,
                        [day]: { ...prev[day], close: e.target.value }
                      }))}
                      className="input-glass py-2 px-3 text-sm"
                    />
                  </div>
                )}
                {hours.closed && (
                  <span className="text-red-400 text-sm">Zatvorené</span>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={onSave}
          disabled={loading}
          className="btn-aurora mt-6"
        >
          {loading ? 'Ukladám...' : 'Uložiť otváracie hodiny'}
        </button>
      </div>
    </>
  );
}


