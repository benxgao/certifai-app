/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include if using App Router (Next.js 13+)
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7f3bff',
          dark: '#6930c3',
          light: '#a780ff',
        },
        secondary: {
          DEFAULT: '#3a86ff',
          dark: '#2651b0',
          light: '#72abff',
        },
        accent: {
          DEFAULT: '#22d3ee',
          dark: '#1fa4c5',
          light: '#6decef',
        },
      },
      boxShadow: {
        material: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'material-md': '0 6px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
