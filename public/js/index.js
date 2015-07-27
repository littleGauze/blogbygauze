/*index js*/
$(function(){

	//litening enter key
	$("body").keyup(function(e){
		 if(e.keyCode == 13){
		 	$("form input.submit").trigger('click');
		 }
	});

	//handle register click
	$("#switch-reg").click(function(){
		var _this = $(this);
		var repass = _this.parent().prev().find('[name=reuserpass]');
		var btn = repass.next();

		if(_this.hasClass('login')){
			_this.removeClass('login')
				 .addClass('register')
				 .text('已有账号？登录');
			repass.slideDown().removeClass('hide');
			btn.attr('id', 'REGISTER').val('注册');
		}else{
			_this.removeClass('register')
				 .addClass('login')
				 .text('立即注册');

			repass.slideUp();
			btn.attr('id', 'LOGIN').val('登陆');
		}
	});

	//user login
	$('input[name=username]').keyup(function(e){
		var _this = $(this);
		var value = _this.val();
		if(!usernameLimit(e.key)){
			value = value.slice(0, -1);
		}

		value = value.replace(/[^\x00-\xff]/mg, '');

		_this.val(value);
	});

	//验证表单
	$("form input.submit").click(function(){
		var _this = $(this);
		var action = this.id;
		var form = _this.parents('form')[0];
		
		var isReg = (action == 'REGISTER');
		var btn = form.submit;
		var username = form.username;
		var userpass = form.userpass;
		var reuserpass = form.reuserpass;
		
		var uname = username.value;
		var upass = userpass.value;
		var reupass = reuserpass.value;

		if(!uname){
			showAlert('用户名不能为空!', username);
			return false;
		}

		if(!upass){
			showAlert('密码不能为空!', userpass);
			return false;
		}else if(isReg && upass.length < 6){
			showAlert('密码长度必须大于6位!', userpass);
			return false;
		}
		
		if(isReg && upass != reupass){
			showAlert('两次密码输入不一致!', reuserpass);
			return false;
		}

		var params = {
			action: action,
			username: uname,
			userpass: upass
		}

		var path = params.action.toLowerCase();
		var tips1 = (path=='login')?'正在登录...':'正在注册...';
		var tips2 = (path=='login')?'登录成功! 正在跳转...':'注册成功! 返回登录...';
		$(btn).prop('disabled', true).val(tips1);

		//检查用户名
		if(isReg){
			$.post('/register/checkusername', {action: 'CHECKUSERNAME', username: uname}, function(res){
				if(res.result_code != 200){
					showAlert(res.result_desc, username);
					$(btn).prop('disabled', false).val('注册');
				}else{
					//提交信息【注册】
					doRequest(path, params, btn, tips2);

				}
			});
		}else{
			//提交信息【登录】
			doRequest(path, params, btn, tips2);
		}
	});

});

function doRequest(path, params, btn, tips2){
	$.post('/'+path, params, function(res){
		var status = res.result_code;
		if(status == 200){
			$(btn).prop('disabled', false).val(tips2);
			setTimeout(function(){window.location = '/'}, 1000);
		}else{
			$(btn).prop('disabled', false).val('登陆');
			showAlert(res.result_desc);
		}
	});
}

//警告框
function showAlert(tips, input){
	//ALERT_TPL
	var alert = $(ALERT_TPL);
	alert.find('label').text(tips);
	input && input.focus();
	$("div.no-login").prepend(alert);

	setTimeout(function(){ $(alert).remove(); }, 2000);

}

//只允许输入字母和数字
function usernameLimit(value){
	var reg = /[a-zA-Z0-9]{1}/;

	return reg.test(value)

}