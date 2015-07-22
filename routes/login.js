var express = require('express');
var Users = require('../models/Users');
var router = express.Router();

router.post('/', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		username: req.body.username,
		userpass: req.body.userpass
	};
	
	Users.login(params, function(result){
		result = JSON.parse(result);
		req.session.userinfo = result.userinfo;
		res.send(result);
	});
});

module.exports = router;