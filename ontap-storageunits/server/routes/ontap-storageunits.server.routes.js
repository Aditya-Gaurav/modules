'use strict';

/**
 *  Storage unit Module dependencies.
 */
var storageunitsPolicy = require('../policies/ontap-storageunits.server.policy'),
  storageunits = require('../controllers/ontap-storageunits.server.controller'),
  path=require('path'),
  auth = require(path.resolve('./modules/users/server/controllers/users/users.authentication.server.controller'));

module.exports = function (app) {
  // storageunits collection routes
  app.route('/api/ontap-storageunits').all([auth.loginODIN, storageunitsPolicy.isAllowed])
    .get(storageunits.list)
    .post(storageunits.create);
  
  app.route('/api/ontap-storageunits/getListOfIgroups').all([auth.loginODIN, storageunitsPolicy.isAllowed])
    .get(storageunits.getListOfIgroups)

  app.route('/api/ontap-storageunits/getProvisioned').all([auth.loginODIN, storageunitsPolicy.isAllowed])
    .get(storageunits.getProvisioned)  

  // Single server routes
  app.route('/api/ontap-storageunits/:ontapStorageunitId').all([auth.loginODIN, storageunitsPolicy.isAllowed])
    .get(storageunits.read)
    .put(storageunits.update)
    .delete(storageunits.delete);

  app.route('/api/peers').all([auth.loginODIN, storageunitsPolicy.isAllowed])
  .get(storageunits.getPeers) 
  

  // Finish by binding the server middleware
  app.param('ontapStorageunitId', storageunits.storageunitByID);
};
