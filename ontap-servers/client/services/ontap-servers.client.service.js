'use strict';

//Servers service used for communicating with the servers REST endpoints
angular.module('ontap-servers').factory('OntapServers', ['$resource',
  function ($resource) {
    return $resource('api/ontap-servers/:ontapServerId', {
      serverId: '@ontapServerId'
    }, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    });
  }
]);
