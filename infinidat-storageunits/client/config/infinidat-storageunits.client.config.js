'use strict';

// Configuring the Stirage units module
angular.module('infinidat-storageunits').run(['Menus',
  function (Menus) {
    // Add the Storage Units dropdown item
    Menus.addSubMenuItem('topbar', 'storagemanagement', {
      title: 'Infinidat Storage Units',
      state: 'infinidat-storageunits.list',
      type: 'dropdown',
      roles: featuresSettings.roles.infinidatStorageunit.list,
      position: 3,
      submenu: [{ 'name' : 'List Storage Units', 'roles' : featuresSettings.roles.infinidatStorageunit.list, 'state': 'infinidat-storageunits.list' },
                { 'name': 'Create Storage Units', 'roles': featuresSettings.roles.infinidatStorageunit.create, 'state': 'infinidat-storageunits.create' }]
    });

  }
]);
