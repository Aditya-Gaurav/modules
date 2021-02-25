'use strict';

// Setting up route
angular.module('infinidat-storageunits').config(['$stateProvider',
  function ($stateProvider) {
    // infinidat-storageunits state routing
    $stateProvider
      .state('infinidat-storageunits', {
        abstract: true,
        url: '/infinidat-storageunits',
        template: '<ui-view/>'
      })
      .state('infinidat-storageunits.list', {
        url: '',
        templateUrl: 'modules/infinidat-storageunits/client/views/list-infinidat-storageunits.client.view.html',
        controller: 'InfinidatStorageunitsController',
        data: {
          roles: featuresSettings.roles.infinidatStorageunit.list,
          parent: 'storagemanagement',
          parentstate: 'infinidat-storageunits'
        }
      })
      .state('infinidat-storageunits.create', {
        url: '/create',
        templateUrl: 'modules/infinidat-storageunits/client/views/create-infinidat-storageunit.client.view.html',
        data: {
          roles: featuresSettings.roles.infinidatStorageunit.create,
          parent: 'storagemanagement',
          parentstate: 'infinidat-storageunits'
        }
      })
      .state('infinidat-storageunits.view', {
        url: '/:infinidatStorageunitId',
        templateUrl: 'modules/infinidat-storageunits/client/views/view-infinidat-storageunit.client.view.html',
        data: {
          roles: featuresSettings.roles.infinidatStorageunit.read,
          parent: 'storagemanagement',
          parentstate: 'infinidat-storageunits'
        }
      })
      .state('infinidat-storageunits.edit', {
        url: '/:infinidatStorageunitId/edit',
        templateUrl: 'modules/infinidat-storageunits/client/views/edit-infinidat-storageunit.client.view.html',
        data: {
          roles: featuresSettings.roles.infinidatStorageunit.update,
          parent: 'storagemanagement',
          parentstate: 'infinidat-storageunits'
        }
      })      
      .state('infinidat-storageunits.fix', {
        url: '/:infinidatStorageunitId/fix',
        templateUrl: 'modules/infinidat-storageunits/client/views/fix-infinidat-storageunit.client.view.html',
        data: {
          roles: ['root'],
          parent: 'storagemanagement',
          parentstate: 'infinidat-storageunits'
        }
      });
  }
]);
