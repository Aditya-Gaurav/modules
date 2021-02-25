'use strict';

/**
 * Module dependencies.
 */
var infinidatSystemsPolicy = require('../policies/infinidat-systems.server.policy'),
  infinidatSystems = require('../controllers/infinidat-systems.server.controller'),
  path=require('path'),
  auth = require(path.resolve('./modules/users/server/controllers/users/users.authentication.server.controller'));

module.exports = function (app) {
  // systems collection routes
  app.route('/api/infinidat-systems').all([auth.loginODIN, infinidatSystemsPolicy.isAllowed])
    .get(infinidatSystems.list)
    .post(infinidatSystems.create);

  // Single system routes
  app.route('/api/infinidat-systems/:infinidatSystemId').all([auth.loginODIN, infinidatSystemsPolicy.isAllowed])
    .get(infinidatSystems.read)
    .put(infinidatSystems.update)
    .delete(infinidatSystems.delete);

  // Finish by binding the system middleware
  app.param('infinidatSystemId', infinidatSystems.infinidatSystemByID);
};
