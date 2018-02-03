var express = require('express');
var router = express.Router();
var fs = require('fs');

var yahoo = require('../services/finance.js');

/* GET home page. */
router.get('/', function (req, res, next) {

	if (process.env.API_MODE) {
		res.redirect('/data');
	} else {
		res.type('text/html');
		res.sendFile(path.resolve(__dirname, 'public/index.html'));
	}
});

module.exports = router;
