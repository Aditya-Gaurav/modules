'use strict';

/**
 * Storage unit Module dependencies.
 */
var _ = require('lodash'),
    acl = require('acl'),
    path = require('path'),
    featuresSettings = require(path.resolve('./config/features'));

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Storage Units Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: featuresSettings.roles.ontapStorageunit.create,
    allows: [{
      resources: '/api/ontap-storageunits',
      permissions: ['post']
    }]
  }, {
    roles: featuresSettings.roles.ontapStorageunit.list,
    allows: [{
      resources: '/api/ontap-storageunits',
      permissions: ['get']
    }]
  }, {
    roles: featuresSettings.roles.ontapStorageunit.read,
    allows: [{
      resources: '/api/ontap-storageunits/:ontapStorageunitId',
      permissions: ['get']
    }]
  }, {
    roles: featuresSettings.roles.ontapStorageunit.update,
    allows: [{
      resources: '/api/ontap-storageunits/:ontapStorageunitId',
      permissions: ['put']
    }]
  }, {
    roles: featuresSettings.roles.ontapStorageunit.delete,
    allows: [{
      resources: '/api/ontap-storageunits/:ontapStorageunitId',
      permissions: ['delete']
    }]
  },
  {
    roles:  featuresSettings.roles.ontapStorageunit.create,
    allows: [{
      resources: '/api/ontap-storageunits/getListOfIgroups',
      permissions: ['get']
    }]
  },
  {
    roles: featuresSettings.roles.ontapStorageunit.create,
    allows: [{
      resources: '/api/peers',
      permissions: ['get']
    }]
  },
  {
    roles: featuresSettings.roles.ontapStorageunit.create,
    allows: [{
      resources: '/api/ontap-storageunits/getProvisioned',
      permissions: ['get']
    }]
  }
]);
};

/**
 * Check If storageunits Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  if (roles.indexOf('guest') !== -1) {
    return res.status(401).json({
      message: 'Session has expired, please login again to access the resource'
    });
  }

  if (req.storageunit && req.user) {
    //Root gets to access all objects
    if (_.includes(roles, 'root') || _.includes(roles, 'l1ops')) {
    //Partner gets to access all objects under tenancy and his partner tenancy
    } else if ( _.includes(roles, 'partner') &&
                ( (req.storageunit.tenant && req.storageunit.tenant.id === req.user.tenant.toString()) ||
                  (req.storageunit.partner && req.storageunit.partner.id === req.user.tenant.toString()) ) ) {
    //Others gets to access all objects under their tenancy
    } 
    // else if ( !req.storageunit.tenant || req.storageunit.tenant.id !== req.user.tenant.toString()) {
    //   return res.status(403).json({
    //     message: 'User is not authorized'
    //   });
    // }
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
