/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core dark palette
        'navy': {
          900: '#0a0e1a',
          800: '#0f1225',
          700: '#131737',
          600: '#1a1f45',
          500: '#232952',
        },
        // Violet accents
        'violet-accent': {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dark: '#6d28d9',
          glow: 'rgba(124, 58, 237, 0.15)',
        },
        // Surface colors
        'glass': {
          DEFAULT: 'rgba(17, 20, 40, 0.6)',
          light: 'rgba(255, 255, 255, 0.04)',
          hover: 'rgba(255, 255, 255, 0.07)',
          border: 'rgba(255, 255, 255, 0.06)',
        },
        // Legacy compat
        background: '#0f1225',
        surface: 'rgba(17, 20, 40, 0.7)',
        border: 'rgba(255, 255, 255, 0.06)',
        accent: '#7c3aed',
        'accent-hover': '#6d28d9',
        'accent-light': 'rgba(124, 58, 237, 0.15)',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
        'card': '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
        'elevated': '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        'float': '0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
        'modal': '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.1)',
        'glow-sm': '0 0 15px rgba(124, 58, 237, 0.15)',
        'glow': '0 0 30px rgba(124, 58, 237, 0.2)',
        'glow-lg': '0 0 50px rgba(124, 58, 237, 0.25)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'orbit': 'orbitSlow 30s linear infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)' },
        },
        orbitSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
