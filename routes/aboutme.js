var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('aboutme', {url: req.baseUrl});
});

module.exports = router;