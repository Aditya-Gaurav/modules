'use strict';

//Storage Units service used for communicating with the Storage units REST endpoints 

angular.module('infinidat-storageunits').factory('InfinidatStorageunits', ['$resource',
  function ($resource) {
    return $resource('api/infinidat-storageunits/:infinidatStorageunitId', {
      storageunitId: '@infinidatStorageunitId'
    }, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      },
      getIgroups: {
        method: 'GET',
        url: 'api/infinidat-storageunits/getListOfIgroups',
        isArray: true
      },
      getPeers: {
        method: 'GET',
        url: 'api/peers',
        isArray: true
      },
      'query': {
        method: 'GET',
        isArray: true
      },
    });
  }
]);
