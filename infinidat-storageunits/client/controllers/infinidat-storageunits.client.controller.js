'use strict';

// Storage units controller

angular.module('infinidat-storageunits')
	.controller('InfinidatStorageunitsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'InfinidatStorageunits', 'OntapServers', 'InfinidatSystems', 'Flash', 'modalService', '$sanitize', 'Tags', 'Applications',
  function ($scope, $stateParams, $location, $http, Authentication, InfinidatStorageunits, Servers, InfinidatSystems, Flash, modalService, $sanitize, Tags, Applications) {
    $scope.authentication = Authentication;   
    $scope.hostTypes = [];
    $scope.workloads = [];
    $scope.storagePools = [];
    $scope.existingHosts = [];
    $scope.existingHostNames = [];
    $scope.existingClusters = [];
    $scope.applicationId = '';
    $scope.labels = featuresSettings.labels;
    $scope.SUAccessRoles = featuresSettings.roles.infinidatStorageunit;
    $scope.applications = Applications.query();
    $scope.port_info = [{}];


    $scope.portPattern = /^((?:iqn\.[0-9]{4}-[0-9]{2}(?:\.[A-Za-z](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)+(?::[^,:]*)?)|(eui\.[0-9A-Fa-f]{16}))+(?:,((?:iqn\.[0-9]{4}-[0-9]{2}(?:\.[A-Za-z](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)+(?::[^,:]*)?)|(eui\.[0-9A-Fa-f]{16}))+)*$/
    $scope.serverName = "";
    $scope.clusterName = "";
    
    $scope.validProtocolsToAssign = ["fc", "iscsi"];
    $scope.validTargetsToAssign = ["host","cluster"] //"group" 
    
   
    $scope.isRoot = Authentication.user.roles.indexOf('root') !== -1;
    $scope.isL1ops = Authentication.user.roles.indexOf('l1ops') !== -1;
    $scope.isAdmin = Authentication.user.roles.indexOf('admin') !== -1;
    $scope.isUser = Authentication.user.roles.indexOf('user') !== -1;

    $scope.showDrEnabledCheckBox = false;


    var flashTimeout = 3000;

    function throwFlashErrorMessage(message) {
			var errMsg;
			//If error Message is a list of errors (object), show only the first error
			if(typeof message === 'object'){
				errMsg = message[Object.keys(message)[0]];
			} else {
				errMsg = message;
			}
      if (angular.element(document.getElementsByClassName("alert-danger")).length === 0) {
        Flash.create('danger', '<strong ng-non-bindable>' + $sanitize(errMsg) + '</strong>', flashTimeout, { class: '', id: '' }, true);
      }
    }

    $scope.genrateStorageName = function() {
      if(this.name != undefined) {
        this.code = this.name.replace(/[\s|-]+/ig, "_")
      } else {
        this.code = '';
      }
    }
    
    $scope.populateSystems = function(application) {
      $scope.systems = [];
      var systems = InfinidatSystems.query();
      systems.$promise.then(function(results) {
        if (!application) {
          $scope.systems = systems;
        } else {
          angular.forEach(systems, function(system) {
            if (system.applications.length > 0  && system.applications.includes(application)) {

              $scope.systems.push(system);
            }
          });
          if($scope.systems.length == 0){
            resetFormFields();
          }
        }        
        // callback();
      });
    }
 
    //Reset the the form fields if selected application has no system data
    function resetFormFields() {
      $scope.workload = '';
      $scope.storagePool = '';
      $scope.mapping = '';
      $scope.targetName = '';
      $scope.targetType = '';
      $scope.existingHost = '';
      $scope.existingCluster = '';
      $scope.protocol = '';
      $scope.hostType = '';
      $scope.hostName = '';
      $scope.portName = '';

    }

    $scope.addPort = function() {
      $scope.port_info.push({});
    }

    $scope.removePort = function(index) {
      $scope.port_info.splice(index, 1);
    }

    var preparePortInfoObjectFromScope = function(scopePorts) {
      var port_info = [];
      angular.forEach(scopePorts, function(portDetail) {
        var obj = {};
        obj['label'] = portDetail.label;
        obj['port'] = portDetail.port
        port_info.push(obj)
      });

      return port_info;
    }

    $scope.checkboxChanged = function() {
      if ($scope.dr_enabled && $scope.serverName != "" && $scope.clusterName != "") {
        //query DB and get the peer relations
        var peers = InfinidatStorageunits.getPeers({"vserverName":$scope.serverName, "clusterName":$scope.clusterName});
        peers.$promise.then(function(results) {
          $scope.peers = results;
          if(results.length == 1) {
            $scope.destinationCluster = results[0]['peerCluster'];
            $scope.destinationVserver = results[0]['peerVserver']
          }
        });
      }
    }

    // watchers to check the update of value and preselect the dropdown if only one value is present
    
    $scope.$watch("applicationId", function(newVal, oldVal) {
      if (newVal) {
        $scope.populateSystems(newVal, function() {
          if($scope.systems.length === 1){
            $scope.infinidatSystemId = $scope.systems[0].infinidatSystemId;
          }
        });  
      }        
    });

    $scope.$watch("infinidatSystemId", function(newVal, oldVal) {
      if (newVal) {
        angular.forEach($scope.systems, function(systemDetail) {
          if (systemDetail.infinidatSystemId && systemDetail.infinidatSystemId === newVal) {
            $scope.hostTypes = systemDetail.host_type;
            if ($scope.hostTypes.length == 1) {
              $scope.hostType = $scope.hostTypes[0].name
            }

            $scope.storagePools = systemDetail.storage_pool;  
            if ($scope.storagePools.length == 1) {
              $scope.storagePool = $scope.storagePools[0].name
            }

            $scope.existingHostNames = systemDetail.hosts;
            if ($scope.workloads.length == 1) {
              $scope.existingHostName = $scope.hosts[0].name
            }
            
            $scope.existingHosts = systemDetail.hosts;
            if ($scope.existingHosts.length == 1) {
              $scope.existingHost = $scope.existingHosts[0].name;
            } 

            $scope.existingClusters = systemDetail.host_clusters;
            if ($scope.existingClusters.length == 1) {
              $scope.existingCluster = $scope.existingClusters[0].name
            }

          }
        });
      }        
    });





    $scope.$watch("protocol", function(newVal, oldVal) {
      if (newVal) {
        if (newVal == "iscsi") {
          // $scope.portPattern = /^((?:iqn\.[0-9]{4}-[0-9]{2}(?:\.[A-Za-z](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)+(?::[^,:]*)?)|(eui\.[0-9A-Fa-f]{16}))$/
          $scope.portPattern = /((, )?(^)?(((?:iqn\.[0-9]{4}-[0-9]{2}(?:\.[A-Za-z](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)+(?::[^,:]*)?)|(eui\.[0-9A-Fa-f]{16}))))/g;
          $scope.portPatternError = "Invalid port.  e.g. iqn.1992-05.com.microsoft:servername"
        } else {
          // $scope.portPattern = /(([0-9]{2}):([0-9]{2}):([0-9]{2}):([0-9]{2}):([0-9]{2}):([0-9]{2}))$/
          $scope.portPattern = /((, )?(^)?(([0-9]{2}):([0-9]{2}):([0-9]{2}):([0-9]{2}):([0-9]{2}):([0-9]{2})))/g
          $scope.portPatternError = "Invalid port.  e.g. 10:00:00:00:56:78"
        }
      }        
    });

    function formatPortInfoData(portInfoData){
      var portInfoArray = portInfoData.split(/\s*,\s*/).filter(function(str) {
        return /\S/.test(str);
      });

      return portInfoArray;
    }

    $scope.selectedTargetType = function(targetName) {
      if($scope.targetName != targetName) {
         this.existingHost = null;
      }
      $scope.targetName = targetName;
    }

    $scope.initUpdate = function(acl) {
      InfinidatStorageunits.get({
        infinidatStorageunitId: $stateParams.infinidatStorageunitId
      }, function(storageunit) {
          $scope.storageunit = storageunit;
          $scope.aclArray = $scope.storageunit.acl.split(',');
      });
    };

    $scope.initialize = function() {
      // $scope.mapping = "existing"
    }
  	$scope.create = function(isValid) {
		 	if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'storageunitForm');
        return false;
      }


      var port_info = preparePortInfoObjectFromScope(this.port_info);
      
      // Create new storage unit object
      var storageunit = new InfinidatStorageunits({
        name: $sanitize(this.name),
        code: $sanitize(this.code),
        infinidatSystem: $sanitize(this.infinidatSystemId),
        // workload: $sanitize(this.workload),
        storagePool: $sanitize(this.storagePool),
        sizegb: this.sizegb,
        applicationId: $sanitize(this.applicationId),        
        mapping: this.mapping,
        hostName: $sanitize(this.hostName)
        // lunId: $sanitize(this.lunId)
      });
      

      if(this.mapping == "new") {
        storageunit.protocol= $sanitize(this.protocol);
        
        if(storageunit.protocol == 'fc'){
          storageunit.wwns = ($sanitize(this.wwns)).split(','); 
        }
        else{
          storageunit.iqns = ($sanitize(this.iqns)).split(','); 
        }
      }

      if(this.mapping == "existing") {
        storageunit.targetType = $sanitize(this.targetType);
        storageunit.hostName =  (this.targetName == 'host') ? $sanitize(this.existingHost) : $sanitize(this.existingCluster)
      }
      //Redirect to list page after save
      console.log('storageunit', storageunit);
      storageunit.$create(function (response) {
        $location.path('infinidat-storageunits');
        Flash.create('success', '<strong ng-non-bindable>Submitted the Storage Unit Create request.<br>Please wait for the Status to change to Operational.</strong>', 10000, { class: '', id: '' }, true);

        // Clear form fields
        $scope.name = '';
        $scope.code = '';
        $scope.sizegb = '';
        $scope.infinidatSystem = '';
        $scope.protocol = '';
        // $scope.workload = '';
        // $scope.lunId = '';
        // $scope.portName = '';
        // $scope.existingHost = '';
        // $scope.existingClusters = '';
        storageunit.mapping = "";
        storageunit.storagePool = "";
        storageunit.targetType = "";

      }, function (errorResponse) {
        throwFlashErrorMessage(errorResponse.data.message);
      });
  	};

    // get the details of storage unit
    $scope.findOne = function () {
      InfinidatStorageunits.get({
        infinidatStorageunitId: $stateParams.infinidatStorageunitId
      }, function(data) {
        $scope.storageunit = data;
        $scope.freshTag = false;
        // var acl_array = data.acl.split(',');        
        // $scope.acl_array = acl_array.length >= 1 ? acl_array : [];
        // if(acl_array.length === 1 && !$scope.storageunit.aclRemove && acl_array[0] !==''){
        //   $scope.storageunit.aclRemove = acl_array[0];
        // }
      
      }, function(error) {
        $location.path('infinidat-storageunits');
        throwFlashErrorMessage('No storage unit with that identifier has been found');
      });

       $http.get('api/lookups/suStatus')
        .then(function(response) {
          $scope.validStatusToAssign = response.data;
      });
    };

     // Update existing Storage unit
    $scope.update = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'storageunitForm');
        return false;
      }
      var storageunit = $scope.storageunit;
      // var port_info = prepareTagsObjectFromScope(this.port_info);
      storageunit.sizegb = this.sizegb;
      
      storageunit.$update({
        infinidatStorageunitId: $stateParams.infinidatStorageunitId
      },function () {
        $location.path('infinidat-storageunits');
        Flash.create('success', '<strong ng-non-bindable>Submitted the infinidat Storageunit volume expansion Update request.<br>Please wait for the Status to return to Operational.</strong>', 10000, { class: '', id: '' }, true);
      }, function (errorResponse) {
        throwFlashErrorMessage(errorResponse.data.message);
      });
    };

    // Remove existing Storage Unit
    $scope.remove = function (storageunit) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete Storage Unit?',
        bodyText: ['Are you sure you want to delete the Storage Unit?']
      };
      modalService.showModal({}, modalOptions).then(function (result) {
        if (storageunit) {
          storageunit.$remove(function (response) {
            $location.path('storageunits');
            Flash.create('success', '<strong ng-non-bindable>Submitted the Storage Unit Delete request.<br>Please wait for the object to be removed from the list.</strong>', 10000, { class: '', id: '' }, true);
          }, function (errorResponse) {
            throwFlashErrorMessage(errorResponse.data.message);
          });

          for (var i in $scope.storageunits) {
            if ($scope.storageunits[i] === storageunit) {
              $scope.storageunits.splice(i, 1);
            }
          }
        }
      });
    };

    // Find a list of Storagegroups
    $scope.find = function () {
      //$scope.servers = Servers.query();
    };


    //Fix to be applied by root (managed services)
    $scope.fix = function () {
      var storageunit = $scope.storageunit;
      storageunit.fromFix = "true";
      storageunit.$update({
        infinidatStorageunitId: $stateParams.infinidatStorageunitId
      },function () {
        $location.path('infinidat-storageunits');
        Flash.create('success', '<strong ng-non-bindable>Successfully fixed the Storagegroup!</strong>', 10000, { class: '', id: '' }, true);
      }, function (errorResponse) {
        throwFlashErrorMessage(errorResponse.data.message);
      });
    };

    //Fix to be applied by root (managed services)
    // $scope.fix = function () {
    //   var storageunit = $scope.storageunit;  
    //   storageunit.fromFix = "true";
    //   storageunit.$update(function () {
    //     $location.path('storageunits');
    //     Flash.create('success', '<strong>Successfully fixed the Storage Unit!</strong>', 10000, { class: '', id: '' }, true);
    //   }, function (errorResponse) {
    //     Flash.create('danger', '<strong>' + errorResponse.data.message + '</strong>', 10000, { class: '', id: '' }, true);
    //   });
    // };

  }]);
