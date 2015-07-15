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
	$(window).scroll(function(e){
		var _this = $(this);
		var sTop = _this.scrollTop();
		if(sTop < 80){
			publish.stop(true).fadeIn();
		}else if(sTop > 100 && sTop < 500){
			publish.stop(true).fadeOut();
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

});