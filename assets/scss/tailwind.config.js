module.exports = {
  theme: {
    fontFamily: {
      body: [
        '"Roboto"',
        'sans-serif'
      ],
      mono: [
        '"Roboto-mono"',
        'monospace'
      ]
    },
    extend: {
      colors: {
        gray: {
           50: "#fafafa",
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121"
        },
        // Todo: retire
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
          100: '#A5A8BD',
          200: '#9094A7',
          300: '#7C7F91',
          400: '#686B7B',
          500: '#535665',
          600: '#3F414F',
          700: '#2A2D39',
          800: '#20232E',
          900: '#161823'
        }
      },
      height: {
        18: '4.5rem'
      },
      borderWidth: {
        1: '1px',
        3: '3px'
      },
      fontSize: {
        code: '15px'
      },
      minHeight: {
        18: '4.5rem'
      },
      opacity: {
        60: '0.6'
      }
    }
  },
  variants: {
    textColor: [
      'hover'
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
  }
}
