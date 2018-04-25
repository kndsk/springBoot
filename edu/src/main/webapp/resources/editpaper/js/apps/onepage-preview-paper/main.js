/**
 * @description: 预览
 * @author：smchen2
 * @time: 陈世敏(2016-08-19)
 */
require.config(requireConfig);
define(function(require, exports, module) {
    var dao = require('common/dao'),
        util = require('common/common'),
        template = require('template'),
        answer = require('onepage-preview-paper/answer'),
        jumplogic = '';
    require('previewDrag');//排序拖拽
    
    var getDisplayCtrledQNum = function(ques, needHideArr){
		var itemId = $(ques).attr('itemId');
		var displayFlag = false;
		$(ques).find('.option-content').each(function(index, element){
			if($(element).attr('displaylogic') === 'true'){
				displayFlag = true;
			}
		});
		if(displayFlag){
			for(var i = 0; i < window.displayLogic.length; i++){
				if(window.displayLogic[i].code === itemId){
					for(var n = 0; n < window.displayLogic[i].displayQN.length; n++){
						for(var m = 0; m < window.displayLogic[i].displayQN[n].qn.length; m++){
							if($.inArray(window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber, needHideArr) === -1){
								needHideArr.push(window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber);
							}
							//判断需要隐藏的题是否是显示逻辑控制者
							var ques1 = $('.main-panple').find('.'+window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber);
							if($(ques1).attr('type') === '1' || $(ques1).attr('type') === '2' || $(ques1).attr('type') === '4' || $(ques1).attr('type') === '5'){
								getDisplayCtrledQNum(ques1, needHideArr);
							}
						}
					}
				}
			}
		}
	};
	
    // 绑定事件
    var addEvents = function(){
    	$(document).on('change','.xs',eventController.xsInputCtrl);
    	$(document).on('change','.zs',eventController.zsInputCtrl);
    	$(document).on('change','.sz',eventController.szInputCtrl);
		$(document).on('keyup','.zs',eventController.zsInputCtrl1);
		$(document).on('keyup','.sz',eventController.zsInputCtrl1);
		$(document).on('keyup','.xs',eventController.zsInputCtrl1);
        //选择
        $(document).on('click','.item-view-option',eventController.optionSwicth);
        $(document).on('click','.radio-view-option',eventController.optionSwicth);

    	$(document).on('click','.item-view-option',eventController.clickCtrl);
    	//input change事件
    	$(document).on('change','input',eventController.inputChange);
    	$(document).on('change','textarea',eventController.inputChange);
    	
    	$(document).on('mouseover','.answer-box',eventController.dragChange);
    	
    	//提交
    	$(document).on('click','#submitAnswer',eventController.submitAnswer);
    };
    // 加载
    var renderView = {
        /**
         * [renderTitle 加载标题]
         * @return {[type]} [description]
         */
        renderTitle:function(){
            var dataUrl = basePath + '/paper/getpaper',
                parmes = {
                    paperId:$('#hdPaperId').val()
                };
            $.when(dao.requestListData(dataUrl,parmes)).done(function(data){
                if(data.flag === 1){
                    if(data.data != null){
                        $("#paperTitle").html(data.data.name);
                        $("#paperInstruction").html(data.data.guideLanguage);
                    }else{
                        jnoButtonConfirm('网络错误！', '','',1);
                    }
                }else{
                    jnoButtonConfirm(data.flagMsg, '','',1);
                }
            }).fail(function(){
                jnoButtonConfirm('网络错误！', '','',1);
            });
        },
        /**
         * [renderTheme 加载题目]
         * @return {[type]} [description]
         */
        renderTheme:function(){
            var dataUrl = basePath + '/paperitem/getpaperitems',
                tempUrl = basePath + '/resources/editpaper/templ/preview-paper/preview-paper-templ.html',
                parmes = {
                    paperId:$('#hdPaperId').val()
                };
            $.when(dao.requestListTmpl(tempUrl),dao.requestListData(dataUrl,parmes)).done(function(templ,data){
                if(data.flag === 1){
                    if(data.data != null){
                        var render = template.compile(templ);
                        $('.main-panple').append(render(data.data));
                        util.getImgData();
                        var indexS = -1;
                        $(data.data.viewData).each(function(index,item){
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
                        window.total = data.data.total;
                        window.displayLogic = data.data.displayLogic;
                        renderView.renderDisplay(data.data.displayLogic); 
                        renderView.renderJump(data.data.jumpLogic); //加载跳转逻辑
                        answer.simulateInit();
                    }else{
                        jnoButtonConfirm('网络错误！', '','',1);
                    }
                }else{
                    jnoButtonConfirm(data.flagMsg, '','',1);
                }
            }).fail(function(){
                jnoButtonConfirm('网络错误！', '','',1);
            });
        },
        /**
         * [renderJump 设置逻辑]
         * @param  {[type]} jumplogic [description]
         * @return {[type]}           [description]
         */
        renderJump:function(jumplogic){
        	if(jumplogic == null){
        		return;
        	}
        	for(var i = 0; i < jumplogic.length; i++){
        		//实际是id
        		var code = jumplogic[i].code;
        		$('.main-panple').find('.'+code).find('.option-content').each(function(){
        			var name = $(this).attr('name');
        			for(var j = 0; j < jumplogic[i].sts.length; j++){
        				if(name === jumplogic[i].sts[j].name){
        					$(this).attr('target', jumplogic[i].sts[j].targetQuestionNumber);
        				}
        			}
        		});
        	}
        },
        renderDisplay:function(displaylogic){
        	if(displaylogic == null){
        		return;
        	}
        	for(var i = 0; i < displaylogic.length; i++){
        		//标记显示控制题
            	var xCode = displaylogic[i].code;
            	$('.main-panple').find('.'+xCode).find('.option-content').each(function(index, element){
            		$(element).attr("displaylogic", "true");
            	});
            	//隐藏被控制题   此处不做进度更新  防止一渲染页面就进度不为0  会有点奇怪
            	for(var j = 0; j < displaylogic[i].displayQN.length; j++){
            		for(var n = 0; n < displaylogic[i].displayQN[j].qn.length; n++){
            			var yCode = displaylogic[i].displayQN[j].qn[n].targetQuestionNumber;
            			$('.main-panple').find('.'+yCode).parent().hide();
            		}
            	}
        	}
        }
    };
    // 事件控制
    var eventController = {
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
			if(res == null){
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
		//整数控制
		zsInputCtrl:function(){
			var inputVal = $(this).val();
			var rexp = /^-?[0-9]*$/g;
			var res = inputVal.match(rexp);
			if(res == null){
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
			if(res == null){
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
            if(e.target.nodeName != 'INPUT'){
				var $this = $(this).parents('.item-view-option');
				if($this.length === 0){
					$this = $(this);
				}
                //单选
                $this.find('.radio-normal').addClass('radio-selected');
                var both = $this.siblings();
                both.each(function(index, element){
                    $(element).find('.radio-normal').removeClass('radio-selected');
                    $(element).find('input').val("");
                })
                //多选
                if($this.find('.checkbox-normal').hasClass('checkbox-selected')){
                    $this.find('.checkbox-normal').removeClass('checkbox-selected');
                    $this.find('input').val("");
                }else{
                    var maxChoiceNum = $this.parents('.preview-wrapper').attr('maxChoiceNum');
                    if($this.parent().find('.checkbox-selected').length == maxChoiceNum){
                        return;
                    }
                    $this.find('.checkbox-normal').addClass('checkbox-selected');
                }
                answer.updateProgress($this.parents('.preview-wrapper'), $this.parents('.preview-wrapper').attr('itemId'));
                }
        },
        /**
         * [clickCtrl 逻辑跳转]
         * @return {[type]} [description]
         */
		clickCtrl:function(){
			//处理跳转逻辑
			var srcIndex = $(this).parents('.radio-view').attr('index');
			var target = $(this).find('.option-content').attr('target');
			if(target != ""){
				//将其他选项隐藏的题目展示
				$('.main-panple').find('.src-index-'+srcIndex).each(function(){
					$(this).parent().show();
					$(this).removeClass('src-index-'+srcIndex);
					//将跳过的题恢复后从已作答中移除，以便计算进度
					answer.removeNotAnswerQNum($(this).attr('itemId'));
					answer.updateProgressSliderBar();
				});
				var targetIndex = $('.main-panple').find('.'+target).attr('index');
				//隐藏改选项需要跳过的题
				for(var i = 1; i < parseInt(targetIndex)-parseInt(srcIndex); i++){
					$('.main-panple').find('.preview-wrapper').each(function(){
						$this = $(this);
						if($this.attr('index') == parseInt(srcIndex)+i){
							$this.addClass('src-index-'+srcIndex);
							$this.parent().hide();
							//将跳过的题目的作答数据清除  
							answer.clearAnswer($this);
							//将跳过的题也看作已作答，以便计算进度
							if($this.attr('type') !== '11'){
								answer.addHadAnswerQNum($this.attr('itemId'));
							}
							answer.removeResult($this.attr('itemId'));
							answer.updateProgressSliderBar();
						}
					});
				}
			}
			//显示逻辑处理
			var displaylogic = $(this).find('.option-content').attr('displaylogic');
			if(displaylogic === 'true'){
				var itemId = $(this).parents('.preview-wrapper').attr('itemId');
				var chooseArr = [];
				var noChooseArr = [];
				for(var i = 0; i < window.displayLogic.length; i++){
					if(window.displayLogic[i].code === itemId){
						$(this).parent().find('.radio-normal').each(function(index, element){
							if($(element).hasClass('radio-selected')){
								chooseArr.push($(element).attr('value'));
							}else{
								noChooseArr.push($(element).attr('value'));
							}
						});
						$(this).parent().find('.checkbox-normal').each(function(index, element){
							if($(element).hasClass('checkbox-selected')){
								chooseArr.push($(element).attr('value'));
							}else{
								noChooseArr.push($(element).attr('value'));
							}
						});
						var needShowArr = [];
						var needHideArr = [];
						for(var j = 0; j < chooseArr.length; j++){
							for(var n = 0; n < window.displayLogic[i].displayQN.length; n++){
								if(chooseArr[j] === window.displayLogic[i].displayQN[n].name){
									for(var m = 0; m < window.displayLogic[i].displayQN[n].qn.length; m++){
										if($.inArray(window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber, needShowArr) === -1){
											needShowArr.push(window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber);
										}
									}
								}
							}
						}
						for(var j = 0; j < noChooseArr.length; j++){
							for(var n = 0; n < window.displayLogic[i].displayQN.length; n++){
								if(noChooseArr[j] === window.displayLogic[i].displayQN[n].name){
									for(var m = 0; m < window.displayLogic[i].displayQN[n].qn.length; m++){
										if($.inArray(window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber, needShowArr) === -1){
											needHideArr.push(window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber);
											//判断需要隐藏的题是否是显示逻辑控制者
											var ques = $('.main-panple').find('.'+window.displayLogic[i].displayQN[n].qn[m].targetQuestionNumber);
											if($(ques).attr('type') === '1' || $(ques).attr('type') === '2' || $(ques).attr('type') === '4' || $(ques).attr('type') === '5'){
												getDisplayCtrledQNum(ques, needHideArr);
											}
										}
									}
								}
							}
						}
						if(needShowArr.length != 0){
							for(var j = 0; j < needShowArr.length; j++){
								$this = $('.main-panple').find('.'+needShowArr[j]);
								$('.main-panple').find('.'+needShowArr[j]).parent().show();
								//将隐藏的题恢复后从已作答中移除，以便计算进度
								answer.clearAnswer($this);
								answer.removeNotAnswerQNum(needShowArr[j]+'');
								answer.updateProgressSliderBar();
							}
							//将隐藏的题也看作已作答，以便计算进度
							for(var j = 0; j < needHideArr.length; j++){
								//将跳过的题目的作答数据清除  
								$this = $('.main-panple').find('.'+needHideArr[j]);
								answer.clearAnswer($this);
								var $tt = $('.main-panple').find('.'+needHideArr[j]);
								$tt.parent().hide();
								if($tt.attr('type') !== '11'){
									answer.addHadAnswerQNum(needHideArr[j]+'');
								}
								answer.removeResult(needHideArr[j]+'');
								answer.updateProgressSliderBar();
							}
						}else{
							//多选题显示逻辑控制  
							for(var j = 0; j < needHideArr.length; j++){
								//将跳过的题目的作答数据清除  
								$this = $('.main-panple').find('.'+needHideArr[j]);
								answer.clearAnswer($this);
								$('.main-panple').find('.'+needHideArr[j]).parent().hide();
								answer.removeNotAnswerQNum(needHideArr[j]+'');
								answer.removeResult(needHideArr[j]+'');
								answer.updateProgressSliderBar();
							}
						}
					}
				}
			}
		},
		inputChange:function(){
			answer.updateProgress($(this).parents('.preview-wrapper'), $(this).parents('.preview-wrapper').attr('itemId'));
		},
		dragChange:function(){
			answer.updateProgress($(this).parents('.preview-wrapper'), $(this).parents('.preview-wrapper').attr('itemId'));
		},
		submitAnswer:function(){
			console.log(JSON.stringify(window.areadyAnswerResult));
		}
    };
    // 初始化
    var init = function(){
    	window.paperId = $('#hdPaperId').val();
        renderView.renderTitle();
        renderView.renderTheme();
        addEvents();
        window.total = 0;
        $(".header").find(".rightVoEnName").each(function() {
			$(this).removeClass("active");
		});
		$("#PaperManager").addClass("active");
    }

    $(function(){
        init();
		$(window).scroll(scrollEvent);
    })
});
//滚动事件
function scrollEvent(e){
	var offsetY=15;
	var offsetTop = $(document).scrollTop()+offsetY;
	if(offsetTop>130){
		$(".answer-progress-box").css("position","fixed");
		$(".answer-progress-box").css("width","100%");
		$(".answer-progress-box").css("left",0);
		$(".answer-progress-box").css("right",0);
	}else{
		$(".answer-progress-box").css("width",1000);
		$(".answer-progress-box").css("position","relative");
	}
}