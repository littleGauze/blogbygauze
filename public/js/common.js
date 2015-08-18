/*common js put it here*/
var bucketUrl = "http://7xkdc3.com1.z0.glb.clouddn.com/";
var Qiniu_UploadUrl = "http://up.qiniu.com";
var BUCKETNAME = 'blogbygauze';

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
			opacity: 0,
			marginLeft: '-50px',
			marginTop: '-50px'
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
		var forms = $("form.comment");
		var form = _this.parents('div.blog').find('form');
		forms.hide();
		form.stop(true)
			.slideDown('fast')
			.find('input[name="comment"]').focus();
	});

	//hide the comment input when blur
	/*$("input[name='comment']").blur(function(e){
		var _this = $(this);
		var form = _this.parents('form');
		form.stop(true).slideUp('fast');
	});*/

	//logout
	$("a.logout").click(function(e){
		if(confirm('确定要登出吗？')){
			window.location = '/logout';
		}
	});

	//初始化模态框
	window.myModal = new myModal();

});

//填写评论
function doComment(postid, from, to, _this){
	var _this = $(_this),
		input,form,params,content,parent,commentUl,tpl;

	input = _this.prev().find('input');
	form = _this.parents('form');
	content = $.trim(input.val());
	parent = _this.attr('parent');
	commentUl = form.prev();

	if(!content || !postid) return false;

	params = {
		action: 'COMMENT',
		postid: postid,
		content: content,
		from: from,
		to: to,
		parent: parent || 0
	};

	$.post("message/commnet", params, function(result){
		if(result.result_code == 200){
			tpl = '<li id="'+ result.msgid +'"><a href="zone/'+ result.from +'">NealLi</a>: <span>'+ content +'</span></li>';
			commentUl.append(tpl);
			input.val('');
		}else{
			alert(result.result_desc);
		}
	});
}


function myModal(options, title, content){
	var _this = $("#myModal");
	var wtitle = _this.find('.modal-title');
	var wcontent = _this.find('.modal-body');
	var defaults = {
		keyboard: true,
		show: false
	};

	(typeof options == 'object') && (defaults = $.extend(defaults, options));

	//初始化
	_this.modal(defaults);

	this.show = function(timeout, callback){
		_this.modal('show');

		(timeout = parseInt(timeout)) && setTimeout(function(){
			_this.modal('hide');
			(typeof callback == 'function') && callback(this);
		}, timeout);
	}

	this.hide = function(){
		_this.modal('hide');
	}

	this.set = function(title, content){
		title && wtitle.html(title);
		content && wcontent.html(content);

		return this;
	}

}

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

//生成上传凭证的key
function genaratorKey(uname){
	var key = '';
	key += getRandomKey(16);
	key += new Date().getTime();
	//打散字符串
	key = shuffleStr(key);
	key = uname + "/" + key;

	return key;
}

//获取上传凭证
function getUpToken(uname, callback){
	//生成key
	var bucketname = BUCKETNAME;
	var key = genaratorKey(uname);
		
	var params = {
			bucketname: bucketname + ":" + key
		};

		//获取上传凭证
		$.post('/qiniu/getToken', params, function(res){

			if(res.status == 'ok'){
				token = res.uptoken;
			    //执行回调
			    callback({uptoken: token, key: key});

			}else{
				//执行回调
			    callback(false);
			}

		});
}

//普通上传
function Qiniu_upload(f, token, key, callback, progress) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Qiniu_UploadUrl, true);
    var formData, startDate;
    formData = new FormData();
    if (key !== null && key !== undefined) formData.append('key', key);
    formData.append('token', token);
    formData.append('file', f);
    var taking;
    xhr.upload.addEventListener("progress", function(evt) {
        if (evt.lengthComputable) {
            var nowDate = new Date().getTime();
            taking = nowDate - startDate;
            var x = (evt.loaded) / 1024;
            var y = taking / 1000;
            var uploadSpeed = (x / y);
            var formatSpeed;
            if (uploadSpeed > 1024) {
                formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
            } else {
                formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
            }
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            //进度回调
            progress(percentComplete, formatSpeed);
        }
    }, false);

    xhr.onreadystatechange = function(response) {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
            var blkRet = JSON.parse(xhr.responseText);
            //成功回调
            callback(xhr.status, blkRet);
            
        } else if (xhr.status != 200 && xhr.responseText) {
        	//失败回调
        	callback(xhr.status, xhr.responseText);
        }
    };

    startDate = new Date().getTime();
    
    xhr.send(formData);
};