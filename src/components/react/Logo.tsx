import React from 'react';

interface LogoProps {
  className?: string;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  subtitle = "BLOG PORTAL"
}) => {
  return (
    <svg
      viewBox="0 0 280 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chiropraxia Košice Logo"
    >
      <defs>
        {/* Gradient pre pozadie ikonky */}
        <linearGradient id="iconBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#262626" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        {/* Jemná žiara za ikonkou */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* --- ICON ČASŤ --- */}
      <g>
        {/* Glow efekt pod ikonkou */}
        <rect x="2" y="2" width="40" height="40" rx="12" fill="#89CFF0" fillOpacity="0.15" filter="url(#glow)" />

        {/* Hlavný tvar boxu */}
        <rect x="0" y="0" width="40" height="40" rx="12" fill="url(#iconBg)" stroke="white" strokeOpacity="0.1" strokeWidth="1" />

        {/* Activity Krivka (Baby Blue) */}
        <path
          d="M10 20H14L17 11L23 29L26 20H30"
          stroke="#89CFF0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* --- TEXT ČASŤ --- */}
      <g transform="translate(52, 0)">
        {/* Hlavný nadpis (Rajdhani/Outfit) */}
        <text y="22" className="font-display font-bold" fontSize="18" fill="#0a0b1e" letterSpacing="0.05em">
          CHIROPRAXIA <tspan fill="#005a9e">KOŠICE</tspan>
        </text>

        {/* Podnadpis (Inter) */}
        <text y="38" className="font-sans text-uppercase" fontSize="9" fill="#000000" letterSpacing="0.2em">
          {subtitle}
        </text>
      </g>
    </svg>
  );
};

