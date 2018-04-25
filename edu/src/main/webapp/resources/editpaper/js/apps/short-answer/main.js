/**
 * @description: 简答
 * @author：smchen2
 * @time: 陈世敏(2016-08-09)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        base = require('common/base'),
        template = require('template'),
        dao = require('common/dao');
    require('popbox');
    var constraints = [],//约束条件
        type = 9;//题型
    var addEvents = function(){
        // 确定
        $(document).on('click','.short-answer .ok',eventCtroller.okEvent);

        // 取消
        $(document).on('click','.short-answer .cancle',eventCtroller.cancleEvent);


        //预览删除
        $(document).on('click', '.short-answer-view .view-delete', eventCtroller.cancleViewEvent);

        // 预览编辑
        $(document).on('click', '.short-answer-view .view-edit', eventCtroller.viewEdit);

        //预览设置逻辑
        $(document).on('click', '.short-answer-view .view-logic', base.logicEvent);
        
        $(document).on('mouseover','.view-wrapper',base.wrapperHover);

        $(document).on('mouseout','.view-wrapper',base.wrapperOut);
    };

    var eventCtroller = {
        /**
         * [okEvent 确定函数]
         * @return {[type]} [description]
         */
        okEvent:function(){
        	$(this).attr('disabled', 'disabled');
            if(base.getValue()){
                var $this = $(this).closest('.short-answer-box'); 
                
                var parmes = {}, 
                    object = {};
                parmes.type = type;
                parmes.questionTitle = $this.find('.theme').html();
                parmes.constraints = dynamicSelected.getCountObj();
                parmes.combine = window.combination;
                
                parmes.pageIndex = $('.tab-ul li').index($('.page-seletced')); //当前页
                if(parmes.combine === true){
                    parmes.parentId = $this.parents('.combin-box').find('.hd-parentid').val(); //组合题父级id
                }

                object.paperItemId = $this.find('.hd-paperitem-id').val();
                object.paperId = window.paperId;
                object.paperItem = JSON.stringify(parmes);
                var dataUrl = basePath+"/paperitem/savepaperitem",
                    templUrl = basePath+'/resources/editpaper/templ/short-answer/short-answer-view.html';
                $.when(dao.requestListTmpl(templUrl),dao.requestListData(dataUrl,object)).done(function(templ,data){
                    if(data.flag === 1){
                    	$(this).removeAttr('disabled');
                    	$this.find('.hd-paperitem-id').val(data.data.id);
                        window.okType = true;
                        util.removeRichEditor($this);
                        var render = template.compile(templ);
                        $this.empty().append(render(data));
                        util.getImgData();//重置图片的宽和高
                    }else{
                        $(this).removeAttr('disabled');
                        jnoButtonConfirm(data.flagMsg, '','',1);  
                    }
                }).fail(function(){
                    $(this).removeAttr('disabled');
                    jnoButtonConfirm('网络错误！', '','',1);
                });
            }else{
                $(this).removeAttr('disabled');
            }
        },
        /**
         * [cancleEvent 取消函数]
         * @return {[type]} [description]
         */
        cancleEvent:function(){
        	var $this = $(this).closest('.short-answer-box'); 
        	if($this.find('.hd-paperitem-id').val() != ''){
        		var dataUrl = basePath+"/paperitem/getviewpaperitem",
	        		parmes = {
	                        paperItemId: $this.find('.hd-paperitem-id').val()
	                    },
	                templUrl = basePath+'/resources/editpaper/templ/short-answer/short-answer-view.html';
	            $.when(dao.requestListTmpl(templUrl),dao.requestListData(dataUrl,parmes)).done(function(templ,data){
	                if(data.flag === 1){
	                	$this.find('.hd-paperitem-id').val(data.data.id);
	                    window.okType = true;
	                    util.removeRichEditor($this);
	                    var render = template.compile(templ);
	                    $this.empty().append(render(data));
	                }else{
                        jnoButtonConfirm(data.flagMsg, '','',1); 
	                }
	            }).fail(function(){
                    jnoButtonConfirm('网络错误！', '','',1);
	            });
        	}else{
        		$this = $(this).closest('.short-answer');
        		util.removeRichEditor($this);
        		$this.closest('.short-answer').remove();
        		window.okType = true;
        	}
        },
        /**
         * [cancleViewEvent 删除函数]
         * @return {[type]} [description]
         */
        cancleViewEvent:function(){
            if(window.okType === false){
                jnoButtonConfirm('等待当前操作完毕！', '','',1);
                return false;
            }else{
                var $this = $(this).closest('.short-answer-box');
                jConfirm('确认删除吗？','警告',function(){
                    var dataUrl = basePath + '/paperitem/deletepaperitem',
                        parmes = {
                            paperItemId: $this.find('.hd-paperitem-id').val()
                        };
                    $.when(dao.requestListData(dataUrl, parmes)).done(function(data) {
                        if (data.flag === 1) {
                            $this.remove();
                            jnoButtonConfirm(data.flagMsg, '','',1); 
                        }else{
                            jnoButtonConfirm(data.flagMsg, '','',1); 
                        }
                    }).fail(function() {
                        jnoButtonConfirm('网络错误！', '','',1);
                    })
                })
            }
        },
        /**
         * [viewEdit 编辑函数]
         * @return {[type]} [description]
         */
        viewEdit: function() {
        	if((window.okType === true && window.combination === false) || (window.okType === true && $(this).parents('.combin-box').length != 0)){
        		var $this = $(this).closest('.short-answer-box'),
        		dataUrl = basePath + "/paperitem/getpaperitem",
        		templUrl = basePath + '/resources/editpaper/templ/short-answer/short-answer.html',
        		parmes = {
        			paperItemId: $this.find('.hd-paperitem-id').val()
        		};
        		$.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
        			if (data.flag) {
        				if (data.data) {
        					var render = template.compile(templ);
        					$this.empty().append(render(data));
        					window.okType = false;
        					util.initRichEditor($('.short-answer'));

                            if(data.data.constraints != null){ //初始化约束
                                dynamicSelected.init(data.data.constraints,1);
                            }else{
                                dynamicSelected.init(1);
                            }
        				} else {
                            jnoButtonConfirm('数据为空！', '','',1);
        				}
        			} else {
                        jnoButtonConfirm(data.flagMsg, '','',1); 
        			}
        		}).fail(function() {
                    jnoButtonConfirm('网络错误！', '','',1);
        		})
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