var superagent = require('superagent');
var Users = function(){};
	Users.prototype.baseUrl = 'http://nblog.9451.com';

//用户注册
Users.prototype.register = function(params, callback){
	this.doRequest('post', params, callback);
}

//用户登录
Users.prototype.login = function(params, callback){
	this.doRequest('post', params, callback);
};

//请求封装
Users.prototype.doRequest = function(method, params, callback){
	params.type = 'users';

	superagent[method](this.baseUrl)
		.type('form')
		.send(params)
		.end(function(err, res){
			callback(res.text);
		});
};

module.exports = new Users;