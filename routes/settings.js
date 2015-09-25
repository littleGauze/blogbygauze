var express = require('express');
var Users = require('../models/Users');
var router = express.Router();

router.all('*', function(req, res, next){
	if(!req.session.userinfo){
		res.redirect('/');
	}else{
		next();
	}
});

router.get('/', function(req, res){
	res.render('settings', {type: 'baseinfo'});
});

router.get('/cpass', function(req, res){
	res.render('settings', {type: 'changepass'});
});

router.post('/baseinfo', function(req, res){
	var params = req.body;
	//从session中取出用户名
	var username = req.session.userinfo.user_name;
		params.username = username;
		params.auth = req.auth;
	Users.saveBaseinfo(params, function(rs){
		rs = JSON.parse(rs);
		//更新session信息
		(rs.result_code == 200) && (req.session.userinfo = rs.userinfo);
		res.send(rs);
	});
})

router.post('/changepass', function(req, res){
	var params = req.body,
		username = req.session.userinfo.user_name;

	params.username = username;
	params.auth = req.auth;

	Users.changePassword(params, function(rs){
		rs = JSON.parse(rs);

		res.send(rs);

	});
});

module.exports = router;