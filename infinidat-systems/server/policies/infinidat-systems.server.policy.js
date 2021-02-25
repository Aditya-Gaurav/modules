'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl'),
  path = require('path'),
  featuresSettings = require(path.resolve('./config/features'));

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke systems Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
  roles: featuresSettings.roles.infinidatSystem.create,
  allows: [{
    resources: '/api/infinidat-systems',
    permissions: ['post']
  }]
}, {
  roles: featuresSettings.roles.infinidatSystem.list,
  allows: [{
    resources: '/api/infinidat-systems',
    permissions: ['get']
  }]
}, {
  roles: featuresSettings.roles.infinidatSystem.read,
  allows: [{
    resources: '/api/infinidat-systems/:infinidatSystemId',
    permissions: ['get']
  }]
}, {
  roles: featuresSettings.roles.infinidatSystem.update,
  allows: [{
    resources: '/api/infinidat-systems/:infinidatSystemId',
    permissions: ['put']
  }]
}, {
  roles: featuresSettings.roles.infinidatSystem.delete,
  allows: [{
    resources: '/api/infinidat-systems/:infinidatSystemId',
    permissions: ['delete']
  }]
}]);
};

/**
 * Check If systems Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  if (roles.indexOf('guest') !== -1) {
    return res.status(401).json({
      message: 'Session has expired, please login again to access the resource'
    });
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
