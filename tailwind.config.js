module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      safelist: ['-my-fullscreen', '-my-0']
    }
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        "fullscreen": "100vh"
      },
      width: {
        '192': '48rem'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
