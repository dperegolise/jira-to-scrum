/**
 * Created by mike on 7/18/2015.
 * home.module -
 */
angular.module('agile.auth', [
  'agile.home',
  'agile.config',
  'agile.config.path',

  'agile.models.auth',
  'agile.models.user',
  'agile.models.issue',

  'agile.services.user',
  'agile.services.issue',
  'agile.services.auth'
]);
