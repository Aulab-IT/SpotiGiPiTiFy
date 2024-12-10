/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
     "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1ED760',
        'spotify-black': '#181818',
        'spotify-grey': '#282828',
        'spotify-white': '#FFFFFF',
        'spotify-light-grey': '#B3B3B3',
        'spotify-dark-grey': '#333333',
        'spotify-background': '#121212',
        'aulab-yellow': '#FFED00',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}