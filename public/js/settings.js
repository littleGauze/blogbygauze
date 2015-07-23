/*settings js*/
$(function(){
	var form = $("#baseinfo");

	var file = form[0].file;
	var username = form[0].username;
	var uname = $.trim(username.value);
	var bucketname = '';

	$(file).change(function(e){
		var file = this.files[0];

		bucketname += getRandomKey(16);
		bucketname += new Date().getTime();
		//打散字符串
		bucketname = shuffleStr(bucketname);
		bucketname = uname + "/" + bucketname;
		
		var params = {
			bucketname: bucketname
		};

		//获取上传凭证
		$.post('/qiniu/getToken', params, function(res){

			console.log(res);

		});

	});

});