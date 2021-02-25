'use strict';

/**
 * Storage unit Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  logger = require(path.resolve('./config/lib/log')),
  ip = require('ip'),
  util = require('util'),
  mongoose = require('mongoose'),
  rabbitMqService = require(path.resolve('./config/lib/rabitmqService')),
  featuresSettings = require(path.resolve('./config/features')),
  InfinidatStorageunit = mongoose.model('infinidat_storageunits'),
  Subscription = mongoose.model('Subscription'),
  Peer = mongoose.model('ontap_peers'),
  Job = mongoose.model('Job'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var saveStorageUnit = function(storageunit, from, callback) {
  callback = callback || function(){};
  storageunit.save(function (err, storageunitSaved) {
    if (err) {
      logger.info(from + ': Failed to save Storage Unit object: ' + err);
    } else {
      storageunit = storageunitSaved;
      logger.info(from + ': Storage Unit Saved Successfully');
      callback();
    }
  });
};

// To respond with proper error message
var respondError = function(res, errCode, errMessage){
    res.status(errCode).send({
     message: errMessage
    });
};

var handleErrorFromWFA = function(storageunit) {
  logger.info("Error on WFA, moving status to Contact Support");
  storageunit.status = 'Contact Support';
  saveStorageUnit(storageunit, "Error on WFA");
};


/**
* Create Storage Unit
*/
exports.create = function (req, res) {
  var clientWfa = require('./infinidat-storageunits.server.wfa.su.create');
  var suCreateJob;

	var storageunit = new InfinidatStorageunit();
  storageunit.user = req.user;
  storageunit.name = req.body.name || '';
  storageunit.code = req.body.code || '';
  storageunit.sizegb = req.body.sizegb;
  // storageunit.workload = req.body.workload || '';
  storageunit.storagePool = req.body.storagePool || '';
  storageunit.mapping = req.body.mapping;  
  storageunit.hostName = req.body.hostName || '';

  // storageunit.lunId = req.body.lunId || 0;
 
  if (storageunit.mapping == "new")  {
    storageunit.protocol = req.body.protocol  || '';
    // storageunit.portInfo = req.body.portInfo || {};
    storageunit.portInfo = storageunit.protocol == 'fc' ? req.body.wwns : req.body.iqns;
    // storageunit.portInfo = req.body.portName || [];

    // storageunit.hostType = req.body.hostType || '';
  } 

  if (storageunit.mapping == "existing")  {
    storageunit.targetType = req.body.targetType || '';  
    // storageunit.hostName = req.body.hostName || '';
  } 
 
  if (req.body.applicationId) {
    if (mongoose.Types.ObjectId.isValid(req.body.applicationId)) {
      storageunit.application = mongoose.Types.ObjectId(req.body.applicationId);
    } else {
      storageunit.application = mongoose.Types.ObjectId();
    }
  }

  if (req.body.infinidatSystem) {
    if (mongoose.Types.ObjectId.isValid(req.body.infinidatSystem)) {
      storageunit.infinidatSystem = mongoose.Types.ObjectId(req.body.infinidatSystem);
    } else {
      storageunit.infinidatSystem = mongoose.Types.ObjectId();
    }
  }

  console.log("infinidat-storageunit is:", storageunit)

  storageunit.validate(function(err) {
    if (err) {
      var errMsg = {};
      _.forOwn(err.errors, function (error, field) {
        logger.info(field, error.message);
        errMsg[field] = error.message;
      });
      return respondError(res, 400, errMsg);
    } else {
      Job.create(req, 'infinidat-storageunits', function(err, createJobRes) {
        suCreateJob = createJobRes;
        storageunit.save(function (err) {
          if (err) {
            suCreateJob.update('Failed', err, storageunit);
            return respondError(res, 400, errorHandler.getErrorMessage(err));
          } else {
            storageunit.populate('application', 'name code')
              .populate('infinidatSystem', 'name rest_url_ip', function (err, storageunitPopulated) {
              if (err) {
                suCreateJob.update('Failed', err, storageunit);
                return respondError(res, 400, errorHandler.getErrorMessage(err));
              } else {
                storageunit = storageunitPopulated;
                res.json(storageunit);                
                createSu();
              }
            });
          }
        });
      });
    }
  });

  function createSu() {
    var jobId;
    var args = {
      volume_name: storageunit.code,
      // protocol: storageunit.protocol,
      size: storageunit.sizegb,
      // application: storageunit.application,
      // eseriesSystem : storageunit.eseriesSystem.name, 
      cluster_name: storageunit.infinidatSystem.rest_url_ip,
      // workload_name : storageunit.workload, 
      existing_server: storageunit.mapping == 'existing' ? false : true,
      storage_pool: storageunit.storagePool, 
      protocol : storageunit.protocol || null,
     
      // target_type: storageunit.targetType,   
      host_name: storageunit.hostName,
      // host_type: storageunit.hostType,
      // port_info: storageunit.portInfo,
      // lun_id : storageunit.lunId || null,

      db_info: [{"name":"infinidat_storageunits", "id": storageunit._id}, {"name":"jobs", "id":suCreateJob._id}], 
      // action: "create",
    };

    if (storageunit.mapping == "new")  {
      // args.protocol = storageunit.protocol;
      // args.wwns = storageunit.wwns;
      // args.iqns = storageunit.iqns;
      // args.port_info = storageunit.portInfo;
      // args.host_type = storageunit.hostType;
      args.wwns = storageunit.protocol == 'fc' ? req.body.wwns : null;
      args.iqns = storageunit.protocol == 'iscsi' ? req.body.iqns : null;
    } 
  
    if (storageunit.mapping == "existing")  {
      // args.targetType = storageunit.targetType;  
      args.wwns = null;
      args.iqns = null;
    } 

    console.log('InfinidatStorageunit create Args: ' , args );
    // return;
    // logger.info('Storage unit create Args:' + util.inspect(args, {showHidden: false, depth: null}));

    rabbitMqService.publisheToQueue(args, "infinidat");

  }

};


/**
* Show the current Storage Unit
*/
exports.read = function (req, res) {
  var storageunit = req.storageunit.toObject();
  storageunit.storageunitId = storageunit._id;
  res.json(storageunit); 
};

/**
 * Update a Storage Unit
 */
exports.update = function (req, res) {
  var wfaUpdateRequired = false;
  var clientWfa = require('./infinidat-storageunits.server.wfa.su.update');
  var storageunit = req.storageunit;
  var suUpdateJob;
  var sizegbDifference = 0;

   //If the request is from fix page and its root, he can modify the following parameters
  if(req.body.fromFix && _.includes(req.user.roles, 'root')){

    // logger.info('SU Fix: Storageunit Object: ' + util.inspect(storageunit, {showHidden: false, depth: null}));
    // logger.info('SU Fix: Request Body: ' + util.inspect(req.body, {showHidden: false, depth: null}));
      console.log('SU Fix: Storageunit Object: ', storageunit);
      console.log('SU Fix: Request Body: ', req.body);

    storageunit.status = _.isUndefined(req.body.status) ? storageunit.status : req.body.status ;

    Job.create(req, 'infinidat-storageunits', function(err, updateJobRes) {
    suUpdateJob = updateJobRes;
      storageunit.save(function (err, storageunitSaved) {
        if (err) {
          logger.info('Storageunit Fix: Failed to save Storageunit object: ' + err);
          suUpdateJob.update('Failed', 'Fix - Failed' , storageunit);
          var errMsg = {};
          _.forOwn(err.errors, function(error, field) {
            logger.info(field, error.message);
            errMsg[field] = error.message;
          });
          return respondError(res, 400, errMsg);
        } else {
          logger.info('Storageunit Fix: Fixed Successfully');
          suUpdateJob.update('Completed', 'Fix - Applied' , storageunit);
          res.json(storageunitSaved);
        }
      });
    });
    return;
  }

  if (storageunit.status !== 'Operational') {
    return respondError(res, 400, 'Storage Unit is currently undergoing a different operation. Please wait until Status is Operational');
  }

  storageunit.name = _.isUndefined(req.body.name) ? storageunit.name : req.body.name;

  if (!_.isUndefined(req.body.sizegb) && storageunit.sizegb !== req.body.sizegb) {
    // if (storageunit.protocol === 'iscsi' && req.body.sizegb < storageunit.sizegb) {
    //   return respondError(res, 400, 'Size must be higher than the existing Size');
    // }

    // sizegbDifference = req.body.sizegb - storageunit.sizegb;
    // storageunit.sizegb = req.body.sizegb;
    wfaUpdateRequired = true;
    storageunit.sizegb = storageunit.sizegb + req.body.sizegb;

    Job.create(req, 'infinidat-storageunits', function(err, updateJobRes) {
    suUpdateJob = updateJobRes;
      storageunit.save(function (err, storageunitSaved) {
        if (err) {
          logger.info('Infinidat-storageunit Volume Expansion: Failed to save Infinidat-storageunit object: ' + err);
          suUpdateJob.update('Failed', 'Infinidat-storageunit Volume Expansion - Failed' , storageunit);
          var errMsg = {};
          _.forOwn(err.errors, function(error, field) {
            logger.info(field, error.message);
            errMsg[field] = error.message;
          });
          return respondError(res, 400, errMsg);
        } else {
          logger.info('Eseries-storageunit Volume Expansion: Updated Successfully');
          suUpdateJob.update('Completed', 'Volume Expansion - Applied' , storageunit);
          res.json(storageunitSaved);
          updateVolumeSu(storageunit, suUpdateJob);
        }
      });
    });

    return;
  }

  //update acl as per the update and remove
  if (storageunit.protocol === 'nfs' || storageunit.protocol === 'iscsi') {
    var acl_array = storageunit.acl ? storageunit.acl.split(',') : [];

    //validate aclAdd against the pattern
    if (req.body.aclAdd && storageunit.protocol === 'nfs' && !(/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)((\/([8-9]|1[0-9]|2[0-6]))*)$/).test(req.body.aclAdd)) {
      return respondError(res, 400, 'Invalid ACL to add');
    } else if(req.body.aclAdd && storageunit.protocol === 'iscsi' && !(/^((?:iqn\.[0-9]{4}-[0-9]{2}(?:\.[A-Za-z](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)+(?::[^,:]*)?)|(eui\.[0-9A-Fa-f]{16}))$/).test(req.body.aclAdd)) {
      return respondError(res, 400, 'Invalid ACL to add');
    } else if (req.body.aclAdd) {
      acl_array.push(req.body.aclAdd);
      wfaUpdateRequired = true;
    }

    //validate aclRemove , to have in the existing list
    if (req.body.aclRemove && !_.includes(acl_array, req.body.aclRemove)) {
      return respondError(res, 400, 'ACL to be removed should be an exisitng ACL for the storageunit');
    } else if(req.body.aclRemove && _.includes(acl_array, req.body.aclRemove)) {
       acl_array.splice(acl_array.indexOf(req.body.aclRemove), 1);
       wfaUpdateRequired = true;
    }
    storageunit.acl = acl_array.join();
  }

  storageunit.validate(function(err) {
    if (err) {
      var errMsg = '';
      _.forOwn(err.errors, function(error, field) {
        errMsg = errMsg  + error.message +". ";
      });

      return respondError(res, 400, errMsg);
    } else {
      storageunit.status = wfaUpdateRequired ? 'Updating' : 'Operational';
      Job.create(req, 'eseries-storageunits', function(err, createJobRes) {
        suUpdateJob = createJobRes;
        storageunit.save(function (err, storageunitSaved) {
          if (err) {
            suUpdateJob.update('Failed', err, storageunit);
            return respondError(res, 400, errorHandler.getErrorMessage(err));
          } else {
            storageunit
            .populate('partner', 'name code')
            .populate('server', 'name code')
            .populate('tenant', 'name code')
            .populate('subtenant', 'name code')
            .populate('subscription', 'name code')
            .populate('storagegroup', 'name code', function (err, storageunitPopulated) {
              if (err) {
                suUpdateJob.update('Failed', err, storageunit);
                return respondError(res, 400, errorHandler.getErrorMessage(err));
              }
              else {
                storageunit = storageunitPopulated;
                res.json(storageunit);
                if (wfaUpdateRequired) {
                  suUpdateJob.update('Processing', 'Storage Unit Updating', storageunit);

                  if (sizegbDifference !== 0 && featuresSettings.paymentMethod.prePaid) {
                    updateSubscription();
                  } else {
                    updateSu();
                  }
                } else {
                  suUpdateJob.update('Completed', null, storageunit);
                }
              }
            });
          }
        });
      });
    }
  });

  function updateSubscription() {
    Subscription.findById(storageunit.subscription, function (err, subscription) {
      if (err) {
        return respondError(res, 400, errorHandler.getErrorMessage(err));
      } else if (!subscription) {
        return respondError(res, 400, 'No Subscription associated with that Storage Group\'s Server has been found');
      } else {
        storageunit.populate('storagegroup', 'name code tier', function (err, storageunitPopulated) {
          if (err) {
            suUpdateJob.update('Failed', err, storageunit);
            return respondError(res, 400, errorHandler.getErrorMessage(err));
          } else {
            _.forEach(subscription.storagePack, function (value, key) {
              if (value.class === 'ontap-' + storageunitPopulated.storagegroup.tier) {
                var classElements = _.filter(subscription.storagePack, {'class': value.class});
                if (classElements && classElements.length > 1) {
                  suUpdateJob.update('Failed', 'duplicate subscription storage classes', storageunitPopulated);
                  return respondError(res, 400, errorHandler.getErrorMessage(err));
                } else {
                  subscription.storagePack[key].sizegb.available = subscription.storagePack[key].sizegb.available - sizegbDifference;
                  subscription.save(function (err) {
                    if (err) {
                      suUpdateJob.update('Failed', err, storageunit);
                      return respondError(res, 400, errorHandler.getErrorMessage(err));
                    } else {
                      updateSu();
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  function untilUpdated(jobId) {
    var args = {
      jobId: jobId
    };

    clientWfa.suUpdateStatus(args, function (err, resWfa) {
      if (err) {
        suUpdateJob.update('Failed', 'Failed to obtain status WFA ' + err , storageunit);
        logger.info('Storage Unit Update: Failed to obtain status - Error : '+ err);
        handleErrorFromWFA(storageunit);

      } else {
        if (resWfa.jobStatus === 'FAILED') {
          suUpdateJob.update('Failed', 'Failed to update WFA ' + err , storageunit);
          logger.info('Storage Unit Update: Failed to update Storage Unit, Job ID: ' + jobId);
          handleErrorFromWFA(storageunit);

        } else if (resWfa.jobStatus !== 'COMPLETED') {
          logger.info('Storage Unit Update: Not completed yet, polling again in 30 seconds, Job ID: ' + jobId);
          setTimeout(function () { untilUpdated(jobId); }, config.wfa.refreshRate);

        } else {
          storageunit.status = 'Operational';
          suUpdateJob.update('Completed', null , storageunit);
          saveStorageUnit(storageunit, 'Storage Unit Update');
        }
      }
    });
  }
};


/**
 * Delete a Storage Unit
 */
exports.delete = function (req, res) {
  var clientWfa = require('./infinidat-storageunits.server.wfa.su.delete.js');
  var storageunit = req.storageunit;
  var suDeleteJob;

  if (storageunit.status !== 'Operational') {
    return respondError(res, 400, 'Storage unit is currently undergoing a different operation. Please wait until Status = Operational');
  }

  storageunit.status = 'Deleting';
  Job.create(req, 'infinidat-storageunits', function(err, createJobRes) {
    suDeleteJob = createJobRes;
    storageunit.save(function(err){
      if (err) {
        suDeleteJob.update('Failed', err, storageunit);
        return respondError(res, 400, errorHandler.getErrorMessage(err));
      } else {
        // logger.info('Storage Unit Delete: Delete Status Updated Successfully: ' + util.inspect(storageunit, {showHidden: false, depth: null}));
        res.status(200).send();

        if (featuresSettings.paymentMethod.prePaid) {
          updateSubscription();
        } else {
          deleteSu();
        }
      }
    });
  });

  function updateSubscription() {
    Subscription.findById(storageunit.subscription, function (err, subscription) {
      if (err) {
        return respondError(res, 400, errorHandler.getErrorMessage(err));
      } else if (!subscription) {
        return respondError(res, 400, 'No Subscription associated with that Storage Group\'s Server has been found');
      } else {
        storageunit.populate('storagegroup', 'name code tier', function (err, storageunitPopulated) {
          if (err) {
            suDeleteJob.update('Failed', err, storageunit);
            return respondError(res, 400, errorHandler.getErrorMessage(err));
          } else {
            _.forEach(subscription.storagePack, function (value, key) {
              if (value.class === 'ontap-' + storageunitPopulated.storagegroup.tier) {
                var classElements = _.filter(subscription.storagePack, {'class': value.class});
                if (classElements && classElements.length > 1) {
                  suDeleteJob.update('Failed', 'duplicate subscription storage classes', storageunitPopulated);
                  return respondError(res, 400, errorHandler.getErrorMessage(err));
                } else {
                  subscription.storagePack[key].sizegb.available = subscription.storagePack[key].sizegb.available + storageunit.sizegb;
                  subscription.save(function (err) {
                    if (err) {
                      suDeleteJob.update('Failed', err, storageunit);
                      return respondError(res, 400, errorHandler.getErrorMessage(err));
                    } else {
                      deleteSu();
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  }

  function deleteSu() {
    var args = {
      server : storageunit.server.code,
      storagegroup: storageunit.storagegroup.code,
      storageunit: storageunit.code
    };
    var jobId;
    // logger.info('storage unit delete: Args for WFA' + util.inspect(args, {showHidden: false, depth: null}));
    clientWfa.suDeleteExec(args, function (err, resWfa) {
      if (err) {
        suDeleteJob.update('Failed', 'Failed to delete Storage Unit WFA' + err, storageunit);
        logger.info('Storage Unit Delete: Failed to delete Storage Unit - Error : '+ err);
        handleErrorFromWFA(storageunit);
      } else {
        jobId = resWfa.jobId;
        logger.info('Storage Unit Delete: Response from WFA' + util.inspect(resWfa, {showHidden: false, depth: null}));
        untilDeleted(jobId);
      }
    });
  }

  function untilDeleted(jobId) {
    var args = {
      jobId: jobId
    };

    clientWfa.suDeleteStatus(args, function (err, resWfa) {
      if (err) {
        suDeleteJob.update('Failed', 'Failed to obtain status WFA' + err, storageunit);
        logger.info('Storage Unit Delete: Failed to obtain status, Job ID: ' + jobId);
        handleErrorFromWFA(storageunit);

      } else {

        if (resWfa.jobStatus === 'FAILED') {
          suDeleteJob.update('Failed', 'Failed to delete storageunit WFA' + err, storageunit);
          logger.info('Storage Unit Delete: Failed to delete Storage Unit, Job ID: ' + jobId);
          handleErrorFromWFA(storageunit);

        } else if (resWfa.jobStatus !== 'COMPLETED') {
          logger.info('Storage Unit Delete: Not completed yet, polling again in 30 seconds, Job ID: ' + jobId);
          setTimeout(function () { untilDeleted(jobId); }, config.wfa.refreshRate);

        } else {
          storageunit.status = 'Deleting';
          suDeleteJob.update('Completed', null, storageunit);
          saveStorageUnit(storageunit, 'Storage Unit Delete');
          deleteStorageUnit();
        }
      }
    });
  }

  function deleteStorageUnit() {
    storageunit.remove(function (err) {
      if (err) {
        logger.info('Storage Unit Delete: Failed to delete object: ' + err);
      }
    });
  }
};



/**
 * List of Storage Units
 */
exports.list = function (req, res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  var query = InfinidatStorageunit.find({})
    .populate('infinidatSystem', 'name rest_url_ip')
    .populate('application', 'name code')

  if (req.query.infinidatSystem) {
    if (mongoose.Types.ObjectId.isValid(req.query.infinidatSystem)) {
      query.where({'infinidatSystem' : req.query.infinidatSystem});
    } else {
      return respondError(res, 400, 'Invalid infinidat system Id');
    }
  }

  if (req.query.application) {
    if (mongoose.Types.ObjectId.isValid(req.query.application)) {
      query.where({'application' : req.query.application});
    } else {
      return respondError(res, 400, 'Invalid application Id');
    }
  }

  if (_.includes(req.user.roles, 'root') || _.includes(req.user.roles, 'l1ops')) {
  } else if (_.includes(req.user.roles, 'partner')) {
    query.where({ $or:[ {'tenant':req.user.tenant }, {'partner':req.user.tenant} ] });
  } else {
    query.where({ 'tenant': req.user.tenant });
  }

  query.exec(function (err, storageunits) {
    respondList(err, storageunits);
  });

  function respondList(err, storageunits) {
    if (err) {
     return respondError(res, 400, errorHandler.getErrorMessage(err));
    } else {
      res.json(storageunits);
    }
  }
};


/**
 * Storage unit middleware
 */
exports.infinidatStorageunitByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return respondError(res, 400, 'Infinidat Storage unit is invalid');
  }

  InfinidatStorageunit.findById(id)
  .populate('infinidatSystem','name rest_url_ip')
  .populate('application', 'name code')
  .exec(function (err, storageunit) {
    console.log(err, (storageunit && storageunit.name !== ''))
    if (err) {
      return next(err);
    } else if (storageunit && storageunit.name !== '') {
      req.storageunit = storageunit;
      next();
    } else {
      return respondError(res, 400, 'No infinidat-storageunit with that identifier has been found');
    }
   
  });
};

/**
 * Get list of available igroups under given server and cluster
 */
exports.getListOfIgroups = function(req, res) {
  console.log(req.query);
  if (req.query['vserverName'] == "" || req.query['clusterName'] == "" ) {
    res.json([])
  }
  var args = {
    "vserverName": req.query['vserverName'],
    "clusterName": req.query['clusterName']
  }
  var dbWfa = require('./infinidat-storageunits.server.wfa.db.read');
  dbWfa.getIgroups(args, function (err, out) {
    if (err) {
      logger.info('SG Create: Failed to Read LUN ID for ISCSI from  WFA, Error: ' + err);
      res.json([])
    } else {
      res.json(out);
    }
  });
  
};

exports.getPeers = function(req, res) {
  var serverName = req.query.vserverName || '';
  var clusterName = req.query.clusterName || '';
  if (serverName != "" && clusterName != "") {
    var query = {"sourceCluster": clusterName, "sourceVserver": serverName};
    console.log(query)
    Peer.find(query)
    .exec(function (err, peers) {
      if (err) {
        return respondError(res, 400, 'No peer with that identifier has been found');
      } else if (peers.length > 0 ) {
        console.log(peers)
        res.json(peers)        
      } else {
        res.json([])
      }
    });
  } else {
    res.json([])
  }
  
}


function updateVolumeSu(storageunit, suJob) {
  var args = {
    volume_name: storageunit.code,
    size: storageunit.sizegb,
    rest_url_ip: storageunit.eseriesSystem.rest_url_ip,
    workload_name : storageunit.workload, 
    storage_pool: storageunit.storagePool, 
    host_name: storageunit.hostName,
    lun_id : storageunit.lunId || null,
    db_info: [{"name":"eseries_storageunits", "id": storageunit._id}, {"name":"jobs", "id":suJob._id}], 
  };

  if (storageunit.mapping == "new")  {
    args.protocol = storageunit.protocol;
    args.port_info = storageunit.portInfo;
    args.host_type = storageunit.hostType;
  } 

  if (storageunit.mapping == "existing")  {
    args.targetType = storageunit.targetType;  
  } 

  console.log('InfinidatStorageunit create Args: ' , args );
  // logger.info('Storage unit create Args:' + util.inspect(args, {showHidden: false, depth: null}));
  rabbitMqService.publisheToQueue(args, "eseries");

}