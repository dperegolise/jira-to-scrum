/**
 * Created by michael.cooper on 11/20/2014.
 * @see http://bitoftech.net/2014/06/09/angularjs-token-authentication-using-asp-net-web-api-2-owin-asp-net-identity/
 */

angular.module(
  'agile.interceptors.interceptor', [
    'agile.config',
    'LocalStorageModule'
  ]
)

  .factory(
  'interceptorService',
  function( $location, $q, $window, $log) {
    'use strict';

    /**
     * @private cache buster
     *  ignores html files
     * @param {string} url
     * @returns {string}
     */
    function cacheBuster(url) {
      if (url.indexOf('.html') > 0) {
        $log.info('template: ' + url);
        return url;
      }

      var args = url.indexOf('?');

      var stamp = 'stamp=' + new Date().getTime();

      return (args > 0) ?
      url + '&' + stamp :
      url + '?' + stamp;
    }

    var _request = function(config) {
      // bypass local

      if (config.url.indexOf('http') !== 0) {
        return config;
      }
      //bypass auth setting
      if (config.url.indexOf('/auth') > 0) {
        return config;
      }

      config.headers = config.headers || {};

      // cache buster
      if (config.method === 'GET' && !config.cache) {
        config.url = cacheBuster(config.url);
      }



      return config;
    };


    return {
      request: _request,

    };
  }
)
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('interceptorService');
  }
);
