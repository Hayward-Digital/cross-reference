module.exports = {
    plugins: [
      require('postcss-import'),
      require('autoprefixer'),
      require('@fullhuman/postcss-purgecss')({
        content: [
          './public/index.html',
          './src/**/*.js',
          './src/**/*.jsx',
        ],
        safelist: [
          /col-/,
          /btn-/,
          /px-/,
          /py-/,
          /rounded-pill/,
          /d-flex/,
          /flex-wrap/,
          /align-items-/,
          /justify-content-/,
          /g-0/,
          /card/,
          /pagination/,
          /active/,
          /disabled/,
        ],
      }),
    ],
  };