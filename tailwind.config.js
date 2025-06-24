/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in src
  ],
  theme: {
    extend: {
      colors: {
        'meditrack-blue': '#3B82F6',
        'meditrack-green': '#10B981',
        'meditrack-gray': '#4B5563',
      },
      fontFamily: {
        'geist-sans': ['"Geist Sans"', 'sans-serif'],
        'geist-mono': ['"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};