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
        },
        light: {
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121'
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
      'dark',
      'hover'
    ],
    borderColor: [
      'dark',
      'hover'
    ],
    textColor: [
      'dark',
      'hover',
      'focus'
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
