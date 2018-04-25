/**
 * @description: 表格
 * @author：smchen2
 * @time: 陈世敏(2016-08-10)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        base = require('common/base'),
        template = require('template'),
        dao = require('common/dao');
    require('dropListSave'); //记录下拉框数值
    require('popbox');
    var constraints = []//约束条件
    var type = 6,//题目类型
        complex = false;
    var addEvents = function(){
        // 删除
        $(document).on('click','.table-wrapper .btn-remove',eventCtroller.remove);
        // 新增
        $(document).on('click','.table-wrapper .add-quenstion',eventCtroller.add);
        // 增加组标题
        $(document).on('click','.add-group',eventCtroller.addGrope);
        // 删除组标题
        $(document).on('click','.del-group',eventCtroller.delGrope);
        // 新增其他
        //  $(document).on('click','.table-wrapper .oth_op',eventCtroller.addOther);
        // 确定
        $(document).on('click','.table-wrapper .ok',eventCtroller.okEvent);
        // 取消
        $(document).on('click','.table-wrapper .cancle',eventCtroller.cancleEvent);
        $(document).on('change','.table-wrapper .switch',eventCtroller.switchType);

        //预览删除
        $(document).on('click', '.table-view .view-delete', eventCtroller.cancleViewEvent);

        // 预览编辑
        $(document).on('click', '.table-view .view-edit', eventCtroller.viewEdit);

        //预览设置逻辑
        $(document).on('click', '.table-view .view-logic', base.logicEvent);

        $(document).on('change', '.table-wrapper .option-number', eventCtroller.maxChoiceNumChange);
        
        $(document).on('mouseover','.view-wrapper',base.wrapperHover);

        $(document).on('click','.table-wrapper #addInput',eventCtroller.addInput);

        $(document).on('mouseout','.view-wrapper',base.wrapperOut);
     // 模拟checkbox
        $(document).on('click', '.table-box .check-box i',function(){
            var $this = $(this);
            if($this.hasClass('checkbox-selected')){
                $this.removeClass('checkbox-selected');
            }else{
                $this.addClass('checkbox-selected');
            }
        });
    };

    var eventCtroller = {
        /**
         * [remove 删除选项]
         * @return {[type]} [description]
         */
        remove:function(){
        	$this = $(this).closest('.option-group');
            // 其他项只是hide的 依然存在 so is 3
            if ($this.find('.option-li').length <= 2) {
                return;
            }
            $(this).parent().remove();
        },
        /**
         * [add 新增选项]
         */
        add:function(){
            var html = '<li class="quenstion-li option-li"><div class="content-edit" contenteditable="true" type="table"></div><span class="option-handle"></span><a class="btn-remove" href="javascript:void(null)">&#10005;</a></li>';
            $(this).parent().find('ul').append(html);
            $('.table-wrapper .quenstion-ul .option-li').drag({ //选项拖拽
                'handle':'.option-handle'
            });
            util.initRichEditor($('.table-wrapper'));
        },
        addInput:function () {
                console.log($('.fill-theme').length);
                var tmpl = '___';
                $('.fill-theme').html($('.fill-theme').html().replace('<br>', ''));

                $('.fill-theme').find('p:last').append(tmpl);
                var text = $('.fill-theme').text();
                var pattern = /____*/g;
                if(pattern.test(text)){
                    var transtext = text.replace(/____*/g,'<span class="countNumlist"></span>');
                    var tmpl = '<div id="countNumlist" style="display:none;">';
                    tmpl += transtext;
                    tmpl += '</div>';
                    $('body').append(tmpl);
                    var newL = $('#countNumlist .countNumlist').length;
                    dynamicSelected.loadSelect(newL);
                    $('#countNumlist').remove();
                }else{
                    dynamicSelected.loadSelect(0);
                }

        },
        /**
         * [addGrope 增加组]
         */
        addGrope:function(){
            var html = '<div class="group-box"><li class="quenstion-all option-li"><div class="content-edit" contenteditable="true" type="table"></div><a class="del-group" href="javascript:void(null)">&#10005;</a></li><div class="content-edit combin-content" contenteditable="true" type="table"></div></div>';
            $(this).closest('.multiple-choice-option').find('.quenstion-group').append(html);
            util.initRichEditor($('.table-wrapper'));
        },
        /**
         * [delGrope 删除组]
         */
        delGrope:function(){
        	if($(this).parents(".quenstion-group").find(".group-box").length <= 1){
        		return;
        	}
        	$(this).parents(".group-box").remove();
        	util.initRichEditor($('.table-wrapper'));
        },
        addOther:function(){
            $('.fill-control').show();

        },
        /**
         * [maxChoiceNumChange 动态获取最大选择项]
         * @return {[type]} [description]
         */
        maxChoiceNumChange:function(){
            var $this = $(this),
                num = $this.parents(".option-group").find('.quenstion-li').length;
            // if($this.parents('.multiple-wrapper').find('.option-control a').attr("other-show") == 'false'){
            //     num = num - 1;
            // }
            if(parseInt($this.val()) > num || parseInt($this.val()) == 0){
                $this.val(num);
            }
            if($this.val().match(/\D/g)){
                $this.val(num);
            }
        },
        /**
         * [okEvent 确定函数]
         */
        okEvent:function(){
        	$(this).attr('disabled', 'disabled');
            if(base.getValue()){
                var $this = $(this).closest('.table-box'); 
                
                var val = $this.find('.switch').val(),
                    parmes = {},
                    subTitles = [],
                    optionArray = [],
                    object = {};
                console.log(val);
                if(val === 'general'){
                    complex = false;
                    var titles = [];
                    $this.find('.general-box .content-edit p').each(function(index,item){
                        var obj={
                            leftTitle:$(item)[0].outerHTML
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
                }else{
                    complex = true;
                    $this.find('.group-box .quenstion-all').each(function(index,item){
                        var titles = [];
                        $(item).parent().find('.combin-content p').each(function(index,valObj){
                                var obj = {
                                    leftTitle:$(valObj)[0].outerHTML
                                }
                            titles.push(obj);
                        })
                        var sub = {
                            groupTitle:$(item).find('.content-edit').html(),
                            titles:titles
                        }
                        subTitles.push(sub);
                    })
                    $this.find('.option-group li').each(function(index,item){
                        var obj={
                            value:$(item).find('.content-edit').html(),
                            name:index
                        }
                        optionArray.push(obj);
                    });
                }
                parmes.type = type;
                parmes.questionTitle = $this.find('.theme').html();
                parmes.subTitles = subTitles;
                parmes.optionArray = optionArray;
                parmes.combine = window.combination;
                parmes.complex = complex;
                parmes.constraints = dynamicSelected.getCountObj();//调用dropListSavejs的获取约束的方法
                parmes.maxChoiceNum = $this.find('.option-number').val();//选项是否多选
                parmes.pageIndex = $('.tab-ul li').index($('.page-seletced')); //当前页
                if($('.check-box i').hasClass('checkbox-selected')){ //是否为小题
                    parmes.subFlag = true;
                }else{
                    parmes.subFlag = false;
                }

                if(parmes.combine === true){
                    parmes.parentId = $this.parents('.combin-box').find('.hd-parentid').val(); //组合题父级id
                }
                object.paperItemId = $this.find('.hd-paperitem-id').val();
                object.paperId = window.paperId;
                object.paperItem = JSON.stringify(parmes);
                var dataUrl = basePath+"/paperitem/savepaperitem",
                    templUrl = basePath+'/resources/editpaper/templ/table/table-view.html';
                $.when(dao.requestListTmpl(templUrl),dao.requestListData(dataUrl,object)).done(function(templ,data){
                    if(data.flag === 1){
                    	$(this).removeAttr('disabled');
                        $this.find('.hd-paperitem-id').val(data.data.id);
                        window.okType = true;
                        util.removeRichEditor($this);
                        var render = template.compile(templ);
                        $this.empty().append(render(data));
                        util.getImgData();

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
        	var $this = $(this).closest('.table-box'); 
        	if($this.find('.hd-paperitem-id').val() != ''){
        		var dataUrl = basePath+"/paperitem/getviewpaperitem",
	        		parmes = {
	                        paperItemId: $this.find('.hd-paperitem-id').val()
	                    },
	                templUrl = basePath+'/resources/editpaper/templ/table/table-view.html';
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
        		$this = $(this).closest('.table-wrapper');
        		util.removeRichEditor($this);
        		$this.closest('.table-wrapper').remove();
        		window.okType = true;
        	}
        },
        /**
         * [switchType 表格切换]
         */
        switchType:function(){
            var val = $(this).val();
            if(val === 'general'){
                $(this).closest('.multiple-choice-option').find('.add-group').hide();
                var html = '<div class="general-box"><div class="content-edit" contenteditable="true" type="table"></div></div>';
                $(this).closest('.multiple-choice-option').find('.quenstion-group').empty().append(html);
                util.initRichEditor($('.table-wrapper'));
            }else{
                $(this).closest('.multiple-choice-option').find('.add-group').show();
                 var html = '<div class="group-box"><li class="quenstion-all option-li"><div class="content-edit" contenteditable="true" type="table"></div><a class="del-group" href="javascript:void(null)">&#10005;</a></li><div class="content-edit combin-content" contenteditable="true" type="table"></div></div>';
                $(this).closest('.multiple-choice-option').find('.quenstion-group').empty().append(html);
                util.initRichEditor($('.table-wrapper'));
                $('.table-sub-checkbox').hide();
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
                var $this = $(this).closest('.table-box');
                jConfirm('确认删除吗？','警告',function(){
                    var dataUrl = basePath + '/paperitem/deletepaperitem',
                        parmes = {
                            paperItemId: $this.find('.hd-paperitem-id').val()
                        };
                    $.when(dao.requestListData(dataUrl, parmes)).done(function(data) {
                        if (data.flag === 1) {
                            $this.remove();
                            alert(data.flagMsg);
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
         */
        viewEdit: function() {
        	if((window.okType === true && window.combination === false) || (window.okType === true && $(this).parents('.combin-box').length != 0)){
        		var $this = $(this).closest('.table-box'),
        		dataUrl = basePath + "/paperitem/getpaperitem",
        		templUrl = basePath + '/resources/editpaper/templ/table/table.html',
        		parmes = {
        			paperItemId: $this.find('.hd-paperitem-id').val()
        		};
        		$.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
        			if (data.flag) {
        				if (data.data) {
        					var render = template.compile(templ);
        					$this.empty().append(render(data));
        					window.okType = false;
        					$('.table-wrapper .quenstion-ul .option-li').drag({ //选项拖拽
        		                'handle':'.option-handle'
        		            },function(){
                                util.initRichEditor($('.table-wrapper'));
                            });

                            if (data.data.complex === true){
                            	$this.find('.add-group').show();
                                $(".switch option[value='combin'] ").attr("selected",true);
                                $('.table-sub-checkbox').hide();
                            }
        					util.initRichEditor($('.table-wrapper'));
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

    var init = function(){
        addEvents();

    };

    $(function(){
        init();
    })
})