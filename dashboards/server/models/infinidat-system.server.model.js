'use strict';

/**
 * Module dependencies.
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Dashboard Schema
*/	

var DashboardInfiniboxSystemSchema = new Schema({
	system_name: {
		type: String,
		default: '',
		trim: true
	},
	system_mode: {
		type: String,
		default: '',
		trim: true
	},
	system_state: {
		type: String,
		default: '',
		trim: true
	},
	system_missing_drives: {
		type: Number,
		default: 0
	}
})

mongoose.model('infinibox_system_health',DashboardInfiniboxSystemSchema);


