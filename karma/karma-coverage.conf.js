/**
 * Created by mike on 12/8/2014.
 */
module.exports = function(config) {
  config.set({
    /**
     * From where to look for files, starting with the location of this
     * file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during
     * testing.
     */
    files: [
      '<% files.forEach( function ( file ) { %><%= file %>',
      '<% }); %>' +
      'src/**/*.module.js',
      'src/**/*.js'
    ],
    exclude: [
      'src/assets/**/*.js'
    ],
    frameworks: ['jasmine'],
    plugins: ['karma-jasmine', 'karma-firefox-launcher',
      'karma-chrome-launcher', 'karma-phantomjs-launcher'],
    preprocessors: {
      'src/**/*[!.spec.].js': ['coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['coverage'],

    /**
     * On which port should the browser connect, on which port is the test
     * runner operating, and what is the URL path for the browser to use.
     * bumped ports so we can run 2 sessions      */
    port: 9019,
    runnerPort: 9101,
    urlRoot: '/',

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only
     * "Firefox" by default, but other browser names include: Chrome,
     * ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like
     * "chromium" or "firefox", but that these vary based on your operating
     * system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can
     * be left open and the tests will automatically occur there during the
     * build. This has the aesthetic advantage of not launching a browser
     * every time you save.
     */
    browsers: [
      'PhantomJS'
    ]
  });
};

