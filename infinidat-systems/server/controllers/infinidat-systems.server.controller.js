'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  InfinidatSystem = mongoose.model('infinidat_systems'),
  Pod = mongoose.model('Pod'),
  Job = mongoose.model('Job'),
  logger = require(path.resolve('./config/lib/log')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  util = require('util');

/**
 * Create a system
 */
exports.create = function (req, res) {
  var system = new InfinidatSystem();
  system.user = req.user;
  system.name = req.body.name;
  system.rest_url_ip = req.body.rest_url_ip;
  system.wwn = req.body.wwn || '';
  system.provisioning_state = req.body.provisioning_state;
  system.applications = req.body.applications || '';
  system.save(function (err) {
      logger.info('System system.save(): Entered');
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        logger.info('InfinidatSystem system.save(): Calling Job.create()...');
        Job.create(req, 'infinidat-system', function(err, createJobRes) {
          createJobRes.update('Completed', 'InfinidatSystem Saved', system);
        });
        res.json(system);
      }
    });
};

/**
 * Show the current system
 */
exports.read = function (req, res) {
  res.json(req.system);
};

/**
 * Update a system
 */
exports.update = function (req, res) {
  console.log('called', "here");
  console.log('called');

  // return;
  var system = req.system;

  system.name = _.isUndefined(req.body.name) ? system.name : req.body.name;
  system.rest_url_ip = req.body.rest_url_ip;
  system.wwn = req.body.wwn;
  system.provisioning_state = req.body.provisioning_state;
  system.applications = req.body.applications;

  system.save(function (err) {
      logger.info('InfinidatSystem infinidat-system.save(): Entered');
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        logger.info('InfinidatSystem infinidat-system.save(): Calling Job.create()...');        
        Job.create(req, 'infinidat-system', function(err, createJobRes) {
          createJobRes.update('Completed', 'InfinidatSystem Saved', system);
        });
        res.json(system);
      }
    });
  
};

/**
 * Delete an system
 */
exports.delete = function (req, res) {
  var system = req.system;

  //check for POD dependancy
  // Pod.find({ 'system_keys' : mongoose.Types.ObjectId(system._id) }).exec(function (err, systems) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     if(systems.length > 0) {
  //       return res.status(400).send({
  //         message: 'Can\'t perform Delete: Please ensure all associated systems are deleted from the pods'
  //       });
  //     } else {
  //       system.remove(function (err) {
  //         if (err) {
  //           return res.status(400).send({
  //             message: errorHandler.getErrorMessage(err)
  //           });
  //         } else {
  //           Job.create(req, 'system', function(err, deleteJobRes) {
  //             deleteJobRes.update('Completed', 'System Deleted', system);
  //           });
  //           res.json({});
  //         }
  //       });
  //     }
  //   }
  // });
};

/**
 * List of systems
 */
exports.list = function (req, res) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  InfinidatSystem.find().exec(function (err, systems) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(systems);
    }
  });
};

/**
 *Infinidat System middleware
 */
exports.infinidatSystemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Infinidat System is invalid'
    });
  }

  InfinidatSystem.findById(id).populate('applications').exec(function (err, system) {
    if (err) {
      return next(err);
    } else if (!system) {
      return res.status(404).send({
        message: 'No Infinidat System with that identifier has been found'
      });
    }
    req.system = system;
    next();
  });
};
