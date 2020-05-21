const root = __dirname + '/../../';

const purgecss = process.env.HUGO_ENVIRONMENT === 'production'
  ? require('@fullhuman/postcss-purgecss')({
      content: [
        root + 'content/**/*.md',
        root + 'content/**/*.html',
        root + 'layouts/**/*.html',
        root + 'assets/**/*.scss'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      whitelist: [ 'dark-mode' ],
      fontFace: true
    })
  : null;

module.exports = {
  plugins: [
    require('postcss-import')({
      path: [ root ]
    }),
    require('tailwindcss')(root + 'assets/scss/tailwind.config.js'),
    require('autoprefixer'),
    purgecss
  ]
}
