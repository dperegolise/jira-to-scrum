/**
 * Created by michael.cooper on 10/21/2014.
 */
// An example configuration file.
exports.config = {
    // Do not start a Selenium Standalone sever - only run this using chrome.
    /*    chromeOnly: true,
     chromeDriver: './node_modules/protractor/selenium/chromedriver',*/
    seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',
    seleniumPort: 4444,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'internet explorer',
        'version': '9'
    },

    baseUrl: 'http://localhost:3444',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['e2e/**/*.spec.js'],

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
