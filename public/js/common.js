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
	$("body").on('click', 'div.picture', function(){
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
			.addClass('glyphicon-heart').click();

	});

	//clike like btn
	$("body").on('click', 'a.like', function(e){
		var _this = $(this);
		_this
			.removeClass('glyphicon-heart-empty')
			.addClass('glyphicon-heart');
	});

	//commnet clicked
	$("body").on('click', 'a.comment', function(e){
		var _this = $(this);
		var forms = $("form.comment");
		var form = _this.parents('div.blog').find('form');
		forms.hide();
		form.stop(true)
			.slideDown('fast')
			.find('input[name="comment"]').focus();
	});

	$("body").on('click', 'a.reply', function(e){
		var _this = $(this);
		var forms = $("form.comment");
		var form = _this.parents('div.msg-item').find('form');
		forms.hide();
		form.stop(true)
			.slideDown('fast')
			.find('input[name="comment"]').focus();
	});

	//reply commnet
	$("body").on('click','li.reply',function(e){

		var _this = $(this);
		var msgno = _this.attr('mno');
		var loginUser = $("#loginUser").val();
		var forms = $("form.comment");
		var form = _this.parents('div.blog').find('form');
		var a = _this.find('a').first();
		var uname = a.attr('title');
		var user = a.attr('href').split('/')[1];

		if(!form[0] || (loginUser == uname)){

			form.stop(true)
			.slideUp('fast')
			return false;
		};

		form[0].to.value = user;
		form[0].tnick.value = uname;
		form[0].parent.value = msgno;

		forms.hide();
		form.stop(true)
			.slideDown('fast')
			.find('input[name="comment"]')
			.attr('placeholder', '回复：'+uname)
			.focus();
	});

	//get comments
	$("div.blog").each(function(_, blog){
		var id = blog.id.split('-')[1],
			$blog = $(blog),
			container = $blog.find('ul.comments'),
			loginUser = $("#loginUser").val(),
			count = 0,
			loaded,commentLabel,likeLable;

		loaded = container.hasClass('done');

		commentLabel = $blog.find('span.comment span');
		likeLable = $blog.find('span.like span');
		
		if(loaded) return false;

		getComments({
			action: 'GETALL',
			postid: id
		}, function(res){
			if(res.result_code == 200){
				var tpl = '',
					comments = res.comments,
					listen = '',
					i,from,to;

				for(i=0; i<comments.length; i++){
					from = comments[i].message_from_nick || comments[i].message_from;
					to = comments[i].message_to_nick || comments[i].message_to;

					if(from != loginUser){
						listen = 'class="reply"';
					}

					if(comments[i].message_parent == 0){
						count++;
						tpl += '<li id="'+ comments[i].message_no +'" '+ listen +'  mno="'+ comments[i].message_no +'"><a title="'+ from +'" href="zone/'+ comments[i].message_from +'">'+ from +'</a>: <span>'+ comments[i].message_content +'</span></li>';
					}else{
						tpl += '<li id="'+ comments[i].message_no +'" '+ listen +'  mno="'+ comments[i].message_parent +'"><a title="'+ from +'" href="zone/'+ comments[i].message_from +'">'+ from +'</a>回复<a href="zone/'+ comments[i].message_to +'">'+ to +'</a>: <span>'+ comments[i].message_content +'</span></li>'
					}
				}

				container.empty()
						.append(tpl).
						addClass('done');

			}else{
				container.empty();
			}

			commentLabel.text(count);
			likeLable.text(res.likes || 0);
		});

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

	//submit comment
	$("body").on('click', 'input.submitComment', function(e){
		var _this = $(this),
			form = this.form;

		doComment(form);

	});

	//初始化模态框
	window.myModal = new myModal();

});

//回复留言
function replyLeaveMsg(mno, content){
	var form = $("form.leave-msg")[0],
		parent;

		(content.length > 16) && (content = content.slice(0, 16)+'...');

		$(form.content).attr('placeholder', '回复问题：'+content).focus();
		form.parent.value = mno;

}

//留言
function leaveMsg(form, _this){
	var _this = $(_this),
		content = form.content.value,
		parent = form.parent.value,
		tpl = '',
		container = $("div.message-wrapper"),
		replyContainer,
		params;

	if(!content) return false;
	
	params = {
		action: 'LEAVEMSG',
		content: content,
		parent: parent,
	};

	$.post("/message/leavemsg", params, function(result){
		if(result.result_code == 200){
			if(parent){
				replyContainer = $("#msg-"+parent).find('ul.answer');

				tpl = '<li> '+ content +'</li>';
				replyContainer.append(tpl);
			}else{
				tpl = '<div id="msg-'+ result.msgid +'" class="msg">'+
						'<h3><span>Q</span>: '+ content +'<a title="回复" onclick="replyLeaveMsg('+ result.msgid + ', \''+ content +'\');" href="javascript:void(0);" class="glyphicon glyphicon-share"></a></h3>'+
						'<ul class="answer">'+
						'</li>'+
					'</div>';

				container.append(tpl);
			}

			$(form.content).attr('placeholder', '说点什么吧');
			form.content.value = '';
			form.parent.value = '';
		}
	});
}

//点赞
function doLike(postid, from, fnick, to, tnick, _this){
	var _this = $(_this),
		params,commentUl,tpl,likeLable;

	if(!from || !to || !postid) return false;

	likeLable = _this.next().find('span');

	params = {
		action: 'LIKE',
		postid: postid,
		from: from,
		fnick: fnick || '',
		to: to,
		tnick: tnick || ''
	};

	$.post("/message/like", params, function(result){
		if(result.result_code == 200){
			likeLable.text(parseInt(likeLable.text())+1);
		}
	});
}

//填写评论
function doComment(form){
	var _this = $(_this),
		content = form.comment.value,
		postid = form.pno.value,
		params,commentUl,tpl,commentLabel,from,to;

	commentUl = $(form).prev();
	commentLabel = commentUl.prev().find('span.comment span');

	if(!content || !postid) return false;

	from = form.fnick.value || form.from.value;
	to = form.tnick.value || form.to.value;

	params = {
		action: 'COMMENT',
		postid: postid,
		content: content,
		from: form.from.value,
		fnick: form.fnick.value || '',
		to: form.to.value,
		tnick: form.tnick.value || '',
		parent: form.parent.value || 0
	};

	$.post("/message/commnet", params, function(result){
		if(result.result_code == 200){
			if(params.parent == 0){
				tpl = '<li id="'+ result.msgid +'"><a href="zone/'+ result.from +'">'+ from +'</a>: <span>'+ content +'</span></li>';
				commentUl.append(tpl);
			}else{
				tpl = '<li id="'+ result.msgid +'"><a href="zone/'+ result.from +'">'+ from +'</a>回复<a href="zone/'+ result.to +'">'+ to +'</a>: <span>'+ content +'</span></li>';
				$(tpl).insertAfter('li[mno='+ params.parent +']:last');
			}
			
			commentLabel.text(parseInt(commentLabel.text())+1);
			form.comment.value = '';
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

//加载评论信息
function getComments(params, callback){
	$.post('/message/getall', params, function(res){
		callback && callback(res);
	});
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