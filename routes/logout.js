var express = require('express');
var Users = require('../models/Users');
var router = express.Router();

router.get('/', function(req, res){
	req.session.userinfo = null;
	res.redirect('/');
});

module.exports = router;