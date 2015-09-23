var express = require('express');
var msg = require('../models/Messages');
var router = express.Router();

router.post('/commnet', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		postid: req.body.postid,
		from: req.body.from,
		fnick: req.body.fnick,
		to: req.body.to,
		tnick: req.body.tnick,
		content: req.body.content,
		parent: req.body.parent
	};

	msg.comment(params, function(result){
		result = JSON.parse(result);
		res.send(result);
	});

});

router.post('/like', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		postid: req.body.postid,
		from: req.body.from,
		fnick: req.body.fnick,
		to: req.body.to,
		tnick: req.body.tnick
	};

	msg.like(params, function(result){
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

router.post('/mymsg', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		user: req.body.user,
		page: req.body.page,
		limit: req.body.limit
	};

	msg.myMsg(params, function(result){
		result = JSON.parse(result);
		res.send(result);
	});

});

router.post('/leavemsg', function(req, res){
	var params = {
		auth: req.auth,
		action: req.body.action,
		content: req.body.content,
		parent: req.body.parent
	};

	msg.leaveMsg(params, function(result){
		result = JSON.parse(result);
		res.send(result);
	});

});

module.exports = router;