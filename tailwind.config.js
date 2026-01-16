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
          ink: '#1f1a17',
          night: '#0f1115',
          forest: '#0f3d3e',
          forestLight: '#1f5246',
          gold: '#c9a46b',
          goldSoft: '#e5d2b2',
          sand: '#f2e6d6',
          ivory: '#fdf9f2',
          mist: '#f7f1e8',
          clay: '#b26a4c',
        },
        luxury: {
          ink: '#1f1a17',
          night: '#0f1115',
          gold: '#c9a46b',
          sand: '#f2e6d6',
          ivory: '#fdf9f2',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 1s ease-out',
        'slide-down': 'slideDown 1s ease-out',
        'slide-left': 'slideLeft 1s ease-out',
        'slide-right': 'slideRight 1s ease-out',
        'scale-up': 'scaleUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'rotate-gradient': 'rotate-gradient 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #0f3d3e 0%, #1f5246 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f2e6d6 0%, #c9a46b 100%)',
        'rose-gradient': 'linear-gradient(135deg, #caa58a 0%, #b26a4c 100%)',
      },
    },
  },
  plugins: [],
}
