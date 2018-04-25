/**
 * @author gangwu3
 *
 */
requirejs.config(requireConfig);
define(function(require, exports, module) {
	var $ = require('jquery'),
    dao = require('common/dao');
	
	var answer = {
		//进度更新
		updateProgress:function($t, qn){
			//判断是否已经作答
			var res = answer.checkIsAnswer($t);
			if(res == true){
				//记录作答信息
				var resObj = answer.getAnswerResult($t);
				//将作答结果添加到window.areadyAnswerResult中
				answer.saveResult(resObj);
			}else{
				//删除window.areadyAnswerResult中该题的作答信息
				answer.removeResult(qn);
			}
			//更新进度条
			answer.updateProgressSliderBar();
		},
		//检查是否作答
		checkIsAnswer:function($t){
			var type = $t.attr('type');
			//填空题  一旦有空未作答   即为未作答
			if(type === '3' || type === '9'){
				var flag = true;
				 $t.find('.ht-mk').each(function(){
					 if($(this).val() == ''){
						 flag = false;
					 }
				 });
				 $t.find('.ht-mk-t').each(function(){
					 if($(this).val() == ''){
						 flag = false;
					 }
				 });
				 return flag;
			}
			//单选题   一旦有---checked 即为作答
			if(type === '1'){
				var flag = false;
				$t.find('.radio-normal').each(function(){
					 if($(this).hasClass('radio-selected')){
						 flag =  true;
					 }
				 });
				return flag;
			}
			//多选题   一旦有---checked 即为作答
			if(type === '2'){
				var flag = false;
				$t.find('.checkbox-normal').each(function(){
					 if($(this).hasClass('checkbox-selected')){
						 flag = true;
					 }
				 });
				return flag;
			}
			//选择填空题  当有空选项被勾选 但是空存在未作答  则未作答
			if(type === '4'){
				var flag1 = false;
				//检验所有选项
				$t.find('.radio-normal').each(function(){
					 //单选题
					 if($(this).hasClass('radio-selected')){
						 //如果此选项含有填空
						 if ($(this).parent().find('.ht-mk') != null && $(this).parent().find('.ht-mk').length != 0){
							 var flag = true;
							 /*填空可以不填
							 $(this).parent().find('.ht-mk').each(function(){
								 if($(this).val() == ''){
									 flag = false;
								 }
							 });*/
							 flag1 = flag;
						 }else{
							 flag1 = true;
						 }
					 }
				 });
				return flag1;
			}
			//选择填空题  当有空选项被勾选 但是空存在未作答  则未作答
			if(type === '5'){
				var flag1 = false;
				//检验所有选项
				$t.find('.checkbox-normal').each(function(){
					 //多选题
					 if($(this).hasClass('checkbox-selected')){
						 //如果此选项含有填空
						 if ($(this).parent().find('.ht-mk').length > 0){
							 var flag = true;
							 /* 填空可以不填
							 $(this).parent().find('.ht-mk').each(function(i,elm){
								 if($(elm).val() == ''){
									 flag = false;
									 return;
								 }
							 });*/
							 flag1 = flag;
						 }else{
							 flag1 = true;
						 }
					 }
				 });
				return flag1;
			}
			//表格和单选类似  只是区别在于  多个'题'组合成一个表格题
			if(type === '6' || type === '10'){
                var flag1 = false;
                $t.find('.table-body').each(function(){
                    flag1 = false;
                    var flag = false;
                    if($(this).find('.radio-normal').length > 0){
                        $(this).find('.radio-normal').each(function(){
                            if($(this).hasClass('radio-selected')){
                                flag = true;
                            }
                        });
                        if(flag === false){
                            return flag;
                        }
                        flag1 = flag;
                    }else{
                        $(this).find('.checkbox-normal').each(function(){
                            if($(this).hasClass('checkbox-selected')){
                                flag = true;
                            }
                        });
                        if(flag === false){
                            return flag;
                        }
                        flag1 = flag;
                    }
                });
                return flag1;
            }
			//排序题
			if(type === '7'){
				var listNum = $t.find('.sort-input li').length;
				if(listNum === parseInt($t.attr('maxInputNum'))){
					return true;
				}else{
					return false;
				}
			}
		},
		//获取作答数据
		getAnswerResult:function($t){
			var questionNum = $t.attr('itemId');
			var type = $t.attr('type');
			var val = '';
			var choiceVal = [];
			var fillVal = [];
			// 单选
			if (type === '1') {
				$t.find('.radio-normal').each(function() {
					if ($(this).hasClass('radio-selected')) {
						val = $(this).attr('value');
						choiceVal.push(val);
					}
				});
			}
			// 多选
			if (type === '2') {
				$t.find('.checkbox-normal').each(function() {
					if ($(this).hasClass('checkbox-selected')) {
						val = $(this).attr('value');
						choiceVal.push(val);
					}
				});
			}
			// 填空  简答
			if (type === '3' || type === '9') {
				$t.find('.ht-mk').each(function() {
					if ($(this).val() != '') {
						val = $(this).val();
						fillVal.push(val);
					}
				});
				$t.find('.ht-mk-t').each(function() {
					if ($(this).val() != '') {
						val = $(this).val();
						fillVal.push(val);
					}
				});
			}
			// 单选填空
			if (type === '4') {
				$t.find('.radio-normal').each(function() {
					if ($(this).hasClass('radio-selected')) {
						val = $(this).attr('value');
						choiceVal.push(val);
						if ($(this).parent().find('.ht-mk') != null && $(this).parent().find('.ht-mk').length != 0) {
							$(this).parent().find('.ht-mk').each(
								function() {
									if ($(this).val() != '') {
										val = $(this).val();
										fillVal.push(val);
									}
								});
						}
					}
				});
			}
			// 多选填空
			if (type === '5') {
				$t.find('.checkbox-normal').each(function() {
					if ($(this).hasClass('checkbox-selected')) {
						val = $(this).attr('value');
						choiceVal.push(val);
						if ($(this).parent().find('.ht-mk') != null && $(this).parent().find('.ht-mk').length != 0) {
							$(this).parent().find('.ht-mk').each(
								function() {
									if ($(this).val() != '') {
										val = $(this).val();
										fillVal.push(val);
									}
							});
						}
					}
				});
			}
			//表格题  量表题
			if (type === '6' || type === '10') {
                //多题组成一表格题
                $t.find('.table-body').each(function(){
                    if( $(this).find('.radio-normal').length > 0){
                        $(this).find('.radio-normal').each(function(){
                            if($(this).hasClass('radio-selected')){
                                val = $(this).attr('value');
                                choiceVal.push(val);
                            }
                        });
                    } else {
                        var _answer = [];
                        $(this).find('.checkbox-normal').each(function(){
                            if($(this).hasClass('checkbox-selected')){
                                val = $(this).attr('value');
                                _answer.push(val);
                            }
                        });
                        choiceVal.push(_answer.join('|'));
                    }
                });
            }
			// 排序
			if (type === '7') {
				$t.find('.sort-input li').each(function(){
					val = $(this).attr('value');
					choiceVal.push(val);
				});
			}
			var value = {
				'choiceVal':choiceVal,
				'fillVal':fillVal
			};
			
			var answerObj = {
				'questionNum' : questionNum,
				'value' : value
			};
			return answerObj;
		},
		//保存答案
		saveResult:function(obj){
			answer.removeResult(obj.questionNum);
			window.areadyAnswerResult.push(obj);
		},
		//移除答案
		removeResult:function(qn){
			for(var i = 0; i < window.areadyAnswerResult.length; i++){
				if(window.areadyAnswerResult[i].questionNum === qn){
					window.areadyAnswerResult.splice(i, 1);
					break;
				}
			}
		},
		//更新进度条
		updateProgressSliderBar:function(){
			var num = window.areadyAnswerResult.length;
			var count = controlManager.totalNum;
			if(controlManager.displayObj){
				count = 0;
				for(var i in controlManager.displayObj){
					if(controlManager.displayObj[i].isShow && controlManager.displayObj[i].type != 11){
						count++;
					}
				}
			}
			var progressNum = parseInt((num/count)*100);
			if(progressNum>100){
				progressNum = 100;
			}
			$('.progress-box').find('.banner').css('width', progressNum+'%');
			$('.progress-num').find('span').text(progressNum);
			answer.cacheData();
		},
		//缓存数据
		cacheData:function(){
			//将window.areadyAnswerResult存入到本地缓存
			if(window.localStorage){
				var resultKey = window.paperId + '_result';
				localStorage[resultKey] = JSON.stringify(window.areadyAnswerResult);
			}
		},
		simulateInit:function(){
			//此处的赋值是从本地缓存中获取
	        var resultKey = window.paperId + '_result';
	        if(window.localStorage && localStorage[resultKey] != undefined){
	        	//已作答试题答案集合
	        	window.areadyAnswerResult = eval('('+localStorage[resultKey]+')');
	        	//将记录的答案模拟
	        	answer.simulateAnswer();
	        	answer.updateProgressSliderBar();
	        }else{
	        	//已作答试题答案集合
	        	window.areadyAnswerResult = [];
	        }
		},
		//模拟缓存数据作答
		simulateAnswer:function(){
			//此处是采用克隆 而不是赋值指针
			$(document).find('.preview-wrapper').each(function(){
				var $this = $(this);
				if($this.attr('type') != '11'){
					var code = $this.attr('itemId');
					for(var i = 0; i < window.areadyAnswerResult.length; i++){
						if(code === window.areadyAnswerResult[i].questionNum){
							answer.doSimulate($this, window.areadyAnswerResult[i].value);
						}
					}
					
				}
			});
		},
		//做模拟
		doSimulate:function($this, value){
			var type = $this.attr('type');
			// 单选
			if (type === '1') {
				$this.find('.radio-normal').each(function() {
					if ($(this).attr('value') === value.choiceVal[0]) {
						$(this).addClass('radio-selected');
						var $opCon = $(this).parent().find('.option-content');
					}
				});
			}
			// 多选
			if (type === '2') {
				var valArr = value.choiceVal;
				for(var i = 0; i < valArr.length; i++){
					$this.find('.checkbox-normal').each(function() {
						if ($(this).attr('value') === valArr[i]) {
							$(this).addClass('checkbox-selected');
						}
					});
				}
			}
			// 填空 
			if (type === '3') {
				var valArr = value.fillVal;
				$this.find('.ht-mk').each(function(index,element) {
					if($(element).attr('type') === 'range'){
						$(this).parents('.fill-box').find('.range-result').eq(index).text(valArr[index]);
					}
					$(element).val(valArr[index]);
				});
			}
			// 简答
			if (type === '9') {
				var valArr = value.fillVal;
				$this.find('.ht-mk').each(function(index,element) {
					$(element).val(valArr[index]);
				});
				$this.find('.ht-mk-t').each(function(index,element) {
					$(element).val(valArr[valArr.length-1]);
				});
			}
			// 单选填空
			if (type === '4') {
				var choiceValArr = value.choiceVal;
				var fillValArr = value.fillVal;
				if(fillValArr.length != 0){
					$this.find('.radio-normal').each(function() {
						if ($(this).attr('value') === choiceValArr[0]) {
							$(this).addClass('radio-selected');
							$(this).parent().find('.ht-mk').each(function(index,element) {
								$(element).val(fillValArr[index]);
							});
						}
					});
				}else{
					$this.find('.radio-normal').each(function() {
						if ($(this).attr('value') === choiceValArr[0]) {
							$(this).addClass('radio-selected');
						}
					});
				}
			}
			// 多选填空
			if (type === '5') {
				var choiceValArr = value.choiceVal;
				var fillValArr = value.fillVal;
				if(fillValArr.length != 0){
					for(var i = 0; i < choiceValArr.length-1; i++){
						$this.find('.checkbox-normal').each(function() {
							if ($(this).attr('value') === choiceValArr[i]) {
								$(this).addClass('checkbox-selected');
							}
						});
					}
					$this.find('.checkbox-normal').each(function() {
						if ($(this).attr('value') === choiceValArr[choiceValArr.length-1]) {
							$(this).addClass('checkbox-selected');
							$(this).parent().find('.ht-mk').each(function(index,element) {
								$(element).val(fillValArr[index]);
							});
						}
					});
				}else{
					for(var i = 0; i < choiceValArr.length; i++){
						$this.find('.checkbox-normal').each(function() {
							if ($(this).attr('value') === choiceValArr[i]) {
								$(this).addClass('checkbox-selected');
							}
						});
					}
				}
			}
			//表格题  量表题
			if (type === '6' || type === '10') {
				$this.find('.table-body').each(function(index, element){
					$(element).find('.radio-normal').each(function(){
						if($(this).attr('value') === value.choiceVal[index]){
							$(this).addClass('radio-selected');
						}
					});
				 });
			}
			// 排序
			if (type === '7') {
				for(var i = 0; i < value.choiceVal.length; i++){
					$this.find('.sort-options li').each(function(index, element){
						if($(element).attr('value') === value.choiceVal[i]){
							$this.find('.sort-input').append($(element));
						}
					});
				}
				var _l = $this.find('.list').length;
				var boxL = $this.find('.sort-input');
				var boxR = $this.find('.sort-options');
				var maxNum = parseInt($this.attr('maxInputNum'));
				$this.find('.list').dragNew({
					'handle':'.option-handle',
					'leftDom':boxL,
					'rightDom':boxR,
					'maxNum':maxNum,
					'listNum':_l
				});
				boxL.find('.list').dragLeave({
					'handle':'.option-handle',
					'leftDom':boxL,
					'rightDom':boxR,
					'maxNum':maxNum,
					'listNum':_l
				});
			}
		},
		clearAnswer:function($this){
			$this.find('.radio-selected').removeClass('radio-selected');
			$this.find('.checkbox-selected').removeClass('checkbox-selected');
			$this.find('input').val('');
			$this.find('textarea').val('');
			if($this.find('.sort-input').length > 0){
				var $sortInput = $this.find('.sort-input').html();
				$this.find('.sort-input').html('');
				//考虑到本是排序题，就未恢复待初始化的顺序，直接添加到后面
				$this.find('.sort-options').append($sortInput);
				$this.find('.list').dragNew({
					'handle':'.option-handle',
					'leftDom':$this.find('.sort-input'),
					'rightDom':$this.find('.sort-options'),
					'maxNum':$this.attr('maxInputNum'),
					'listNum':$this.find('.list').length
				});
			}
		}
	};
	return answer;
});