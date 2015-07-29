var superagent = require('superagent');
var config = require('../common/config')
var Posts = function(){};
	Posts.prototype.baseUrl = config.mysqlUrl;

//发表帖子
Posts.prototype.publish = function(params, callback){
	this.doRequest('post', params, callback);
}

//根据用户名查询帖子
Posts.prototype.findPostsByUname = function(params, callback){
	this.doRequest('post', params, callback);
}

//查询所有最新的帖子
Posts.prototype.findAllPosts = function(params, callback){
	this.doRequest('post', params, callback);
}

//请求封装
Posts.prototype.doRequest = function(method, params, callback){
	params.type = 'posts';

	superagent[method](this.baseUrl)
		.type('form')
		.send(params)
		.end(function(err, res){
			var result = res.text.replace(/<script type="text\/javascript">.*<\/script>/igm, '');
			callback(result);
		});
};

module.exports = new Posts;