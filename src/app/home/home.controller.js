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

function HomeController(UserService, IssueService) {
  'use strict';

  var user = null;
  var query = "";
  var issueList = [];
  var vm = this;

  activate();

  vm.doQuery = function() {
    IssueService.getIssueList(replaceAll(vm.query, " ", "+")).then(function(list) {
      vm.issueList = list;
    });
  };

  var replaceAll = function(string, target, replacement) {
    return string.split(target).join(replacement);
  };

  function activate() {
    vm.query = "labels=Farmowners and labels=Delta";
  }
  vm.doQuery();
}
