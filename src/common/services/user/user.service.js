/**
 * Created 12/11/2015.
 * Copyright 2015 Focus Technologies
 * user.service
 */
angular.module('agile.services.user', [
  'agile.models.apiError',
  'agile.models.user'
])
  .service('UserService', function($q, $http, User) {
    'use strict';

    /**
     * @class userService
     *
     **/

    /**
     *
     * @param userName
     * @returns {*|jQuery.promise|Function|promise.promise|deferred.promise|{then,
     *   catch, finally}}
     */
    var getUser = function(userName) {
      var defer = $q.defer();

      var url = "https://focustech.atlassian.net/rest/api/2/user?username=" + userName;

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
        function(data, status, headers, config) {
          defer.reject(new ApiError(data, status, headers, config));
        }
      );

      return defer.promise;
    };


    return {
      getUser: getUser
    };
  });
