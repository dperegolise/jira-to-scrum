/**
 * Created 12/11/2015.
 *
 * user.service
 */
angular.module('agile.services.user', [
  'agile.config.path',
  'agile.models.apiError',
  'agile.models.user'
])
  .service('UserService', function($q, $http, User, ApiError, ENVIRONMENT) {
    'use strict';

    /**
     * @class userService
     *
     **/

    /**
     *
     * @param {String} userName
     * @returns {User}
     */
    var getUser = function(userName) {
      var defer = $q.defer();

      var url = ENVIRONMENT.API_2_PATH + "user?username=" + userName;

      var req = {
        method: 'GET',
        url: url,
        isArray: false
      };

      $http(req).then(
        function(response) {
          defer.resolve(new User(response.data));
        },
        // error
        function(data) {
          defer.reject(new ApiError(data));
        }
      );

      return defer.promise;
    };

    return {
      getUser: getUser
    };
  });
