var express = require('express');
var msg = require('../models/Messages');
var router = express.Router();

router.post('/commnet', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		postid: req.body.postid,
		from: req.body.from,
		to: req.body.to,
		content: req.body.content,
		parent: req.body.parent
	};

	msg.comment(params, function(result){
		result = JSON.parse(result);
		res.send(result);
	});

});

router.post('/getall', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		postid: req.body.postid
	};

	msg.getAll(params, function(result){
		result = JSON.parse(result);
		res.send(result);
	});

});

module.exports = router;