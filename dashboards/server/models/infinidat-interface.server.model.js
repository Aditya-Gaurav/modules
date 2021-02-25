'use strict';

/**
 * Module dependencies.
*/

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
	* Dashboard Schema 
*/

var DashboardInfiniboxInterfaceSchema = new Schema({
  system_name: {
    type: String,
    default: '',
    trim: true
  },
  hba_port_number: {
    type: Number,
    default: 0
  },
  system_interface_port_number: {
    type: Number,
    default: 0
  },
  wwnn: {
    type: String,
    default: '',
    trim: true
  },
  wwpn : {
    type: String,
    default: '',
    trim: true
  },
  state: {
		type: String,
    default: '',
    trim: true
  },
  state_description: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('infinibox_interface_health', DashboardInfiniboxInterfaceSchema);
