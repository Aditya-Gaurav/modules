'use strict';

// Configuring the Stirage units module
angular.module('ontap-storageunits').run(['Menus',
  function (Menus) {

    // Add the Storage Units dropdown item
    Menus.addSubMenuItem('topbar', 'storagemanagement', {
      title: 'Ontap Storage Units',
      state: 'ontap-storageunits.list',
      type: 'dropdown',
      roles: featuresSettings.roles.ontapStorageunit.list,
      position: 3,
      submenu: [{ 'name' : 'List Storage Units', 'roles' : featuresSettings.roles.ontapStorageunit.list, 'state': 'ontap-storageunits.list' },
                { 'name': 'Create Storage Units', 'roles': featuresSettings.roles.ontapStorageunit.create, 'state': 'ontap-storageunits.create' }]
    });
  }
]);
