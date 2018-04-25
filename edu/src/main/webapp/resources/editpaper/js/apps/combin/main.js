/**
 * @description: 组合题
 * @author：smchen2
 * @time: 陈世敏(2016-08-011)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common');
    var type = 1;//题目类型
    var addEvents = function(){
        // 确定
        $(document).on('click','.combin-wrapper .ok-combin',eventCtroller.okEvent);
        // 取消
        $(document).on('click','.combin-wrapper .cancle-combin',eventCtroller.cancleEvent);
    };

    var eventCtroller = {
        okEvent:function(){
        	if(window.okType === true){
        		window.combination = false;
        		window.okType = true;
        	//	清理模板冗余数据
                var $this = $(this).closest('.combin-box-wrapper');
                var $index = $this.find('.paragraph-box .view-wrapper').attr('index');
                var temp = $this.find('.combin-box').children().clone(true);
                $this.empty().append(temp).find('div').eq(0).attr('index',$index);
        	}
        },
        cancleEvent:function(){
    		if($(this).parents('.combin-wrapper').find('.hd-parentid').val() != ''){
    			if(window.okType === true){
    				window.combination = false;
    				window.okType = true;
    				$(this).parent().hide();
    			}
    		}else{
    			window.combination = false;
        		window.okType = true;
    			$(this).closest('.combin-box-wrapper').remove();
    		}
        }
    };

    var init = function(){
        addEvents();
    };

    $(function(){
        init();
    })
})