var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('myinfos', {url: req.baseUrl});
});

module.exports = router;