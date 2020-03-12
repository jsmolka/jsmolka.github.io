const root = __dirname + '/../../';

module.exports = {
  plugins: [
    require('postcss-import')({
      path: [ root ]
    }),
    require('tailwindcss')(root + 'assets/css/tailwind.config.js'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        root + 'content/**/*.html',
        root + 'layouts/**/*.html'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      fontFace: true
    }),
    require('autoprefixer')({
      grid: true
    }),
    require('postcss-reporter')
  ]
}
