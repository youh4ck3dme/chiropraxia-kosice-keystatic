/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Liquid Chrome Color Palette
      colors: {
        // 🌑 VOID (Pozadie) - Tmavo modrá
        'void': {
          DEFAULT: '#0a0a1a',
          light: '#0f0f2a',
        },

        // 💿 CHROME (Text) - Svetlá
        'chrome': {
          DEFAULT: '#E2E8F0',
          white: '#F8FAFC',
          metal: '#94A3B8',
        },

        // 🌌 AURORA (Brand) - Modrá paleta
        'aurora': {
          dim: '#2a4897',
          DEFAULT: '#006fb8',
          glow: '#00a7ed',
        },

        // 🔴 ERROR / STATUS
        'signal': {
          error: '#EF4444',
          success: '#22c55e',
        },

        // Glass utilities
        'glass': {
          subtle: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: 'rgba(255, 255, 255, 0.2)',
        },

        // Legacy mappings for consistency (deprecated but kept for intermediate safety)
        'chrome-white': '#F8FAFC',
        'chrome-silver': '#E2E8F0',
        'chrome-gray': '#94A3B8',
        'aurora-glow': '#00a7ed',
        'aurora-dim': '#2a4897',
      },

      // Glassmorphism backgrounds
      backgroundColor: {
        'glass-dark': 'rgba(255, 255, 255, 0.03)',
        'glass-medium': 'rgba(255, 255, 255, 0.05)',
        'glass-light': 'rgba(255, 255, 255, 0.08)',
      },

      // Backdrop blur values
      backdropBlur: {
        xs: '4px',
        xl: '20px',
        '2xl': '40px',
      },

      // Border radius for cards
      borderRadius: {
        'card': '1.5rem',
        'card-lg': '2rem',
      },

      // Custom shadows for depth
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'aurora': '0 0 60px -15px rgba(0, 111, 184, 0.3)',
        'aurora-strong': '0 0 80px -10px rgba(0, 111, 184, 0.5)',
      },

      transitionTimingFunction: {
        'liquid': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },

      // Animations
      animation: {
        'aurora-slow': 'auroraFloat 20s ease-in-out infinite',
        'aurora-medium': 'auroraFloat 15s ease-in-out infinite reverse',
        'aurora-fast': 'auroraFloat 10s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'tilt-in': 'tiltIn 0.3s ease-out',
        'sheen': 'sheen 3s infinite',
      },

      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
        auroraFloat: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0.5',
          },
          '25%': {
            transform: 'translate(10%, 10%) scale(1.1)',
            opacity: '0.7',
          },
          '50%': {
            transform: 'translate(-5%, 15%) scale(0.9)',
            opacity: '0.4',
          },
          '75%': {
            transform: 'translate(-10%, 5%) scale(1.05)',
            opacity: '0.6',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        tiltIn: {
          '0%': {
            opacity: '0',
            transform: 'perspective(1000px) rotateX(10deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'perspective(1000px) rotateX(0)',
          },
        },
      },

      // Gradient text utilities
      backgroundImage: {
        'chrome-gradient': 'linear-gradient(to right, #F8FAFC, #94A3B8)',
        'aurora-gradient': 'linear-gradient(135deg, #0a0a1a 0%, #0f172a 50%, #1e293b 100%)',
        'chrome-shine': 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)',
        'deep-space': 'radial-gradient(ellipse at center, #0a0a0a 0%, #050505 100%)',
        'liquid-blue': 'radial-gradient(ellipse at center, #2a4897 0%, #0a0a1a 70%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
