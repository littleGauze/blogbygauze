/*settings js*/
$(function(){
	var form = $("#baseinfo");
	//上传图片
	var bucketname = 'blogbygauze';
    var progressbar = $("#progressbar");

	var file = form[0].file;
	var username = form[0].username;
	var uname = $.trim(username.value);
	var key = '';
	var token = '';

	$(file).change(function(e){
		//获取上传凭证
		var res = getUpToken(uname, function(res){
			if(res){
				token = res.uptoken;
				key = res.key;

				 if (file.files.length > 0 && token != "" && key) {
			        Qiniu_upload(file.files[0], token, key, function(status, res){
			        	if(status == 200){
			        		if(res.error){
				            	alert('上传失败!');
				            }else{
				            	$("#key").val(key);
				            	var img = $("#privew")[0];
				            		img.src = bucketUrl + key;
				            }
				            console && console.log(res);
			        	}else{

			        	}
			        }, function(percent, speed){
	      			 	console.log(percent, speed);
			        });
			    } else {
			        console && console.log("form input error");
			    }

			   
			}else{
				alert('获取上传凭证失败!');
			}
		});
	});

	//保存数据
	$("#save-btn").click(function(){
		var form = $("#baseinfo")[0];

		var params = {
			action: 'SAVEBASEINFO',
			key: form.key.value,
			gender: form.gender.value,
			nickname: form.nickname.value,
			motto: form.motto.value
		}

		//保存数据
		$.post('/settings/baseinfo', params, function(res){
			myModal.set('提示', res.result_desc);
			if(res.result_code == 200){
				myModal.show(1000, function(){window.location = '/settings';});
			}else{
				myModal.show(1000);
			}
		});
	})

});