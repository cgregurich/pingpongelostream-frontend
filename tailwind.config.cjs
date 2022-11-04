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
        'site-color-one': colors.purple[100],
        'site-color-two': colors.purple[800],
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
