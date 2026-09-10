/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // ── CORE PALETTE ──────────────────────────────────────────────
          // Deep indigo-navy: feels premium, editorial, like a luxury magazine
          primary: '#0D2137',

          // Rich ocean jade: less "teal AI", more "Andaman Sea at dusk"
          secondary: '#1A5C52',

          // Coral sunrise accent: distinct, warm, human, not generic "mint"
          accent: '#E8704A',

          // Soft aged ivory — warmer, more tactile than clinical off-white
          bg: '#FAF7F2',

          // Deep honey-amber: richer than flat gold, feels hand-painted
          gold: '#C8820A',

          // Warm driftwood sand — earthy, tropical, not pastel
          sand: '#EDE0CB',

          // Sunrise coral: button CTAs, highlights
          coral: '#D45F3C',

          // Mist jade: subtle section fills
          jade: '#D5E8E4',

          // Typography
          text: '#1A1A2E',
          muted: '#5C6E7A',
          card: '#FFFFFF',
          sandLight: '#F7F1E8',

          // Legacy aliases for compatibility
          accentHover: '#D45F3C',
          goldDark: '#A66B08',
        },
        primary: {
          50:  '#f0f7f5',
          100: '#d4eae5',
          200: '#aad3cb',
          300: '#74b4a8',
          400: '#479286',
          500: '#2f746a',
          600: '#1A5C52',
          700: '#174d44',
          800: '#0D2137',
          900: '#091829',
          950: '#050d17',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Sarabun', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'marine-sm': '0 2px 8px -1px rgba(13, 33, 55, 0.08)',
        'marine':    '0 10px 30px -10px rgba(13, 33, 55, 0.14)',
        'marine-lg': '0 20px 50px -12px rgba(26, 92, 82, 0.20)',
        'coral-glow':'0 0 28px rgba(232, 112, 74, 0.30)',
        'gold-glow': '0 0 24px rgba(200, 130, 10, 0.28)',
        'card': '0 4px 22px -2px rgba(13, 33, 55, 0.07), 0 2px 6px -1px rgba(13, 33, 55, 0.04)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-7px)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float:   'float 4s ease-in-out infinite',
        fadeIn:  'fadeIn 0.4s ease-out both',
        shimmer: 'shimmer 2.5s infinite linear',
      },
    },
  },
  plugins: [],
}
