/**
 * Created by michael.cooper on 8/4/2015.
 */
angular.module('agile.models.issue', [
  'agile.models.user'
])
  .factory('Issue', function(User) {
    'use strict';

    /**
     * @class
     * @constructor
     *
     */
    var Issue = function(issue) {
      this.self = issue.self;
      this.key = issue.key;
      this.timeEstimate = issue.fields.timeestimate;
      this.description = issue.fields.description;
      this.summary = issue.fields.summary;
      this.assignee =
        (issue.fields.assignee === null) ? new User({displayName:"Not assigned"}) :
          new User(issue.fields.assignee);
      this.icon = issue.fields.issuetype.iconUrl;
    };

    return Issue;
  });
