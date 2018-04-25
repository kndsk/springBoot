/**
 * 使用插件的方式上传图片
 * @param editorInstance
 * @param pre_id
 */
function uploadWordImages(editorInstance) {
    var ed = editorInstance;
    var txt = ed.getData();
    txt = txt.replaceAll("v:imagedata", "img");
    var container = "<div id='container_temp' style='display:none'></div>";
    $(document.body).append($(container));
    jQuery("#container_temp").html(txt);
    jQuery('#container_temp img').each(function () {
        var src = $(this).attr('src');
        if (src.indexOf("file:///") != -1 && src["file:///".length]) {
            var srct = src.replace('file:///', '');
            var serverPath = ImageCtrl.pasteWordImage(newbasePath+'/uploadWordImg',srct);
            if (serverPath != 'error' && serverPath != "") {
                if (serverPath) {
                    serverPath = serverPath.replace("\"", "");
                    serverPath = serverPath.replace("\"", "");
                };
                $(this).attr('src', serverPath);
                if(serverPath == "上传失败"){
                	$(this).attr("style","width:20px;height:20px;");
                }
            }
            // $(this).wrap("<div style='display:inline-block'></div>");
        }
    });
    txt = jQuery('#container_temp').html();
    ed.setData(txt);
}



