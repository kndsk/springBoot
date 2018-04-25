/**
 * @description: 预览
 * @author：smchen2
 * @time: 陈世敏(2016-08-19)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var util = require('common/common'),
    	dao = require('common/dao'),
        template = require('template'),
        answer = require('eachpage-preview-paper/answer');
        require('previewDrag');//排序拖拽
        require('mpt');//模板系统引入
        require('tpl');//模板引入
        require('popbox');
    /*
	* 数组去重 去空
	*/
	Array.prototype.weight = function(){
		var d = {};
		var b = [];
		var _this = this;
		if(_this.length <= 1) {
			return _this;
		}
		d[_this[0]] = _this[0];
		if(_this[0] != ''){
			b.push(_this[0]);
		}
		for(var i=1,len = _this.length;i<len;i++){
			if(_this[i] != d[_this[i]]){
				d[_this[i]] = _this[i];
				if(_this[i] != ''){
					b.push(_this[i]);
				}
			}else{
				continue;
			}
		}
		return b;
	}
    // 绑定事件
    var addEvents = function(){
    	$(document).on('blur','.xs',eventController.xsInputCtrl);

    	$(document).on('blur','.zs',eventController.zsInputCtrl);

    	$(document).on('blur','.sz',eventController.szInputCtrl);
        $(document).on('keyup','.zs',eventController.zsInputCtrl1);
        $(document).on('keyup','.sz',eventController.zsInputCtrl1);
        $(document).on('keyup','.xs',eventController.zsInputCtrl1);
        //选择
        $(document).on('click','.item-view-option .checkbox-normal',eventController.optionSwicth);
        $(document).on('click','.item-view-option .radio-normal',eventController.optionSwicth);

        $(document).on('click','.radio-view-option',eventController.optionSwicth);
        $(document).on('blur', '.item-view-option input', eventController.optionSwicthWithInput);

    	// $(document).on('click','.item-view-option',eventController.clickCtrl);
    	//input change事件
    	$(document).on('change','input',eventController.inputChange);

    	$(document).on('change','textarea',eventController.inputChange);

    	$(document).on('mouseover','.answer-box',eventController.dragChange);
    	//上一页点击
        $(document).on('click','.pre-page',eventController.prePage);
        //下一页点击
        $(document).on('click','.next-page',eventController.nextPage);
    	//提交
    	$(document).on('click','#submitAnswer',eventController.submitAnswer);
    };
    //控制逻辑
    var controlManager = {
        //保存跳转逻辑变量
        jumplogic:null,
        //保存了那一道题设置了跳转逻辑
        jumpSaveId:{},
        //跳转逻辑 设置
        jumplogicSet:function(){
           var currentpage =  controlManager.currentpage;
           if(!!controlManager.jumplogic){
        	   for(var i=0;i<controlManager.jumplogic.length;i++){
                   var list = controlManager.jumplogic[i];
                   controlManager.jumpSaveId[list.code] = {};
                   for(var j=0;j<list.sts.length;j++){
                       var listj = list.sts[j];
                       controlManager.jumpSaveId[list.code][listj.name] = listj.targetQuestionNumber;
                   }
              }
           }
        },
        //保存显示逻辑
        displayLogic:null,
        //保存题目数据
        answerData:null,
        //保存每页的ID数据
        savaPageForId:null,
        //保存包含的显示逻辑的ID
        saveDisplayForId:{},
        /*
                        显示控制对象
            {'id名':{
                isShow:false
            }}
        */
        displayObj:null,
        //用户行为路径数组 页数跳转
        userBehaviorPath:[1],
        //当前页 对应的是原始数组的位置
        currentpage:0,
        //总页数
        total:0,
        //总题数
        totalNum:0,
        //计算分页
        countPageNext:function(){
            controlManager.currentpage++;
            var flag = 0;
            for(var i=0;i<controlManager.savaPageForId[controlManager.currentpage].length;i++){
                var list = controlManager.savaPageForId[controlManager.currentpage][i];
                if(!controlManager.displayObj[list].isShow){
                    flag++;
                }
            }
            if(flag == controlManager.savaPageForId[controlManager.currentpage].length){
                controlManager.countPageNext();
            }else{
                //如果用户行为数组已经添加 则忽略不再添加
                var flagAdd = true;
                for(var i=0;i<controlManager.userBehaviorPath.length;i++){
                    var listl = controlManager.userBehaviorPath[i];
                    if(listl == controlManager.currentpage){
                        flagAdd = false;
                    }
                }
                if(flagAdd){
                    controlManager.userBehaviorPath.push(controlManager.currentpage);
                }
                renderView.renderTheme(controlManager.answerData[controlManager.currentpage-1]);
            }
        },
         //计算分页
        countPagePrev:function(){
            //移除当前页
            var currentPage = controlManager.userBehaviorPath.pop();
            var _l = controlManager.userBehaviorPath.length;
            controlManager.currentpage = controlManager.userBehaviorPath[_l-1];
            renderView.renderTheme(controlManager.answerData[controlManager.currentpage-1]);
        },
        //数据改造
        transData:{
            /*
                渲染模板位置数据改造
                如果当前页都是隐藏的继续查找下一页 以此类推
            */
            tmplTransData:function(num){
                var result = null;
                //上一页
                if(num === -1){
                   controlManager.countPagePrev();
                }
                //下一页
                if(num === 1){
                   controlManager.countPageNext();
                }
            }
        }
    };
    // 加载
    var renderView = {
        /**
         * [renderThemeData 请求数据]
         */
        renderThemeData:function(){
            var dataUrl = globalConfig.requestBase + globalConfig.req.getpaperitems,
                parmes = {
                        paperId:$('#hdPaperId').val()
                    };
            		util.ajax.ajaxPost(dataUrl, parmes,function(data){
                        if(data.flag === 1){
                        if(data.data.answerData != null){
                            var dataSaveD  = data.data;
                          //保存全局数据
                            controlManager.answerData = dataSaveD.answerData;
                            if(!!dataSaveD.viewData){
                                var listData = dataSaveD.viewData;
                                controlManager.displayObj = {};
                                //保存显示数组
                                for(var i=0;i<listData.length;i++){
                                    var list = listData[i];
                                    if(!!list.subPaperItemDTOs){
                                        controlManager.displayObj[listData[i].id] = {};
                                        controlManager.displayObj[listData[i].id].isShow = true;
                                        controlManager.displayObj[listData[i].id].type = list.type;
                                        controlManager.displayObj[listData[i].id].index = list.index;
                                        for(var j=0;j<list.subPaperItemDTOs.length;j++){
                                            var listJ = list.subPaperItemDTOs[j];
                                            controlManager.displayObj[listJ.id] = {};
                                            controlManager.displayObj[listJ.id].isShow = true;
                                            controlManager.displayObj[listJ.id].type = listJ.type;
                                            controlManager.displayObj[listJ.id].index = listJ.index;
                                        }
                                    }else{
                                        controlManager.displayObj[listData[i].id] = {};
                                        controlManager.displayObj[listData[i].id].isShow = true;
                                        controlManager.displayObj[listData[i].id].type = list.type;
                                        controlManager.displayObj[listData[i].id].index = list.index;
                                    }
                                }
                            }
                            //如果有显示逻辑跳转
                            if(!!dataSaveD.displayLogic){
                                controlManager.displayLogic = dataSaveD.displayLogic;
                                var listData = dataSaveD.displayLogic;
                                //更改显示数组
                                for(i=0;i<listData.length;i++){
                                    if(listData[i]){
                                        for(var j=0;j<listData[i].displayQN.length;j++){
                                            controlManager.saveDisplayForId[listData[i].code] = listData[i].displayQN;
                                            if(listData[i].displayQN[j]){
                                                for(var m=0;m<listData[i].displayQN[j].qn.length;m++){
                                                    var list = listData[i].displayQN[j].qn[m];
                                                    if(!!controlManager.displayObj[list.targetQuestionNumber]){
                                                    	controlManager.displayObj[list.targetQuestionNumber].isShow = false;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //保存当前页包含的ID
                            if(!!dataSaveD.answerData){
                                controlManager.savaPageForId = {};
                                controlManager.saveAnswerForPage = {};
                                for(var i=0;i<dataSaveD.answerData.length;i++){
                                    var list = dataSaveD.answerData[i];
                                    controlManager.savaPageForId[(i+1)] = [];
                                    controlManager.saveAnswerForPage[i+1] = [];
                                    for(var j=0;j<list.paperItemDTOs.length;j++){
                                        var listJ = list.paperItemDTOs[j];
                                        //如果是组合题
                                        if(!!listJ.subPaperItemDTOs){
                                            for(var m=0;m<listJ.subPaperItemDTOs.length;m++){
                                                var listm = listJ.subPaperItemDTOs[m];
                                                controlManager.savaPageForId[(i+1)].push(listm.id);
                                            }
                                        }else{
                                            controlManager.savaPageForId[(i+1)].push(listJ.id);
                                        }
                                    }
                                }
                            }
                            //记录当前页
                            controlManager.currentpage = 1;
                            //保存总页数
                            controlManager.total = dataSaveD.answerData.length;
                            //保存总题数
                            controlManager.totalNum = dataSaveD.viewData.length;
                            //保存原始跳转逻辑变量
                            if(!!dataSaveD.jumpLogic)
                                controlManager.jumplogic = dataSaveD.jumpLogic;
                                //跳转逻辑初始化保存
                                controlManager.jumplogicSet();
                            }
                            //如果记录后 用户刷新
                            if(window.localStorage.getItem($('#hdPaperId').val()+'_currentpage')){
                                var countCurr = parseInt(window.localStorage.getItem($('#hdPaperId').val()+'_currentpage'));
                                controlManager.currentpage = countCurr;
                                controlManager.userBehaviorPath = window.localStorage.getItem($('#hdPaperId').val()+'_userBehaviorPath').split(',');
                                controlManager.displayObj = JSON.parse(window.localStorage.getItem($('#hdPaperId').val()+'_displayObj'));
                                renderView.renderTheme(controlManager.answerData[countCurr-1]);
                                //触发按钮的选中单击事件
                                $('.item-view-option').each(function(){
                                	if($(this).find('.checkbox-selected').length > 0){
                                		$(this).find('.checkbox-selected').removeClass('checkbox-selected');
                                		$(this).trigger('click');
                                	}
                                    if($(this).find('.radio-selected').length > 0){
                                         $(this).trigger('click');
                                    }
                                });
                            }else{ //默认加载第一页
                               renderView.renderTheme(controlManager.answerData[0]);
                            }
                        }else{
                            jnoButtonConfirm('网络错误！', '','',1);
                        }
                    })
        },
        /**
         * [renderTheme 加载题目]
         * data 当前页数据
         */
        renderTheme:function(data){
            //加载模板
            $('.main-wrapper').html(MPT.getTmpl('T_tmplete',data));
            //加载跳页
            $('.main-wrapper').append(MPT.getTmpl('T_pageJump',{'index':controlManager.currentpage,'totalPage':controlManager.total}));
            eventController.getImgData();
            var indexS = -1;
            $(data.paperItemDTOs).each(function(index,item){
                if(item.type === 7){
                    indexS++;
                    $('.sort-options').eq(indexS).find('.list').dragNew({  //拖拽排序
                        'handle':'.option-handle',
                        'leftDom':$('.sort-input').eq(indexS),
                        'rightDom':$('.sort-options').eq(indexS),
                        'maxNum':item.maxInputNum,
                        'listNum':item.sortOptions.length
                    });
                }
                if(item.type === 11 && item.combine === true){
                	$(item.subPaperItemDTOs).each(function(index,element){
                		if(element.type === 7){
                			  indexS++;
                              $('.sort-options').eq(indexS).find('.list').dragNew({  //拖拽排序
                                  'handle':'.option-handle',
                                  'leftDom':$('.sort-input').eq(indexS),
                                  'rightDom':$('.sort-options').eq(indexS),
                                  'maxNum':element.maxInputNum,
                                  'listNum':element.sortOptions.length
                              });
                		}
                	});
                }
            });
            eventController.initRangeEvent();
            answer.simulateInit();
            //保存当前页面
            window.localStorage.setItem($('#hdPaperId').val()+'_currentpage',controlManager.currentpage);
            window.localStorage.setItem($('#hdPaperId').val()+'_userBehaviorPath',controlManager.userBehaviorPath);
            window.localStorage.setItem($('#hdPaperId').val()+'_displayObj',JSON.stringify(controlManager.displayObj));
        }
    };
    // 事件控制
    var eventController = {
        /**
         * [selecteData 删选数据]
         */
        selecteData:function(indexPage){

        },
        /**
         * [prePage 上一页]
         * @return {[type]} [description]
         */
        prePage:function(){
             controlManager.transData.tmplTransData(-1);
            sorll();
        },
        /**
         * [nextPage 下一页]
         */
        nextPage:function(){
            var result = window.areadyAnswerResult;
            var cur = controlManager.currentpage;
            var listId = controlManager.savaPageForId[cur];
            var flag = 0;
            for(var i=0;i<listId.length;i++){
                var listI = listId[i];
                for(var j=0;j<result.length;j++){
                    if(result[j].questionNum == listI){
                        flag++;
                    }
                }
                if(!controlManager.displayObj[listI].isShow){
                    flag++;
                }else if(controlManager.displayObj[listI].type == 11){
                    flag++;
                }
            }
            sorll();
            /*if(flag != listId.length){
                 jnoButtonConfirm('当前页还有未选择的题目，请选择后再跳转！', '','',1);
            }else{
                 controlManager.transData.tmplTransData(1);
            }*/
            controlManager.transData.tmplTransData(1);

        },
        //小数控制
		xsInputCtrl:function(){
			var inputVal = $(this).val();
			var len = $(this).attr('pointNum');
			// var s = '';
			// for(var i = 0; i < parseInt(len); i++){
			// 	s = s + (i+1);
			// 	if(i != parseInt(len)-1){
			// 		s = s + ',';
			// 	}
			// }
			///^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/g
            eval("var rexp = /^-?[0-9]+([\.][0-9]{1," + parseInt(len) + "}){0,1}$/gi");
			var res = inputVal.match(rexp);
			if(res == null || !res[0]){
				$(this).val("");
                jAlert("请最多保留"+parseInt(len)+"位小数", "提示");
				return;
			}
            var thisVal=parseFloat(inputVal);
            var minVal=parseFloat($(this).attr('minNum'));
            var maxVal=parseFloat($(this).attr('maxNum'));
            if( thisVal< minVal || thisVal> maxVal){
                $(this).val("");
                jAlert("请输入大于等于"+minVal+"并且小于等于"+maxVal+"的值", "提示");
                return;
            }
            if(inputVal ==""){
                return;
            }
            $(this).val(parseFloat(inputVal));
		},
        /*zsInputCtrl1:function(){
            var val = $(this).val().trim();
            $(this).val(val);
        },*/
		//整数控制
		zsInputCtrl:function(){
			var inputVal = $(this).val();
			var rexp = /^-?[0-9]*$/g;
			var res = inputVal.match(rexp);
			if(res == null || !res[0]){
				$(this).val("");
                jAlert("请输入整数", "提示");
				return;
			}
            var thisVal=parseFloat(inputVal);
            var minVal=parseFloat($(this).attr('minNum'));
            var maxVal=parseFloat($(this).attr('maxNum'));
            if( thisVal< minVal || thisVal> maxVal){
                $(this).val("");
                jAlert("请输入大于等于"+minVal+"并且小于等于"+maxVal+"的值", "提示");
                return;
            }
            if(inputVal ==""){
                return;
            }
            $(this).val(parseFloat(inputVal));
		},
		//数字控制
		szInputCtrl:function(){
			var inputVal = $(this).val();
            var rexp = /^-?\d+(\.\d+)?$/g;
			var res = inputVal.match(rexp);
			if(res == null || !res[0]){
				$(this).val("");
                jAlert("请输入数字", "提示");
				return;
			}
			var thisVal=parseFloat(inputVal);
            var minVal=parseFloat($(this).attr('minNum'));
            var maxVal=parseFloat($(this).attr('maxNum'));
            if( thisVal< minVal || thisVal> maxVal){
                $(this).val("");
                jAlert("请输入大于等于"+minVal+"并且小于等于"+maxVal+"的值", "提示");
                return;
            }
            if(inputVal ==""){
                return;
            }
            $(this).val(parseFloat(inputVal));
		},
        zsInputCtrl1:function(){
            var val = $(this).val().trim();
            $(this).val(val);
        },
        /**
         * [optionSwicth 选项切换]
         * @return {[type]} [description]
         */
        optionSwicth:function(e){
            var targetId;
        	if(e.target.nodeName != 'INPUT'){
                var $this = $(this).parents('.item-view-option');
                if($this.length === 0){
                    $this = $(this);
                }
        		//单选
        		if($this.find('.radio-normal').length > 0){
                    targetId = $(this).parents('.radio-view').attr('itemid');
        			$this.find('.radio-normal').addClass('radio-selected');
                    if($this.find('input').length > 0 && !$this.find('input').val()){
                        $this.find('input').get(0).focus();
                    }
        			var both = $this.siblings();
            		both.each(function(index, element){
            			$(element).find('.radio-normal').removeClass('radio-selected');
            			$(element).find('input').val("");
            		})
        		}
        		//多选
        		if($this.find('.checkbox-normal').length > 0){
                    targetId = $(this).parents('.multiple-view').attr('itemid');
                    //read rule
                    var rules = $this.attr('data-rule');
                    if(!!rules){
                        rules = rules.split(',').sort().join(',');

                        //查看是否可以点击
                        var flag = true , magicDomIndex = rules.split(',') ;
                        if(magicDomIndex.length > 0){
                            var PDom = $this.parents('.view-option-box');
                            magicDomIndex.forEach(function (index) {
                                var magicDomItem = PDom.find('.item-view-option').eq(index - 1).find('.checkbox-normal');
                                if(magicDomItem.hasClass('checkbox-selected')){
                                    flag = false;
                                }
                            });
                        }
                        if(!flag){
                            //send tips
                            jAlert('该选项与您已选择的选项冲突','提示');
                            return false;
                        }
                    }
                    if($this.find('.checkbox-normal').hasClass('checkbox-selected')){
        				$this.find('.checkbox-normal').removeClass('checkbox-selected');
        				$this.find('input').val("");
                        // eventController.deleteRule($this);
        			}else{
        				var maxChoiceNum = $this.parents('.preview-wrapper').attr('maxChoiceNum');
        				if($this.parent().find('.checkbox-selected').length == maxChoiceNum){
        					return false;
        				}
                        // eventController.addRule(rules,$this);
        				$this.find('.checkbox-normal').addClass('checkbox-selected');
                        if($this.find('input').length > 0 && !$this.find('input').val()){
                            $this.find('input').get(0).focus();
                        }
        			}
        		}
        		answer.updateProgress($this.parents('.preview-wrapper'), $this.parents('.preview-wrapper').attr('itemId'));
        	}
        	//将逻辑跳转进行剥离
            if(!!targetId){
                if(!!controlManager.jumpSaveId[targetId] || !!controlManager.saveDisplayForId[targetId]){
                    eventController.clickCtrl($this);
                }
            }
        },
        optionSwicthWithInput: function (e) {
            var $this = $(e.target);
            var targetId;
            var pNode = $(this).parents(".item-view-option");
            if (pNode.length > 0) {
                // 多选包含填空
                if (pNode.find('.checkbox-normal').length > 0) {
                    targetId = pNode.parents('.multiple-view').attr('itemid');
                    //read rule
                    var rules = pNode.attr('data-rule');
                    if(!!rules){
                        rules = rules.split(',').sort().join(',');

                        //查看是否可以点击
                        var flag = true , magicDomIndex = rules.split(',') ;
                        if(magicDomIndex.length > 0){
                            var PDom = $this.parents('.view-option-box');
                            magicDomIndex.forEach(function (index) {
                                var magicDomItem = PDom.find('.item-view-option').eq(index - 1).find('.checkbox-normal');
                                if(magicDomItem.hasClass('checkbox-selected')){
                                    flag = false;
                                }
                            });
                        }
                        if(!flag){
                            //send tips
                            jAlert('该选项与您已选择的选项冲突','提示');
                            pNode.find('input').val("");
                            return false;
                        }
                    }
                    var maxChoiceNum = $(this).parents('.preview-wrapper').attr('maxChoiceNum');
                    var val = $this.val().trim();
                    $this.val(val);
                    if (!!pNode.find('input').val()) {
                        if (pNode.parents(".view-option-box").find('.checkbox-selected').length > maxChoiceNum) {
                            pNode.find('input').val("");
                            pNode.find('.checkbox-normal').removeClass('checkbox-selected');
                            jAlert("此题目最多选择"+ maxChoiceNum +"项","提示");
                            return false;
                        }
                        pNode.find('.checkbox-normal').addClass('checkbox-selected');
                    } else {
                        if(!$this.hasClass('sx') && !$this.hasClass('zx') && !$this.hasClass('sz')){
                            jAlert('请在横线上填写内容','提示');
                        }
                    }
                }
                // 单选包含填空
                if (pNode.find('.radio-normal').length > 0) {
                    targetId = pNode.parents('.radio-view').attr('itemid');
                    var val = $this.val().trim();
                    $this.val(val);
                    if (!!pNode.find('input').val()) {
                        pNode.find('.radio-normal').addClass('radio-selected');
                        var both = pNode.siblings();
                        both.each(function (index, element) {
                            $(element).find('.radio-normal').removeClass('radio-selected');
                            $(element).find('input').val("");
                        })
                    } else {
                        if(!$this.hasClass('sz') && !$this.hasClass('xs') && !$this.hasClass('zs')){
                            jAlert('请在横线上填写内容','提示');
                        }
                    }
                }
            }
            answer.updateProgress($(this).parents('.preview-wrapper'), $(this).parents('.preview-wrapper').attr('itemId'));
            //将逻辑跳转进行剥离
            if(!!targetId && !!$this.val()){
                if(!!controlManager.jumpSaveId[targetId] || !!controlManager.saveDisplayForId[targetId]){
                    eventController.clickCtrl($(pNode));
                }
            }
        },
        /**
         * [clickCtrl 逻辑跳转]
         * @return {[type]} [description]
         */
        clickCtrl:function(dom){
            var displayFlag = false,
                jumpFlag = false;
            var targetId = 0;
            var quesType = 'radio';//题目类型
            //单选题
            if($(dom).parents('.radio-view').length > 0){
                //获取当前选项ID
                targetId = $(dom).parents('.radio-view').attr('itemid');
            }
            if($(dom).parents('.multiple-view').length > 0){
                targetId = $(dom).parents('.multiple-view').attr('itemid');
                quesType = 'multiple';
            }
            //如果当前选项包含跳转逻辑
            if(!!controlManager.jumpSaveId[targetId]){
                var dataObj = controlManager.jumpSaveId[targetId];
                //设置跳转的target
                jumpFlag = true;
                for(var val in dataObj){
                    if(!!dataObj[val]){
                        $(dom).find('.option-content[name='+ val +']').attr('target',dataObj[val]);
                    }else{
                        $(dom).find('.option-content[name='+ val +']').attr('target','');
                    }
                }
            }
            //如果当前元素包含显示逻辑
            if(!!controlManager.saveDisplayForId[targetId]){
                displayFlag = true;
                for(var i=0;i<controlManager.saveDisplayForId[targetId].length;i++){
                    var listI = controlManager.saveDisplayForId[targetId][i];
                    var tmp = '';
                    for(var j=0;j<listI.qn.length;j++){
                        if(j<listI.qn.length-1){
                            tmp += listI.qn[j].targetQuestionNumber+',';
                        }else{
                            tmp += listI.qn[j].targetQuestionNumber;
                        }
                    }
                    $(dom).parent().find('.option-content[name='+ listI.name +']').attr('targetDisplay',tmp);
                }
            }
            //目标元素ID
            var target = $(dom).find('.option-content').attr('target');
            //目标元素的displayId
            var targetDis = $(dom).find('.option-content').attr('targetDisplay');
            //如果元素包含显示逻辑
            if(displayFlag){
                //如果是单选题
                if(quesType == 'radio'){
                    //判断其是否有互斥条件 先恢复之前所有元素的显示属性
                    var siblingsS = $(dom).parent().find('.option-content');
                    siblingsS.each(function(){
                        var name = $(this).attr('name');
                        var targetdisplay = $(this).attr('targetdisplay');
                        if(!!targetdisplay || targetdisplay == '0'){
                            var arrDisS = targetdisplay.split(',');
                            for(var i=0;i<arrDisS.length;i++){
                                if(!!controlManager.displayObj[arrDisS[i]]){
                                    controlManager.displayObj[arrDisS[i]].isShow = false;
                                    controlManager.displayObj[arrDisS[i]].HIDE = true;
                                }
                                answer.removeResult(arrDisS[i]);
                            }
                        }
                    });
                    var arrDis = [];
                    if(targetDis){
                        arrDis = targetDis.split(',');
                    }
                    for(var i=0;i<arrDis.length;i++){
                        if(!!controlManager.displayObj[arrDis[i]]){
                            controlManager.displayObj[arrDis[i]].isShow = true;
                        }
                        answer.removeResult(arrDis[i]);
                    }
                    answer.updateProgressSliderBar();
                }else if(quesType == 'multiple'){//如果是多选题
                    var parent = $(dom).parent().parent();
                    //取已经被选择的元素
                    var isChoseArr = parent.find('.checkbox-selected').siblings('.option-content');
                    //取没有被选择的元素
                    var isnotChoseArr = parent.find('.checkbox-normal').not('.checkbox-selected').siblings('.option-content');
                    var isChArrId = '';
                    var isnotChArrId = '';
                    isChoseArr.each(function(i){
                        isChArrId += $(this).attr('targetdisplay')+',';
                    });
                    isnotChoseArr.each(function(i){
                        isnotChArrId += $(this).attr('targetdisplay')+',';
                    });
                    //需要显示的题
                    var needShowArr = isChArrId.split(',').weight();
                    if(Boolean(needShowArr[0])){
                        for(var i=0;i<needShowArr.length;i++){
                            var listI = needShowArr[i];
                            if(!!controlManager.displayObj[listI]){
                                controlManager.displayObj[listI].isShow = true;
                            }
                            answer.removeResult(listI);
                        }
                    }
                    //需要隐藏的题
                    var needHideArr = isnotChArrId.split(',').weight();
                    if(Boolean(needHideArr[0])){
                        //取差值 如果显示题型设置了显示 此题不能隐藏
                        for(var j=0;j<needHideArr.length;j++){
                            var listJ = needHideArr[j];
                            var isHide = true;
                            for(var m=0;m<needShowArr.length;m++){
                                var listM = needShowArr[m];
                                if(listJ == listM){
                                    isHide = false;
                                }
                            }
                            if(isHide){
                                if(!!controlManager.displayObj[listJ]){
                                    controlManager.displayObj[listJ].isShow = false;
                                }
                                answer.removeResult(listJ);
                            }
                        }
                        answer.updateProgressSliderBar();
                    }
                }
                //重新加载页面
                controlManager.currentpage--;
                controlManager.transData.tmplTransData(1);
            }
            if(jumpFlag){
                    //判断其是否有互斥条件 先恢复之前所有元素的显示属性
                    for(var k in controlManager.jumpSaveId[targetId]){
                        var list = controlManager.jumpSaveId[targetId][k];
                        if(!!list){
                            for(var i in controlManager.displayObj){
                                if(controlManager.displayObj[parseInt(i)].index < controlManager.displayObj[parseInt(list)].index && controlManager.displayObj[parseInt(i)].index > controlManager.displayObj[parseInt(targetId)].index){
                                    controlManager.displayObj[i].isShow = true;
                                }
                            }
                        }
                    }
                    if(!!target || target == "0"){
                        //处在中间的元素设置为隐藏
                        for(var i in controlManager.displayObj){
                            //处在选择元素中间的 设置为隐藏
                            if(controlManager.displayObj[parseInt(i)].index < controlManager.displayObj[parseInt(target)].index && controlManager.displayObj[parseInt(i)].index > controlManager.displayObj[parseInt(targetId)].index){
                                controlManager.displayObj[i].isShow = false;
                                //将跳过的题恢复后从已作答中移除，以便计算进度
                                answer.removeResult(i);
                                answer.updateProgressSliderBar();
                            }
                        }

                    }
                    //重新加载页面
                    controlManager.currentpage--;
                    controlManager.transData.tmplTransData(1);
                }
		},
		inputChange:function(){
			answer.updateProgress($(this).parents('.preview-wrapper'), $(this).parents('.preview-wrapper').attr('itemId'));
		},
		dragChange:function(){
			answer.updateProgress($(this).parents('.preview-wrapper'), $(this).parents('.preview-wrapper').attr('itemId'));
		},
		submitAnswer:function(){
            var result = window.areadyAnswerResult;
            var cur = controlManager.currentpage;
            var listId = controlManager.savaPageForId[cur];
            var flag = 0;
            for(var i=0;i<listId.length;i++){
                var listI = listId[i];
                for(var j=0;j<result.length;j++){
                    if(result[j].questionNum == listI){
                        flag++;
                    }
                }
                if(!controlManager.displayObj[listI].isShow){
                    flag++;
                }else if(controlManager.displayObj[listI].type == 11){
                    flag++;
                }
            }
            /*if(flag != listId.length){
                 jnoButtonConfirm('最后一页还有未选择的题目，请选择后再提交！', '','',1);
            }else{
                console.log(JSON.stringify(window.areadyAnswerResult));
            }*/
            console.log(JSON.stringify(window.areadyAnswerResult));
		},
        getImgData:function(){
          $('img').each(function(index,item){
            var $item = $(item),
                itemWidth = $item.width(),
                itemHeight = $item.height(),
                parentWidth = $item.parent().width(),
                parentHeight = $item.parent().height();
            if(itemWidth >parentWidth){
              $item.width('100%');
              $item.height('100%');
            }
          });
        },
        /*
        *
        * [addrules] 废弃
        * */
        addRule: function (rules,$this) {
            if(!!rules){
                var items = $this.parents('.view-option-box');
                rules.split(',').forEach(function (value) {
                    items.find('.item-view-option').eq(value - 1).attr('disabled','disabled');
                });
            }
        },
        /*
        *
        * [deleteRule] 废弃
        * */
        deleteRule: function ($this) {
            //去掉全部禁用
            var items = $this.parents('.view-option-box');
                items.find('.item-view-option').removeAttr('disabled');
            //添加单独的禁用
            var selectedItem = items.find('.checkbox-selected');
            if(selectedItem.length > 0){
                selectedItem.each(function (index,needRule) {
                    var $this = $(needRule).parents('.item-view-option');
                    var rules = $this.attr('data-rule');
                    eventController.addRule(rules,$this);
                });
            }
        },
        initRangeEvent: function () {
            $("input.hk").each(function (index,input) {
                $('.range-result').eq(index).text($(input).val());
                (function (index,input) {
                    $(input).off('input').on('input',function () {
                        $('.range-result').eq(index).text($(this).val());
                    });
                })(index,input);
            });
        }
    };
    // 初始化
    var init = function(){
    	window.paperId = $('#hdPaperId').val();
        renderView.renderThemeData();//全局数据
        addEvents();
    }

    $(function(){
        init();
        $(window).scroll(scrollEvent);
    })
    window.controlManager = controlManager;
});
//滚动事件
function scrollEvent(e){
    var offsetY=15;
    var offsetTop = $(document).scrollTop()+offsetY;
    if(offsetTop>200){
        $(".answer-progress-box").css("position","fixed");
        $(".answer-progress-box").css("width","100%");
        $(".answer-progress-box").css("left",0);
        $(".answer-progress-box").css("right",0);
    }else{
        $(".answer-progress-box").css("width",1000);
        $(".answer-progress-box").css("position","relative");
    }
}

function sorll() {
    $("body").scrollTop("0");
}
