var superagent = require('superagent');
var config = require('./config');
var qiniu = require('qiniu')
var Qiniu = function(){};
	Qiniu.prototype.baseUrl = config.qiuiUrl;

//获取上传凭证
Qiniu.prototype.getToken = function(bucketname, callback){
	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	var token = putPolicy.token();

	var rs = {
		status: token?'ok':'fail',
		uptoken: token
	};

	return rs;
}

module.exports = new Qiniu;