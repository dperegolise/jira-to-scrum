/**
 * Created 8/4/2015.
 *
 * apiError.models
 */
angular.module('agile.models.apiError', [])
  .factory('ApiError', function() {

    /***
     * @class ApiError
     *
     * @constructor
     */
    var ApiError = function(data) {
      if (angular.isObject(data)) {
        this.data = null;
        this.statusText = null;
        this.status = 0;
        if (data.data) {
          this.data = data.data;
          this.statusText = data.statusText;
          this.status = data.status;
        }

      } else {
        this.data = data;
        this.status = data.status;
      }

    };

    /**
     * @property message
     * @returns {string}
     */
    Object.defineProperty(ApiError.prototype, 'message', {
      get: function() {
        var vm = this;
        var message = vm.data ? 'Error: ' + JSON.stringify(vm.data) : '';
        switch (vm.status) {
          case -1:
            message += 'Unknown error or timeout';
            break;
          case 401:
            message += 'Invalid or expired credentials';
            break;
          case 404:
            message += 'Not found';
            break;
          default:
            message += 'Unclassified error ' + vm.status;
            break;
        }
        return message;
      },
      enumerable: true
    });

    return ApiError;
  });
