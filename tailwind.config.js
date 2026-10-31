/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1E3E62',
          900: '#0F2744',
          950: '#0A192F',
        },
        aicte: {
          navy: '#0E2A47',
          darkNavy: '#08192D',
          teal: '#0D9488',
          lightTeal: '#14B8A6',
          cyan: '#06B6D4',
          accent: '#EA580C', // Saffron touch for Indian government portal aesthetic
          gold: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
