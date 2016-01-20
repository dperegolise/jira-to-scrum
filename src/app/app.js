/**
 * Main entry point for app
 */
angular.module(
  'agile', [
    'ngAnimate',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'templates-app',
    'templates-common',
    'ngMessages',
    'LocalStorageModule',
    'agile.config',
    'agile.config.path',
    'agile.nav',
    'agile.home'
  ]
)
  .config(
  function($stateProvider, $compileProvider,
           ENVIRONMENT,
           $urlRouterProvider, $httpProvider,
           States) {

    /**
     * The global angular object comes with a new
     * .reloadWithDebugInfo() method, which does exactly what it says.
     * It reloads the browser with debug information to make
     * your life easier again.
     */
    if (ENVIRONMENT.ENV !== 'working') {
      $compileProvider.debugInfoEnabled(false);
    }

    $stateProvider
      .state(
      States.app.default, {
        abstract: true,
        views: {
          'header': {
            templateUrl: 'templates/header.tpl.html'
          },
          'nav': {
            templateUrl: 'templates/nav.tpl.html',
            controller: 'NavController as navi'
          },
          'content': {
            // Empty by Design (yep!)
          },
          'footer': {
            templateUrl: 'templates/footer.tpl.html'
          }
        }
      }
    );

    $urlRouterProvider.otherwise('/home');
  }
)
  .controller('AgileController', AgileController);

function AgileController() {
  'use strict';
}
