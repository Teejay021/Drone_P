/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/html/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        roboto: ['Roboto', 'sans'],
      }
    },
  },
  darkMode: 'class',
  plugins: [],
  
});

