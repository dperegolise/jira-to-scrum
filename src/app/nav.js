/**
 * Created by mike on 12/18/2014.
 */
angular.module('agile.nav', [

])
  .controller('NavController', NavController);

/**
 * @class NavController
 * settings and admin stuff
 * @constructor
 */
function NavController($rootScope) {
  'use strict';
  this.isCollapsed = true;
  var vm = this;

  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    vm.isCollapsed = true;
  });

}
