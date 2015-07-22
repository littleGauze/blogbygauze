/*index js*/
$(function(){

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
	$("form input.btn").click(function(){
		var _this = $(this);
		var action = this.id;
		var form = _this.parents('form')[0];
		
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
		}else if(upass.length < 6){
			showAlert('密码长度必须大于6位!', userpass);
			return false;
		}
		
		if(!$(reuserpass).is(':hidden') && upass != reupass){
			showAlert('两次密码输入不一致!', reuserpass);
			return false;
		}

		var params = {
			action: action,
			username: uname,
			userpass: upass
		}

		var path = params.action.toLowerCase();
		//提交信息
		$.post('/'+path, params, function(res){
			var status = res.result_code;
			showAlert(res.result_desc, status);
		});
		
	});

});

//警告框
function showAlert(tips, input){
	//ALERT_TPL
	var alert = $(ALERT_TPL);
	if(typeof input == 'number'){
		alert
			.removeClass('alert-danger')
			.addClass('alert-success');
		input = null;
	}
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