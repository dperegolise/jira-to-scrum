/**
 * Created by michael.cooper on 8/4/2015.
 */
angular.module('agile.models.user', [

])
  .factory('User', function() {
    'use strict';

    /**
     * @class
     * @constructor
     *
     */
    var User = function(user) {
      this.self = user.self;
      this.name = user.name;
      this.emailAddress = user.emailAddress;
      this.avatarUrls = user.avatarUrls;
      this.displayName = user.displayName;
      this.active = user.active;
      this.timeZone = user.timeZone;
    };

    return User;
  });
