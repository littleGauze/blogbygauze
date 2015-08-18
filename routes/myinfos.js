var express = require('express');
var Posts = require('../models/Posts');
var router = express.Router();

router.all('*', function(req, res, next){
	if(!req.session.userinfo){
		res.redirect('/');
	}
	next();
});

router.get('/', function(req, res){
	var params = {
		auth: req.auth,
		action: 'MYPOSTS',
		page: 1,
		limit: 10,
		username: req.session.userinfo.user_name
	};

	Posts.findPostsByUname(params, function(result){
		result = JSON.parse(result);
		var posts = [];
		if(result.result_code == 200){
			posts = result.posts;
		}
		
		res.render('myinfos', {type: 'posted', posts: posts});

	});
});

router.get('/atme', function(req, res){
	res.render('myinfos', {type: 'atme'});
});

router.get('/friends', function(req, res){
	res.render('myinfos', {type: 'friends'});
});

//查询用户帖子
router.get('/myposts', function(req, res){

	var params = {
		auth: req.auth,
		action: 'MYPOSTS',
		page: req.body.page,
		limit: req.body.limit,
		username: req.body.username
	};

	Posts.findPostsByUname(params, function(result){
		
		res.send(result);

	});
});


module.exports = router;