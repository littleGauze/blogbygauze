var express = require('express');
var Posts = require('../models/Posts');
var rels = require('../models/Relations');
var msg = require('../models/Messages');
var router = express.Router();

router.all('*', function(req, res, next){
	if(!req.session.userinfo){
		res.redirect('/');
	}else{
		next();
	}
});

router.get('/', function(req, res){
	var params = {
		auth: req.auth,
		action: 'MYPOSTS',
		page: req.query.page || 1,
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

	var params = {
		auth: req.auth,
		action: 'MYMSG',
		user: req.session.userinfo.user_name,
		page: req.query.page || 1
	};

	msg.myMsg(params, function(result){
		result = JSON.parse(result);
		if(result.result_code == 200){
			res.render('myinfos', {type: 'atme', messages: result.messages});
		}else{
			res.render('myinfos', {type: 'atme', messages: []});
		}

	});

});

router.get('/friends', function(req, res){

	var params = {
		auth: req.auth,
		action: 'GETFRIENDS',
		user: req.session.userinfo.user_name,
		page: req.query.page || 1
	};
	
	rels.getFriends(params, function(result){
		result = JSON.parse(result);
		if(req.query.page){
			if(result.result_code == 200){
				res.send(result.lists);
			}else{
				res.send([]);
			}
		}else{
			if(result.result_code == 200){
				res.render('myinfos', {type: 'friends', lists: result.lists});
			}else{
				res.render('myinfos', {type: 'friends', lists: []});
			}
		}

	});

});

router.get('/fallowed', function(req, res){
	var params = {
		auth: req.auth,
		action: 'FALLOWED',
		user: req.session.userinfo.user_name,
		page: req.query.page || 1
	};

	rels.getFallowed(params, function(result){
		console.log(result);
		result = JSON.parse(result);

		if(result.result_code == 200){
			res.send(result.lists);
		}else{
			res.send([]);
		}
	});

});

router.get('/fallowing', function(req, res){
	var params = {
		auth: req.auth,
		action: 'FALLOWING',
		user: req.session.userinfo.user_name,
		page: req.query.page || 1
	};

	rels.getFallowing(params, function(result){
		result = JSON.parse(result);

		if(result.result_code == 200){
			res.send(result.lists);
		}else{
			res.send([]);
		}
	});

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