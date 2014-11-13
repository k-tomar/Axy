var Ctrlr = require('./controllers/axy');
var mongoose = require('mongoose');

// expose the routes to our app with module.exports
module.exports = function (app, router) {
	router.get('/', Ctrlr.form);

	router.post('/create', Ctrlr.create);

	router.get('/list', Ctrlr.list);

	router.get('/:key', Ctrlr.resolve);

	app.use('/', router);
};