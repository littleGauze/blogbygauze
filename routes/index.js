var express = require('express');
var Posts = require('../models/Posts');
var router = express.Router();

router.get('/', function(req, res){
	var params = {
			auth: req.auth,
			page: 1,
			limit: 20
	};

	if(!req.session.userinfo){
		params.action = 'ALLPOSTS';

		Posts.findAllPosts(params, function(result){
			result = JSON.parse(result);
			var posts = [];
			if(result.result_code == 200){
				posts = result.posts;
			}
			
			res.render('index', {posts: posts});

		})
	}else{
		//获取我关注的帖子和我的帖子
		params.action = 'FALLOWPOSTS';
		params.uname = req.session.userinfo.user_name;

		Posts.findFallowPosts(params, function(result){
			var posts = [];
			result = JSON.parse(result);
			if(result.result_code == 200){
				posts = result.posts;
			}

			res.render('index', {posts: posts});
		});
	}
});

module.exports = router;