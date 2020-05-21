module.exports = {
  theme: {
    fontFamily: {
      body: [
        'Inter',
        'system-ui',
        '-apple-system',
        'sans-serif'
      ]
    },
    extend: {
      colors: {
        dark: {
          100: '#eaebeb',
          200: '#d5d7d8',
          300: '#b7bbbd',
          400: '#92979b',
          500: '#2B3137',
          600: '#24292E',
          700: '#1A1D21',
          800: '#131619',
          900: '#0D0F11'
        }
      },
      borderWidth: {
        1: '1px'
      }
    },
    darkSelector: '.dark-mode'
  },
  variants: {
    backgroundColor: [
      'dark'
    ],
    borderColor: [
      'dark'
    ],
    textColor: [
      'dark'
    ],
    margin: [
      'first',
      'responsive'
    ]
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ]
}
