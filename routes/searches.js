var express = require('express');
var Posts = require('../models/Posts');
var router = express.Router();

router.get('/', function(req, res){

	var params = {
		auth: req.auth,
		action: 'ALLPOSTS',
		page: 1,
		limit: 20
	};

	Posts.findAllPosts(params, function(result){
		
		result = JSON.parse(result);
		var posts = [];
		if(result.result_code == 200){
			posts = result.posts;
		}
		console.log(posts);
		res.render('searches', {posts: posts});

	})
	
});

module.exports = router;