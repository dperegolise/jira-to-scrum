/**
 * Created by bob on 8/9/2015.
 */
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
var pkg = require('../package.json');
var now = new Date();
var banner = '/**\n' +
	' * ' + pkg.name + ' - v' + pkg.version + ' - ' + now.toString() +
	' *\n' +
	' * ' + pkg.description + '\n' +
	' * ' + pkg.homepage + '\n' +
	' *\n' +
	' * Copyright (c) ' + now.getFullYear() + '  '
	+ pkg.author + '\n' +
	' */\n';

module.exports = {
   /**
   * build
   */
  build_dir: 'build',
  dev_dir: 'dev',
  path_dir: 'src/common/config',
  connectPort: 3444,
  icon: 'src/favicon.ico',

  app_files: {
    js: [
      'src/**/*.module.js',
      'src/**/*.js',
      '!src/**/*.spec.js',
      '!src/assets/**/*.js',
      '!src/common/mocks/**'
    ],
    jsunit: ['src/**/*.spec.js'],

    atpl: ['src/app/**/*.tpl.html'],
    ctpl: ['src/common/**/*.tpl.html'],

    html: ['src/index.html'],
    less: 'src/less/main.less',
    assets: ['src/assets/**', '!src/assets/README.md']
  },

  vendor_files: {
    js: [
      //'vendor/angular/angular.js',
      'vendor/angular-animate/angular-animate.min.js',
      'vendor/angular-touch/angular-touch.min.js',

      'vendor/angular-ui-router/release/angular-ui-router.js',

      'vendor/lodash/lodash.min.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/moment/moment.js',
      'vendor/angular-moment/angular-moment.js',
      'vendor/angular-messages/angular-messages.min.js',
        'vendor/angular-local-storage/dist/angular-local-storage.min.js'
    ],
    jskarma: [
      'vendor/angular/angular.min.js',
      'vendor/angular-animate/angular-animate.min.js',

      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-touch/angular-touch.min.js',

      'vendor/angular-ui-router/release/angular-ui-router.min.js',

      'vendor/lodash/lodash.min.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/moment/moment.js',
      'vendor/angular-moment/angular-moment.min.js',
      'vendor/angular-messages/angular-messages.min.js',

      'vendor/angular-local-storage/dist/angular-local-storage.min.js',

      'src/common/mocks/**',
      'fixtures/**/*.js'
    ],

    css: [
      'vendor/angular-ui-grid/ui-grid.min.css',
      'vendor/angular-ui-select/dist/select.css',
      'vendor/bootstrap/dist/css/bootstrap.css'
    ],
    assets: [],
    fonts: [
      'vendor/font-awesome/fonts/FontAwesome.otf',
      'vendor/font-awesome/fonts/fontawesome-webfont.eot',
      'vendor/font-awesome/fonts/fontawesome-webfont.svg',
      'vendor/font-awesome/fonts/fontawesome-webfont.ttf',
      'vendor/font-awesome/fonts/fontawesome-webfont.woff',
      'vendor/angular-ui-grid/ui-grid.eot',
      'vendor/angular-ui-grid/ui-grid.svg',
      'vendor/angular-ui-grid/ui-grid.woff',
      'vendor/angular-ui-grid/ui-grid.ttf',
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.eot',
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.svg',
      'vendor/bootstrap/fonts/glyphicons-halfings-regular.ttf',
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff'

    ],
    fontsToCss: [
      'vendor/angular-ui-grid/ui-grid.eot',
      'vendor/angular-ui-grid/ui-grid.svg',
      'vendor/angular-ui-grid/ui-grid.ttf',
      'vendor/angular-ui-grid/ui-grid.woff'
    ]
  },

  /**
   * sets up constants for different build environments.
   *
   */
  working: {
    "ENVIRONMENT": {
      "ENV": "working",
      "API_PATH": "https://focustech.atlassian.net/rest/api/2/", // local external endpoint
      "VERSION": 'v ' + pkg.version
    }
  },
  dev: {
    "ENVIRONMENT": {
      "ENV": "prod",
      API_PATH: "production url",
      "VERSION": 'v ' + pkg.version
    }
  },

  /**
   * options
   */
  lintOptions: {
		curly: true,
		immed: true,
		newcap: true,
		noarg: true,
		sub: true,
		boss: true,
		eqnull: true,
		force: true
	},

	htmlMinOptions: {
		collapseBooleanAttributes: false,
		collapseWhitespace: true,
		conservativeCollapse: true,
		removeAttributeQuotes: false,
		removeComments: true,
		removeEmptyAttributes: false,
		removeRedundantAttributes: false,
		removeScriptTypeAttributes: false,
		removeStyleLinkTypeAttributes: false,
		caseSensitive: true
	},

	uglyOptions: {
      output: {
        preamble: banner
      },
      mangle: true,
      stats: true,
      compress: false
   },

   uglyVendorOptions: {
      mangle: false,
      stats: true,
      compress: false
   },

   jsTarget: pkg.name + '-' + pkg.version + '.js',

   jsVendorTarget: pkg.name + '.vendor.js'
};
