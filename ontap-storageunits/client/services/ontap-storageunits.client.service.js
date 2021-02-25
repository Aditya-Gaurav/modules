'use strict';

//Storage Units service used for communicating with the Storage units REST endpoints 

angular.module('ontap-storageunits').factory('OntapStorageunits', ['$resource',
  function ($resource) {
    return $resource('api/ontap-storageunits/:ontapStorageunitId', {
      ontapStorageunitId: '@ontapStorageunitId'
    }, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      },
      getIgroups: {
        method: 'GET',
        url: 'api/ontap-storageunits/getListOfIgroups',
        isArray: true
      },
      getPeers: {
        method: 'GET',
        url: 'api/peers',
        isArray: true
      },
      getProvisioned: {
        method: 'GET',
        url: 'api/ontap-storageunits/getProvisioned',
        isArray: true
      },
      'query': {
        method: 'GET',
        isArray: true
      },
    });
  }
]);
