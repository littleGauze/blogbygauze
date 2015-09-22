var superagent = require('superagent');
var config = require('../common/config')
var Messages = function(){};
	Messages.prototype.baseUrl = config.mysqlUrl;

//发表评论
Messages.prototype.comment = function(params, callback){
	this.doRequest('post', params, callback);
}

//获取评论
Messages.prototype.getAll = function(params, callback){
	this.doRequest('post', params, callback);
}

//点赞
Messages.prototype.like = function(params, callback){
	this.doRequest('post', params, callback);
}

//获取我的消息
Messages.prototype.myMsg = function(params, callback){
	this.doRequest('post', params, callback);
}

//请求封装
Messages.prototype.doRequest = function(method, params, callback){
	params.type = 'message';

	superagent[method](this.baseUrl)
		.type('form')
		.send(params)
		.end(function(err, res){
			var result = res.text.replace(/<script type="text\/javascript">.*<\/script>/igm, '');
			callback(result);
		});
};

module.exports = new Messages;