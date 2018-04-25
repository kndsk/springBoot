/**
 * 答题卡图片处理帮忙类
 */
ImageCtrl = {

	/**
	 * 在解答题区域的所有图片可拖动。
	 */
	draggableAll : function() {
		//var allImgSelector = $("div.child img");
		//ImageCtrl.divImageAdaptive("div.child");
		//ImageCtrl.draggable(allImgSelector);
	},
	
	/**
	 * 解答题区域的图片 添加class(显示边框效果)
	 */
	showBorder: function(){
		var allImgSelector = $("div.child img");
		allImgSelector.hover(function(){
			$(this).addClass('imgBorderClass');
		},function(){
			$(this).removeClass('imgBorderClass');
		});
	},

	/**
	 * 指定选择器内部图片可通过
	 */
	draggable : function(selector) {
		// $(selector).draggable({
		// 	onDrag : ImageCtrl._limitInParentArea,
		// }).resizable();
	},
	
	/**
	 * 将图片放在Div区域中。
	 * 判断图片能否放得下区域，如果可以直接存放，否则等比压缩后存放
	 * 注：调用该方法后，图片支持拖拽和调整大小，不需要再次调用draggable方法
	 */
	putImageToDiv : function(jImg, jDiv){		
		jDiv.append(jImg);
		jImg.on("load", function(){
			ImageCtrl._compressImageIfNeed(jImg, jDiv);
		});
	},
	
	/**
	 * 指定DIv内的所有图片大小自适应Div,并支持拖拽和调整大小。
	 */
	divImageAdaptive : function(jDiv){
		$("img", jDiv).each(function(){
			var jThis = $(this);
			if (jThis[0].complete){
				ImageCtrl._compressImageIfNeed(jThis, $(jDiv));
			} else {
				jThis.on("load", function(){
					ImageCtrl._compressImageIfNeed(jThis, $(jDiv));
				});
			}
			
		});
	},
	
	/**
	 * 图片拖动限制在父文本区域内
	 * @private
	 */
	_limitInParentArea : function(e) {
		var d = e.data;
		if (d.left < 0) {
			d.left = 0;
		}
		if (d.top < 0) {
			d.top = 0;
		}
		var jThis = $(d.target);
		var jParent = $(d.target).parents("div.child");
		if (d.left + jThis.outerWidth() > jParent.width()) {
			d.left = jParent.width() - jThis.outerWidth();
		}
		if (d.top + jThis.outerHeight() > jParent[0].scrollHeight) {
			d.top = jParent[0].scrollHeight - jThis.outerHeight();
		}
	},

	/**
	 * ctrl+V粘贴图片处理
	 */
	pasteImage : function() {
		var evt = window.event;
		if (!evt || !evt.clipboardData){
			// 不支持剪切板功能
			return;
		}
		var jThis = $(this);
		var items = evt.clipboardData.items;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.kind == "file" && item.type.indexOf("image/") > -1) {
				// 图片使用FileReader转换为base64格式后，由后台处理并返回新的URL
				var blob = item.getAsFile(), reader = new FileReader();
				reader.readAsDataURL(blob);

				reader.onload = function() {
					if(this.result.indexOf("data:image/") > -1){
						var jImg = $('<img src="' + this.result + '">');
						ImageCtrl.putImageToDiv(jImg, jThis);
						
						$.ajax({
			                type: "post",
			                url: newbasePath + "/upload",
			                data:{"encodeImg":this.result},
			                dataType:"json",
			                success: function(rst){
			                	if (rst.result == "success"){
									$(jImg).attr('src',rst.message);
									ImageCtrl.putImageToDiv(jImg, jThis);
								}else if(rst.result == "failed"){
									// 图片上传失败，src改为上传失败，用于保存时匹配
									// systemAlert("图片上传失败，请重新上传");
									ImageCtrl._setInvalidImg(jImg);
									
								}
			                },
			                error: function(a,b,c) {
			                	// systemAlert("图片上传失败，请重新上传");
			                	ImageCtrl._setInvalidImg(jImg);
			                }
			            });
					}
				};
			}
		}


	},
	
	/**
	 * 如果图片高度大于最大高度，则等比压缩图片使之能适应最大高度。
	 * @private
	 */
	_compressImageIfNeed : function(jImg, jDiv){
		var jDivHeight = jDiv.height() ? jDiv.height() : parseInt(jDiv.css('min-height')) ;
		if (jImg.height() > jDiv.height()){
			var afterHeight = Math.floor(jDiv.height());
			var afterWidth = Math.floor(jImg.width() * (afterHeight / jImg.height()));
			jImg.height(afterHeight).width(afterWidth);
		}
		if (jImg.width() > jDiv.width()){
			var afterWidth = Math.floor(jDiv.width());
			var afterHeight = Math.floor(jImg.height() * (afterWidth / jImg.width()));
			jImg.height(afterHeight).width(afterWidth);
		}
		// ImageCtrl.draggable(jDiv);
	},

		/**
	 * 判断内用中是否包含图片
	 */
	isDataContainImg: function(data){
		var div = $("<div>"+data+"</div>");
		return $(div).find("img").length;
	},
	/**
	 * 设置无效图片
	 */
	_setInvalidImg:function(data){
		data.attr("src","上传失败");
		data.attr("style","width:20px;height:20px;");
	},

		/**
	 * 此方法返回上传图片后的结果
	 */
	pasteWordImage: function(serverUrl,localImgPath){
		var downloadPliuginContent = "直接粘贴图片需要安装插件，<a target='_blank' onClick='downloadPliugin()' href='" + newbasePath + "/resources/editpaper/utils/demo/AnswerSheetPluginSetup.exe'>点此下载</a>，请安装后重启浏览器重试！";

		var result = ""; //图片上传后返回的结果
		if(!plugInstance){
			plugInstance = new uploadUtil.UploadPlug(serverUrl);
		}

		if(plugInstance.pluginValid()){
			result = plugInstance.uploadImg(localImgPath);
		}else{
			// systemAlert(downloadPliuginContent);
			
		}
		return result;
	}
	
};