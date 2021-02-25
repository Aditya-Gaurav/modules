'use strict';

// Setting up route
angular.module('ontap-storageunits').config(['$stateProvider',
  function ($stateProvider) {
    // ontap-storageunits state routing
    $stateProvider
      .state('ontap-storageunits', {
        abstract: true,
        url: '/ontap-storageunits',
        template: '<ui-view/>'
      })
      .state('ontap-storageunits.list', {
        url: '',
        templateUrl: 'modules/ontap-storageunits/client/views/list-ontap-storageunits.client.view.html',
        controller: 'OntapStorageunitsListController',
        data: {
          roles: featuresSettings.roles.ontapStorageunit.list,
          parent: 'storagemanagement',
          parentstate: 'ontap-storageunits'
        }
      })
      .state('ontap-storageunits.create', {
        url: '/create',
        templateUrl: 'modules/ontap-storageunits/client/views/create-ontap-storageunit.client.view.html',
        data: {
          roles: featuresSettings.roles.ontapStorageunit.create,
          parent: 'storagemanagement',
          parentstate: 'ontap-storageunits'
        }
      })
      .state('ontap-storageunits.view', {
        url: '/:ontapStorageunitId',
        templateUrl: 'modules/ontap-storageunits/client/views/view-ontap-storageunit.client.view.html',
        data: {
          roles: featuresSettings.roles.ontapStorageunit.read,
          parent: 'storagemanagement',
          parentstate: 'ontap-storageunits'
        }
      })
      .state('ontap-storageunits.edit', {
        url: '/:ontapStorageunitId/edit',
        templateUrl: 'modules/ontap-storageunits/client/views/edit-ontap-storageunit.client.view.html',
        data: {
          roles: featuresSettings.roles.ontapStorageunit.update,
          parent: 'storagemanagement',
          parentstate: 'ontap-storageunits'
        }
      })      
      .state('ontap-storageunits.fix', {
        url: '/:ontapStorageunitId/fix',
        templateUrl: 'modules/ontap-storageunits/client/views/fix-ontap-storageunit.client.view.html',
        data: {
          roles: ['root'],
          parent: 'storagemanagement',
          parentstate: 'ontap-storageunits'
        }
      });
  }
]);
