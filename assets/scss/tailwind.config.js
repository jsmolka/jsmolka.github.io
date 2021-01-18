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
        }
      },
      borderWidth: {
        3: '3px',
        6: '6px'
      },
      fontSize: {
        md: '0.95rem',
        index: '5rem',
      },
      height: {
        18: '4.5rem'
      },
      minHeight: {
        18: '4.5rem'
      },
      opacity: {
        40: '0.40',
        60: '0.60',
        85: '0.85'
      },
      screens: {
        anchor: '832px',
        'list-body': '384px'
      },
      width: {
        'list-key': '144px'
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
