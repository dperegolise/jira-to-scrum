/**
 * Created by mike on 7/20/2015.
 * featureA.model -
 */
angular.module('agile.featureA')
  .factory('FeatureA', function() {

    /**
     * @class FeatureA
     * @constructor
     *
     * @property {string} firstName - feature's first name
     * @property {string} lastName  - feature's last name
     */
    var FeatureA = function() {
      this.firstName = '';
      this.lastName = '';
    };

    /**
     * @method fromDTO - convert dto object to view model
     * @param {object} dto
     */
    FeatureA.prototype.fromDTO = function(dto) {
      var vm = this;
      vm.firstName = dto.firstName;
      vm.lastName = dto.lastName;
    };

    /**
     * @method fullName
     * @return {string}
     */
    Object.defineProperty(FeatureA.prototype, 'fullName', {
      get: function() {
        var vm = this;
        return vm.firstName + vm.lastName;
      },
      enumerable: true
    });

    /**
     * @method toDTO - re-shape to dto object
     * @returns {object}
     */
    FeatureA.prototype.toDTO = function() {
      var vm = this;
      return {
        firstName: vm.firstName,
        lastName: vm.lastName
      };

    };

    return FeatureA;

  });
