/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    screens: {
      'form': '930px',
      ...defaultTheme.screens,
      sm: "560px",
    },
  },
  plugins: [],
}
