var express = require('express');
var Qiniu = require('../models/Qiniu-api');
var router = express.Router();

router.post('/getToken', function(req, res){
	var bucketname = req.params.bucketname;
	var token = Qiniu.getToken(bucketname);
	res.send(token);
});

module.exports = router;