/**
 * @description: 多选
 * @author：smchen2
 * @time: 陈世敏(2016-08-08)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        base = require('common/base'),
        template = require('template'),
        dao = require('common/dao');
    require('popbox');
    require('dropListSave'); //记录下拉框数值
    var type = 2;//题目类型
    var addEvents = function(){
        // 删除
        $(document).on('click','.multiple-wrapper .item-option a:not(".del-fill")',eventCtroller.remove);
        // 新增
        $(document).on('click','.multiple-wrapper .add-option',eventCtroller.add);
        // 删除其他项
        $(document).on('click','.multiple-wrapper .del-fill',eventCtroller.delOther);
        // 新增其他
        $(document).on('click','.multiple-wrapper .option-control a.add-other',eventCtroller.addOther);
        // 确定
        $(document).on('click','.multiple-wrapper .ok',eventCtroller.okEvent);
        // 取消
        $(document).on('click','.multiple-wrapper .cancle',eventCtroller.cancleEvent);
        // maxChoiceNum值改变
        $(document).on('change','.multiple-wrapper .option-number',eventCtroller.maxChoiceNumChange);

        //预览删除
        $(document).on('click', '.multiple-view .view-delete', eventCtroller.cancleViewEvent);

        // 预览编辑
        $(document).on('click', '.multiple-view .view-edit', eventCtroller.viewEdit);

        //预览设置逻辑
        $(document).on('click', '.multiple-view .view-logic', base.logicEvent);
        
        $(document).on('mouseover','.view-wrapper',base.wrapperHover);

        $(document).on('mouseout','.view-wrapper',base.wrapperOut);
        // 模拟checkbox
        $(document).on('click', '.multiple-box .check-box i',function(){
            var $this = $(this);
            if($this.hasClass('checkbox-selected')){
                $this.removeClass('checkbox-selected');
            }else{
                $this.addClass('checkbox-selected');
            }
        });
        $(document).off('click','a.add-magic-controller').on('click','a.add-magic-controller',eventCtroller.addMagicRules);
        $(document).off('input','.magic-rules-box select').on('input','.magic-rules-box select',eventCtroller.setDefaultRule);
        $(document).off('click','.magic-rule-item a').on('click','.magic-rule-item a',eventCtroller.deleteRuleItem);
    };

    var eventCtroller = {
        /**
         * [remove 删除选项]
         * @return {[type]} [description]
         */
        remove:function(){
        	$this = $(this).closest('.multiple-choice-option');
        	// 其他项只是hide的 依然存在 so is 3
        	if($this.find('.item-option').length <= 3){
        		return;
        	}
        	var optionNumber = $(this).parents(".multiple-wrapper").find(".option-number");
        	$(optionNumber).val(parseInt($(optionNumber).val())-1);
            $(this).parent().remove();
            $('.multiple-wrapper .option-box .item-option').drag({ //选项拖拽
                'handle':'.option-handle'
            },function(){
                util.initRichEditor($('.multiple-wrapper'));
            });
            //change select box
            eventCtroller.changeMagicValue();
        },
        /**
         * [add 新增选项]
         */
        add:function(){
            var html = '<li class="item-option"><div class="content-edit" contenteditable="true" type="multiple"></div><span class="option-handle"></span><a href="javascript:void(null)">&#10005;</a></li>';
            $('.multiple-wrapper .option-box').append(html);
            $('.multiple-wrapper .option-box .item-option').drag({ //选项拖拽
                'handle':'.option-handle'
            });
            util.initRichEditor($('.multiple-wrapper'));
            var optionNumber = $(this).parents(".multiple-wrapper").find(".option-number");
            $(optionNumber).val(parseInt($(optionNumber).val())+1);
            //change select box
            eventCtroller.changeMagicValue();
        },
        delOther:function(){
        	util.removeRichEditor($('.fill'));
        	var optionNumber = $(this).parents(".multiple-wrapper").find(".option-number");
        	$(optionNumber).val(parseInt($(optionNumber).val())-1);
            $('.fill').hide();
            $this = $(this).closest('.multiple-choice-option');
            $(this).parents('.multiple-wrapper').find('.option-control a').show();
            $(this).parents('.multiple-wrapper').find('.option-control a').attr('other-show','false');
            $('.add-other').show().removeAttr('disabled');
            $this.find('.fill .item-option').html('');
            type = 2;
            //change select box
            eventCtroller.changeMagicValue();
        },
        /**
         * [addOther 增加其他项]
         */
        addOther:function(){
            if($('.option-operating .other-option').find('div').length) return;
        	$('.fill').show();
        	// $(this).hide();
        	$(this).attr('other-show','true');
            $(this).attr('disabled','disabled');
            $this = $(this).closest('.multiple-choice-option');
            $this.find('.fill .item-option').html('<div class="content-edit theme" contenteditable="true" type="radio"></div><a href="javascript:void(null)" class="del-fill">&#10005;</a>')
            $this.find('.fill .content-edit').attr('contenteditable',true);
            util.initRichEditor($('.multiple-wrapper'));
            var optionNumber = $(this).parents(".multiple-wrapper").find(".option-number");
            $(optionNumber).val(parseInt($(optionNumber).val())+1);
            //change select box
            eventCtroller.changeMagicValue();
        },
        okEvent:function(){
        	$(this).attr('disabled', 'disabled');
            if(base.getValue()){
                var $this = $(this).closest('.multiple-box'); 
               
                var type = 2,
                	parmes = {},
                    options = [],
                    object = {};
                var magicRules = eventCtroller.readRules();
                $this.find('.option-operating .item-option').each(function(index,item){
                    if ($(item).find('.content-edit').html() != undefined) {
                        if($(item).hasClass('other-option')){ //多选填空
                            type = 5;
                            parmes.constraints = dynamicSelected.getCountObj(); //调用dropListSavejs的获取约束的方法
                        }
                        var obj={
                            value:$(item).find('.content-edit').html(),
                            name:index
                        };
                        if(magicRules[index + 1] && magicRules[index + 1] instanceof Array){
                            obj.magicRules = magicRules[index + 1].join(',')
                        }else{
                            obj.magicRules = '';
                        }
                        options.push(obj);
                    }
                });
                parmes.type = type;
                parmes.questionTitle = $this.find('.theme').html();
                parmes.options = options;
                parmes.showColumnNum = $this.find('.column-num option:selected').text();
                parmes.combine = window.combination;
                parmes.maxChoiceNum = $this.find('.option-number').val();
                parmes.pageIndex = $('.tab-ul li').index($('.page-seletced')); //当前页
                if($('.check-box i').hasClass('checkbox-selected')){ //是否为辅助题
                    parmes.assistFlag = true;
                }else{
                    parmes.assistFlag = false;
                }
                
                if(parmes.combine === true){
                    parmes.parentId = $this.parents('.combin-box').find('.hd-parentid').val(); //组合题父级id
                }
                object.paperItemId = $this.find('.hd-paperitem-id').val();
                object.paperId = window.paperId;
                object.paperItem = JSON.stringify(parmes);
                var dataUrl = basePath+"/paperitem/savepaperitem",
                    templUrl = basePath + '/resources/editpaper/templ/multiple-choice/multiple-choice-view.html';
                $.when(dao.requestListTmpl(templUrl),dao.requestListData(dataUrl,object)).done(function(templ,data){
                    if(data.flag === 1){
                    	$(this).removeAttr('disabled');
                    	$this.find('.hd-paperitem-id').val(data.data.id);
                        window.okType = true;
                        util.removeRichEditor($this);
                        var render = template.compile(templ);
                        $this.empty().append(render(data));
                        util.getImgData();//重新设置图片的宽高
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
        	var $this = $(this).closest('.multiple-box'); 
        	if($this.find('.hd-paperitem-id').val() != ''){
        		var dataUrl = basePath+"/paperitem/getviewpaperitem",
	        		parmes = {
	                        paperItemId: $this.find('.hd-paperitem-id').val()
	                    },
	                templUrl = basePath + '/resources/editpaper/templ/multiple-choice/multiple-choice-view.html';
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
        		$this = $(this).closest('.multiple-wrapper');
        		util.removeRichEditor($this);
	            $this.closest('.multiple-wrapper').remove();
	            window.okType = true;
        	}
        },
        /**
         * [maxChoiceNumChange 动态获取最大选择项]
         * @return {[type]} [description]
         */
        maxChoiceNumChange:function(){
        	var $this = $(this),
                num = $this.parents(".multiple-wrapper").find('.item-option').length;
        	if($this.parents('.multiple-wrapper').find('.option-control a').attr("other-show") == 'false'){
        		num = num - 1;
        	}
        	if(parseInt($this.val()) > num || parseInt($this.val()) == 0){
        		$this.val(num);
        	}
        	if($this.val().match(/\D/g)){
        		$this.val(num);
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
                var $this = $(this).closest('.multiple-box');
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
        		var $this = $(this).closest('.multiple-box'),
        		dataUrl = basePath + "/paperitem/getpaperitem",
        		templUrl = basePath + '/resources/editpaper/templ/multiple-choice/multiple-choice.html',
        		parmes = {
        			paperItemId: $this.find('.hd-paperitem-id').val()
        		};
        		$.when(dao.requestListTmpl(templUrl), dao.requestListData(dataUrl, parmes)).done(function(templ, data) {
        			if (data.flag) {
        				if (data.data) {
        					var render = template.compile(templ);
        					$this.empty().append(render(data));
                            if (data.data.type === 5){
                                $this.find('.multiple-choice-option .fill .item-option').html('<div class="content-edit theme" contenteditable="true" type="radio">'+data.data.options[data.data.options.length-1].value+'</div><a href="javascript:void(null)" class="del-fill">&#10005;</a>');
                                $this.find('.fill .content-edit').attr('contenteditable', true);
                            }
                            $(".column-num option[value='"+data.data.showColumnNum+"'] ").attr("selected",true);
        					window.okType = false;

        					$('.multiple-wrapper .option-box .item-option').drag({ //选项拖拽
        		                'handle':'.option-handle'
        		            },function(){
                                util.initRichEditor($('.multiple-wrapper'));
                            });
        					util.initRichEditor($('.multiple-wrapper'));

                            if(data.data.constraints != null){ //初始化约束
                                dynamicSelected.init(data.data.constraints);
                            }else{
                                dynamicSelected.init();
                            }
                         //   初始化互斥条件
                            eventCtroller.changeMagicValue();
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
         * [addMagicRules 添加单条互斥规则]
         */
        addMagicRules: function () {
            var node = $('.magic-rules-box');
            var magicRuleItem = $('<p class="magic-rule-item"><label>互斥规则：</label>条件&nbsp;' +
                '<select class="magic-rule first-rule"></select>&nbsp;&nbsp;&nbsp;&nbsp;对立条件&nbsp;' +
                '<select class="magic-rule second-rule"></select>' +
                '<a href="javascript:void(null)" style="float: right; color: #999CB4;">✕</a></p>');
            node.append(magicRuleItem);
            //取值
            eventCtroller.changeMagicValue();
        },
        /**
         * [changeMagicValue 动态修改下拉框的值]
         */
        changeMagicValue: function () {
            //取值
            var nomalItemLength = $('.option-box .item-option').length,
                fillItemLength = $('.option-operating .other-option').find('div').length ? 1 : 0;
            var allItemLength = nomalItemLength + fillItemLength, domFragemnt = "<option value = '-1' >请选择</option>";
            for(var i = 0 ; i < allItemLength ; i++){
                 domFragemnt += "<option value = '"+ (i+1) +"' >选项"+ (i+1) +"</option>";
            }
            // set value
            $('.magic-rule').each(function ($index, select) {
                var selfValue = !!$(select).val() ? $(select).val() : $(select).attr('data-rule');
                $(select).html(domFragemnt);
                if(!!selfValue && !!$(select).find('option[value="'+ selfValue +'"]').length){
                    $(select).val(selfValue);
                }else{
                    $(select).val("-1");
                }
            });
            // prohibit value
            $('.magic-rule').each(function ($index, select) {
                var selfValue = $(select).val() ? $(select).val() : $(select).attr('data-rule');
                if(!$(select).hasClass('second-rule')){
                    $(this).parent().find('.second-rule option[value='+selfValue+']').attr('disabled',"disabled");
                }else if($(select).hasClass('second-rule')){
                    $(this).parent().find('.first-rule option[value='+selfValue+']').attr('disabled',"disabled");
                }
            })
        },
        /**
         * [setDefaultRule 屏蔽已选]
         */
        setDefaultRule: function () {
            var selfValue = $(this).val();
            if(selfValue === "-1") return;
            if(!$(this).hasClass('second-rule')){
                $(this).siblings('.second-rule').find('option').each(function (index,$option) {
                    if( $($option).attr('value') === selfValue ){
                        $($option).attr('disabled','disabled');
                    }else{
                        $($option).removeAttr('disabled');
                    }
                });
            }else if($(this).hasClass('second-rule')){
                $(this).parent().find('.first-rule option').each(function (index,$option) {
                    if( $($option).attr('value') === selfValue ){
                        $($option).attr('disabled','disabled');
                    }else{
                        $($option).removeAttr('disabled');
                    }
                });
            }
        },
        /**
         * [readRules 读取互斥规则]
         * @returns {{}}
         */
        readRules: function () {
            var magicRules = {}, isExit = 0;
            Array.prototype.forEach.call($('.magic-rule-item'),function (item) {
                var primary = $(item).find('.first-rule').val(),
                    secondary = $(item).find('.second-rule').val();
                if(primary !== "-1" && secondary !== '-1'){

                    isExit++;

                    if( magicRules[primary] instanceof Array ){
                        magicRules[primary].push(secondary)
                    }else{
                        magicRules[primary] = [secondary]
                    }

                    if(magicRules[secondary] instanceof Array){
                        magicRules[secondary].push(primary)
                    }else{
                        magicRules[secondary] = [primary]
                    }
                }
            });
            return isExit === 0 ? false : magicRules;
        },
        /**
         * [deleteRuleItem 刪除单条规则]
         */
        deleteRuleItem: function () {
            $(this).parents('.magic-rule-item').remove();
        }
    };

    var init = function(){
        addEvents();
    };

    $(function(){
        init();
    })
});