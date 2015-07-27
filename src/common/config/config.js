/**
 * Created by mike on 6/1/2014.
 */
angular.module('agile.config', [])

  .constant('States', {
    home: {
      default: 'agile.home'
    },
    app: {
      default: 'agile'
    },
    featureA: {
      default: 'agile.featureA'
    }
  });
