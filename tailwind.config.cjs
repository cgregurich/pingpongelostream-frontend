/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'skeleton-color': colors.gray[200],
        'site-color-one': colors.purple[100],
        'site-color-two': colors.purple[800],
      }
    },
  },
  plugins: [],
}
