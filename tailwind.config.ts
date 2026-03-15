import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core palette from screenshots
        bg: '#F2F2F2',          // light grey page background
        surface: '#FFFFFF',     // white cards
        ink: '#111111',         // near-black headings
        muted: '#6B7280',       // grey body text
        subtle: '#E5E7EB',      // borders / dividers
        dark: '#0F0F0F',        // dark featured section background
        // Accent colours (AI badges etc.)
        green: '#22C55E',
        'green-light': '#DCFCE7',
        orange: '#F97316',
        'orange-light': '#FFF0E6',
        purple: '#8B5CF6',
        'purple-light': '#F3F0FF',
        blue: '#3B82F6',
        'blue-light': '#EFF6FF',
        teal: '#14B8A6',
      },
      fontFamily: {
        sans: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease both',
        fadeIn: 'fadeIn 0.4s ease both',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.10)',
        float: '0 8px 32px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}
export default config
