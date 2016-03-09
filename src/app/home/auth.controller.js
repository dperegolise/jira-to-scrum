/**
 * auth.controller
 */
angular.module('agile.auth')
  .controller('AuthController', AuthController)
  .config(function($stateProvider, States) {
    'use strict';
    $stateProvider.state(States.home.auth, {
      url: '/authenticate',
      views: {
        'content@': {
          templateUrl: 'home/auth.tpl.html',
          controller: 'AuthController as auth'
        }
      }
    });
  }
);

function AuthController(Auth, AuthService, $state, States, $stateParams) {
  'use strict';

  this.userEmail = null;
  this.userPassword = null;
  var vm = this;

  vm.authenticate = function() {
    AuthService.authenticate(new Auth({
      username: vm.userEmail,
      password: vm.userPassword
    })).then(function() {
      $state.go(States.home.default, $stateParams, {reload: true});
    }, function(reason) {
      alert(reason.data);
    });
  }

}
