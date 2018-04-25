/**
 * @description: 设置逻辑弾框
 * @author：smchen2
 * @time: 陈世敏(2016-08-19)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
        dao = require('common/dao'); 

    var addEvents = function(){
        // tab切换
        $(document).on('click','.tab-box span',function(){
            if($(this).attr('type') === 'site'){
                $('.site-wrapper').show();
                $('.show-wrapper').hide();
                $(this).addClass('.tab-selected').siblings().removeClass('tab-selected');
            }else{
                $('.site-wrapper').hide();
                $('.show-wrapper').show();
                $(this).addClass('tab-selected').siblings().removeClass('tab-selected');
            }
        });
        // 选中跳转题
        $(document).on('click','.site-wrapper .sigle-option',function(){
            var $this = $(this),
                index = $this.index(),
                $item = $('.site-wrapper .right-panple').eq(index);
            if($this.hasClass('selected')){
                $this.removeClass('selected');
            }else{
                $this.addClass('selected').siblings().removeClass('selected');
            }
            $item.addClass('show').siblings().removeClass('show');
        });
        // 选中选项
        $(document).on('click','.site-wrapper .sigle-theme',function(){
            var $this = $(this);
            if($this.hasClass('selected')){
                $this.removeClass('selected');
            }else{
                $this.addClass('selected').siblings().removeClass('selected');
            }
        });

         // 选中跳转题
        $(document).on('click','.show-wrapper .sigle-option',function(){
            var $this = $(this),
                index = $this.index(),
                $item = $('.show-wrapper .right-panple').eq(index);
            if($this.hasClass('selected')){
                $this.removeClass('selected');
            }else{
                $(this).addClass('selected').siblings().removeClass('selected');
            }
            $item.addClass('show').siblings().removeClass('show');
        });
        // 选中选项
        $(document).on('click','.show-wrapper .sigle-theme',function(){
            var $this = $(this);
            if($this.hasClass('selected')){
                $this.removeClass('selected');
            }else{
                $this.addClass('selected').siblings();
            }
        });

        // 弾框取消
        $(document).on('click','.dialog-cancle',cancleEvent);
        // 弾框确定
        $(document).on('click','.dialog-ok',okEvent);
    }
    /**
     * [okEvent 弾框确定函数]
     * @return {[type]} [description]
     */
    var okEvent = function(){
    	$(this).attr('disabled', 'disabled');
        var dataUrl = basePath + '/paper/updatepaperjumplogic',
            jumplogic = {},
            dispalyLogic = {},
            sts = [],
            displayQN = [];
        // 跳转逻辑,实际是id
        jumplogic.code = $('#code').val();
        $('.site-wrapper .sigle-option').each(function(index,item){
                var obj = {
                    name:$(item).attr('name'),
                    targetQuestionNumber:$('.site-wrapper .right-panple').eq(index).find('.selected span').attr('targetId')
                }
                sts.push(obj);
        });
        // 显示逻辑
        dispalyLogic.code = $('#code').val();
        $('.show-wrapper .sigle-option').each(function(index,item){
            var obj = {
                name:$(item).attr('name'),
                qn:[]
            }
            $('.show-wrapper .right-panple').eq(index).find('.selected').each(function(i,val){
                var targetId = $(val).find('span').attr('targetId'),
                    showObj = {};
                showObj.targetQuestionNumber = targetId;
                obj.qn.push(showObj);
            });
            displayQN.push(obj);
        });
        jumplogic.sts = sts;
        dispalyLogic.displayQN = displayQN;
        jumplogic = JSON.stringify(jumplogic);
        dispalyLogic = JSON.stringify(dispalyLogic);
        var parmes = {
                jumplogic:jumplogic,
                displaylogic:dispalyLogic,
                paperId:$(this).attr('data-id')
            };
        $.when(dao.requestListData(dataUrl,parmes)).done(function(data){
            if(data.flag === 1){
            	$(this).removeAttr('disabled');
                $.alerts._hide();
                jnoButtonConfirm('保存成功！', '','',1);
            }else{
                jnoButtonConfirm('保存失败!', '','',1);
            }
        }).fail(function(){
            jnoButtonConfirm('网络错误！', '','',1);
        });
    }
    // 弾框取消
    var cancleEvent = function(){
        $.alerts._hide();
    }
    addEvents();
})