/**
 * @description: 公共的方法
 * @author：smchen2
 * @time: 陈世敏(2016-08-20)
 */
requirejs.config(requireConfig);
define(function(require, exports, module) {
    require('imageCtrl');
    require('plugin');
    require('pasteImgText');
    require('ckeditor');
    require('textCode');
    require('index');
    var $ = require('jquery'),
        dao = require('common/dao'),
        template = require('template');
    var utils = {
      /**
       * [logicEvent 设置逻辑弾框]
       * @return {[type]} [description]
       */
      logicEvent:function(){
            var dataUrl = basePath + "/paperitem/getjumpdata",
                parmes = {
                    paperItemId:$(this).attr('data-id')
                };
            $.when(dao.requestListData(dataUrl, parmes)).done(function(data) {
                if (data.flag) {
                    if (data.data) {
                            html = MPT.getTmpl('t_tmplete_dialog',data.data);
                        jnoButtonConfirm(html, '','','');
                        if(data.data.paperItemDTO.type === 2 || data.data.paperItemDTO.type === 5){
                        	$('.show-logic').click();
                        	$('.tab-box').css('width', '20%');
                        }
                    } else {
                        jnoButtonConfirm('数据为空！', '','',1);
                    }
                } else {
                    jnoButtonConfirm(data.flagMsg, '','',1)
                }
            }).fail(function() {
                jnoButtonConfirm('网络错误！', '','',1);
            })
        },
        wrapperHover:function(){
            // var $this=$(this),
            //     templUrl = basePath + 'res/templ/conctrol/conctrol.html';
            // $.when(dao.requestListTmpl(templUrl)).done(function(templ){
            //     var data = {},
            //         render = template.compile(templ);
            //     $this.append(render(data));
            // }).fail(function(){
            //     alert('网络错误！');
            // });
            $(this).find('.conctrol-box').show();
        },
        wrapperOut:function(){
            $(this).find('.conctrol-box').hide();
        },
        getValue:function(){
            var falg = true;
            $('.content-edit').each(function(index,item){
                if(!$(item).find('img').length){
                    if(!$.trim($(item).text())){
                        jnoButtonConfirm('存在未输入项！', '','',1);
                        falg = false;
                        return false;
                    }
                }
            });
            
            return falg;
        }
    };
    return utils;

});