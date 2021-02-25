'use strict';

/**
 * Module dependencies.
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
	* Dashboard Schema 
*/

var DashboardInfiniboxDriveSchema = new Schema({
  system_name: {
    type: String,
    default: '',
    trim: true
  },
  id: {
    type: Number,
    default: 0
  },
  enclosure_index: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  failure_reason: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('infinibox_drive_health', DashboardInfiniboxDriveSchema);
