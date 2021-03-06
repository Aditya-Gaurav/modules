'use strict';

// Menus here

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'Clusters',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'Nodes',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'SVMs',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'Aggregates',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'LIFs',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'Volumes',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'LUNs',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });  
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'Ports',
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'ontapHealth', {
        title: 'Drives', //Disk name changed to Drives
        state: 'dashboards.details',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
   
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'Systems',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'Controllers',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'Pools',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'Interfaces',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'Volumes',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });  
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'Drives',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });
    Menus.addSubMenuItem('topbar', 'eseriesHealth', {
        title: 'ASUPs',
        state: 'dashboards.eseriesDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 7,
    });  

    Menus.addSubMenuItem('topbar', 'infinidatHealth', {
        title: 'Systems',
        state: 'dashboards.infinidatDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 8,
    });
   
    Menus.addSubMenuItem('topbar', 'infinidatHealth', {
        title: 'Pools',
        state: 'dashboards.infinidatDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 8,
    });
    Menus.addSubMenuItem('topbar', 'infinidatHealth', {
        title: 'Interfaces',
        state: 'dashboards.infinidatDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 8,
    });
    Menus.addSubMenuItem('topbar', 'infinidatHealth', {
        title: 'Volumes',
        state: 'dashboards.infinidatDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 8,
    });  
    Menus.addSubMenuItem('topbar', 'infinidatHealth', {
        title: 'Drives',
        state: 'dashboards.infinidatDetails',
        roles: ['user', 'admin', 'root', 'partner', 'read', 'l1ops'],
        position: 8,
    });
  

  }]);