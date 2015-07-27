var express = require('express');
var router = express.Router();

router.all('*', function(req, res, next){
	if(!req.session.userinfo){
		res.redirect('/');
	}
	next();
});

router.get('/', function(req, res){
	res.render('myinfos', {type: 'posted'});
});

router.get('/atme', function(req, res){
	res.render('myinfos', {type: 'atme'});
});

router.get('/friends', function(req, res){
	res.render('myinfos', {type: 'friends'});
});

module.exports = router;