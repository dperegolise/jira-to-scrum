/**
 * Created by mike on 7/20/2015.
 * featureA.controller -
 */
angular.module('agile.featureA')
  .controller('featureAController', featureAController)

  .config(function($stateProvider, States) {
    'use strict';
    $stateProvider.state(States.featureA.default, {
      url: '/featureA',
      views: {
        'content@': {
          templateUrl: 'featureA/featureA.tpl.html',
          controller: 'featureAController as featureA'
        }
      }
    });
  }
);

function featureAController(FeatureA, featureAService) {
  //'use strict';
  this.model = new FeatureA();
  this.message = '';
  var vm = this;

  activate();

  function activate() {
    vm.message = featureAService.get();
  }
}
