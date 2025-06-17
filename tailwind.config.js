/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include if using App Router (Next.js 13+)
    './src/**/*.{js,ts,jsx,tsx}', // Include src folder
  ],
  safelist: [
    // Ensure our custom color classes are always included
    {
      pattern: /(success|warning|error|info|secondary)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark', 'hover', 'focus'],
    },
    {
      pattern:
        /(bg|text|border)-(success|warning|error|info|secondary)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark', 'hover', 'focus'],
    },
    // Include opacity variants for dark mode
    {
      pattern: /(bg|border)-(success|warning|error|info|secondary)-900\/\d+/,
      variants: ['dark'],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // violet-500 as default
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#6d28d9',
          light: '#a78bfa',
        },
        secondary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca', // indigo-700 as default
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#4338ca', // indigo-700
          dark: '#312e81', // indigo-900
          light: '#6366f1', // indigo-500
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          DEFAULT: '#22d3ee', // cyan-400
          dark: '#0e7490', // cyan-700
          light: '#67e8f9', // cyan-300
        },
        // Additional accent colors for variety
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e', // green-500
          dark: '#15803d', // green-700
          light: '#4ade80', // green-400
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b', // amber-500
          dark: '#b45309', // amber-700
          light: '#fbbf24', // amber-400
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444', // red-500
          dark: '#b91c1c', // red-700
          light: '#f87171', // red-400
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1d4ed8', // blue-700
          light: '#60a5fa', // blue-400
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
