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
        'blue-hs': {
          100: '#E6FEFD',
          200: '#BFFEFB',
          300: '#99FDF9',
          400: '#4DFBF4',
          500: '#00F9EF',
          600: '#00E0D7',
          700: '#00958F',
          800: '#00706C',
          900: '#004B48'
        },
        'red-hs': {
          100: '#FFE6ED',
          200: '#FFBFD3',
          300: '#FF99B8',
          400: '#FF4D83',
          500: '#FF004E',
          600: '#E60046',
          700: '#99002F',
          800: '#730023',
          900: '#4D0017'
        },
        'blue': {
          100: '#EAFAFA',
          200: '#CAF3F1',
          300: '#AAEBE9',
          400: '#6ADDD9',
          500: '#2ACEC8',
          600: '#26B9B4',
          700: '#197C78',
          800: '#135D5A',
          900: '#0D3E3C'
        },
        'red': {
          100: '#FBEAEF',
          200: '#F4CAD7',
          300: '#EDAABF',
          400: '#E06B8E',
          500: '#D32B5E',
          600: '#BE2755',
          700: '#7F1A38',
          800: '#5F132A',
          900: '#3F0D1C'
        },
        'dark': {
          100: '#282C34',
          200: '#23272E',
          300: '#1E2127',
          400: '#191C21',
          500: '#14161A',
          600: '#0F1114',
          700: '#0A0B0D',
          800: '#050607',
          900: '#000000'
        },

        // Polar Night
        "polar-night-0": "#2e3440",
        "polar-night-1": "#3b4252",
        "polar-night-2": "#434c5e",
        "polar-night-3": "#4c566a",

        // Snow Storm
        "snow-storm-0": "#d8dee9",
        "snow-storm-1": "#e5e9f0",
        "snow-storm-2": "#eceff4",

        // Frost
        "frost-0": "#8fbcbb",
        "frost-1": "#88c0d0",
        "frost-2": "#81a1c1",
        "frost-3": "#5e81ac",

        // Aurora
        "aurora-0": "#bf616a",
        "aurora-1": "#d08770",
        "aurora-2": "#ebcb8b",
        "aurora-3": "#a3be8c",
        "aurora-4": "#b48ead",

        // Base
        "base-dark": "#242933",
        "base-light": "#f2f4f8",

        // Grey
        "grey-dark": "#abb9cf",
        "grey-light": "#7b88a1"
      },
      borderWidth: {
        1: '1px',
        3: '3px'
      },
      maxWidth: {
        'screen-xl': '75em'
      },
      transitionProperty: {
        bg: 'background'
      },
      opacity: {
        60: '0.6'
      }
    },
    darkSelector: '.dark-mode'
  },
  variants: {
    backgroundColor: [
      'dark',
      'dark-hover',
      'hover'
    ],
    borderColor: [
      'dark',
      'hover'
    ],
    borderRadius: [
      'responsive'
    ],
    boxShadow: [
      'responsive'
    ],
    textColor: [
      'dark',
      'hover',
      'focus'
    ],
    margin: [
      'first',
      'last',
      'responsive'
    ],
    padding: [
      'first',
      'last',
      'responsive'
    ]
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ]
}
