/*common js put it here*/
//document ready
$(function(){
	var i = setInterval(function(){
		if($.fn.stickUp){
			$(".navbar-wrappr").stickUp();
			clearInterval(i);
		}
	}, 10);

	//window.scroll listening
	var publish = $("div.publish-wrapper");
	var mynav = $(".mynav-wrapper");
	$(window).scroll(function(e){
		var _this = $(this);
		var sTop = _this.scrollTop();
		if(sTop < 80){
			publish.stop(true).fadeIn();
		}else if(sTop > 100 && sTop < 500){
			publish.stop(true).fadeOut();
		}

		if(mynav[0]){
			var top = mynav.offset().top;
			
		}

	});

	//double click like it
	$("div.picture").dblclick(function(){
		var _this = $(this);
		var heart = '<span class="tmp-heart glyphicon glyphicon-heart"></span>';
		_this.append(heart).find("span.tmp-heart").animate({
			fontSize: '100px',
			opacity: 0
		});
		_this
			.next()
			.find("a.like")
			.removeClass('glyphicon-heart-empty')
			.addClass('glyphicon-heart');
	});

	//clike like btn
	$("a.like").click(function(e){
		var _this = $(this);
		_this
			.removeClass('glyphicon-heart-empty')
			.addClass('glyphicon-heart');
	});

	//commnet clicked
	$("a.comment").click(function(e){
		var _this = $(this);
		var form = _this.parents('div.blog').find('form');
		form.stop(true)
			.slideDown('fast')
			.find('input[name="comment"]').focus();
	});

	//hide the comment input when blur
	$("input[name='comment']").blur(function(e){
		var _this = $(this);
		var form = _this.parents('form');
		form.stop(true).slideUp('fast');
	});

	//logout
	$("a.logout").click(function(e){
		if(confirm('确定要登出吗？')){
			window.location = '/logout';
		}
	});

});

//警告框
var ALERT_TPL = '<div class="alert alert-danger alert-dismissible" role="alert">'+
			  	'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
			  	'<label></label>'+
			'</div>';

//生成随机字符
function getRandomKey(length){
	var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
	var key = '';

	for(var i=0; i<length; i++){
		var random = this.randomNum(0,63);
		key += str.charAt(random);
	}

	return key;
};

//生成随机数
function randomNum(start, end){
	end = end || start && (start = 0);

	return Math.floor(Math.random() * end) + start;
}

//将字符串打撒再返回
function shuffleStr(str){
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