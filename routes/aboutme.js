var express = require('express');
var msg = require('../models/Messages');
var router = express.Router();

router.get('/', function(req, res){

	var params = {
		auth: req.auth,
		action: 'GETLEAVEMSG'
	};

	msg.getLeaveMsg(params, function(result){
		result = JSON.parse(result);
		if(result.result_code == 200){
			res.render('aboutme', {messages: result.messages});
		}else{
			res.render('aboutme', {messages: []});
		}
	});
});

module.exports = router;