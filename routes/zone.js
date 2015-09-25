var express = require('express');
var Posts = require('../models/Posts');
var router = express.Router();

router.get('/:name', function(req, res){
	var uname = req.params.name,
		userinfo = req.session.userinfo,
		host = '';
		if(userinfo){
			host = userinfo.user_name
		}
	//如果自己点了自己则跳转到个人空间
	if(host && uname == host){
		res.redirect('/myinfos');
		return;
	}

	var params = {
		auth: req.auth,
		action: 'MYPOSTS',
		page: req.query.page || 1,
		username: uname,
		fans: host
	};

	Posts.findPostsByUname(params, function(result){
		result = JSON.parse(result);
		var posts = [],
			userinfo = result.userinfo,
			fallow = result.fallow;
		if(result.result_code == 200){
			posts = result.posts;
		}
		
		res.render('zone', {posts: posts, user: userinfo, fallow: fallow});

	});
});

module.exports = router;