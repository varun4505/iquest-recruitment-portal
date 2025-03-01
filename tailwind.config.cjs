/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ffec',
          100: '#ccffcc',
          200: '#99ff99',
          300: '#66ff66',
          400: '#33ff33',
          500: '#00ee00', // Slightly dimmed Matrix green
          600: '#00d000',
          700: '#00a000',
          800: '#008000',
          900: '#006000',
          950: '#004000',
        },
        secondary: {
          50: '#e5f0ff',
          100: '#cce0ff',
          200: '#99c0ff',
          300: '#66a0ff',
          400: '#4080ff',
          500: '#3366cc', // Adjusted terminal blue for better contrast
          600: '#0044cc',
          700: '#0033a3',
          800: '#002280',
          900: '#001166',
          950: '#000a4d',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        terminal: {
          bg: '#0a1a0a',        // Slightly greenish dark background instead of pure black
          text: '#92d992',      // Softer green for main text
          accent: '#3366cc',    // Adjusted blue for accents
          dim: '#5a5a5a',       // Slightly lighter dimmed elements
          highlight: '#00ee00', // Highlight color (kept brighter)
        },
      },
      animation: {
        typing: 'typing 3.5s steps(40, end)',
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-in': 'slideIn 0.5s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 