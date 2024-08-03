/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './layouts/**/*.{js,ts,jsx,tsx}', 
      './styles/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {},
    },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.responsive-text': {
            '@apply text-xs lg:text-tiny xl:text-base 2xl:text-lg': {},
          },
          '.responsive-text-lg': {
            '@apply text-xs lg:text-base xl:text-lg 2xl:text-xl': {},
          }
          // Add more custom utilities here
        });
      },
      // Include other plugins if needed
    ],
  };
  