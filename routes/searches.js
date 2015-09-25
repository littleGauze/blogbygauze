var express = require('express');
var Posts = require('../models/Posts');
var Rels = require('../models/Relations');
var router = express.Router();

router.get('/', function(req, res){

	var params = {
		auth: req.auth,
		action: 'ALLPOSTS',
		page: req.query.page || 1
	};

	if(req.session.userinfo){
		params.exclude = req.session.userinfo.user_name;
	}

	Posts.findAllPosts(params, function(result){
		
		result = JSON.parse(result);
		var posts = [];
		if(result.result_code == 200){
			posts = result.posts;
		}
		
		res.render('searches', {posts: posts});

	})
	
});

router.post('/fallow', function(req, res){
	var params = {
		auth: req.auth,
		action: 'FALLOW',
		user: req.body.user,
		me: req.body.me,
		nick: req.body.nick
	};

	Rels.fallow(params, function(result){
		result = JSON.parse(result);

		res.send(result);
	});

});

router.post('/unfallow', function(req, res){
	var params = {
		auth: req.auth,
		action: 'UNFALLOW',
		user: req.body.user,
		me: req.body.me
	};

	Rels.unfallow(params, function(result){
		result = JSON.parse(result);

		res.send(result);
	});

});

module.exports = router;