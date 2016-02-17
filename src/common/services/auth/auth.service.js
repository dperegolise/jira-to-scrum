/**
 * Created 12/11/2015.
 *
 * user.service
 */
angular.module('agile.services.auth', [
  'agile.config.path',
  'agile.models.apiError',
  'agile.models.user'
])
  .service('AuthService', function($q, $http, User, ApiError, ENVIRONMENT) {
    'use strict';

    /**
     * @class authService
     *
     **/

    /**
     *
     * @returns boolean
     */
    var isAuthenticated = function() {
      var defer = $q.defer();

      var url = ENVIRONMENT.API_ROOT + "auth/1/session";

      var req = {
        method: 'GET',
        url: url,
        isArray: false
      };

      $http(req).then(
        function(response) {
          defer.resolve(response.status == 200);
        },
        // error
        function(data) {
          if(data.status == 401) {
            defer.resolve(false);
          } else {
            defer.reject(new ApiError(data));
          }
        }
      );

      return defer.promise;
    };

    return {
      isAuthenticated: isAuthenticated
    };
  });
