/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const color = 'emerald';
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'site-color-one': colors[color][100],
        'site-color-two': colors[color][800],
        'site-color-two-light': colors[color][600],
        'site-color-two-lighter': colors[color][500],
        'site-background': colors.white,
        'primary': colors.black,
        'secondary': colors.green[600],
        'secondary-muted': colors.red[900],
        'skeleton-color': colors.gray[200],
      }
    },
  },
  plugins: [],
}
