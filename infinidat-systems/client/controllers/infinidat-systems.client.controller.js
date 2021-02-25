'use strict';

// Pods controller
angular.module('infinidat-systems').controller('InfinidatSystemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'InfinidatSystems', 'Applications', 'modalService', 'Flash', '$sanitize',
  function ($scope, $stateParams, $location, Authentication, InfinidatSystems, Applications, modalService, Flash, $sanitize) {
    $scope.authentication = Authentication;
    $scope.infinidatSystemAccessRoles = featuresSettings.roles.infinidatSystem;
    $scope.applicationsList = Applications.query()
    
    var flashTimeout = 3000;
    
    function throwFlashErrorMessage(message) {
      var errMsg = message;
      //If error Message is a list of errors (object), show only the first error
      if(typeof message === 'object'){
        errMsg = message[Object.keys(message)[0]];
      }
      if (angular.element(document.getElementsByClassName("alert-danger")).length === 0) {
        Flash.create('danger', '<strong ng-non-bindable>' + $sanitize(errMsg) + '</strong>', flashTimeout, { class: '', id: '' }, true);
      }
    }

    // Create new system
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'systemForm');

        return false;
      }

      // Create new system object
      var infinidatSystem = new InfinidatSystems({
        name: $sanitize(this.name),
        wwn: $sanitize(this.wwn),
        rest_url_ip: $sanitize(this.rest_url_ip),
        provisioning_state: $sanitize(this.provisioning_state),
        applications: this.applications
      });
      // Redirect after save
      infinidatSystem.$create(function (response) {
        $location.path('infinidat-systems');
        Flash.create('success', '<strong ng-non-bindable>Successfully created the infinidat System!</strong>', 3000, { class: '', id: '' }, true);

        // Clear form fields
        $scope.name = '';
        $scope.wwn = '';
        $scope.rest_url_ip = '';
        $scope.provisioning_state = '';
        $scope.rest_uri = '';
      }, function (errorResponse) {
        throwFlashErrorMessage(errorResponse.data.message); 
      });
    };

    // Remove existing system
    $scope.remove = function (infinidatSystem) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete Infinidat system?',
        bodyText: ['Are you sure you want to delete this Infinidat system?']
      };
      modalService.showModal({}, modalOptions).then(function (result) {
        if (infinidatSystem) {
          infinidatSystem.$remove(function (response) {
            $location.path('infinidat-systems');
            Flash.create('success', '<strong ng-non-bindable>Successfully Deleted the infinidat system!</strong>', 3000, { class: '', id: '' }, true);
          }, function (errorResponse) {
            throwFlashErrorMessage(errorResponse.data.message);           
          });

          for (var i in $scope.infinidatSystem) {
            if ($scope.infinidatSystem[i] === infinidatSystem) {
              $scope.infinidatSystem.splice(i, 1);
            }
          }
        }
      });
    };

    // Update existing system
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'systemForm');

        return false;
      }

      var system = $scope.system;
      console.log("this.applications", this.applications);
      system.applications = this.applications;

      // console.log("$scope.system", infinidatSystem);return;


      system.$update({
        infinidatSystemId: $stateParams.infinidatSystemId

      },function () {
        $location.path('infinidat-systems');
        Flash.create('success', '<strong ng-non-bindable>Successfully updated the infinidat system!</strong>', 3000, { class: '', id: '' }, true);
      }, function (errorResponse) {
        console.log(errorResponse.data);
        throwFlashErrorMessage(errorResponse.data.message); 
      });
    };

    // Find a list of systems
    $scope.find = function () {
      $scope.infinidatSystems = InfinidatSystems.query();
    };

    // Find existing system
    $scope.findOne = function () {
      InfinidatSystems.get({
        infinidatSystemId: $stateParams.infinidatSystemId
      }, function(data) {
        $scope.system = data;
        var applicationList = [];
        data.applications.forEach(function(app) {
          applicationList.push(app._id)
        });
        $scope.applications = applicationList;
      }, function(error){
        $location.path('infinidat-systems');
        throwFlashErrorMessage('No infinidat system with that identifier has been found');
      });
    };
  }
]);
