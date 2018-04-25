/**
 * ckeditor网页编辑器，上传示例：
 * 上传方式：
 * 1. 插件方式；
 * 2. QQ等截屏方式(使用的是剪切板事件)；
 * 3. 从word拷贝方式.
 *  注意点：ckeditor编辑器不支持方式2剪切板事件，
 *  但可编辑div支持该事件,故使用此方式: $(this).on("paste", ImageCtrl.pasteImage);
 */

var basePath = newbasePath;
CKEDITOR.disableAutoInline = true; //默认不自动实例化

// $(function(){
// //	DomCtrl.clearBeforeInit();
// //	DomCtrl._initCkedit();
// 	// DomCtrl._addLayer();

// 	// $(".child").each(function () {
//  //        $(this).focus(function(){
//  //        	 var id = $(this).attr("id");
//  //        	 var pasteData = ""; //拷贝的内容
//  //        	 if(id && !CKEDITOR.instances[id]){

//  //        		 var editor = CKEDITOR.inline(id);
//  //        		 editor.on("afterPaste",function(){
//  //                 	uploadWordImagesFromCKEditor(editor, '',pasteData);
// 	//              });
// 	//              // 拷贝内容，移除内容的样式
// 	//              editor.on("paste", function(e){
// 	//              	var data = e.data.dataValue;
// 	//              	e.data.dataValue = "";
// 	//              	pasteData = DomCtrl.clearHtml(data);
// 	//                  //alert("拷贝的内容为："+data);
// 	//              });
//  //        	 }

//  //        });
//  //        // 注册粘贴事件,并上传图片。
//  //        $(this).on("paste", ImageCtrl.pasteImage);
// 	// });    
// });



var DomCtrl = {

	/**
	 * 在初始化操作执行之前执行清理操作。
	 * @private
	 */
	clearBeforeInit: function() {
		for (var i in CKEDITOR.instances) {
			var ed = CKEDITOR.instances[i];
			ed.destroy(true);
			this.deleteEditor(ed);
		}
		CKEDITOR.document.clearCustomData();
	},
	deleteEditor: function(obj) {
		for (var name in obj) {
			if (name == "focusManager") {
				continue;
			}
			delete obj[name];
		}
	},

	/**
	 *  对从word中copy过来的内容进行过滤。
	 */
	clearHtml: function(data) { //string
		data = this.removeStyle(data);
		if (data.length > 0) {
			// data = data.replaceAll("v:imagedata", "img");
			return data;
		}
		return "";

	},

	/**
	 * 将标签style删除
	 */
	removeStyle: function(data) {
		if (data) {
			var div = $("<div>" + data + "</div>");
			div.find("[style]").removeAttr("style");
			div.css({
				'color': '#000',
				'font-family': '微软雅黑'
			});
			if (div.find("a").length) {
				div.find("a").css({
					'color': 'blue',
					'text-decoration': 'underline'
				});
			}

			var html = div.html();
			var reg = /<v:imagedata[^>]*><\/v:imagedata>/g;
			html = html.replace(reg, '');
			return html;
		}
	},

	/**
	 * 添加编辑器中的弹出层控制
	 * @private
	 */
	_addLayer: function() {
		// var arr_html = [];
		// arr_html.push('<div id="wordImageAppletWrapper"');
		// arr_html.push('style="height: 1px;background-color: #f2f1f1;border-top: 1px solid gray;position:fixed; bottom:0;left:0; width:100%; overflow: hidden;z-index:1000;" >');
		// arr_html.push('<applet id="wordImageApplet" name="wordImageApplet" ');
		// arr_html.push('codebase="' + basePath + '/scripts/libs/wordimg/applet/" archive="uploader.jar" ');
		// arr_html.push('code="com.iflytek.applet.imageuploader.UploaderApplet" ');
		// arr_html.push('width="1" height="1"> ');
		// arr_html.push('</applet></div><div id="word_image_container_temp"style="display:none;"></div>');
		// $(document.body).append(arr_html.join(''));
		if (typeof plugInstance == "undefined") {
			plugInstance = new uploadUtil.UploadPlug(basePath + '/uploadWordImg');
			if (!plugInstance.pluginValid()) {
				if (window.sessionStorage.tempProperty == "1") {
					return;
				}
				var downloadPliuginContent = "直接粘贴图片需要安装插件，<a target='_blank' onClick='downloadPliugin()' href='" + newbasePath + "/resources/editpaper/utils/demo/AnswerSheetPluginSetup.exe'>点此下载</a>，请安装后重启浏览器重试！";

				// systemAlert(downloadPliuginContent);
				// parent.window.Util.Dialogue.dialogBox(true, "提示框", );
				window.sessionStorage.tempProperty = "1";
			}
		}

	},

	_initCkedit: function() {
		CKEDITOR.on('instanceReady', function(evt) {
			//alert('instanceReady');
		});
	}

};