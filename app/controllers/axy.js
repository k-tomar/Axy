'use strict'; 

/**
 * Module dependencies.
 */
require('../models/url');
var ID  = require('short-id');
var mongoose  = require('mongoose');
var UrlModel = mongoose.model('url');

/**
 * @configure short-id
 */

ID.configure({
  length: 6,
  algorithm: 'sha1',
  salt: Math.random
});


/**
 * @method form
 * @param {object} req and res
 */
exports.form = function (req, res) {
	res.send('<form action="/create" method="post"><input type="text" name="url" /><input type="submit" value="Create" /></form>');
};

/**
 * @method create
 * @param {object} req and res
 */
exports.create = function (req, res) {
	var url = req.param('url');
	console.log('Received ' + url);
	var data = {url: url};
	UrlModel.findOne({url: url}, function(err, result) {
		if(err) throw err;
		if (typeof result !== "undefined" && null !== result) {
			console.log('Result of url search is ' + result);
			data.key = result.key;
			console.log('Creating ShortUrl for ' + data.url + ' at key ' + data.key);
			return returnResponse(data);
		}
		data.key = ID.store(url);
		var  newUrl = new UrlModel(data);
		newUrl.save(function (err) {
			if (err) console.log(err);
		});
		console.log('Creating ShortUrl for ' + data.url + ' at key ' + data.key);
		returnResponse(data);

	});
	function returnResponse(data) {
		var host = req.get('host');
		console.log('The key for url ' + data.url + ' is ' + data.key);
		res.send('http://'+host+'/' + data.key, {'Content-Type': 'text/javascript'}, 200);
	}
	
};

/**
 * @method resolve
 * @param {object} req and res
 */
exports.resolve = function (req, res) {
	var key = req.param('key');
	console.log('Searching for url with key ' + key);
	UrlModel.findOneAndUpdate({key: key}, {'$inc': {hits: 1}}, function(err, result) {
		if (err) throw err;
		if (undefined == result) {
			console.log('Cound not match ' + key);
			return;
		}
		console.log('Redirecting to ' + result.url);
		res.redirect(result.url, 301);
	});

};

/**
 * @method list
 * @param {object} req and res
 */
exports.list = function (req, res) {
	UrlModel.find(function(err, result) {
		if (err) throw err;
		// res.jsonp(result, 200);
		var resp = '<ul>'
		for (var i = 0; i < result.length; i++) {
			resp += '<li>'+(i+1)+'. Url: ' + result[i].url+' - ShortKey: '+ result[i].key +' - Hits: '+ (undefined != result[i].hits ? result[i].hits: 0)+'</li>';
		};
		resp += "</ul>";
		res.send(resp, 200);

	});
};
