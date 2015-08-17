(function (module) {
    try {
        module = angular.module('agile.fixtures');
    } catch (e) {
        module = angular.module('agile.fixtures', []);
    }
    module.value('fixturefeatureAfeatureA', [
  {
    "bing": "bam",
    "boom": "biff"
  },
  {
    "bing": "pow",
    "boom": "pop"
  }
]);})();
