(function (module) {
    try {
        module = angular.module('agile.fixtures');
    } catch (e) {
        module = angular.module('agile.fixtures', []);
    }
    module.value('fixturehomehome', {
  "see": "more",
  "clearly": "with"
});})();
