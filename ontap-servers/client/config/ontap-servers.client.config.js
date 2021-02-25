'use strict';

// Configuring the Servers module
angular.module('ontap-servers').run(['Menus',
  function (Menus) {
  //  Add the servers dropdown item
    Menus.addSubMenuItem('topbar', 'storagemanagement', {
      title: featuresSettings.labels.server.serverName + 's',
      state: 'ontap-servers.list',
      type: 'dropdown',
      roles: featuresSettings.roles.server.list,
      position: 1,
      submenu: [{ 'name' : 'List ' + featuresSettings.labels.server.serverName + 's', 'roles' : featuresSettings.roles.server.list, 'state': 'ontap-servers.list' },
                { 'name': 'Create ' + featuresSettings.labels.server.serverName + 's', 'roles': featuresSettings.roles.server.create, 'state': 'ontap-servers.create' }]
    });
  }
]);
