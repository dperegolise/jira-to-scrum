/**
 * Created 12/11/2015.
 * Copyright 2015 Focus Technologies
 * issue.service
 */
angular.module('agile.services.issue', [
  'agile.models.apiError',
  'agile.models.issue'
])
  .service('IssueService', function($q, $http, Issue, ApiError) {
    'use strict';

    /**
     * @class issueService
     *
     **/


    var getIssueList = function(query) {
      var defer = $q.defer();

      var url = "https://focustech.atlassian.net/rest/api/2/search?jql=" + query;

      var req = {
        method: 'GET',
        url: url,
        isArray: false
      };

      $http(req).then(
        function(response) {
          var issueList = [];
          _.each(response.data.issues, function(issue) {
            issueList.push(new Issue(issue));
          });
          defer.resolve(issueList);
        },
        // error
        function(data, status, headers, config) {
          defer.reject(new ApiError(data, status, headers, config));
        }
      );

      return defer.promise;
    };


    return {
      getIssueList: getIssueList
    };
  });
