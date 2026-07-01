/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        darkbg:     '#070b14',
        darkcard:   '#0f1623',
        darksurf:   '#161f2e',
        darkedge:   '#1d2a3e',
      },
      boxShadow: {
        'glass':       '0 8px 32px 0 rgba(31,38,135,0.07)',
        'glass-dark':  '0 8px 32px 0 rgba(0,0,0,0.45)',
        'glow':        '0 0 40px rgba(99,102,241,0.35)',
        'glow-sm':     '0 0 20px rgba(99,102,241,0.2)',
        'amber-glow':  '0 0 30px rgba(245,158,11,0.25)',
        'card-hover':  '0 20px 60px -10px rgba(99,102,241,0.25)',
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(ellipse 80% 80% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 90%, rgba(124,58,237,0.15) 0%, transparent 60%)',
        'gradient-mesh-dark': 'radial-gradient(ellipse 80% 80% at 50% -10%, rgba(79,70,229,0.3) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 90%, rgba(109,40,217,0.2) 0%, transparent 60%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
      },
      animation: {
        'blob':          'blob 8s infinite ease-in-out',
        'fade-in-up':    'fadeInUp 0.5s ease-out forwards',
        'fade-in':       'fadeIn 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'shimmer':       'shimmer 2.5s infinite',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'count-up':      'countUp 0.6s ease-out forwards',
        'border-glow':   'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(40px,-60px) scale(1.1)' },
          '66%':     { transform: 'translate(-30px,20px) scale(0.9)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        borderGlow: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
