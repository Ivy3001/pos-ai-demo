export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#211C18',
          900: '#2A2420',
          800: '#3A322C',
        },
        paper: {
          50: '#F5F0E4',
          100: '#EFE8D8',
          200: '#E4DAC2',
        },
        oxblood: {
          700: '#5E1C1E',
          600: '#7A2426',
          500: '#93302F',
        },
        sage: {
          700: '#3D4A2F',
          600: '#4F5F3D',
          500: '#647A4D',
        },
        mustard: {
          600: '#A6690F',
          500: '#C17817',
        },
        steel: {
          400: '#8B9299',
          300: '#AAB0B5',
        },
      },
      fontFamily: {
        display: ['var(--font-slab)'],
        body: ['var(--font-inter)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        'perforate-x': 'repeating-linear-gradient(90deg, transparent, transparent 6px, var(--tw-gradient-stops) 6px, var(--tw-gradient-stops) 8px)',
      },
    },
  },
  plugins: [],
};
