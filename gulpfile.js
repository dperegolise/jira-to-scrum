// jscs: disable
/**
 * Created by michael.cooper on 12/1/2014.
 */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var del = require('del');
var orderedStream = require('stream-series');
var runSequence = require('run-sequence');

var WATCH_MODE  = 'watch',
    RUN_MODE    = 'run',
    VENDOR_PATH = /^vendor\/.*\/([^\/]*)$/;

/**
 * sets up config
 */
var config = require('./config/config.js');
var pkg = require('./package.json');
var mode = WATCH_MODE;

gulp.task('help', $.taskListing);

/**
 * checks jscs style
 */
gulp.task('style', function() {
  return gulp.src('src/**/*.js')
    .pipe($.jscs());

});

/**
 * create injectable test fixtures
 * converts json files to test modules
 */
gulp.task('fixtures', function() {
  return gulp.src('fixtures/**/*.json')
    .pipe($.ngJson2js({
      moduleName: 'agile.fixtures',
      prefix: 'fixture.',
      rename: function(url) {
        return url.replace(/\//g, '').replace(/\./g, '')
          .replace('json', '')
      }
    }))
    //.pipe($.concat('fixtures.js'))
    .pipe(gulp.dest('fixtures'));
});

/**
 * sets up simple node connect server with live reload
 */
gulp.task(
  'connect', function() {
    $.connect.server(
      {
        root: 'build',
        fallback: 'build/index2.html',
        port: config.connectPort,
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
      .pipe($.bump({type: 'patch'}))
      .pipe(gulp.dest('./'));
  }
);
/**
 * lints file from .jshintrc
 */
gulp.task(
  'lint', function() {
    return gulp.src(config.app_files.js)
      .pipe($.jshint())
      .pipe($.jshint.reporter('default'));
  }
);

/**
 * creates build-dependent constants module
 *  - for working dir
 */
gulp.task(
  'ngConstant-working', function(cb) {

    var options = config.working;
    constantBuild(options, cb);
  }
);

gulp.task(
  'ngConstant-dev', function(cb) {

    var options = config.dev;
    constantBuild(options, cb);
  }
);

/**
 * makes the compressed html templates for app
 */
gulp.task(
  'html2js-app', function() {
    return gulp.src(config.app_files.atpl)
      .pipe(
      $.htmlmin(
        config.htmlMinOptions
      )
    )
      .pipe(
      $.html2js(
        {
          useStrict: true,
          base: 'src/app',
          outputModuleName: 'templates-app'
        }
      )
    )

      .pipe($.concat('templates-app.js'))
      .pipe(gulp.dest(config.build_dir));
  }
);

/**
 *  makes the compressed html templates for common
 *
 * */
gulp.task(
  'html2js-common', function() {
    return gulp.src(config.app_files.ctpl)
      .pipe(
      $.htmlmin(
        config.htmlMinOptions
      )
    )
      .pipe(
      $.html2js(
        {
          useStrict: true,
          base: 'src/common',
          outputModuleName: 'templates-common'
        }
      )
    )

      .pipe($.concat('templates-common.js'))
      .pipe(gulp.dest(config.build_dir));
  }
);

/**
 * clean out build directory
 */
gulp.task(
  'clean', function(cb) {

    del([config.build_dir], {}, cb);

  }
);

/**
 * clean out build directory
 */
gulp.task(
  'clean-dev', function(cb) {
    del([config.dev_dir], {}, cb);

  }
);

/**
 * convert less files to css and merge with vendor css files
 * */
gulp.task(
  'lessCss', function(cb) {
    var cssTarget = pkg.name + '-' + pkg.version + '.css';
    return $.merge(
      gulp.src(config.vendor_files.css),
      gulp.src(config.app_files.less)
        .pipe($.less().on('error', $.util.log))
    )
      .pipe($.concat(cssTarget))
      .pipe(gulp.dest(config.build_dir + '/assets/css'));
  }
);
gulp.task(
  'fontsInCss', function() {
    return gulp.src(config.vendor_files.fontsToCss)
      .pipe(gulp.dest(config.build_dir + '/assets/css'));
  }
);

gulp.task(
  'fontsInCss-dev', function() {
    return gulp.src(config.vendor_files.fontsToCss)
      .pipe(gulp.dest(config.dev_dir + '/assets/css'));
  }
);

gulp.task(
  'lessCss-dev', function(cb) {
    var cssTarget = pkg.name + '-' + pkg.version + '.css';
    return gulp.src(config.build_dir + '/assets/css/' + cssTarget)
      .pipe(
      $.minifyCss()
    )
      .pipe(gulp.dest(config.dev_dir + '/assets/css/'));
  }
);

/**
 * copy user js files
 * */
gulp.task(
  'buildJs-app', function(cb) {
    return gulp.src(config.app_files.js)
      .pipe(gulp.dest(config.build_dir + '/src'));

  }
);

/**
 * copy vendor js files
 * */
gulp.task(
  'buildJs-vendor', function(cb) {
    return gulp.src(config.vendor_files.js)
      .pipe(gulp.dest(config.build_dir + '/vendor'));

  }
);

/**
 * copy assets
 * */
gulp.task(
  'copySupport', function(cb) {
    gulp.src(config.app_files.assets)
      .pipe(gulp.dest(config.build_dir + '/assets'));

    gulp.src(config.vendor_files.assets)
      .pipe(gulp.dest(config.build_dir + '/assets'));

    gulp.src(config.vendor_files.fonts)
      .pipe(gulp.dest(config.build_dir + '/assets/fonts'));

    cb();
  }
);

/**
 Copy fav icon
 */
gulp.task(
  'copyIcon', function(cb) {
    gulp.src(config.icon)
      .pipe(gulp.dest(config.build_dir));
    cb();
  }
);

gulp.task(
  'copySupport-dev', function(cb) {
    return gulp.src(
      [config.build_dir + '/assets/**',
        '!' + config.build_dir + '/assets/css/**']
    )
      .pipe(gulp.dest(config.dev_dir + '/assets'));
  }
);

gulp.task(
  'copyFaviconAndConfig-dev', function(cb) {
    return gulp.src(
      ['src/*.ico', 'web.config']
    )
      .pipe(gulp.dest(config.dev_dir));
  }
);

// generate a todo.md from your javascript files
gulp.task(
  'todo', function() {
    gulp.src('src/**/*.js')
      .pipe($.todo())
      .pipe(gulp.dest('./'));
    // -> Will output a TODO.md with your todos
  }
);

gulp.task(
  'karma', function(done) {

    return gulp.src('/src/app/app.js')
      .pipe(
      $.karma(
        {
          configFile: config.build_dir + '/karma.conf.js',
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
      $.karma(
        {
          configFile: config.build_dir
          + '/karma-coverage.conf.js',
          action: 'run'
        }
      )
        .on(
        'error', function(err) {
          // Make sure failed tests cause gulp to exit non-zero
          console.log($.util.colors.red.underline('Coverage failed'));
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
    gulp.src('./karma/karma.conf.js')
      .pipe($.template({files: config.vendor_files.jskarma}))
      .pipe(gulp.dest(config.build_dir));

    gulp.src('./karma/karma-coverage.conf.js')
      .pipe($.template({files: config.vendor_files.jskarma}))
      .pipe(gulp.dest(config.build_dir));

    cb();
  }
);

/**
 * build index page with injected scripts
 * */
gulp.task(
  'index', function() {
    // create ordered vendor file list to inject
    var files = [];
    _.each(
      config.vendor_files.js, function(vendor) {
        files.push('vendor/' + trimOutVendor(vendor));
      }
    );

    var target = gulp.src('./src/index2.html')
      .pipe($.template({files: files}));

    var sources = orderedStream(
      gulp.src(
        [config.build_dir + '/*.js'],
        {read: false}
      ),
      gulp.src(
        [config.build_dir + '/src/**/*.module.js',
          config.build_dir + '/src/**/*.js',
          config.build_dir + '/**/*.css'],
        {read: false}
      )
    );

    return target.pipe(
      $.inject(
        sources,
        {
          ignorePath: '/build/',
          addRootSlash: false
        }
      )
    )
      .pipe($.rename(function(path) {
        path.basename = 'index';
      })
    )
      .pipe(gulp.dest(config.build_dir));
  }
);

/**
 * waiting message
 */
gulp.task(
  'console-wait', function(cb) {
    console.log($.util.colors.green('Watching ...'));
  }
);

/**
 * express server setup
 */
gulp.task('serverExpress', function() {
  // Start the server at the beginning of the task
  $.express.run(
    ['server/gulpExpress.js']
  );

  // Restart the server when file changes
  gulp.watch(
    [
      config.build_dir + '/**/index*.html',
      config.build_dir + '/src/**/*.js',
      config.build_dir + '/templates-*.js'
    ], _.debounce($.express.notify, 500, {leading: false, trailing: true}));

  gulp.watch([config.build_dir + '/**/*.css'], function(event) {

    $.express.notify(event);
    //pipe support is added for server.notify since v0.1.5,
    //see https://github.com/gimm/gulp-express#servernotifyevent
  });

  gulp.watch([config.build_dir + 'assets/images/**/*'],
    $.express.notify);
  gulp.watch(['server/gulpExpress.js'],
    [$.express.run]);
});

/**
 * complete build
 * */
gulp.task(
  'build', function(cb) {

    console.log($.util.colors.green.underline('Building ' + pkg.name));
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
        config.build_dir + '/annotate/*.js'
      ]
    )
      .pipe($.concat(jsTarget))
      .pipe(gulp.dest(config.dev_dir))
  }
);

gulp.task(
  'compile-vendor', function() {
    // compress libs, our templates
    // and then concat our annotated custom code section
    return gulp.src(
      [config.build_dir + '/vendor/**/*.js',
        config.build_dir + '/templates-*.js',
        !config.build_dir + '/karma*'
      ]
    )
      .pipe($.concat(config.jsVendorTarget))
      .pipe($.uglify(config.uglyVendorOptions))
      .pipe(gulp.dest(config.build_dir + '/annotate'));
  }
);

/**
 * Annotates and uglifies our code section ONLY
 * */
gulp.task(
  'annotate', function() {
    gulp.src(
      [config.build_dir + '/src/**/*.module.js',
        config.build_dir + '/src/**/*.js',
        !config.build_dir + '/src/**/*.spec.js']
      )
      .pipe($.wrap('(function(){ \'use strict\';\n<%= contents %>})();\n')) // wraps
      // all
      // in
      // IIFE!!
      .pipe($.ngAnnotate())
      .pipe($.concat(config.jsTarget))
      .pipe($.uglify(config.uglyOptions))
      .pipe(gulp.dest(config.build_dir + '/annotate'));
  }
);

gulp.task(
  'index-dev', function() {
    // create ordered vendor file list to inject
    var sources = gulp.src(
      [
        config.dev_dir + '/**/*.module.js',
        config.dev_dir + '/**/*.js',
        config.dev_dir + '/assets/css/*.css'
      ], {read: false}
    );
    var templateFiles = {
      files: [],
      styles: []
    };
    var target = gulp.src('./src/index2.html')
      .pipe(
      $.template(
        {
          files: templateFiles.files,
          styles: templateFiles.styles
        }
      )
    );

    return target
      .pipe(
        $.rename(
          function(path) {
            path.basename = 'index';
          }
        )
      )
      .pipe(
        $.inject(
          sources,
          {
            ignorePath: '/dev/',
            addRootSlash: false
          }
        )
      )
      .pipe(gulp.dest(config.dev_dir));
  }
);

gulp.task(
  'build-dev', function(cb) {

    console.log($.util.colors.yellow.underline('Building dev deploy ' + pkg.name));
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

    var jsWatcher = gulp.watch(
          ['src/**/*.js'],
          ['buildJs-app', 'karma', 'lint']
        ),
        lessWatcher = gulp.watch('src/less/**/*.less', ['lessCss']),

        htmlAppWatcher = gulp.watch(
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

/**************** functions *****************/
 var constantBuild = function(options, cb) {
    var path = config.path_dir + '/path.js';
  
    del(
      path, function(err, deletedFiles) {
        gulp.src('config/path.json')
          .pipe(
          $.ngConstant(
            {
              constants: options
            }
          )
        )
          .pipe($.wrap('// jscs:disable\n<%= contents %>\n// jscs:enable\n\n'))
          .pipe(gulp.dest(config.path_dir));
      }
    );
    cb();
};

function list(val) {
    return val.split(',');
}

var debounceServer = function() {
    $.throttle(function() {
        $.express.notify();
    }, 2000)
};

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