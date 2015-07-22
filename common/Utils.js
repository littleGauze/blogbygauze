var Utils = function(){};

//生成秘钥
Utils.prototype.getAuth = function(length, token) {
	var tlength = token.length || 0;
	length = length || 0;
	length = length - tlength;
	var str = 'bcdfghjkmnopqrstuvwxyABCDEFHIJKLMNOPQRSTUVWXYZ0123456789';
	var auth = '';

	for(var i=0; i<length; i++){
		var random = this.randomNum(0,55);
		auth += str.charAt(random);
	}
	auth += token;
	
	//打乱token
	auth = this.shuffleStr(auth);

	return auth;

};

//生成随机数
Utils.prototype.randomNum = function(start, end){
	end = end || start && (start = 0);

	return Math.floor(Math.random() * end) + start;
}

//将字符串打撒再返回
Utils.prototype.shuffleStr = function(str){
	var rs = '';
	var orgin = str.split('');
	var length = str.length;
	
	while(length){
		var index = this.randomNum(0, length);
		var pice = orgin.splice(index, 1);
		rs += pice;
		length--;
	}

	return rs;
}

module.exports = new Utils;