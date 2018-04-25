/**
 * @description: 量表
 * @author：smchen2
 * @time: 陈世敏(2016-08-11)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        base = require('common/base'),
        template = require('template'),
        dao = require('common/dao');
    require('popbox');
    var type = 10;//题目类型
	var choiceFlag = 1;//默认单选
    var addEvents = function(){
        // 删除
        $(document).on('click','.scale-wrapper .btn-remove',eventCtroller.remove);
        // 添加程度
        $(document).on('click','.scale-wrapper .add-degree',eventCtroller.addDegree);
        // 增加范围
        $(document).on('click','.scale-wrapper .add-quenstion',eventCtroller.addRange);
        // 确定
        $(document).on('click','.scale-wrapper .ok',eventCtroller.okEvent);
        // 取消
        $(document).on('click','.scale-wrapper .cancle',eventCtroller.cancleEvent);
		// 选择
		$(document).on('click','.radio-checkBox-option',eventCtroller.optionSwicth);
        // 预览删除
        $(document).on('click', '.sacle-view .view-delete', eventCtroller.cancleViewEvent);
        // 预览编辑
        $(document).on('click', '.sacle-view .view-edit', eventCtroller.viewEdit);
        // 预览设置逻辑
        $(document).on('click', '.sacle-view .view-logic', base.logicEvent);
        
        $(document).on('mouseover','.view-wrapper',base.wrapperHover);

        $(document).on('mouseout','.view-wrapper',base.wrapperOut);
    };

    var eventCtroller = {
        /**
         * [remove 删除选项]
         * @return {[type]} [description]
         */
        remove:function(){
        	if($(this).parents(".degree-group").length != 0 && $(this).parents(".degree-group").find(".degree-li").length <= 1){
        		return;
        	}
        	if($(this).parents(".option-group").length != 0 && $(this).parents(".option-group").find(".option-li").length <= 2){
        		return;
        	}
            $(this).parent().remove();
        },
        /**
         * [add 添加程度]
         */
        addDegree:function(){
            var html = '<li class="degree-li"><div class="content-edit left-content" contenteditable="true" type="table"></div><span>--</span><div class="content-edit right-content" contenteditable="true" type="table"></div><a class="btn-remove btn-delete" href="javascript:void(null)">&#10005;</a></li>';
            $(this).parent().find('.degree-ul').append(html);
            util.initRichEditor($('.scale-wrapper'));
        },
        /**
         * [addRange 添加范围]
         */
        addRange:function(){
            var html = '<li class="quenstion-li option-li"><div class="content-edit" contenteditable="true" type="table"></div><span class="option-handle"></span><a class="btn-remove" href="javascript:void(null)">&#10005;</a></li>';
            $(this).parent().find('.quenstion-ul').append(html);
            $('.option-li').drag({ //选项拖拽
                'handle':'.option-handle'
            });
            util.initRichEditor($('.scale-wrapper'));
        },
        /**
         * [okEvent 确定函数]
         * @return {[type]} [description]
         */
        okEvent:function(){
        	$(this).attr('disabled', 'disabled');
            if(base.getValue()){
                var $this = $(this).closest('.sacle-box'); 
                
                var parmes = {},
                    subTitles = [],
                    optionArray = [],
                    titles = [],
                    object = {};
                $this.find('.degree-ul li').each(function(index,item){
                    var obj={
                        leftTitle:$(item).find('.left-content').html(),
                        rightTitle:$(item).find('.right-content').html()
                    } 
                    titles.push(obj);
                })
                var sub = {
                    titles:titles
                }
                subTitles.push(sub);
                $this.find('.option-group li').each(function(index,item){
                    var obj={
                        value:$(item).find('.content-edit').html(),
                        name:index
                    }
                    optionArray.push(obj);
                });
                
                parmes.type = type;
                parmes.questionTitle = $this.find('.theme').html();
                parmes.subTitles = subTitles;
                parmes.optionArray = optionArray;
                parmes.choiceFlag = choiceFlag;
                parmes.combine = window.combination;

                parmes.pageIndex = $('.tab-ul li').index($('.page-seletced')); //当前页
                if(parmes.combine === true){
                    parmes.parentId = $this.parents('.combin-box').find('.hd-parentid').val(); //组合题父级id
                }
                object.paperItemId = $this.find('.hd-paperitem-id').val();
                object.paperId = window.paperId;
                object.paperItem = JSON.stringify(parmes);
                var dataUrl = basePath+"/paperitem/savepaperitem",
                    templUrl = basePath+'/resources/editpaper/templ/scale/sacle-view.html',
                    templUrlMultiple = basePath + '/resources/editpaper/templ/scale/sacle-view-multiple.html';
                //同时加载单选和多选模板,根据反馈结果进行选择
                $.when(dao.requestListTmpl(templUrl),dao.requestListTmpl(templUrlMultiple),dao.requestListData(dataUrl,object)).done(function(templ,templUrlMultiple,data){
					if(data.flag === 1){
                    	$(this).removeAttr('disabled');
                    	$this.find('.hd-paperitem-id').val(data.data.id);
                        window.okType = true;
                        util.removeRichEditor($this);
                        var render;
                        if(data.data.choiceFlag == 2){
                            render = template.compile(templUrlMultiple);
                        }else{
                            render = template.compile(templ);
                        }
                        $this.empty().append(render(data));
                        util.getImgData(); //重置图片的大小
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
        	var $this = $(this).closest('.sacle-box');
        	if($this.find('.hd-paperitem-id').val() != ''){
        		var dataUrl = basePath+"/paperitem/getviewpaperitem",
	        		parmes = {
	                        paperItemId: $this.find('.hd-paperitem-id').val()
	                    },
	                templUrl = basePath+'/resources/editpaper/templ/scale/sacle-view.html';
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
        		$this = $(this).closest('.scale-wrapper');
        		util.removeRichEditor($this);
        		$this.closest('.scale-wrapper').remove();
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
                var $this = $(this).closest('.sacle-box');
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
        		var $this = $(this).closest('.sacle-box'),
        		dataUrl = basePath + "/paperitem/getpaperitem",
        		templUrl = basePath + '/resources/editpaper/templ/scale/sacle.html',
        		parmes = {
        			paperItemId: $this.find('.hd-paperitem-id').val()
        		};
        		$.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
        			if (data.flag) {
        				if (data.data) {
        					var render = template.compile(templ);
        					$this.empty().append(render(data));
        					window.okType = false;
        					$('.option-li').drag({ //选项拖拽
        		                'handle':'.option-handle'
        		            },function(){
                                util.initRichEditor($('.scale-wrapper'));
                            });
        					util.initRichEditor($('.scale-wrapper'));
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
        },
        
		/**
         * [optionSwicth 单选多选]
         * @return {[type]} [description]
         */
		optionSwicth:function(e){
			//单选
			var $this = $(this);
			if($this.find('.radio-normal').length > 0){
				$this.find('.radio-normal').addClass('radio-selected');
				choiceFlag=$this.find('.radio-normal').attr("value");
				var both = $this.siblings();
				both.each(function(index, element){
					$(element).find('.radio-normal').removeClass('radio-selected');
					$(element).find('input').val("");
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