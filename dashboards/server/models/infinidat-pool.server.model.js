'use strict';

/**
 * Module dependencies.
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
	* Dashboard Schema 
*/

var DashboardInfiniboxPoolSchema = new Schema({
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
  free_physical_space: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  physical_capacity : {
    type: Number,
    default: 0
  },
  space_used_in_percentage: {
		type: Number,
    default: 0
  }
});

mongoose.model('infinibox_pool_health', DashboardInfiniboxPoolSchema);
