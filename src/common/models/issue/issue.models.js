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
      this.timeEstimate = (issue.fields.customfield_12106 === null) ? "N/A" :
        issue.fields.customfield_12106;
      this.description = issue.fields.description;
      this.summary = issue.fields.summary;
      this.assignee =
        (issue.fields.assignee === null) ?
          new User({displayName: "Not assigned"}) :
          new User(issue.fields.assignee);
      this.icon = issue.fields.issuetype.iconUrl;
      this.type = issue.fields.issuetype.id;
      this.children = [];
      this.parentKey =
        (issue.fields.parent !== undefined) ? issue.fields.parent.key : null;
      this.epicKey = issue.fields["customfield_10008"];
      this.flagged = false;
      this.remEstimate =
        (issue.fields.timetracking !== undefined) ?
          issue.fields.timetracking.remainingEstimate : "N/A";
    };

    /**
     * Adds a child issue to this issue's children array.
     * @param {Issue} child
     */
    Issue.prototype.addChild = function(child) {
      var vm = this;
      vm.children.push(child);
    };

    return Issue;
  });
