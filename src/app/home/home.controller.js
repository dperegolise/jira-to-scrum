/**
 * Created by mike on 7/18/2015.
 * home.controller -
 */
angular.module('agile.home')
  .controller('HomeController', HomeController)
  .config(function($stateProvider, States) {
    'use strict';
    $stateProvider.state(States.home.default, {
      url: '/home',
      views: {
        'content@': {
          templateUrl: 'home/home.tpl.html',
          controller: 'HomeController as home'
        }
      }
    });
  }
);

function HomeController() {
  'use strict';

  var vm = this;

  activate();

  /**
   * fetches intervals
   */
  function activate() {

  }
}
