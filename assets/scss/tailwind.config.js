module.exports = {
  theme: {
    fontFamily: {
      body: [
        'Inter',
        'system-ui',
        '-apple-system',
        'sans-serif'
      ],
      mono: [
        '"JetBrains Mono"',
        'Consolas',
        'Monaco',
        'monospace'
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
      borderWidth: {
        1: '1px',
        3: '3px'
      },
      fontSize: {
        code: '15px'
      },
      opacity: {
        60: '0.6'
      }
    }
  },
  variants: {
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
