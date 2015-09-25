/*settings js*/
$(function(){
	var form = $("#baseinfo");
	//上传图片
	var bucketname = 'blogbygauze';
    var progressbar = $("#progressbar");

    if(form[0]){
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
    }

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

//修改密码
function checkForm(form){
	var oldpass = form.oldpassword.value,
		newpass = form.newpassword.value,
		confirmpass = form.confirmnewpass.value,
		data;

	if(!oldpass){
		alert('旧密码不能为空!');
		return false;
	}

	if(!newpass){
		alert('新密码不能为空!');
		return false;
	}

	if(newpass != confirmpass){
		alert('两次输入的密码不一致!');
		return false;
	}

	data = $(form).serialize();

	$.post('/settings/changepass', data, function(res){
		myModal.set('提示', res.result_desc);
		if(res.result_code == 200){
			myModal.show(1000, function(){window.location = '/settings/cpass';});
		}else{
			myModal.show(1000);
		}
	});

	return false;
}