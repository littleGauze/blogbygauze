var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('myinfos', {url: req.url, type: 'posted'});
});

router.get('/atme', function(req, res){
	res.render('myinfos', {url: req.url, type: 'atme'});
});

router.get('/friends', function(req, res){
	res.render('myinfos', {url: req.url, type: 'friends'});
});

module.exports = router;