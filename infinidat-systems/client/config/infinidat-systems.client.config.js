'use strict';

// Configuring the Pods module
angular.module('infinidat-systems').run(['Menus',
  function (Menus) {
    // Add the pods dropdown item
    var t= Menus.addSubMenuItem('topbar', 'administration', {
      title: 'Infinidat Systems',
      state: 'infinidat-systems.list',
      type: 'dropdown',
      roles: featuresSettings.roles.infinidatSystem.list,
      position: 8,
      submenu: [{ 'name' : 'List Infinidat Systems', 'roles' : featuresSettings.roles.infinidatSystem.list, 'state': 'infinidat-systems.list' },
                { 'name': 'Create Infinidat Systems', 'roles': featuresSettings.roles.infinidatSystem.create, 'state': 'infinidat-systems.create' }]
    });
  }
]);
