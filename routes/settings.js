var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('settings', {type: 'baseinfo'});
});

router.get('/cpass', function(req, res){
	res.render('settings', {type: 'changepass'});
});

module.exports = router;