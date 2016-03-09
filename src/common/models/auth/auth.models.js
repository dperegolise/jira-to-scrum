/**
 * Created by daniel.peregolise on 3/8/2016.
 */
angular.module('agile.models.auth', [

])
  .factory('Auth', function() {
    'use strict';

    /**
     * @class
     * @constructor
     *
     */
    var Auth = function(auth) {
      this.username = auth.username;
      this.password = auth.password;
    };

    return Auth;
  });
