/**
 * 上传插件工具类
 */
window.uploadUtil = window.uploadUtil || {};


uploadUtil.UploadPlug = (function(){
	function UploadPlug(serverUrl){
		this.getPlug();
		this.serverUrl = serverUrl;
	}
	UploadPlug.prototype.pluginValid = function(){
		var plugin = document.getElementById('pluginId');
		if(!plugin){
			plugin = window.parent.document.getElementById('pluginId');
		}
		if(plugin && plugin.valid){
			return true;
		}
		return false;
	};
	UploadPlug.prototype.uploadImg = function(localUrl){
		var result = this.getPlug().uploadImage(this.serverUrl,localUrl);
		return result;
	};
	
	UploadPlug.prototype.getPlug = function(){
		var plugin = document.getElementById('pluginId');
		if(!plugin){
			plugin = window.parent.document.getElementById('pluginId');
		}
		if(!plugin){
			var html = '<object id="pluginId" type="application/x-answersheetplugin" width="1" height="1">'+
		    '<param name="onload" value="pluginLoaded" /></object>';
			$(document.body).append($(html));
			plugin = document.getElementById('pluginId');
		}
		
		if(plugin && plugin.valid){
			return plugin;
		}
		return null;
	};
	
	return UploadPlug;
})();

