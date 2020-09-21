module.exports = {
  theme: {
    fontFamily: {
      bit: [
        '"Bit Outline"',
        '"Roboto"',
        'sans-serif'
      ],
      body: [
        '"Roboto"',
        'sans-serif'
      ],
      mono: [
        '"Roboto Mono"',
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
        blue: {
           50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1'
        },
        // Todo: remove
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
        '7xl': '5rem',
        '8xl': '6rem',
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
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
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
