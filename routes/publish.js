var express = require('express');
var Posts = require('../models/Posts');
var router = express.Router();

router.all('*', function(req, res, next){
	if(!req.session.userinfo){
		res.redirect('/');
	}else{
		next();
	}
});

router.get('/', function(req, res){
	res.render('publish');
});

router.post('/posts', function(req, res){
	var params = {
		auth: req.auth,
		action: 'PUBLISH',
		username: req.body.username,
		key: req.body.key,
		desc: req.body.desc,
		nick: req.body.nick
	}

	Posts.publish(params, function(result){
		result = JSON.parse(result);
		res.send(result);
	});

});

module.exports = router;