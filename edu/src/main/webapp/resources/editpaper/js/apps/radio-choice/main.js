/**
 * @description: 单选
 * @author：smchen2
 * @time: 陈世敏(2016-08-08)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        base = require('common/base'),
        dao = require('common/dao'),
        template = require('template');
    require('popbox');
    require('dropListSave'); //记录下拉框数值
    var type = 1;
    var addEvents = function() {
        // 删除
        $(document).on('click', '.radio-wrapper .item-option a:not(".del-fill")', eventCtroller.remove);
        // 删除其他项
        $(document).on('click', '.radio-wrapper .del-fill', eventCtroller.delRadioOther);
        // 新增
        $(document).on('click', '.radio-wrapper .add-option', eventCtroller.add);
        // 增加其他
        $(document).on('click', '.radio-wrapper .option-control a', eventCtroller.addOther);
        // 模拟checkbox
        $(document).on('click', '.radio-box .check-box i',function(){
            var $this = $(this);
            if($this.hasClass('checkbox-selected')){
                $this.removeClass('checkbox-selected');
            }else{
                $this.addClass('checkbox-selected');
            }
        });
        // 确定
        $(document).on('click', '.radio-wrapper .ok', eventCtroller.okEvent);
        // 取消
        $(document).on('click', '.radio-wrapper .cancle', eventCtroller.cancleEvent);
        //预览删除
        $(document).on('click', '.radio-view .view-delete', eventCtroller.cancleViewEvent);
        // 预览编辑
        $(document).on('click', '.radio-view .view-edit', eventCtroller.viewEdit);

        //预览设置逻辑
        $(document).on('click', '.radio-view .view-logic', base.logicEvent);
        
        $(document).on('mouseover','.view-wrapper',base.wrapperHover);

        $(document).on('mouseout','.view-wrapper',base.wrapperOut);
    };

    var eventCtroller = {
        /**
         * [remove 删除选项]
         * @return {[type]} [description]
         */
        remove: function() {
            $this = $(this).closest('.multiple-choice-option');
            // 其他项只是hide的 依然存在 so is 3
            // if ($this.find('.item-option').length <= 3) {
            //     return;
            // }
            $(this).parent().remove();
            $('.radio-wrapper .option-box .item-option').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.radio-wrapper'));
              });
        },
        /**
         * [add 新增选项]
         */
        add: function() {
            var html = '<li class="item-option"><div class="content-edit" contenteditable="true" type="radio"></div><span class="option-handle"></span><a href="javascript:void(null)">&#10005;</a></li>';
            $('.radio-wrapper .option-box').append(html);
            $('.radio-wrapper .option-box .item-option').drag({ //选项拖拽
                  'handle':'.option-handle'
              });
            util.initRichEditor($('.radio-wrapper'));
        },
        /**
         * [delOther 删除其他项]
         * @return {[type]} [description]
         */
        delRadioOther: function() {
        	util.removeRichEditor($('.fill'));
            $('.fill').hide();
            $('.add-other').show().removeAttr('disabled');
            $this = $(this).closest('.multiple-choice-option');
            $this.find('.fill .item-option').html('');
            type = 1;
        },
        /**
         * [addOther 增加其他项]
         */
        addOther: function() {
            $('.fill').show();
            $(this).hide();
            $(this).attr('disabled', 'disabled');
            $this = $(this).closest('.multiple-choice-option');
            $this.find('.fill .item-option').html('<div class="content-edit theme" contenteditable="true" type="radio"></div><a href="javascript:void(null)" class="del-fill">&#10005;</a>');
            $this.find('.fill .content-edit').attr('contenteditable', true);
            util.initRichEditor($('.radio-wrapper'));
        },
        /**
         * [okEvent 确定函数]
         * @return {[type]} [description]
         */
        okEvent: function() {
        	$(this).attr('disabled', 'disabled');
        	var $index = $(this).attr('_index');
            if(base.getValue()){
                var $this = $(this).closest('.radio-box');
                var type = 1,
                	parmes = {},
                    options = [],
                    object = {};
                $this.find('.option-operating .item-option').each(function(index, item) {
                    if ($(item).find('.content-edit').html() != undefined) {
                        if ($(item).hasClass(('other-option'))) {
                            type = 4;
                            parmes.constraints = dynamicSelected.getCountObj();
                        }
                        var obj = {
                            value: $(item).find('.content-edit').html(),
                            name: index
                        }
                        options.push(obj);
                    }
                });
                parmes.type = type;
                parmes.questionTitle = $this.find('.theme').html();
                parmes.options = options;
                parmes.showColumnNum = $this.find('#columnNum option:selected').text();
                parmes.combine = window.combination;
                
                parmes.pageIndex = $('.tab-ul li').index($('.page-seletced')); //当前页
                if($('.check-box i').hasClass('checkbox-selected')){ //是否为辅助题
                    parmes.assistFlag = true;
                }else{
                    parmes.assistFlag = false;
                }
                
                if (parmes.combine === true) {
                    parmes.parentId = $this.parents('.combin-box').find('.hd-parentid').val();//组合题父级id
                }
                object.paperItemId = $this.find('.hd-paperitem-id').val();
                object.paperId = window.paperId;
                object.paperItem = JSON.stringify(parmes);
                var dataUrl = basePath + "/paperitem/savepaperitem",
                    templUrl = basePath + '/resources/editpaper/templ/radio-chose/radio-chose-view.html';
                $.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, object)).done(function(templ, data) {
                    if (data.flag === 1) {
                    	$(this).removeAttr('disabled');
                    	$this.find('.hd-paperitem-id').val(data.data.id);
                        window.okType = true;
                        util.removeRichEditor($this);
                        var render = template.compile(templ);
                        $this.empty().append(render(data));
                        $this.find('.view-wrapper').attr('index',$index);
                        util.getImgData();
                    } else {
                        $(this).removeAttr('disabled');
                        jnoButtonConfirm(data.flagMsg, '','',1);
                    }
                }).fail(function() {
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
        cancleEvent: function() {
        	var $this = $(this).closest('.radio-box');
        	if($this.find('.hd-paperitem-id').val() != ''){
        		var dataUrl = basePath + "/paperitem/getviewpaperitem",
	        		parmes = {
	                        paperItemId: $this.find('.hd-paperitem-id').val()
	                    },
	                templUrl = basePath + '/resources/editpaper/templ/radio-chose/radio-chose-view.html';
	            $.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
	                if (data.flag === 1) {
	                	$this.find('.hd-paperitem-id').val(data.data.id);
	                    window.okType = true;
	                    util.removeRichEditor($this);
	                    var render = template.compile(templ);
	                    $this.empty().append(render(data));
	                } else {
                        jnoButtonConfirm(data.flagMsg, '','',1);
	                }
	            }).fail(function() {
                    jnoButtonConfirm('网络错误！', '','',1);
	            });
        	}else{
        		$this = $(this).closest('.radio-wrapper');
        		util.removeRichEditor($this);
        		window.okType = true;
        		$this.closest('.radio-wrapper').remove();
        	}
        },
        /**
         * [cancleViewEvent 删除函数]
         * @return {[type]} [description]
         */
        cancleViewEvent: function() {
            if(window.okType === false){
                jnoButtonConfirm('等待当前操作完毕！', '','',1);
                return false;
            }else{
                var $this = $(this).closest('.radio-box');
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
         * [viewEdit 删除函数]
         * @return {[type]} [description]
         */
        viewEdit: function() {
        	if((window.okType === true && window.combination === false) || (window.okType === true && $(this).parents('.combin-box').length != 0)){
        		var $this = $(this).closest('.radio-box'),
                    $index = $this.find('.view-wrapper').attr('index'),
        		dataUrl = basePath + "/paperitem/getpaperitem",
        		templUrl = basePath + '/resources/editpaper/templ/radio-chose/radio-chose.html',
        		parmes = {
        			paperItemId: $(this).attr('data-id')
        		};
        		$.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
        			if (data.flag) {
        				if (data.data) {
        					var render = template.compile(templ);
        					$this.empty().append(render(data));
        					$this.find('.main-wrapper').attr('index',$index);
        					$this.find('.ok').attr('_index',$index);
                            if(data.data.type === 4){
                                $this.find('.multiple-choice-option .fill .item-option').html('<div class="content-edit theme" contenteditable="true" type="radio">'+data.data.options[data.data.options.length-1].value+'</div><a href="javascript:void(null)" class="del-fill">&#10005;</a>');
                                $this.find('.fill .content-edit').attr('contenteditable', true);
                            }
                             $("#columnNum option[value='"+data.data.showColumnNum+"'] ").attr("selected",true); //初始化select值
        					window.okType = false;
        					$('.radio-wrapper .option-box .item-option').drag({ //选项拖拽
        		                  'handle':'.option-handle'
        		              },function(){
                                util.initRichEditor($('.radio-wrapper'));
                              });
        					util.initRichEditor($('.radio-wrapper'));
                            
        					if(data.data.constraints != null){ //初始化约束
                                dynamicSelected.init(data.data.constraints);
                            }else{
                                dynamicSelected.init();
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

    var init = function() {
        addEvents();
    };

    $(function() {
        init();
    })
})