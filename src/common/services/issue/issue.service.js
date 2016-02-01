/**
 * Created 12/11/2015.
 *
 * issue.service
 */
angular.module('agile.services.issue', [
  'agile.config.path',
  'agile.models.apiError',
  'agile.models.issue'
])
  .constant("issueTypes", {
    "test": "11200",
    "story": "7",
    "technicalTask": "8",
    "epic": "6"
  })
  .service('IssueService',
  function($q, $http, Issue, ApiError, issueTypes, ENVIRONMENT) {
    'use strict';

    /**
     * @class issueService
     *
     **/

    /**
     *
     * @param {String} query
     * @returns {Array} An array of Issues
     */
    var getIssueList = function(query) {
      var defer = $q.defer();

      var url = ENVIRONMENT.API_PATH + "search?jql=" + query +
        "&maxResults=100&fields=timetracking,customfield_12106,description,summary,assignee,issuetype,parent,customfield_10008,status";

      var req = {
        method: 'GET',
        url: url,
        isArray: false
      };

      $http(req).then(
        function(response) {
          var issueList = [];
          _.each(response.data.issues, function(issue) {
            issue = new Issue(issue);
            if (issue.type != issueTypes.test) {
              issueList.push(issue);
            }
          });
          var orderedList = orderList(issueList);
          defer.resolve(orderedList);
        },
        // error
        function(data, status, headers, config) {
          defer.reject(new ApiError(data, status, headers, config));
        }
      );

      return defer.promise;
    };

    /**
     *
     * @param {Array} issueList
     * @returns {Array} An array of issue objects, which themselves may contain
     * children issues
     */
    var orderList = function(issueList) {
      var epics = issueList.filter(function(e) {
        return e.type == issueTypes.epic;
      });
      var stories = issueList.filter(function(e) {
        return e.type == issueTypes.story;
      });
      var tasks = issueList.filter(function(e) {
        return e.type == issueTypes.technicalTask;
      });

      _.each(tasks, function(task, key) {
        var parentStories = stories.filter(function(e) {
          return e.key == task.parentKey;
        });
        if (parentStories.length > 0) {
          parentStories[0].addChild(task);
          task.flagged = true;
        }
      });

      _.each(stories, function(story, key) {
        var parentEpics = epics.filter(function(e) {
          return e.key == story.epicKey;
        });
        if (parentEpics.length > 0) {
          parentEpics[0].addChild(story);
          story.flagged = true;
        }
      });

      tasks = tasks.filter(function(e) {
        return e.flagged === false;
      });

      stories = stories.filter(function(e) {
        return e.flagged === false;
      });

      var orderedList = epics.concat(stories).concat(tasks);

      return orderedList;
    };

    return {
      getIssueList: getIssueList
    };
  });
