var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('myinfos', {url: req.originalUrl, type: 'posted'});
});

router.get('/atme', function(req, res){
	res.render('myinfos', {url: req.originalUrl, type: 'atme'});
});

router.get('/friends', function(req, res){
	res.render('myinfos', {url: req.originalUrl, type: 'friends'});
});

module.exports = router;