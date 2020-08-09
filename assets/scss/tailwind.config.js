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
        red: {
          100: '#FF004E',
          200: '#EF0049',
          300: '#DF0044',
          400: '#CF003F',
          500: '#BF003A',
          600: '#AF0035',
          700: '#9F0030',
          800: '#8F002B',
          900: '#7F0026'
        },
        blue: {
          100: '#00F9EF',
          200: '#00E9E0',
          300: '#00DAD1',
          400: '#00CAC2',
          500: '#00BBB3',
          600: '#00ABA4',
          700: '#009B95',
          800: '#008C86',
          900: '#007C77'
        },
        dark: {
          100: '#414768',
          200: '#3C415F',
          300: '#363B57',
          400: '#31354E',
          500: '#2C3046',
          600: '#262A3D',
          700: '#212434',
          800: '#1B1E2C',
          900: '#161823'
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
