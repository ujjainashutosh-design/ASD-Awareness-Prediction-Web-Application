/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          purple: '#7C3AED',
          violet: '#4F46E5',
          gold: '#F59E0B',
          pink: '#EC4899',
        },
        dark: {
          900: '#0B0B14',
          800: '#0F0F1E',
          700: '#12121F',
          600: '#1A1A2E',
          500: '#242436',
        },
      },
      backgroundImage: {
        'spectrum': 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)',
        'hero-grad': 'radial-gradient(ellipse at 50% 0%, #1a0a3a 0%, #0B0B14 60%)',
        'card-grad': 'linear-gradient(145deg, rgba(124,58,237,0.1), rgba(79,70,229,0.05))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' }},
        gradient: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }},
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' }},
      },
    },
  },
  plugins: [],
}
