'use strict'; 

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var urlSchema = new Schema({
	key: {type:String, index:true},
	url: {type:String, index:true},
	hits: Number,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('url', urlSchema); 
