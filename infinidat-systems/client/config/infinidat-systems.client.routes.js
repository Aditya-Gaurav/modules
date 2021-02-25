'use strict';

// Setting up route
angular.module('infinidat-systems').config(['$stateProvider',
  function ($stateProvider) {
    // systems state routing
    $stateProvider
      .state('infinidat-systems', {
        abstract: true,
        url: '/infinidat-systems',
        template: '<ui-view/>'
      })
      .state('infinidat-systems.list', {
        url: '',
        templateUrl: 'modules/infinidat-systems/client/views/list-infinidat-systems.client.view.html',
        controller: 'InfinidatSystemsListController',
        data: {
          roles: featuresSettings.roles.infinidatSystem.list,
          parent: 'administration',
          parentstate: 'infinidat-systems'
        }
      })
      .state('infinidat-systems.create', {
        url: '/create',
        templateUrl: 'modules/infinidat-systems/client/views/create-infinidat-system.client.view.html',
        data: {
          roles: featuresSettings.roles.infinidatSystem.create,
          parent: 'administration',
          parentstate: 'infinidat-systems'
        }
      })
      .state('infinidat-systems.view', {
        url: '/:infinidatSystemId',
        templateUrl: 'modules/infinidat-systems/client/views/view-infinidat-system.client.view.html',
        data: {
          roles: featuresSettings.roles.infinidatSystem.read,
          parent: 'administration',
          parentstate: 'infinidat-systems'
        }
      })
      .state('infinidat-systems.edit', {
        url: '/:infinidatSystemId/edit',
        templateUrl: 'modules/infinidat-systems/client/views/edit-infinidat-system.client.view.html',
        data: {
          roles: featuresSettings.roles.infinidatSystem.update,
          parent: 'administration',
          parentstate: 'infinidat-systems'
        }
      });
  }
]);
