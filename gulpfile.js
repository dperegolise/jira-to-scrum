// jscs: disable
/**
 * Created by michael.cooper on 12/1/2014.
 */
'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var template = require('gulp-template');
var merge = require('gulp-merge');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var inject = require('gulp-inject');
var copy = require('gulp-copy');
var connect = require('gulp-connect');
var orderedStream = require('stream-series');
var order = require('gulp-order');
var bump = require('gulp-bump');
var less = require('gulp-less');
var karma = require('gulp-karma');
var annotate = require('gulp-ng-annotate');
var html2js = require('gulp-html2js');
var htmlmin = require('gulp-htmlmin');
var nodemon = require('gulp-nodemon');
var ngConstant = require('gulp-ng-constant');
var notify = require('gulp-notify');
var ignore = require('gulp-ignore');
var util = require('gulp-util');
var wrap = require('gulp-wrap');
var json2Js = require('gulp-ng-json2js');
var colors = require('colors');
var toDo = require('gulp-todo');
var runSequence = require('run-sequence');

var jscs = require('gulp-jscs');

var server = require('gulp-express');

var WATCH_MODE  = 'watch',
    RUN_MODE    = 'run',
    VENDOR_PATH = /^vendor\/.*\/([^\/]*)$/;

/**
 * sets up config
 */
var userConfig = require('./config/buildConfig.js');
var pkg = require('./package.json');
var mode = WATCH_MODE;
function list(val) {
  return val.split(',');
}

/**
 * sets up constants for different build environments.
 * MOVE: to config dir
 *
 */
var pathConfigs = {

  working: {
    "ENVIRONMENT": {
      "ENV": "working",
      "API_PATH": "http://localhost:40364/", // local external endpoint
      "VERSION": 'v ' + pkg.version
    }
  },
  dev: {
    "ENVIRONMENT": {
      "ENV": "prod",
      API_PATH: "production url",
      "VERSION": 'v ' + pkg.version
    }
  }
};

var lintOptions = {
  curly: true,
  immed: true,
  newcap: true,
  noarg: true,
  sub: true,
  boss: true,
  eqnull: true,
  force: true
};

var htmlMinOptions = {
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
};

/**
 * checks jscs style
 */
gulp.task('style', function() {
  return gulp.src('src/**/*.js')
    .pipe(jscs());

});

/**
 * create injectable test fixtures
 * converts json files to test modules
 */
gulp.task('fixtures', function() {
  return gulp.src('fixtures/**/*.json')
    .pipe(json2Js({
      moduleName: 'agile.fixtures',
      prefix: 'fixture.',
      rename: function(url) {
        return url.replace(/\//g, '').replace(/\./g, '')
          .replace('json', '')
      }
    }))
    //.pipe(concat('fixtures.js'))
    .pipe(gulp.dest('fixtures'));
});

/**
 * sets up simple node connect server with live reload
 */
gulp.task(
  'connect', function() {
    connect.server(
      {
        root: 'build',
        fallback: 'build/index2.html',
        port: userConfig.connectPort,
        livereload: false
      }
    );
  }
);

/**
 * Bumps build version of bower and package
 */
gulp.task(
  'bump', function(cb) {
    return gulp.src(['./bower.json', './package.json'])
      .pipe(bump({type: 'patch'}))
      .pipe(gulp.dest('./'));
  }
);
/**
 * lints file from .jshintrc
 */
gulp.task(
  'lint', function() {
    return gulp.src(userConfig.app_files.js)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  }
);

/**
 * creates build-dependent constants module
 *  - for working dir
 */
gulp.task(
  'ngConstant-working', function(cb) {

    var options = pathConfigs.working;
    constantBuild(options, cb);
  }
);

gulp.task(
  'ngConstant-dev', function(cb) {

    var options = pathConfigs.dev;
    constantBuild(options, cb);
  }
);

var constantBuild = function(options, cb) {
  var path = userConfig.path_dir + '/path.js';

  del(
    path, function(err, deletedFiles) {
      gulp.src('config/path.json')
        .pipe(
        ngConstant(
          {
            constants: options
          }
        )
      )
        .pipe(wrap('// jscs:disable\n<%= contents %>\n// jscs:enable\n\n'))
        .pipe(gulp.dest(userConfig.path_dir));
    }
  );
  cb();
};

/**
 * makes the compressed html templates for app
 */
gulp.task(
  'html2js-app', function() {
    return gulp.src(userConfig.app_files.atpl)
      .pipe(
      htmlmin(
        htmlMinOptions
      )
    )
      .pipe(
      html2js(
        {
          useStrict: true,
          base: 'src/app',
          outputModuleName: 'templates-app'
        }
      )
    )

      .pipe(concat('templates-app.js'))
      .pipe(gulp.dest(userConfig.build_dir));
  }
);

/**
 *  makes the compressed html templates for common
 *
 * */
gulp.task(
  'html2js-common', function() {
    return gulp.src(userConfig.app_files.ctpl)
      .pipe(
      htmlmin(
        htmlMinOptions
      )
    )
      .pipe(
      html2js(
        {
          useStrict: true,
          base: 'src/common',
          outputModuleName: 'templates-common'
        }
      )
    )

      .pipe(concat('templates-common.js'))
      .pipe(gulp.dest(userConfig.build_dir));
  }
);

/**
 * clean out build directory
 */
gulp.task(
  'clean', function(cb) {

    del([userConfig.build_dir], {}, cb);

  }
);

/**
 * clean out build directory
 */
gulp.task(
  'clean-dev', function(cb) {
    del([userConfig.dev_dir], {}, cb);

  }
);

/**
 * convert less files to css and merge with vendor css files
 * */
gulp.task(
  'lessCss', function(cb) {
    var cssTarget = pkg.name + '-' + pkg.version + '.css';
    return merge(
      gulp.src(userConfig.vendor_files.css),
      gulp.src(userConfig.app_files.less)
        .pipe(less().on('error', util.log))
    )
      .pipe(concat(cssTarget))
      .pipe(gulp.dest(userConfig.build_dir + '/assets/css'));
  }
);
gulp.task(
  'fontsInCss', function() {
    return gulp.src(userConfig.vendor_files.fontsToCss)
      .pipe(gulp.dest(userConfig.build_dir + '/assets/css'));
  }
);

gulp.task(
  'fontsInCss-dev', function() {
    return gulp.src(userConfig.vendor_files.fontsToCss)
      .pipe(gulp.dest(userConfig.dev_dir + '/assets/css'));
  }
);

gulp.task(
  'lessCss-dev', function(cb) {
    var cssTarget = pkg.name + '-' + pkg.version + '.css';
    return gulp.src(userConfig.build_dir + '/assets/css/' + cssTarget)
      .pipe(
      minifyCss()
    )
      .pipe(gulp.dest(userConfig.dev_dir + '/assets/css/'));
  }
);

/**
 * copy user js files
 * */
gulp.task(
  'buildJs-app', function(cb) {
    return gulp.src(userConfig.app_files.js)
      .pipe(gulp.dest(userConfig.build_dir + '/src'));

  }
);

/**
 * copy vendor js files
 * */
gulp.task(
  'buildJs-vendor', function(cb) {
    return gulp.src(userConfig.vendor_files.js)
      .pipe(gulp.dest(userConfig.build_dir + '/vendor'));

  }
);

/**
 * copy assets
 * */
gulp.task(
  'copySupport', function(cb) {
    gulp.src(userConfig.app_files.assets)
      .pipe(gulp.dest(userConfig.build_dir + '/assets'));

    gulp.src(userConfig.vendor_files.assets)
      .pipe(gulp.dest(userConfig.build_dir + '/assets'));

    gulp.src(userConfig.vendor_files.fonts)
      .pipe(gulp.dest(userConfig.build_dir + '/assets/fonts'));

    cb();
  }
);

/**
 Copy fav icon
 */
gulp.task(
  'copyIcon', function(cb) {
    gulp.src(userConfig.icon)
      .pipe(gulp.dest(userConfig.build_dir));
    cb();
  }
);

gulp.task(
  'copySupport-dev', function(cb) {
    return gulp.src(
      [userConfig.build_dir + '/assets/**',
        '!' + userConfig.build_dir + '/assets/css/**']
    )
      .pipe(gulp.dest(userConfig.dev_dir + '/assets'));
  }
);

gulp.task(
  'copyFaviconAndConfig-dev', function(cb) {
    return gulp.src(
      ['src/*.ico', 'web.config']
    )
      .pipe(gulp.dest(userConfig.dev_dir));
  }
);

// generate a todo.md from your javascript files
gulp.task(
  'todo', function() {
    gulp.src('src/**/*.js')
      .pipe(toDo())
      .pipe(gulp.dest('./'));
    // -> Will output a TODO.md with your todos
  }
);

gulp.task(
  'karma', function(done) {

    return gulp.src('/src/app/app.js')
      .pipe(
      karma(
        {
          configFile: userConfig.build_dir + '/karma.conf.js',
          action: 'run'
        },
        function() {
          done();
        }
      )
    );
  }
);

gulp.task(
  'karma-coverage', function() {
    return gulp.src('/src/app/common/*.js')
      .pipe(
      karma(
        {
          configFile: userConfig.build_dir
          + '/karma-coverage.conf.js',
          action: 'run'
        }
      )
        .on(
        'error', function(err) {
          // Make sure failed tests cause gulp to exit non-zero
          console.log(colors.red.underline('Coverage failed'));
        }
      )
    );
  }
);

/**
 * configure karma tests
 * */
gulp.task(
  'karmaConfig', function(cb) {

    // manufacture the karma
    var target = gulp.src('./karma/karma.conf.js')
      .pipe(template({files: userConfig.vendor_files.jskarma}))
      .pipe(gulp.dest(userConfig.build_dir));

    var target2 = gulp.src('./karma/karma-coverage.conf.js')
      .pipe(template({files: userConfig.vendor_files.jskarma}))
      .pipe(gulp.dest(userConfig.build_dir));

    cb();
  }
);

/**
 * copy flattens vendor directory, so we chop out middle
 * @param {string} rootName
 * @return {string}
 * @example
 * 'vendor/angular/angular.js' to 'vendor/angular.js',
 * 'vendor/lodash/dist/lodash.js' to  'vendor/lodash.js'
 */
var trimOutVendor = function(rootName) {
  var parts = VENDOR_PATH.exec(rootName);
  return parts[1];
};

/**
 * build index page with injected scripts
 * */
gulp.task(
  'index', function() {
    // create ordered vendor file list to inject
    var files = [];
    _.each(
      userConfig.vendor_files.js, function(vendor) {
        files.push('vendor/' + trimOutVendor(vendor));
      }
    );

    var target = gulp.src('./src/index2.html')
      .pipe(template({files: files}));

    var sources = orderedStream(
      gulp.src(
        [userConfig.build_dir + '/*.js'],
        {read: false}
      ),
      gulp.src(
        [userConfig.build_dir + '/src/**/*.module.js',
          userConfig.build_dir + '/src/**/*.js',
          userConfig.build_dir + '/**/*.css'],
        {read: false}
      )
    );

    return target.pipe(
      inject(
        sources,
        {
          ignorePath: '/build/',
          addRootSlash: false
        }
      )
    )
      .pipe(rename(function(path) {
        path.basename = 'index';
      })
    )
      .pipe(gulp.dest(userConfig.build_dir));
  }
);

/**
 * waiting message
 */
gulp.task(
  'console-wait', function(cb) {
    console.log(colors.green('Watching ...'));

  }
);

/**
 * express server setup
 */
gulp.task('serverExpress', function() {
  // Start the server at the beginning of the task
  server.run(
    ['server/gulpExpress.js']
  );

  var debounceServer = function() {
    throttle(function() {
      server.notify();
    }, 2000)
  };

  // Restart the server when file changes
  gulp.watch(
    [
      userConfig.build_dir + '/**/index*.html',
      userConfig.build_dir + '/src/**/*.js',
      userConfig.build_dir + '/templates-*.js'
    ], _.debounce(server.notify, 500, {leading: false, trailing: true}));

  gulp.watch([userConfig.build_dir + '/**/*.css'], function(event) {

    server.notify(event);
    //pipe support is added for server.notify since v0.1.5,
    //see https://github.com/gimm/gulp-express#servernotifyevent
  });

  gulp.watch([userConfig.build_dir + 'assets/images/**/*'],
    server.notify);
  gulp.watch(['server/gulpExpress.js'],
    [server.run]);
});

/**
 * complete build
 * */
gulp.task(
  'build', function(cb) {

    console.log(colors.green.underline('Building ' + pkg.name));
    runSequence(
      'clean',
      'lint',
      ['ngConstant-working', 'html2js-app', 'html2js-common',
        'lessCss', 'copySupport', 'todo', 'fontsInCss'],
      ['buildJs-app', 'buildJs-vendor'],
      ['index', 'karmaConfig', 'copyIcon'],
      cb
    );

  }
);

/**
 * final compile
 * */
gulp.task(
  'compile', function() {

    var jsTarget = pkg.name + '-' + pkg.version + '.js';
    return gulp.src(
      [
        userConfig.build_dir + '/annotate/*.js'
      ]
    )
      .pipe(concat(jsTarget))
      .pipe(gulp.dest(userConfig.dev_dir))
  }
);

gulp.task(
  'compile-vendor', function() {

    var jsTarget = pkg.name + '.vendor.js';
    // compress libs, our templates
    // and then concat our annotated custom code section
    var uglyOptions = {
      mangle: false,
      stats: true,
      compress: false
    };

    return gulp.src(
      [userConfig.build_dir + '/vendor/**/*.js',
        userConfig.build_dir + '/templates-*.js',
        !userConfig.build_dir + '/karma*'
      ]
    )
      .pipe(concat(jsTarget))
      .pipe(uglify(uglyOptions))
      .pipe(gulp.dest(userConfig.build_dir + '/annotate'));
  }
);

/**
 * Annotates and uglifies our code section ONLY
 * */
gulp.task(
  'annotate', function() {
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
    var uglyOptions = {
      output: {
        preamble: banner
      },
      mangle: true,
      stats: true,
      compress: false
    };
    var jsTarget = pkg.name + '-' + pkg.version + '.js';

    gulp.src(
      [userConfig.build_dir + '/src/**/*.module.js',
        userConfig.build_dir + '/src/**/*.js',
        !userConfig.build_dir + '/src/**/*.spec.js']
    )
      .pipe(wrap('(function(){ \'use strict\';\n<%= contents %>})();\n')) // wraps
      // all
      // in
      // IIFE!!
      .pipe(annotate())
      .pipe(concat(jsTarget))
      .pipe(uglify(uglyOptions))
      .pipe(gulp.dest(userConfig.build_dir + '/annotate'));
  }
);

gulp.task(
  'index-dev', function() {
    // create ordered vendor file list to inject
    var sources = gulp.src(
      [
        userConfig.dev_dir + '/**/*.module.js',
        userConfig.dev_dir + '/**/*.js',
        userConfig.dev_dir + '/assets/css/*.css'
      ], {read: false}
    );
    var templateFiles = {
      files: [],
      styles: []
    };
    var target = gulp.src('./src/index2.html')
      .pipe(
      template(
        {
          files: templateFiles.files,
          styles: templateFiles.styles
        }
      )
    );

    return target
      .pipe(
      rename(
        function(path) {
          path.basename = 'index';
        }
      )
    )
      .pipe(
      inject(
        sources,
        {
          ignorePath: '/dev/',
          addRootSlash: false
        }
      )
    )
      .pipe(gulp.dest(userConfig.dev_dir));
  }
);

gulp.task(
  'build-dev', function(cb) {

    console.log(colors.yellow.underline('Building dev deploy' + pkg.name));
    runSequence(
      ['clean', 'clean-dev', 'bump'],
      'lint',
      ['ngConstant-dev', 'html2js-app', 'html2js-common',
        'lessCss', 'copySupport', 'fontsInCss-dev'],
      ['buildJs-app', 'buildJs-vendor'],
      ['index', 'karmaConfig'],
      ['annotate', 'compile-vendor'],

      // dev construction
      ['lessCss-dev', 'copySupport-dev', 'copyFaviconAndConfig-dev'],
      // big concat
      ['compile', 'karma'],
      ['index-dev'],
      cb
    );

  }
);

// for now - default task
gulp.task(
  'default', function(cb) {

    runSequence(
      'build',
      //   ['watch-mode', 'connect'],
      ['watch-mode', 'serverExpress'],
      'console-wait',
      cb
    )
  }
);

/**
 * Set up watchers
 * */
gulp.task(
  'watch-mode', function(cb) {
    mode = WATCH_MODE;

    var jsWatcher         = gulp.watch(
          ['src/**/*.js'],
          ['buildJs-app', 'karma', 'lint']
        ),
        lessWatcher       = gulp.watch('src/less/**/*.less', ['lessCss']),

        htmlAppWatcher    = gulp.watch(
          'src/app/**/*.tpl.html',
          ['html2js-app']
        ),
        htmlCommonWatcher = gulp.watch(
          'src/common/**/*.tpl.html',
          ['html2js-common']
        );

    function changeNotification(event) {
      console.log(
        'File', event.path, 'was', event.type,
        ', running tasks...'
      );
    }

    jsWatcher.on('change', changeNotification);
    lessWatcher.on('change', changeNotification);
    htmlAppWatcher.on('change', changeNotification);
    htmlCommonWatcher.on('change', changeNotification);

    cb();
  }
);