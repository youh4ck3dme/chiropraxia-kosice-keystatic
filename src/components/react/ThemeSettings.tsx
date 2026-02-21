import React from 'react';
import { useStore } from '@nanostores/react';
import { $theme, toggleTheme } from '../../lib/stores';

/**
 * Theme Settings Component
 * Toggles between "Deep Space" (black) and "Liquid Teal" (gradient) themes
 */
export function ThemeSettings(): React.ReactElement {
  const theme = useStore($theme);

  const handleToggle = () => {
    toggleTheme();
    // Update body class for global theme
    document.body.classList.remove('bg-deep-space', 'bg-liquid-teal');
    document.body.classList.add(
      theme === 'deep-space' ? 'bg-liquid-teal' : 'bg-deep-space'
    );
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-chrome-gray">Téma:</span>
      <button
        onClick={handleToggle}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-aurora/50 ${
          theme === 'liquid-teal' ? 'bg-linear-to-br from-teal-500 to-sky-500' : 'bg-white/10'
        }`}
        aria-label={`Prepnúť na ${theme === 'deep-space' ? 'Liquid Teal' : 'Deep Space'} tému`}
      >
        {/* Toggle knob */}
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-chrome-white shadow-lg transition-transform duration-300 ${
            theme === 'liquid-teal' ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-sm text-chrome-white font-medium">
        {theme === 'deep-space' ? 'Deep Space' : 'Liquid Teal'}
      </span>
    </div>
  );
}

export default ThemeSettings;


