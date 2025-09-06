/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        colorArtistBack:"#F5F5F5",
        colorBack:"#cfd0d1",
        colorBack2:"#e3e3e3",
        colorBack2Hover:"#dedede",
      },
      screens: {
        'xs': '512px',
        'sm': '736px',
        'md': '868px',
        'lg': '1152px',
        'xl': '1480px',
        '2xl': '1715px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}