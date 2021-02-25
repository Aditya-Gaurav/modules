'use strict';

//systems service used for communicating with the systems REST endpoints
angular.module('infinidat-systems').factory('InfinidatSystems', ['$resource',
  function ($resource) {
    return $resource('api/infinidat-systems/:infinidatSystemId', {
      infinidatSystemId: '@infinidatSystemId'
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
