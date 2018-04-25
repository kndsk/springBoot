/**
 * @author gangwu3
 *
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var dao = require('common/dao'),
        util = require('common/common');
    // 绑定事件
    var addEvents = function(){
    	//开始
    	$(document).on('click','#startAnswer',eventController.startAnswer);
    };
    // 加载
    var renderView = {
        /**
         * [renderTitle 加载标题]
         * @return {[type]} [description]
         */
        renderTitle:function(){
            var dataUrl = basePath + '/paper/getpaper',
                parmes = {
                    paperId:$('#hdPaperId').val()
                };
            $.when(dao.requestListData(dataUrl,parmes)).done(function(data){
                if(data.flag === 1){
                    if(data.data != null){
                        $("#paperTitle").html(data.data.name);
                        $("#paperInstruction").html(data.data.guideLanguage);
                    }else{
                        jnoButtonConfirm('网络错误！', '','',1);
                    }
                }else{
                    jnoButtonConfirm(data.flagMsg, '','',1);
                }
            }).fail(function(){
                jnoButtonConfirm('网络错误！', '','',1);
            });
        } 
    };
    // 事件控制
    var eventController = {
		startAnswer:function(){
			window.location.href=basePath+'/paperitem/startpreviewpaper?paperId='+window.paperId+'&edit='+$('#hdEdit').val();
		}
    };
    // 初始化
    var init = function(){
    	window.paperId = $('#hdPaperId').val();
        renderView.renderTitle();
        addEvents();
        $(".header").find(".rightVoEnName").each(function() {
			$(this).removeClass("active");
		});
		$("#PaperManager").addClass("active");
    }

    $(function(){
        init();
    })
})