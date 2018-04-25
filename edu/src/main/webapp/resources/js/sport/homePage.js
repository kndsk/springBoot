/**
 * @author ljhuang
 * 
 */
define(function(require, exports, module) {
	var baseUrl = $("#hd_ctx").val();
	var pageObj = require('paging'); // 分页组件

	var studentTable = require('../sport/studentTable');

	// 工具方法  开始。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
	var chnNumChar = [ "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" ];
	var chnUnitSection = [ "", "万", "亿", "万亿", "亿亿" ];
	var chnUnitChar = [ "", "十", "百", "千" ];

	var SectionToChinese = function(section) {
		var strIns = '', chnStr = '';
		var unitPos = 0;
		var zero = true;
		while (section > 0) {
			var v = section % 10;
			if (v === 0) {
				if (!zero) {
					zero = true;
					chnStr = chnNumChar[v] + chnStr;
				}
			} else {
				zero = false;
				strIns = chnNumChar[v];
				strIns += chnUnitChar[unitPos];
				chnStr = strIns + chnStr;
			}
			unitPos++;
			section = Math.floor(section / 10);
		}
		return chnStr;
	};

	//数字转换成中文
	var NumberToChinese = function(num) {
		var unitPos = 0;
		var strIns = '', chnStr = '';
		var needZero = false;

		if (num === 0) {
			return chnNumChar[0];
		}

		while (num > 0) {
			var section = num % 10000;
			if (needZero) {
				chnStr = chnNumChar[0] + chnStr;
			}
			strIns = SectionToChinese(section);
			strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
			chnStr = strIns + chnStr;
			needZero = (section < 1000) && (section > 0);
			num = Math.floor(num / 10000);
			unitPos++;
		}
		//泽希哥加入，如果是 10-19，显示 十，十一，而不是 一十，一十一
		if (chnStr.indexOf("一十") == 0) {
			chnStr = chnStr.replace("一十", "十");
		}
		return chnStr;
	};
	// 工具方法  结束。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
	
	//左移右移事件
	var initTurnTool = function () {
		  /*考场过多的显示 左右点击箭头*/
        //考场数大于8，显示左右翻页箭头
        if($('.area-tab>li').length>8){
            $('.turn-left').show();
            $('.turn-right').show();
        }
        arrowShow();
        //左右箭头的颜色显示 不可翻动显示浅色（turn-left1.png） 可以翻动显示深色（turn-left2.png）
        function arrowShow() {
            var tabPosition = parseInt($('.area-tab').css('left'));
            var minLeft = ($('.area-tab>li').length-8)*140*-1;
            //ul偏移值为0  左箭头不可点  右箭头可点
            if(tabPosition===0){
                $('.turn-left').removeClass('turn-left2').addClass('turn-left1');
                $('.turn-right').removeClass('turn-right1').addClass('turn-right2');
            }
            //ul偏移值小于0  左箭头可点
            else if(tabPosition<0){
                $('.turn-left').removeClass('turn-left1').addClass('turn-left2');
                //ul偏移值为最小值  右箭头不可点
                if(tabPosition===minLeft){
                    $('.turn-right').removeClass('turn-right2').addClass('turn-right1');
                }
                else {
                    $('.turn-right').removeClass('turn-right1').addClass('turn-right2');
                }
            }
        }
        //左箭头点击事件 考场列表整体右移
        $('.turn-left').click(function () {
            var backgroundUrl=$('.turn-left').css('background-image');
            //背景色不为深色 不可点击
            if(backgroundUrl.indexOf('turn-left2')=== -1){
                return 0;
            }
            else{
                var newTabPosition = parseInt($('.area-tab').css('left'))+140;
                $('.area-tab').css('left',newTabPosition+'px');
            }
            arrowShow();
        });
        //右箭头点击事件 考场列表整体左移
        $('.turn-right').click(function () {
            var backgroundUrl=$('.turn-right').css('background-image');
            //背景色不为深色 不可点击
            if(backgroundUrl.indexOf('turn-right2')=== -1){
                return 0;
            }
            else{
                var newTabPosition = parseInt($('.area-tab').css('left'))-140;
                $('.area-tab').css('left',newTabPosition+'px');
            }
            arrowShow();
        });
	};
	
	//加载学生列表信息的方法
	var initStudentTables = function(schoolCode, examRoom) {
		
		// 每次点击前判断上一次是否完成了提交，如果没完成，则不让点，并且提示先完成上一个考场得录入
		//  $.get(baseUrl + "/getExamRoomStatus", {
		//  	schoolCode: schoolCode+"",
         //    examRoom: examRoom+"",
         //    times: new Date().getTime()
        // }, function (data) {
        	// //如果上一次没有完成，那么提示先完成上一次得
        	// if (!data.obj) {
        	// 	var kaochang = NumberToChinese(examRoom - 1);
        	// 	showMsg("您还未提交考场" + kaochang + "的成绩，请提交后再进行其它操作！");
        	// 	return;
        	// }
        	
        	//切换考场
    		$("#tBody").load(baseUrl + '/toStudentTables', {
    			schoolCode : schoolCode+"",
    			examRoom : examRoom+"",
                times: new Date().getTime()
    		});

    		//选中特效
    		$("#area_tab").find("li").removeClass("active-area");
    		$("li[exam_room='"+examRoom+"']").addClass("active-area");
    		
        // }).error(function (error) {
        //
        // });
	};
	
	   /**
     * 提示错误信息
     * @param error
     */
    var showMsg = function (error) {
        $('.tip-uncommitted>p').html(error);
        $('.tip-uncommitted').show();
        $(".div-shade").show();
    };
	
	$(function() {
		//初始化教室名称
		// var thisFun = this;
		$("#area_tab").find("li").each(function() {
			var exam_room = $(this).attr("exam_room");
			var school_code = $(this).attr("school_code");
			$(this).html("测试教室" + NumberToChinese(exam_room));
			$(this).click(function() {
				initStudentTables(school_code, exam_room);
			});
		});

		//绑定切换tab事件
		initTurnTool();
		//默认加载第一个
		$("#area_tab").find("li").eq(0).click();
        // $(".sex").blur(function () {
        //     var val = $(this).val();
        //     alert(val);
        // })

        $('#recorder').blur(function () {
            var value = $(this).val();
            $(this).attr('title', value);
        });
        $('#auditor').blur(function () {
            var value = $(this).val();
            $(this).attr('title', value);
        });
        $('#data-error').unbind().click(function () {
            $('.tip-uncommitted').hide();
            $(".div-shade").hide();
        });

		if (!window.localStorage){
			alert("您的浏览器版本太低，部分功能可能无法使用，建议升级您的浏览器！");
		}
        $('#submit-success').unbind().click(function () {
            $('.tip-submitted').hide();
            $(".div-shade").hide();
            if(studentTable.ALL_SUBMIT_FLAG === true){
                $('.tip-all-submitted').show();
                $('.div-shade').show();
            }
            // 保存成功后刷新页面
            $("#tBody").load(baseUrl + '/toStudentTables', {
                schoolCode : studentTable.SCHOOL_CODE+'',
                examRoom : studentTable.EXAM_ROOM + '',
                times: new Date().getTime()
            });
        });
        $('#all-submit-success').unbind().click(function () {
            $('.tip-all-submitted').hide();
            $(".div-shade").hide();
        });
	});
});