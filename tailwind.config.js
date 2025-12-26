/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class', // Enable dark mode by adding a 'dark' class
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Add a `light:` variant that applies when an ancestor has the `light` class
    plugin(function ({ addVariant }) {
      addVariant('light', '.light &');
    }),
  ],
};

