export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#1E1E1E',
          900: '#242424',
          800: '#2E2E2E',
          700: '#3A3A3A',
          600: '#484848',
        },
        cream: {
          50: '#FFFCF8',
          100: '#FDF9F3',
          200: '#E9E5DF',
        },
        mint: {
          600: '#3FB894',
          500: '#5AD3B0',
          400: '#7ADFC4',
        },
        leaf: {
          600: '#3FA84A',
          500: '#4CC759',
        },
        coral: {
          600: '#E24B4B',
          500: '#F16565',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
