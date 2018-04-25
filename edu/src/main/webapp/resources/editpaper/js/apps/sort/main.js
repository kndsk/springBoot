/**
 * @description: 排序
 * @author：smchen2
 * @time: 陈世敏(2016-08-10)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        base = require('common/base'),
        template = require('template'),
        dao = require('common/dao');
    require('popbox');
    var type = 7;//题目类型
    var addEvents = function(){
        // 删除
        $(document).on('click','.sort-wrapper .btn-remove',eventCtroller.remove);
        // 题目添加填空
        $(document).on('click','.sort-wrapper .btn-add-blank',eventCtroller.addThemeBlank);
        // 排序对象填空添加
        $(document).on('click','.sort-wrapper .btn-option-blank',eventCtroller.addThemeBlank);
        // 添加排序对象
        $(document).on('click','.sort-wrapper .add-option-item',eventCtroller.addOptionItem);
        // 确定
        $(document).on('click','.sort-wrapper .ok',eventCtroller.okEvent);
        // 取消
        $(document).on('click','.sort-wrapper .cancle',eventCtroller.cancleEvent);
        //预览删除
        $(document).on('click', '.sort-view .view-delete', eventCtroller.cancleViewEvent);

        // 预览编辑
        $(document).on('click', '.sort-view .view-edit', eventCtroller.viewEdit);
        
        // maxSortNum值改变
        $(document).on('change','.sort-wrapper .option-number',eventCtroller.maxSortNumChange);

        //预览设置逻辑
        $(document).on('click', '.sort-view .view-logic', base.logicEvent);
        
        $(document).on('mouseover','.view-wrapper',base.wrapperHover);

        $(document).on('mouseout','.view-wrapper',base.wrapperOut);
    };

    var eventCtroller = {
        /**
         * [remove 删除选项]
         */
        remove:function(){
        	if($(this).parents(".option-box").find(".item-option").length <= 2){
        		return;
        	}
        	var optionNumber = $(this).parents(".sort-wrapper").find(".option-number");
        	$(optionNumber).val(parseInt($(optionNumber).val())-1);
            $(this).parent().remove();
            $('.sort-wrapper .option-box .item-option').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.sort-wrapper'));
              });
        },
        /**
         * [add 新增选项]
         */
        addThemeBlank:function(){
            $(this).parent().find('p:last').append('<input class="add-blank" type="text">');
        },
        /**
         * [addOptionItem 增加排序项]
         */
        addOptionItem:function(){
            var html = '<li class="item-option"><div class="content-edit" contenteditable="true" type="sort"></div><span class="option-handle"></span><a class="btn-remove" href="javascript:void(null)">&#10005;</a></li>'
            $('.sort-wrapper .option-box').append(html);
            util.initRichEditor($('.sort-wrapper'));
            var optionNumber = $(this).parents(".sort-wrapper").find(".option-number");
        	$(optionNumber).val(parseInt($(optionNumber).val())+1);
        	$('.option-box .item-option').drag({ //选项拖拽
                'handle':'.option-handle'
            });
        },
        /**
         * [okEvent 确定函数]
         */
        okEvent:function(){
        	$(this).attr('disabled', 'disabled');
            if(base.getValue()){
                var $this = $(this).closest('.sort-box'); 
                var parmes = {},
                    object = {},
                    sortOptions = [];
                $this.find('.option-operating .item-option').each(function(index,item){
                    var obj={
                    	name:index,	
                        value:{
                            questionTitle:$(item).find('.content-edit').html()
                        }
                    }
                    sortOptions.push(obj);
                });
                parmes.type = type;
                parmes.questionTitle = $this.find('.theme').html();
                parmes.sortOptions = sortOptions;
                parmes.combine = window.combination;
                parmes.maxInputNum = $this.find('.option-number').val();
                
                parmes.pageIndex = $('.tab-ul li').index($('.page-seletced')); //当前页
                if(parmes.combine === true){
                    parmes.parentId = $this.parents('.combin-box').find('.hd-parentid').val(); //组合题父级id
                }

                object.paperItemId = $this.find('.hd-paperitem-id').val();
                object.paperId = window.paperId;
                object.paperItem = JSON.stringify(parmes);
                var dataUrl = basePath+"/paperitem/savepaperitem",
                    templUrl = basePath+'/resources/editpaper/templ/sort/sort-view.html';
                $.when(dao.requestListTmpl(templUrl),dao.requestListData(dataUrl,object)).done(function(templ,data){
                    if(data.flag === 1){
                    	$(this).removeAttr('disabled');
                        $this.find('.hd-paperitem-id').val(data.data.id);
                        window.okType = true;
                        util.removeRichEditor($this);
                        var render = template.compile(templ);
                        $this.empty().append(render(data));
                        util.getImgData(); //重置图片的宽高
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
         */
        cancleEvent:function(){
        	var $this = $(this).closest('.sort-box');
        	if($this.find('.hd-paperitem-id').val() != ''){
        		var dataUrl = basePath+"/paperitem/getviewpaperitem",
	        		parmes = {
	                        paperItemId: $this.find('.hd-paperitem-id').val()
	                    },
	                templUrl = basePath+'/resources/editpaper/templ/sort/sort-view.html';
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
        		$this = $(this).closest('.sort-wrapper');
        		util.removeRichEditor($this);
        		$this.closest('.sort-wrapper').remove();
        		window.okType = true;
        	}
        },
        /**
         * [cancleViewEvent 删除函数]
         */
        cancleViewEvent:function(){
            if(window.okType === false){
                jnoButtonConfirm('等待当前操作完毕！', '','',1);
                return false;
            }else{
                var $this = $(this).closest('.sort-box');
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
        		var $this = $(this).closest('.sort-box'),
        		dataUrl = basePath + "/paperitem/getpaperitem",
        		templUrl = basePath + '/resources/editpaper/templ/sort/sort.html',
        		parmes = {
        			paperItemId: $this.find('.hd-paperitem-id').val()
        		};
        		$.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
        			if (data.flag) {
        				if (data.data) {
        					var render = template.compile(templ);
        					$this.empty().append(render(data));
        					window.okType = false;
        					$('.option-box .item-option').drag({ //选项拖拽
        		                  'handle':'.option-handle'
        		              },function(){
                                util.initRichEditor($('.sort-wrapper'));
                              });
        					util.initRichEditor($('.sort-wrapper'));
        				} else {
                            jnoButtonConfirm('数据为空！', '','',1);
        				}
        			} else {
                        jnoButtonConfirm(data.flagMsg, '','',1);
        			}
        		}).fail(function() {
                    jnoButtonConfirm('网络错误！', '','',1)
        		})
        	}
        },
        /**
         * [maxSortNumChange 实时获取最大排序的个数]
         */
        maxSortNumChange:function(){
        	var num = $(this).parents(".sort-wrapper").find('.item-option').length;
        	if(parseInt($(this).val()) > num || parseInt($(this).val()) == 0){
        		$(this).val(num);
        	}
        	if($(this).val().match(/\D/g)){
        		$(this).val(num);
        	}
        },
    };

    var init = function(){
        addEvents();
    };

    $(function(){
        init();
    })
})