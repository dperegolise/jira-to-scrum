/**
 * Created by mike on 7/18/2015.
 * home.module -
 */
angular.module('agile.home', [
  'agile.config',
  'agile.config.path',

  'agile.models.user',
  'agile.models.issue',

  'agile.services.user',
  'agile.services.issue'
]);
