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
        'play-game-color-one': colors.teal[400],
        'play-game-color-two': colors.black,
        'site-background': colors.white,
        'primary': colors.black,
        'secondary': colors.green[600],
        'secondary-muted': colors.red[900]
      }
    },
  },
  plugins: [],
}
