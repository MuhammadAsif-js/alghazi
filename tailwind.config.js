/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Used by the font-sans and font-serif Tailwind utilities.
        // Actual font faces are loaded via Google Fonts in src/styles/globals.css.
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          dark:   '#1C1917',
          brown:  '#4A3728',
          warm:   '#8c7462',
          cream:  '#FDFBF7',
          muted:  '#b59f8c',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
