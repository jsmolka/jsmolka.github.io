const root = __dirname + '/../../../';

module.exports = {
  plugins: [
    require('postcss-import')({
      path: [ root ]
    }),
    require('tailwindcss')(root + 'assets/css/tailwind.config.js'),
    require('autoprefixer')
  ]
}
