import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette from brand guidelines ──────────────────
        // Primary gradient stops
        teal:   '#20D3B3',   // innovation
        blue:   '#3B82F6',   // trust / data
        violet: '#7C5CFF',   // AI / intelligence (close to #7C5CFF ≈ #8B5CF6)

        // Neutral palette
        ink:    '#0F172A',   // dark text / body text
        ink2:   '#334155',   // secondary UI text
        border: '#E5E7EB',   // UI lines
        bg:     '#FFFFFF',   // light UI background
        surface:'#F8FAFC',   // slightly off-white surfaces
        dark:   '#0B0F1A',   // dark mode background

        // Legacy aliases kept for existing components
        muted:  '#334155',
        subtle: '#E5E7EB',
        green:  '#20D3B3',   // remap green → brand teal
        'green-light': '#E0FAF6',
        orange: '#F97316',
        'orange-light': '#FFF0E6',
        purple: '#8B5CF6',
        'purple-light': '#F0EEFF',
        'blue-light':   '#EFF6FF',
        teal2:  '#20D3B3',
      },
      fontFamily: {
        sans:    ['"Inter"', '"Poppins"', '-apple-system', '"Segoe UI"', '"Roboto"', 'sans-serif'],
        display: ['"Inter"', '"Poppins"', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #20D3B3 0%, #3B82F6 50%, #8B5CF6 100%)',
        'brand-gradient-h': 'linear-gradient(90deg, #20D3B3 0%, #3B82F6 50%, #8B5CF6 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease both',
        fadeIn: 'fadeIn 0.4s ease both',
      },
      boxShadow: {
        card:         '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.10)',
        float:        '0 8px 32px rgba(0,0,0,0.18)',
        glow:         '0 0 24px rgba(32,211,179,0.25)',
      },
    },
  },
  plugins: [],
}
export default config
