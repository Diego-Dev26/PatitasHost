/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        main: {
          100: "#9bdbff",
          200: "#8eceff",
          300: "#81c2ff",
          400: "#73b6ff",
          500: "#65a9ff",
          600: "#569eff",
          700: "#4492ff",
          800: "#2e86ff",
          900: "#007bff",
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  corePlugins : { 
    aspectRatio : false , 
  } , 
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}