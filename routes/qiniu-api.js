var express = require('express');
var Qiniu = require('../common/Qiniu-api');
var router = express.Router();

router.post('/getToken', function(req, res){
	var bucketname = req.body.bucketname;
	var token = Qiniu.getToken(bucketname);
	res.send(token);
});

module.exports = router;