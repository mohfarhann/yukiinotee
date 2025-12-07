/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Rose Pink (feminim)
        'rose': {
          50: '#FFF5F7',
          100: '#FFE5EC',
          200: '#FFB8D1',
          300: '#FF9CB5',
          400: '#FF7FA3',
          500: '#FF6B9D',
          600: '#E85A8C',
        },
        // Secondary - Soft Lavender
        'lavender': {
          50: '#FAF8FE',
          100: '#F3F0FC',
          200: '#E6DDF8',
          300: '#D9CBF3',
          400: '#CCB8EE',
          500: '#BFA5E9',
          600: '#A893D4',
        },
        // Accent - Soft Peach
        'peach': {
          50: '#FFFBF8',
          100: '#FFF4EE',
          200: '#FFE4D1',
          300: '#FFD5B5',
          400: '#FFC599',
          500: '#FFB380',
        },
        // Accent - Mint Green (calming)
        'mint': {
          50: '#F8FFFE',
          100: '#F0FEFC',
          200: '#D9F9F5',
          300: '#B3F1EA',
          400: '#8DE9DF',
          500: '#70DDD1',
        },
        // Neutral - Cream
        'cream': '#FFFBF8',
        'text-soft': '#6B5B7F',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
