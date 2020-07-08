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
          500: '#2b3137',
          600: '#24292e',
          700: '#1a1d21',
          800: '#131619',
          900: '#0d0f11'
        },
        light: {
          100: '#fafafa',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121'
        },
        // Polar Night
        "nord-0": "#2E3440",
        "nord-1": "#3B4252",
        "nord-2": "#434C5E",
        "nord-3": "#4C566A",
        "polar-night-0": "#2E3440",
        "polar-night-1": "#3B4252",
        "polar-night-2": "#434C5E",
        "polar-night-3": "#4C566A",

        // Snow Storm
        "nord-4": "#D8DEE9",
        "nord-5": "#E5E9F0",
        "nord-6": "#ECEFF4",
        "snow-storm-0": "#D8DEE9",
        "snow-storm-1": "#E5E9F0",
        "snow-storm-2": "#ECEFF4",

        // Frost
        "nord-7": "#8FBCBB",
        "nord-8": "#88C0D0",
        "nord-9": "#81A1C1",
        "nord-10": "#5E81AC",
        "frost-0": "#8FBCBB",
        "frost-1": "#88C0D0",
        "frost-2": "#81A1C1",
        "frost-3": "#5E81AC",

        // Aurora
        "nord-11": "#BF616A",
        "nord-12": "#D08770",
        "nord-13": "#EBCB8B",
        "nord-14": "#A3BE8C",
        "nord-15": "#B48EAD",
        "aurora-0": "#BF616A",
        "aurora-1": "#D08770",
        "aurora-2": "#EBCB8B",
        "aurora-3": "#A3BE8C",
        "aurora-4": "#B48EAD",

        // Base
        "base-dark": "#242933",
        "base-light": "#F2F4F8",

        // Grey
        "grey-dark": "#ABB9CF",
        "grey-light": "#7B88A1"
      },
      borderWidth: {
        1: '1px'
      },
      maxWidth: {
        'screen-xl': '75em'
      },
      transitionProperty: {
        'bg': 'background'
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
