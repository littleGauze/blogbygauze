var superagent = require('superagent');
var config = require('../common/config')
var Relations = function(){};
	Relations.prototype.baseUrl = config.mysqlUrl;

//关注用户
Relations.prototype.fallow = function(params, callback){
	this.doRequest('post', params, callback);
}

//取消关注
Relations.prototype.unfallow = function(params, callback){
	this.doRequest('post', params, callback);
}

//获取好友列表
Relations.prototype.getFriends = function(params, callback){
	this.doRequest('post', params, callback);
}

//获取我关注的所有用户
Relations.prototype.getFallowed = function(params, callback){
	this.doRequest('post', params,  callback);
}

//获取关注我的所有用户
Relations.prototype.getFallowing = function(params, callback){
	this.doRequest('post', params,  callback);
}

//请求封装
Relations.prototype.doRequest = function(method, params, callback){
	params.type = 'relations';

	superagent[method](this.baseUrl)
		.type('form')
		.send(params)
		.end(function(err, res){
			var result = res.text.replace(/<script type="text\/javascript">.*<\/script>/igm, '');
			callback(result);
		});
};

module.exports = new Relations;