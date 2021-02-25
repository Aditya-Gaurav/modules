'use strict';

/**
 *  Storage unit Module dependencies.
 */
var infinidatStorageunitsPolicy = require('../policies/infinidat-storageunits.server.policy'),
  infinidatStorageunits = require('../controllers/infinidat-storageunits.server.controller'),
  path=require('path'),
  auth = require(path.resolve('./modules/users/server/controllers/users/users.authentication.server.controller'));

module.exports = function (app) {
  // storageunits collection routes
  app.route('/api/infinidat-storageunits').all([auth.loginODIN, infinidatStorageunitsPolicy.isAllowed])
    .get(infinidatStorageunits.list)
    .post(infinidatStorageunits.create);
  
  app.route('/api/infinidat-storageunits/getListOfIgroups').all([auth.loginODIN, infinidatStorageunitsPolicy.isAllowed])
    .get(infinidatStorageunits.getListOfIgroups)

  // Single server routes
  app.route('/api/infinidat-storageunits/:infinidatStorageunitId').all([auth.loginODIN, infinidatStorageunitsPolicy.isAllowed])
    .get(infinidatStorageunits.read)
    .put(infinidatStorageunits.update)
    .delete(infinidatStorageunits.delete);

  app.route('/api/peers').all([auth.loginODIN, infinidatStorageunitsPolicy.isAllowed])
  .get(infinidatStorageunits.getPeers) 
  

  // Finish by binding the server middleware
  app.param('infinidatStorageunitId', infinidatStorageunits.infinidatStorageunitByID);
};
