'use strict';

angular.module('infinidat-systems').controller('InfinidatSystemsListController', ['$scope', '$filter', 'Authentication', 'InfinidatSystems', 'NgTableParams',
  function ($scope, $filter, Authentication, InfinidatSystems, NgTableParams) {

    $scope.authentication = Authentication;
    $scope.infinidatSystemAccessRoles = featuresSettings.roles.infinidatSystem;
    $scope.rowsToDisplay = function () {
      $scope.tableParams = new NgTableParams({
        count: 10,              // count per page
        sorting: { name: 'asc' }  // initial sorting
      }, {
        counts: [],
        getData: function($defer, params) {
          InfinidatSystems.query(function (data) {
            $scope.infinidatSystems = data;
            var filteredData = $filter('filter')($scope.infinidatSystems, function(data) {    
              if ($scope.search) {
                return ((data.name) ? data.name.toString().toLowerCase().indexOf($scope.search.toLowerCase()): '-1') > -1 || 
                       ((data.wwn) ? data.wwn.toString().toLowerCase().indexOf($scope.search.toLowerCase()): '-1') > -1 ||
                       ((data.management_ip) ? data.management_ip.toString().toLowerCase().indexOf($scope.search.toLowerCase()): '-1') > -1 ||
                       ((data.ssid) ? data.ssid.toString().toLowerCase().indexOf($scope.search.toLowerCase()): '-1') > -1 ||
                       ((data.rest_url) ? data.rest_url.toString().toLowerCase().indexOf($scope.search.toLowerCase()): '-1') > -1 ;
              } else {
                return true;
              }
            });
            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
            params.total(orderedData.length);
              $scope.zeroRecords = false;
            if (orderedData.length === 0) {
              $scope.zeroRecords = true;
            } 
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
    };     
  }
]);
