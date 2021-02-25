'use strict';

// Setting up route
angular.module('ontap-servers').config(['$stateProvider',
  function ($stateProvider) {
    // Servers state routing
    $stateProvider
      .state('ontap-servers', {
        abstract: true,
        url: '/ontap-servers',
        template: '<ui-view/>'
      })
      .state('ontap-servers.list', {
        url: '',
        templateUrl: 'modules/ontap-servers/client/views/list-ontap-servers.client.view.html',
        controller: 'OntapServerListController',
        data: {
          roles: featuresSettings.roles.server.list,
          parent: 'storagemanagement',
          parentstate: 'ontap-servers'
        }
      })
      .state('ontap-servers.create', {
        url: '/create',
        templateUrl: 'modules/ontap-servers/client/views/create-ontap-server.client.view.html',
        data: {
          roles: featuresSettings.roles.server.create,
          parent: 'storagemanagement',
          parentstate: 'ontap-servers'
        }
      })
      .state('ontap-servers.view', {
        url: '/:ontapServerId',
        templateUrl: 'modules/ontap-servers/client/views/view-ontap-server.client.view.html',
        data: {
          roles: featuresSettings.roles.server.read,
          parent: 'storagemanagement',
          parentstate: 'ontap-servers'
        }
      })
      .state('ontap-servers.fix', {
        url: '/:ontapServerId/fix',
        templateUrl: 'modules/ontap-servers/client/views/fix-ontap-server.client.view.html',
        data: {
          roles: ['root'],
          parent: 'storagemanagement',
          parentstate: 'ontap-servers'
        }
      })
      .state('ontap-servers.edit', {
        url: '/:ontapServerId/edit',
        templateUrl: 'modules/ontap-servers/client/views/edit-ontap-server.client.view.html',
        data: {
          roles: featuresSettings.roles.server.update,
          parent: 'storagemanagement',
          parentstate: 'ontap-servers'
        }
      });
  }
]);
