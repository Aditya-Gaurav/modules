'use strict';

/**
 * Module dependencies.
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
	* Dashboard Schema 
*/

var DashboardInfiniboxVolumeSchema = new Schema({
  system_name: {
    type: String,
    default: '',
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  mapped: {
    type: String,
    default: '',
    trim: true
  },
  used_size_in_percentage: {
    type: Number,
    default: 0
  },
  available_size_in_gb: {
    type: Number,
    default: 0
  }
});

mongoose.model('infinibox_volume_health', DashboardInfiniboxVolumeSchema);
