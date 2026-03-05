/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#adb5bd',
          400: '#6c757d',
          500: '#495057',
          600: '#343a40',
          700: '#212529',
          800: '#1a1d21',
          850: '#14171a',
          900: '#0d0f12',
          950: '#08090a',
        },
        accent: {
          green: '#10b981',
          greenDark: '#059669',
          greenLight: '#34d399',
          violet: '#8b5cf6',
          indigo: '#6366f1',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.06)',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        'mesh-gradient':
          'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.1) 0, transparent 50%)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
