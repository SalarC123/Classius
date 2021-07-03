module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}',
          './src/components/**/*.jsx',
          './src/components/**/*.js',
          './public/index.html',

  ],
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
