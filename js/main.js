//main.js
(function(){
	
	var objUrl;
	var inputId = createId();
	
	var imgTop = 0;
	var imgLeft = 0;
	var lev = 1;  //放缩系数
	
	var recogResult = {};  //识别结果
	
	var currentItemIndex = 0;   //当前显示的识别结果
	
	var dangerVehicle = {
		1: '是　',
		'-1': '未知'
	};
	
	var driverFlag = {
		1: '是　　　',
		'-1': '未知　　'
	};
	
	var belt = {
		0: '未系　　',
		1: '已系　　',
		'-1': '未知　　'
	};
	
	var callIphone = {
		0: '未打电话',
		1: '打电话　',
		'-1': '未知　　'
	};
	
	var sunVisor = {
		0: '未打开　',
		1: '打开　　',
		'-1': '未知　　'
	};
	
	$("#headPicDiv").css({
		height: $config.height
	});
	
	$("#recog").click(function(){
		var value = $("#head_pic_btn" + inputId).val();
		if(value){
			upload();
		}else{
			alert('无图片，请先上传图片！');
		}
	});
	
	handleInput();
	
	function createItem(list){
		var arr = [];
		recogResult = {};
		for(var i=0; i<list.length; i++){
			var div = $("<div index='" + (i + 1) + "'>结果" + (i + 1) + "</div>");
			if(i == 0){
				div = $("<div class='on' index='" + (i + 1) + "'>结果" + (i + 1) + "</div>");
			}
			arr.push(div);
			recogResult['index_' + (i + 1)] = list[i];
			div.click(function(){
				var index = $(this).attr('index');
				selectItemByIndex(index);
			});
		}
		$("#t_header").empty().append(arr);
		
		var di = $("<div></div>");
		di.css({
			width: 445 - list.length*80,
			borderBottom: '1px solid #c3bdbd',
			borderTop: '0px solid #c3bdbd',
			height: '37px'
		});
		$("#t_header").append(di);
		
		selectItemByIndex(1);
		currentItemIndex = 1;
	}
	
	function selectItemByIndex(index){
		//console.log('check: ' + (index != currentItemIndex));
		if(index != currentItemIndex){
			var d_0 = recogResult['index_' + index];
			addVehicleDetails(d_0);
			
			var _d_0 = d_0.vehicleBox;
			drawRect(_d_0.x, _d_0.y, _d_0.w, _d_0.h);
			
			$("#t_header").children('div[index=' + index + ']').addClass('on')
			.siblings('div').removeClass('on');
			
			currentItemIndex = index;
		}
	}
	
	function addVehicleDetails(data){
		//console.log(data);
		if(data){
			$("#vehicleBrand").val(data.recogBrand.brandFullName);
			$("#vehicleColor").val(data.colorName);
			$("#vehicleType").val(data.typeName);
			$("#vehiclePlate").val(data.plateNo);
			$("#plateColor").val(data.plateColorName);
			$("#dangerVehicleFlag").val(getCodeName(dangerVehicle, data.DMD));
			$("#vehicleVriver").val("主：" + getCodeName(driverFlag, data.mainDriverFlag) 
					+ "　　　副：" + getCodeName(driverFlag, data.secondDriverFlag));
			$("#lifeBelt").val("主：" + getCodeName(belt, data.mainDriverBeltFlag) 
					+ "　　　副：" + getCodeName(belt, data.secondDriverBeltFlag));
			$("#callPhone").val("主：" + getCodeName(callIphone, data.mainDriverPhoneFlag) 
					+ "　　　副：" + getCodeName(callIphone, data.secondDriverPhoneFlag));
			$("#sunVisor").val("主：" + getCodeName(sunVisor, data.mainSunVisorFlag)
					+ "　　　副：" + getCodeName(sunVisor, data.secondSunVisorFlag));
		}
	}
	
	function changeImgSrc(objUrl){
		if (objUrl) {
			var img = $("#headPic");
            img.attr("src", objUrl); //将图片路径存入src中，显示出图片
            //console.log(img);
            setTimeout(function(){
            	setImg(img, $("#headPicDiv"));
            }, 500);
            
        }
	}
	
	function upload(){
		//console.log('inputId:' + inputId);
		$.ajaxFileUpload({
            url:$config.uploadUrl,
            fileElementId: "head_pic_btn" + inputId, //文件上传域的ID，这里是input的ID，而不是img的
            dataType: 'json', //返回值类型 一般设置为json
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (data) {
            	
            	if(data){
            		handleInput();
            	}
            	
            	h_header_s(data);
            	
                console.log(data);
            }

        });
	}
	
	function h_header_s(list){
		$("#init").hide();
		if($.isArray(list) && list.length > 0){
			$("#haveResult").show();
			var size = list.length;
			if(size > 0){
				$("#t_header").css({
					//width: 80*size
				});
				createItem(list);
			}
		}else{
			$("#noResult").show();
		}
	}
	
	function getCodeName(data, code){
		if(data){
			return data[code];
		}
	}
	
	//在图片上画框
	function drawRect(x, y, w, h){
		if(typeof x == 'number' 
			&& typeof y == 'number' 
				&& typeof w == 'number' 
					&& typeof h == 'number'){
			var span = $("<div></div>");
			var top = imgTop + y/lev;
			var left = imgLeft + x/lev;
			var width = w/lev;
			var height = h/lev;
			//console.log('imgTop: ' + imgTop);
			//console.log('imgLeft: ' + imgLeft);
			//console.log('lev: ' + lev);
			//console.log('x: ' + x);
			//console.log('y: ' + y);
			//console.log('toop: ' + top);
			//console.log('left: ' + left);
			//console.log('width: ' + width);
			//console.log('height: ' + height);
			span.css({
				position: 'absolute',
				width: width,
				height: height,
				border: '1px solid red',
				top: top,
				left: left
			});
			$("#headPicDiv").children('div').remove();
			$("#headPicDiv").append(span);
		}else{
			console.warn('非数字');
		}
	}
	
	function setImg(img, div){
		var imgW = img[0].naturalWidth;
		var imgH = img[0].naturalHeight;
		var divW = div.width();
		var divH = div.height();
		//console.log('imgW: ' + imgW);
		//console.log('imgH: ' + imgH);
		//console.log('divW: ' + divW);
		//console.log('divH: ' + divH);
		if(divW > imgW && divH > imgH){
			imgTop = (divH - imgH)/2;
			imgLeft = (divW - imgW)/2;
			lev = 1;
			img.css({
				width: imgW,
				height: imgH
			});
			setPosition(img, imgTop, imgLeft);
		}
		if(divW > imgW && divH < imgH){
			imgLeft = (divW - imgW)/2;
			imgTop = 0;
			lev = imgH/divH;
			img.css({
				width: imgW
			});
			setPosition(img, imgTop, imgLeft, 'height');
		}
		if(divW < imgW && divH > imgH){
			imgTop = (divH - imgH)/2;
			imgLeft = 0;
			lev = imgW/divW;
			img.css({
				height: imgH
			});
			setPosition(img, imgTop, imgLeft, 'width');
		}
		if(divW < imgW && divH < imgH){
			var w_l = imgW/divW;
			var h_l = imgH/divH;
			if(w_l > h_l){
				imgTop = (divH - imgH/w_l)/2;
				imgLeft = 0;
				lev = w_l;
				img.css({
					width: divW, 
					marginTop: imgTop
				});
			}else{
				imgTop = 0;
				lev = h_l;
				imgLeft = (divW - imgW/h_l)/2;
				img.css({
					height: divH,
					marginLeft: imgLeft
				});
			}
		}
		
		//drawRect(0, 0, 100, 100);
	}
	
	function setPosition(img, top, left, t){
		img.css({
			marginLeft: left,
			marginTop: top
		});
		if(t){
			if(t == 'width'){
				img.css({
					width: '100%'
				});
			}
			if(t == 'height'){
				img.css({
					height: '100%'
				});
			}
		}
	}
	
	function handleInput(){
		inputId = createId();
		var input = createInput(inputId);
		$("#ip_div").empty().append(input);
		input.on('change', function(){
			objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
	        changeImgSrc(objUrl);
		});
	}
	
	function createInput(id){
		return $("<input type=\"file\" id=\"head_pic_btn" + id +  "\" name=\"img\"  value=\"请选择图片\"  />");
	}
	
	//创建一个id
	function createId(){
		return '_' + new Date().getTime();
	}
	
	//建立一個可存取到該file的url
	function getObjectURL(file) {
	    var url = null ;
	    if (window.createObjectURL!=undefined) { // basic
	        url = window.createObjectURL(file) ;
	    } else if (window.URL!=undefined) { // mozilla(firefox)
	        url = window.URL.createObjectURL(file) ;
	    } else if (window.webkitURL!=undefined) { // webkit or chrome
	        url = window.webkitURL.createObjectURL(file) ;
	    }
	    return url ;
	}
	
})();