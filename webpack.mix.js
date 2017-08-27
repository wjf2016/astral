let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

const isProdBuild = process.env.NODE_ENV === 'production'

mix.js('resources/assets/js/app.js', 'public/js/')
.sass('resources/assets/sass/app.scss', 'public/css/')
.sourceMaps()
.options({
  extractVueStyles: isProdBuild
});

if (isProdBuild) {
  mix.version();
}
