/*settings js*/
var Qiniu_UploadUrl = "http://up.qiniu.com";

//

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

		key += getRandomKey(16);
		key += new Date().getTime();
		//打散字符串
		key = shuffleStr(key);
		key = uname + "/" + key;
		
		var params = {
			bucketname: bucketname + ":" + key
		};

		//获取上传凭证
		$.post('/qiniu/getToken', params, function(res){

			if(res.status == 'ok'){
				token = res.uptoken;

				 if (file.files.length > 0 && token != "" && key) {
			        Qiniu_upload(file.files[0], token, key);
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

//普通上传
function Qiniu_upload(f, token, key) {
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
           console.log(percentComplete);
        }
    }, false);

    xhr.onreadystatechange = function(response) {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
            var blkRet = JSON.parse(xhr.responseText);
            if(blkRet.error){
            	alert('上传失败!');
            }else{
            	$("#key").val(key);
            	var img = $("#privew")[0];
            		img.src = bucketUrl + key;
            }
            console && console.log(blkRet);
            
        } else if (xhr.status != 200 && xhr.responseText) {

        }
    };

    startDate = new Date().getTime();
    
    xhr.send(formData);
};