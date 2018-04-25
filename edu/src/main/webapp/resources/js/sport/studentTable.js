/**
 * @author ljhuang
 * 
 */
define(function(require, exports, module) {
	var baseUrl = $("#hd_ctx").val();
	// var school_account = $('#school_account').val();
    var common_grade = '';

    var MISSING_VALUE = -1;
    var SAVED_VALUE = -2;

    var eventController = require('../sport/eventController');
	// 工具方法  开始。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
	var chnNumChar = [ "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" ];
	var chnUnitSection = [ "", "万", "亿", "万亿", "亿亿" ];
	var chnUnitChar = [ "", "十", "百", "千" ];

    var chnNumChar2 = {
        零:0,
        一:1,
        二:2,
        三:3,
        四:4,
        五:5,
        六:6,
        七:7,
        八:8,
        九:9
    };

    var chnNameValue = {
        十:{value:10, secUnit:false},
        百:{value:100, secUnit:false},
        千:{value:1000, secUnit:false},
        万:{value:10000, secUnit:true},
        亿:{value:100000000, secUnit:true}
    };

    var project_result = {
        height_miss:'height',
        weight_miss:'weight',
        power_first_miss:'power_first',
        power_second_miss:'power_second',
        left_eye_miss:'left_eye',
        right_eye_miss:'right_eye',
        breath_first_miss:'breath_first',
        breath_second_miss:'breath_second',
        jump_first_miss:'jump_first',
        jump_second_miss:'jump_second',
        jump_third_miss:'jump_third',
        fifty_miss:'fifty_meter',
        fifth_miss:'fifth_meter'
    };

    var result_project = {
        height:'height_miss',
        weight:'weight_miss',
        power_first:'power_first_miss',
        power_second:'power_second_miss',
        left_eye:'left_eye_miss',
        right_eye:'right_eye_miss',
        breath_first:'breath_first_miss',
        breath_second:'breath_second_miss',
        jump_first:'jump_first_miss',
        jump_second:'jump_second_miss',
        jump_third:'jump_third_miss',
        fifty_meter:'fifty_miss',
        fifth_meter:'fifth_miss'
    };

    //单项缺失状态名
    var misColumnChangeStates = ['heightIsChanged', 'weightIsChanged', 'power_firstIsChanged', 'power_secondIsChanged',
        'left_eyeIsChanged', 'right_eyeIsChanged', 'breath_firstIsChanged', 'breath_secondIsChanged', 'fiftyIsChanged',
        'jump_firstIsChanged', 'jump_secondIsChanged', 'jump_thirdIsChanged', 'fifthIsChanged'];

    //成绩属性名集合
    var projectNames = ['height', 'weight', 'power_first', 'power_second', 'left_eye', 'right_eye', 'breath_first',
        'breath_second', 'jump_first', 'jump_second', 'jump_third', 'fifty_meter', 'fifth_meter'];
    //单项缺失属性名集合
    var projectMissName = ['height_miss', 'weight_miss', 'power_first_miss', 'power_second_miss', 'left_eye_miss',
        'right_eye_miss', 'breath_first_miss', 'breath_second_miss', 'jump_first_miss', 'jump_second_miss',
        'jump_third_miss', 'fifty_miss', 'fifth_miss'];
    /**
     *
     * @param chnStr
     * @returns {number}
     * @constructor
     */
    function ChineseToNumber(chnStr){
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var str = chnStr.split('');

        for(var i = 0; i < str.length; i++){
            var num = chnNumChar2[str[i]];
            if(typeof num !== 'undefined'){
                number = num;
                if(i === str.length - 1){
                    section += number;
                }
            }else{
                var chnNameValue2 = chnNameValue[str[i]];
                if (chnNameValue2 !== undefined){
                    var unit = chnNameValue2.value;
                    secUnit = chnNameValue2.secUnit;
                    if(secUnit){
                        section = (section + number) * unit;
                        rtn += section;
                        section = 0;
                    }else{
                        section += (number * unit);
                    }
                    number = 0;
                }else {
                    return -1;
                }

            }
        }
        return rtn + section;
    }
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

    function StudentTable() {
        var self = this;
        var SCHOOL_EXAM_ID = '';
        var EXAM_ROOM = 'exam_room';
        var SCHOOL_CODE = 'school_code';

        var SCHOOL_EXAM_RECORDERINFO = '';

        // var ALL_SUBMIT_FLAG = false;
       self.ALL_SUBMIT_FLAG = false;
        /**
         * 该考场成绩是否提交
         * @type {string}
         */
        var IS_COMMIT = '_is_commit';
        /**
         * 初始化班级名称
         */
        function initClassName() {
            var classList = $('.className');
            for (var i = 0; i< classList.length; i++){
                var single = classList[i];
                var attributes = single.getAttribute('grade_class');
                single.value = transferName(attributes);
            }
        }

        function transferName(attributes) {
            var grade = attributes.substring(0,1);
            var cla = attributes.substring(2, attributes.length-1);
            var gradeToChinese = NumberToChinese(parseInt(grade));
            var classToChinese = NumberToChinese(parseInt(cla));
            return gradeToChinese + '年级' + classToChinese + '班';
        }

        /**
         * 提交前检查所有学生成绩是否为空
         */
        var checkDataEmpty = function () {
            var hasEmptyData = false;
            $("table.table-inputScore").find("tr.tr_students").each(function () {
                var cache = true;
                if ($(this).find('span.span-checkbox').hasClass('check-no')){
                    var student_name = $(this).find('input.input_name').val();
                    var data = $(this).find('input');
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value === ''){
                            showError(student_name + '的测试数据不能为空');
                            cache = false;
                            break;
                        }

                    }
                }
                hasEmptyData = !cache;
                return cache;
            });
            return hasEmptyData;
        };

        //验证信息录入员信息
        function checkInformation(type) {
            var recorder = $.trim($("#recorder").val());
            var auditor = $.trim($("#auditor").val());
            var phoneNum = $.trim($("#phoneNum").val());
            if (type === 1) {
                //提交时才判断是否为空
                if (!recorder || !auditor || !phoneNum){
                    showError('录入员信息未填写完整！');
                    return false;
                }
            }
            //对电话号码进行校验
            var check_phone = /^[1][3,4,5,7,8][0-9]{9}$/;
            var check_tel1 = /^[0][0-9]{2,3}-[0-9]{7,8}$/;
            var check_tel2 = /^[0-9]{1}[0-9]{6,7}$/;
            if (phoneNum) {
                if (check_phone.test(phoneNum) || check_tel1.test(phoneNum) || check_tel2.test(phoneNum)) {
                    return true;
                } else{
                    showError('信息员联系方式填写不正确！');
                    return false;
                }
            }else {
                return true;
            }
        }

        /**
         * 提交学生成绩
         */
        function commitData() {

            if (checkDataEmpty()){
                $('.commit').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                return;
            }
            var result = checkInformation(1);
            if (!result) {
                $('.commit').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                return;
            }
            // var recorder = $.trim($("#recorder").val());
            // var auditor = $.trim($("#auditor").val());
            // var phoneNum = $.trim($("#phoneNum").val());
            var dataList = [];
            //遍历每一条当前代填写数据
            $("table.table-inputScore").find("tr").each(function() {
                var studentId = $(this).attr("student_id");
                var studentMap = localStorage.getItem(studentId);
                //如果没有数据或者已提交，则不进行数据重新渲染
                if (studentMap != null) {
                    var scoreJson = JSON.parse(studentMap);
                    dataList.push(scoreJson);
                }
            });
            var stringify = JSON.stringify(dataList);
            var misColJson = localStorage.getItem(SCHOOL_EXAM_ID);
            var schRecderJson = localStorage.getItem(SCHOOL_EXAM_RECORDERINFO) ? localStorage.getItem(SCHOOL_EXAM_RECORDERINFO) : '';
            if (!misColJson || misColJson === '{}') {
                var cache = {};
                cache['school_code'] = SCHOOL_CODE;
                cache['exam_room'] = EXAM_ROOM;
                misColJson = JSON.stringify(cache);
            }
            $.post(baseUrl + '/savaSport', {
                data: stringify,
                schoolCode: SCHOOL_CODE,
                examRoom: EXAM_ROOM,
                schRecderJson: schRecderJson,
                misColJson: misColJson
            }, function (data) {
                if (data.result) {
                    showSuccess('提交成功');
                    window.localStorage.setItem(SCHOOL_EXAM_ID + IS_COMMIT, 1);
                    self.ALL_SUBMIT_FLAG = data.obj;
                }
                else {
                	//如果是不在录入时间
                	if (data.message == 'outtime') {
                		showError("当前不在测试数据录入时间内，请联系管理员！");
                		$('.commit').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                        // 刷新页面
                        $("#tBody").load(baseUrl + '/toStudentTables', {
                            schoolCode : SCHOOL_CODE+'',
                            examRoom : EXAM_ROOM + '',
                            times: new Date().getTime()
                        });
                		return;
                	}
                    showError(data.message);
                    $('.commit').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                    // 刷新页面
                    $("#tBody").load(baseUrl + '/toStudentTables', {
                        schoolCode : SCHOOL_CODE+'',
                        examRoom : EXAM_ROOM + '',
                        times: new Date().getTime()
                    });
                }
            }).error(function () {
                showError('保存失败');
                $('.commit').removeClass('un-click').addClass('can-click').removeAttr('disabled');
            });
        }

        /**
         * 保存成绩
         */
        function saveData() {
            //先校验录入信息
            var result = checkInformation(0);
            if (!result) {
                $('.save').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                return;
            }
            // var recorder = $.trim($("#recorder").val());
            // var auditor = $.trim($("#auditor").val());
            // var phoneNum = $.trim($("#phoneNum").val());
            var dataList = [];
            $("table.table-inputScore").find("tr.tr_students").each(function () {
                var studentId = $(this).attr("student_id");
                if ($(this).find('span.span-checkbox').hasClass('check-no')) {
                    var data = $(this).find('input');
                    for (var i = 0; i < data.length; i++) {
                        if($(data[i]).val() == '') {
                            setLocalStorageValue(studentId, $(data[i]).attr('class'), -2);
                        }
                    }
                    setLocalStorageValue(studentId, 'is_empty', 2);
                }
                var studentMap = localStorage.getItem(studentId);
                //如果没有数据或者已提交，则不进行数据重新渲染
                if (studentMap != null) {
                    var scoreJson = JSON.parse(studentMap);
                    dataList.push(scoreJson);
                }
                setLocalStorageValue(studentId, 'currentModify', 0);
            });
            var resultString = JSON.stringify(dataList);
            var misColJson = localStorage.getItem(SCHOOL_EXAM_ID);
            var schRecderJson  = localStorage.getItem(SCHOOL_EXAM_RECORDERINFO) ? localStorage.getItem(SCHOOL_EXAM_RECORDERINFO) : '';
            if (!misColJson || misColJson === '{}') {
                var cache = {};
                cache['school_code'] = SCHOOL_CODE;
                cache['exam_room'] = EXAM_ROOM;
                misColJson = JSON.stringify(cache);
            }

            clearProjectChangeState(misColJson);
            $.post(baseUrl + '/realTimeSave', {
                data: resultString,
                schoolCode: SCHOOL_CODE,
                examRoom: EXAM_ROOM,
                schRecderJson : schRecderJson,
                misColJson: misColJson
            }, function (data) {
                //保存成功
                if (data.result) {
                    showSuccess('保存成功');

                }else {
                    $('.save').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                    showError(data.message);
                }
            }).error(function () {
                $('.save').removeClass('un-click').addClass('can-click').removeAttr('disabled');
                showError('保存失败');
            });

        }


        // $('#submit-success').unbind().click(function () {
        //     $('.tip-submitted').hide();
        //     $(".div-shade").hide();
        //     if(ALL_SUBMIT_FLAG === true){
        //         $('.tip-all-submitted').show();
        //         $('.div-shade').show();
        //     }
        //     // 保存成功后刷新页面
        //     $("#tBody").load(baseUrl + '/toStudentTables', {
        //         schoolCode : SCHOOL_CODE+'',
        //         examRoom : EXAM_ROOM + '',
        //         times: new Date().getTime()
        //     });
        // });
        // $('#all-submit-success').unbind().click(function () {
        //     $('.tip-all-submitted').hide();
        //     $(".div-shade").hide();
        // });
        /**
         * 元素绑定事件
         */
        function bindData() {

            /**
             * 绑定提交按钮
             */
            $('#commit').click(function () {
                $('#commit').removeClass('can-click').addClass('un-click').attr('disabled', true);
                commitData();
            });

            $('#save').click(function () {
                $('#save').removeClass('can-click').addClass('un-click').attr('disabled', true);
                saveData();
            });

            /**
             * 用户在离开页面时给与提示，只在IE下有用
             * @param event
             * @returns {string}
             */
            window.onbeforeunload = function (event) {
                if (window.localStorage.getItem(SCHOOL_EXAM_ID + IS_COMMIT) != 1){
                    return '数据未录入完成';
                }
            };
            /**
             * 校验条形码
             */
            // $(".barcode").undelegate('.barcode', 'blur').blur(function () {
            //
            //     var val = $(this).val();
            //     var attr = $(this).attr('barcode');
            //     if (val == attr) return;
            //     var result = eventController.barcodeCtrl(val);
            //     if (result) {
            //         var school_code = $(this).parents('tr').attr('school_code');
            //         var exam_code = $(this).parents('tr').attr('exam_code');
            //         if (exam_code < 10) {
            //             exam_code = "0" + exam_code;
            //         }
            //         var school_cache = val.substring(0, 11);
            //         var exam_cache = val.substring(11, 13);
            //         if (school_cache == school_code && exam_cache == exam_code) {
            //             var ala = $('.barcode');
            //             var index = 0;
            //             for (var i = 0; i < ala.length; i++){
            //                 var value = ala[i].value;
            //                 if (val == value){
            //                     index++;
            //                 }
            //             }
            //             if (index != 1){
            //                 showError('条形码值不合法，请重新录入');
            //                 $(this).val(attr);
            //             }else {
            //                 $(this).attr('barcode', val);
            //                 //即时保存
            //                 var barcode = $(this).val();
            //                 var studentId = $(this).parents("tr").attr("student_id");
            //                 setLocalStorageValue(studentId, "barcode", barcode);
            //                 //修改条形码后,需要告诉后台这个条形码修改了
            //                 setLocalStorageValue(studentId, 'barcodeStatus', 1);
            //                 setLocalStorageValue(studentId, 'currentModify', 1);
            //             }
            //         }else {
            //             showError('条形码值不合法，请重新录入');
            //             $(this).val(attr);
            //         }
            //     }else {
            //         showError('条形码值不合法，请重新录入');
            //         $(this).val(attr);
            //     }
            // });

            /**
             * 性别校验
             */
            $(".sex").undelegate('.sex', 'blur').blur(function () {
                var val = $(this).val();
                var attr = $(this).parents('tr').attr('student_sex');
                // attr = Boolean(attr);
                var sex = attr == '0'?'男':'女';
                if (val === ''){
                    showError('性别不能为空');
                    $(this).val(attr == '0'?'男':'女');
                    return;
                }
                if (val === sex){
                    return;
                }
                var studentId = $(this).parents("tr").attr("student_id");
                if (sex === '男' && val === '女'){
                    $(this).parent('td').nextAll('td[class != td_className]').children('input').val('');
                    $(this).parents('tr').attr('student_sex', '1');
                    //即时保存
                    var sex1 = (val === "女" ? 1 : 0);

                    setLocalStorageValue(studentId, "sex", sex1);
                    setLocalStorageValue(studentId, 'currentModify', 1);
                    cleanStudentValue(studentId);
                } else if (sex === '女' && val === '男'){
                    $(this).parent('td').nextAll('td[class != td_className]').children('input').val('');
                    $(this).parents('tr').attr('student_sex', '0');
                    //即时保存
                    var sex2 = (val === "男" ? 0 : 1);
                    setLocalStorageValue(studentId, "sex", sex2);
                    setLocalStorageValue(studentId, 'currentModify', 1);
                    cleanStudentValue(studentId);
                } else {
                    showError('性别值不合法，请重新录入');
                    $(this).val(attr == 'false'?'男':'女');
                }

            });

            /**
             * 班级与年级校验
             */
            $(".className").undelegate('.className', 'blur').blur(function () {
                var val = $(this).val();
                var studentId = $(this).parents("tr").attr("student_id");
                if (val === '' || (val.length > 0 && val.trim().length === 0)){
                    showError('班级值不能为空，请重新录入');
                    var attr = $(this).attr('grade_class');
                    $(this).val(attr);
                }else {
                    $(this).attr('grade_class', val);
                    setLocalStorageValue(studentId, 'currentModify', 1);
                }


            	//即时保存
            	var className = $(this).attr('grade_class');
            	setLocalStorageValue(studentId, "className", className);
            });

            /**
             * 是否缺失
             */
            $('.span-checkbox').undelegate('.span-checkbox', 'click').click(function () {

                var miss = $(this).attr('student_miss');
                var studentId = $(this).parents("tr").attr("student_id");
                if (miss == 1){
                    $(this).removeClass('check-yes').addClass('check-no');
                    $(this).attr('student_miss', 0);
                    $(this).parents('tr').find('input:not(.barcode)').removeAttr("disabled");
                    if ($('#isAll_miss').hasClass('check-yes')){
                        $('.span-checkbox-all').removeClass('check-yes').addClass('check-no');
                        // localStorage.setItem(SCHOOL_EXAM_ID + ALL_EMPTY, 0);
                        setExamStorageValue('isAll_miss', 0);
                        $('.span-checkbox-all:not(#isAll_miss)').removeAttr('disabled');
                        setSingleProjectState(0);
                    }
                    $(this).parent('td').nextAll(':not(.td_sex,.td_className)').children('input').each(function () {
                        var key = $(this).attr('class');
                        var examStorageValue = getExamStorageValue(result_project[key]);
                        if (examStorageValue !== 1) {
                            $(this).val('');
                            setLocalStorageValue(studentId, key, '');
                        }else {
                            $(this).attr('disabled', 'disabled');
                        }
                    });
                    $(this).parents('tr').find('.p-name').click(function () {
                        $(this).hide();
                        $(this).next().val($(this).html()).show().focus();
                    });

                    setLocalStorageValue(studentId, "is_empty", 0);
                    setLocalStorageValue(studentId, 'currentModify', 1);
                }
                else {
                    /**
                     * 如果学生的部分成绩已经填写，则不能勾选缺失
                     * @type {boolean}
                     */
                    var isEmpty = true;
                    $(this).parents('tr').find('td:gt(4)').each(function () {
                        var val = $(this).find('input').val();
                        if (val == '' || val == -1){
                            isEmpty = true;
                        }else {
                            isEmpty = false;
                            return false;
                        }
                    });
                    if (!isEmpty) return;

                    $(this).removeClass('check-no').addClass('check-yes');
                    $(this).attr('student_miss', 1);
                    $(this).parents('tr').find('input:not(.barcode)').attr("disabled","disabled");
                    $(this).parents('tr').find('.p-name').off();
                    setLocalStorageValue(studentId, "is_empty", 1);
                    setLocalStorageValue(studentId, 'currentModify', 1);
                    //将-1保存起来
                    $(this).parent('td').nextAll(':not(.td_sex,.td_className)').children('input').each(function () {
                        $(this).val('-1');
                        setLocalStorageValue(studentId, $(this).attr('class'), -1);
                        checkSingleProjectIsAllMiss($(this).attr('class'));
                    });

                    // cleanStudentValue(studentId);
                    var checkboxAllFlag = 1;
                    var eachCount = 0;
                    var checkLength = $('.span-checkbox').length;
                    $('.span-checkbox').each(function (index) {
                        eachCount++;
                        if($(this).attr('student_miss') != 1){
                            checkboxAllFlag = 0;
                            return false;
                        }
                        if(eachCount>=checkLength){
                            if(checkboxAllFlag === 1){
                                if ($('#isAll_miss').hasClass('check-no')){
                                    // var item = localStorage.getItem(SCHOOL_EXAM_ID);
                                    // var data;
                                    // if (item) {
                                    //     data = JSON.parse(item);
                                    // }else {
                                    //     data = new Object();
                                    // }
                                    // var x;
                                    // var result = false;
                                    // for (x in data) {
                                    //     if (x != 'isAll_miss') {
                                    //         var datum = data[x];
                                    //         if (datum === 1) {
                                    //             result = true;
                                    //             break;
                                    //         }
                                    //     }
                                    // }
                                    // if (!result) {
                                    //     $('#isAll_miss').removeClass('check-no').addClass('check-yes');
                                    //     // localStorage.setItem(SCHOOL_EXAM_ID + ALL_EMPTY, 1);
                                    //     $('.span-checkbox-all:not(#isAll_miss)').attr('disabled', 'disabled');
                                    //     setExamStorageValue('isAll_miss', 1);
                                    // }
                                    $('#isAll_miss').trigger('click');

                                }
                            }
                        }
                    });
                }
            });
            /**
             * 是否全部缺失
             */
            $('#isAll_miss').undelegate('#isAll_miss', 'click').click(function () {
                var isCheck = false;
                if ($(this).hasClass('check-yes')){
                    isCheck = false;
                    $('.span-checkbox-all').removeClass('check-yes').addClass('check-no');
                }else {
                    isCheck = true;
                    // var localExamString = localStorage.getItem(SCHOOL_EXAM_ID);
                    // if (localExamString) {
                    //     var localExamData = JSON.parse(localExamString);
                    //     var isSingleProjectMiss = false;
                    //     var x;
                    //     for (x in localExamData) {
                    //         if (localExamData[x] === 1 && !misColumnChangeStates.contains(x)) {
                    //             isSingleProjectMiss = true;
                    //             break;
                    //         }
                    //     }
                    //     if (!isSingleProjectMiss) {
                    //         $('.span-checkbox-all:not(#isAll_miss)').attr('disabled', 'disabled');
                    //         $(this).removeClass('check-no').addClass('check-yes');
                    //     }else {
                    //         setExamStorageValue('isAll_miss', 0);
                    //         return;
                    //     }
                    // }else {
                    //     $('.span-checkbox-all:not(#isAll_miss)').attr('disabled', 'disabled');
                    //     $(this).removeClass('check-no').addClass('check-yes');
                    // }
                }
                if (isCheck) {
                    var isAllEmpty = true;
                    $("table.table-inputScore").find("tr.tr_students").each(function () {
                        // var studentId = $(this).attr("student_id");

                        var isEmpty = true;
                        $(this).find('td:gt(4)').each(function () {
                            var val = $(this).find('input').val();
                            if (!val || val == -1) {
                                isEmpty = true;
                            } else {
                                isEmpty = false;
                                return false;
                            }
                        });
                        if (!isEmpty) {
                            isAllEmpty = false;
                            return false;
                        }
                    });

                    if (isAllEmpty) {
                        $("table.table-inputScore").find("tr.tr_students").each(function () {
                            var studentId = $(this).attr("student_id");
                            $(this).find('input:not(.barcode)').attr("disabled", "disabled");
                            $(this).find('.p-name').off();
                            $(this).find('span').removeClass('check-no').addClass('check-yes');
                            $(this).find('span').attr('student_miss', 1);
                            $(this).children(":not(.td_sex, .td_className, .td_barcode, .td-name)").children('input').each(function () {
                                $(this).val('-1');
                                setLocalStorageValue(studentId, $(this).attr('class'), -1);
                            });
                            // cleanStudentValue(studentId);
                            setLocalStorageValue(studentId, 'is_empty', isCheck ? 1 : 0);

                            setLocalStorageValue(studentId, 'currentModify', 1);
                        });
                        setExamStorageValue('isAll_miss', 1);
                        setSingleProjectState(1);
                        $('.span-checkbox-all').removeClass('check-no').addClass('check-yes');
                    }else {
                        $(this).removeClass('check-yes').addClass('check-no');
                    }
                }else {
                    $("table.table-inputScore").find("tr.tr_students").each(function () {
                        var studentId = $(this).attr("student_id");
                        var isMiss = $(this).find('span').attr('student_miss');
                        if (isMiss == 1) {
                            $(this).find('input:not(.barcode)').removeAttr("disabled");
                            $(this).find('span').removeClass('check-yes').addClass('check-no');
                            $(this).find('span').attr('student_miss', 0);
                            $(this).children(":not(.td_sex, .td_className, .td_barcode, .td-name)").children('input').each(function () {
                                $(this).val('');
                                setLocalStorageValue(studentId, $(this).attr('class'), '');
                            });
                            $(this).find('.p-name').click(function () {
                                $(this).hide();
                                $(this).next().val($(this).html()).show().focus();
                            });
                        }
                        setLocalStorageValue(studentId, 'is_empty', isCheck ? 1 : 0);
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    });
                    setExamStorageValue('isAll_miss', 0);
                    setSingleProjectState(0);
                }
            });

            /**
             * 身高
             */
            $(".height").undelegate('.height', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    if (eventController.heightFirstCtrl(common_grade, val)) {
                        if (eventController.decimalPointCtrl(val)){
                            var result = false;
                            if (common_grade === '4' || common_grade === '5') {
                                result = eventController.heightInputCtrl4(val);
                            } else if (common_grade === '8' || common_grade === '9') {
                                result = eventController.heightInputCtrl8(val);
                            }else {
                                result = false;
                            }
                            if (!result){
                                showError('身高值不合法，请重新录入');
                                $(this).val('');

                            }else {
                                if (val != MISSING_VALUE && val.indexOf('.') <= 0){
                                    $(this).val(val + '.0');
                                }
                                setLocalStorageValue(studentId, 'currentModify', 1);
                            }

                        }else {
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                        }
                    }else {
                        showError('身高值不合法，请重新录入');
                        $(this).val('');
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'height');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var height = $(this).val();
            	setLocalStorageValue(studentId, "height", height? new Number(height) : height);
            	if (height === '-1') {
                    checkSingleProjectIsAllMiss('height');
                    var isMiss = checkIsAllMissByStudentId(studentId);
                    if (isMiss) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 体重
             */
            $(".weight").undelegate('.weight', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    if (eventController.weightFirstCtrl(common_grade, val)) {
                        if (eventController.decimalPointCtrl(val)){
                            var result = false;
                            if (common_grade === '4' || common_grade === '5') {
                                result = eventController.weightInputCtrl4(val);
                            } else if (common_grade === '8' || common_grade === '9') {
                                result = eventController.weightInputCtrl8(val);
                            }else {
                                result = false;
                            }
                            if (!result) {
                                showError('体重值不合法，请重新录入');
                                $(this).val('');
                            }else {
                                if (val != MISSING_VALUE && val.indexOf('.') <= 0){
                                    $(this).val(val + '.0');
                                }
                                setLocalStorageValue(studentId, 'currentModify', 1);
                            }
                        }else {
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                        }
                    }else {
                        showError('体重值不合法，请重新录入');
                        $(this).val('');
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'weight');
                    if (value != '' &&  value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var weight = $(this).val();
            	setLocalStorageValue(studentId, "weight", weight ? new Number(weight) : weight);
                if (weight === '-1') {
                    checkSingleProjectIsAllMiss('weight');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第一次握力
             */
            $(".power_first").undelegate('.power_first', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    if (eventController.powerFirstCtrl(common_grade, sex, val)) {
                        if (eventController.decimalPointCtrl(val)){
                            var result = false;
                            if (common_grade === '4' || common_grade === '5') {
                                result = eventController.gripCtrl4(val);
                            } else if (common_grade === '8' || common_grade === '9') {
                                // if (sex == '0') {
                                //     result = eventController.gripBoyCtrl8(val);
                                // } else {
                                result = eventController.gripGirlCtrl8(val);
                                // }
                            }else {
                                result = false;
                            }
                            if (!result) {
                                showError('握力值不合法，请重新录入');
                                $(this).val('');
                            }else {
                                if (val != MISSING_VALUE && val.indexOf('.') <= 0){
                                    $(this).val(val + '.0');
                                }
                                setLocalStorageValue(studentId, 'currentModify', 1);
                            }
                        }else {
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                        }
                    }else {
                        showError('握力值不合法，请重新录入');
                        $(this).val('');
                    }

                }else {
                    var value = getLocalStorageValue(studentId, 'power_first');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }
            	//即时保存
                var power_first = $(this).val();
                if (power_first){
                    $(this).parent().next().find('input.power_second').removeAttr('readonly');
                }else {
                    $(this).parent().next().find('input.power_second').attr('readonly', 'readonly');
                }
            	setLocalStorageValue(studentId, "power_first", power_first? new Number(power_first) : power_first);
                if (power_first === '-1') {
                    checkSingleProjectIsAllMiss('power_first');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第二次握力
             */
            $(".power_second").undelegate('.power_second', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    if (eventController.powerFirstCtrl(common_grade, sex, val)) {
                        if (eventController.decimalPointCtrl(val)){
                            var result = false;
                            if (common_grade === '4' || common_grade === '5') {
                                result = eventController.gripCtrl4(val);
                            } else if (common_grade === '8' || common_grade === '9') {
                                // if (sex == '0') {
                                //     result = eventController.gripBoyCtrl8(val);
                                // } else {
                                result = eventController.gripGirlCtrl8(val);
                                // }
                            }else {
                                result = false;
                            }
                            if (!result) {
                                showError('握力值不合法，请重新录入');
                                $(this).val('');
                            } else {
                                if (val != MISSING_VALUE && val.indexOf('.') <= 0) {
                                    $(this).val(val + '.0');
                                }
                                setLocalStorageValue(studentId, 'currentModify', 1);
                            }
                        }else {
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                        }
                    }else {
                        showError('握力值不合法，请重新录入');
                        $(this).val('');
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'power_second');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }
            	//即时保存
            	var power_second = $(this).val();
            	setLocalStorageValue(studentId, "power_second", power_second ? new Number(power_second) : power_second);
                if (power_second === '-1') {
                    checkSingleProjectIsAllMiss('power_second');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第二次握力前先校验第一次握力是否填写
             */
            $(".power_second").undelegate('.power_second', 'focus').focus(function () {
                if ($(this).attr('readonly')){
                    $(this).blur();
                }
            });

            /**
             * 左眼
             */
            $(".left_eye").undelegate('.left_eye', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var visionFirstCtrl = eventController.visionFirstCtrl(val);
                    switch (visionFirstCtrl) {
                        case 1:
                            showError('计分方式不合法，请转换为4.0-5.3计分');
                            $(this).val('');
                            break;
                        case 2:
                            showError('视力值不合法，请重新录入');
                            $(this).val('');
                            break;
                        case 3:
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                            break;
                        case 4:
                            if (val != MISSING_VALUE && val.indexOf('.') <= 0){
                                $(this).val(val + '.0');
                            }
                            setLocalStorageValue(studentId, 'currentModify', 1);
                            break;
                    }

                }else {
                    var value = getLocalStorageValue(studentId, 'left_eye');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

                //即时保存
                var left_eye = $(this).val();
                setLocalStorageValue(studentId, "left_eye", left_eye ? new Number(left_eye) : left_eye);
                if (left_eye === '-1') {
                    checkSingleProjectIsAllMiss('left_eye');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 右眼
             */
            $(".right_eye").undelegate('.right_eye', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var visionFirstCtrl = eventController.visionFirstCtrl(val);
                    switch (visionFirstCtrl) {
                        case 1:
                            showError('计分方式不合法，请转换为4.0-5.3计分');
                            $(this).val('');
                            break;
                        case 2:
                            showError('视力值不合法，请重新录入');
                            $(this).val('');
                            break;
                        case 3:
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                            break;
                        case 4:
                            if (val != MISSING_VALUE && val.indexOf('.') <= 0){
                                $(this).val(val + '.0');
                            }
                            setLocalStorageValue(studentId, 'currentModify', 1);
                            break;
                    }

                }else {
                    var value = getLocalStorageValue(studentId, 'right_eye');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var right_eye = $(this).val();
            	setLocalStorageValue(studentId, "right_eye", right_eye ? new Number(right_eye) : right_eye);
                if (right_eye === '-1') {
                    checkSingleProjectIsAllMiss('right_eye');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第一次肺活量
             */
            $(".breath_first").undelegate('.breath_first', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    var result = false;
                    if (common_grade === '4' || common_grade === '5') {
                        result = eventController.vitalCapacityCtrl4(val);
                    } else if (common_grade === '8' || common_grade === '9') {
                        // if (sex == 'false') {
                        //     result = eventController.vitalCapacityBoyCtrl8(val);
                        // } else {
                        result = eventController.vitalCapacityGirlCtrl8(val);
                        // }
                    }
                    if (!result) {
                        showError('肺活量值不合法，请重新录入');
                        $(this).val('');
                    }else {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'breath_first');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var breath_first = $(this).val();
                if (breath_first){
                    $(this).parent().next().find('.breath_second').removeAttr('readonly');
                }else {
                    $(this).parent().next().find('.breath_second').attr('readonly', 'readonly');
                }
            	setLocalStorageValue(studentId, "breath_first", breath_first ? new Number(breath_first) : breath_first);
                if (breath_first === '-1') {
                    checkSingleProjectIsAllMiss('breath_first');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第二次肺活量
             */
            $(".breath_second").undelegate('.breath_second', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    var result = false;
                    if (common_grade === '4' || common_grade === '5') {
                        result = eventController.vitalCapacityCtrl4(val);
                    } else if (common_grade === '8' || common_grade === '9') {
                        // if (sex == 'false') {
                        //     result = eventController.vitalCapacityBoyCtrl8(val);
                        // } else {
                        result = eventController.vitalCapacityGirlCtrl8(val);
                        // }
                    }
                    if (!result) {
                        showError('肺活量值不合法，请重新录入');
                        $(this).val('');
                    }else {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'breath_second');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }
            	//即时保存
            	var breath_second = $(this).val();
            	setLocalStorageValue(studentId, "breath_second", breath_second ? new Number(breath_second) : breath_second);
                if (breath_second === '-1') {
                    checkSingleProjectIsAllMiss('breath_second');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 录入第二次肺活量前先校验第一次肺活量是否填写
             */
            $(".breath_second").undelegate('.breath_second', 'focus').focus(function () {
                if ($(this).attr('readonly')){
                    $(this).blur();
                }
            });

            /**
             * 50米跑
             */
            $(".fifty_meter").undelegate('.fifty_meter', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val) {
                    if (eventController.runningFirstCtrl(common_grade, val)) {
                        if (eventController.decimalPointCtrl(val)){
                            var result = false;
                            if (common_grade === '4' || common_grade === '5') {
                                result = eventController.fiftyMeterCtrl4(val);
                            } else if (common_grade === '8' || common_grade === '9') {
                                result = eventController.fiftyMeterCtrl8(val);
                            }
                            if (!result) {
                                showError('50米跑值不合法，请重新录入');
                                $(this).val('');
                            }else {
                                if (val != MISSING_VALUE &&val.indexOf('.') <= 0){
                                    $(this).val(val + '.0');
                                }
                                setLocalStorageValue(studentId, 'currentModify', 1);
                            }
                        }else {
                            showError('保留位数错误，请保留一位小数');
                            $(this).val('');
                        }
                    }else {
                        showError('50米跑值不合法，请重新录入');
                        $(this).val('');
                    }

                }else {
                    var value = getLocalStorageValue(studentId, 'fifty_meter');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }
            	//即时保存
            	var fifty_meter = $(this).val();
            	setLocalStorageValue(studentId, "fifty_meter", fifty_meter ? new Number(fifty_meter) : fifty_meter);
                if (fifty_meter === '-1') {
                    checkSingleProjectIsAllMiss('fifty_meter');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第一次立定跳远
             */
            $(".jump_first").undelegate('.jump_first', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    var result = false;
                    if (common_grade === '4' || common_grade === '5') {
                        // if (sex == 'false') {
                        //     result = eventController.jumpBoyCtrl4(val);
                        // } else {
                        result = eventController.jumpGirlCtrl4(val);
                        // }
                    } else if (common_grade === '8' || common_grade === '9') {
                        // if (sex == 'false') {
                        //     result = eventController.jumpBoyCtrl8(val);
                        // } else {
                        result = eventController.jumpGirlCtrl8(val);
                        // }
                    }

                    if (!result) {
                        showError('立定跳远值不合法，请重新录入');
                        $(this).val('');
                    }else {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                } else {
                    var value = getLocalStorageValue(studentId, 'jump_first');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var jump_first = $(this).val();
                if (jump_first) {
                    $(this).parent().next().find('.jump_second').removeAttr('readonly');
                }else {
                    $(this).parent().next().find('.jump_second').attr('readonly', 'readonly');
                }
            	setLocalStorageValue(studentId, "jump_first", jump_first ? new Number(jump_first) : jump_first);
                if (jump_first === '-1') {
                    checkSingleProjectIsAllMiss('jump_first');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第二次立定跳远
             */
            $(".jump_second").undelegate('.jump_second', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val) {
                    var sex = $(this).parents('tr').attr('student_sex');
                    var result = false;
                    if (common_grade === '4' || common_grade === '5') {
                        // if (sex == 'false') {
                        //     result = eventController.jumpBoyCtrl4(val);
                        // } else {
                        result = eventController.jumpGirlCtrl4(val);
                        // }
                    } else if (common_grade === '8' || common_grade === '9') {
                        // if (sex == 'false') {
                        //     result = eventController.jumpBoyCtrl8(val);
                        // } else {
                        result = eventController.jumpGirlCtrl8(val);
                        // }
                    }

                    if (!result) {
                        showError('立定跳远值不合法，请重新录入');
                        $(this).val('');
                    }else {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'jump_second');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var jump_second = $(this).val();
                if (jump_second) {
                    $(this).parent().next().find('.jump_third').removeAttr('readonly');
                }else {
                    $(this).parent().next().find('.jump_third').attr('readonly', 'readonly');
                }
            	setLocalStorageValue(studentId, "jump_second", jump_second ? new Number(jump_second) : jump_second);
                if (jump_second === '-1') {
                    checkSingleProjectIsAllMiss('jump_second');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第二次立定跳远前先校验第一次是否填写
             */
            $('.jump_second').undelegate('.jump_second', 'focus').focus(function () {
                // var val = $(this).parent().prev('td').children('.jump_first').val();
                // if (val == '') {
                //     showError('先填写第一次立定跳远记录');
                //     $(this).blur();
                // }
                if($(this).attr('readonly')) {
                    $(this).blur();
                }
            });

            /**
             * 第三次立定跳远
             */
            $(".jump_third").undelegate('.jump_third', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    var result = false;
                    if (common_grade === '4' || common_grade === '5') {
                        // if (sex == 'false') {
                        //     result = eventController.jumpBoyCtrl4(val);
                        // } else {
                        result = eventController.jumpGirlCtrl4(val);
                        // }
                    } else if (common_grade === '8' || common_grade === '9') {
                        // if (sex == 'false') {
                        //     result = eventController.jumpBoyCtrl8(val);
                        // } else {
                        result = eventController.jumpGirlCtrl8(val);
                        // }
                    }

                    if (!result) {
                        showError('立定跳远值不合法，请重新录入');
                        $(this).val('');
                    }else {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'jump_third');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var jump_third = $(this).val();
            	setLocalStorageValue(studentId, "jump_third", jump_third ? new Number(jump_third) : jump_third);
                if (jump_third === '-1') {
                    checkSingleProjectIsAllMiss('jump_third');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 第三次立定跳远前校验第二次是否填写
             */
            $('.jump_third').undelegate('.jump_third', 'focus').focus(function () {
                // var val = $(this).parent().prev('td').children('.jump_second').val();
                // if (val == '') {
                //     showError('先填写第二次立定跳远记录');
                //     $(this).blur();
                // }
                if ($(this).attr('readonly')) {
                    $(this).blur();
                }
            });

            /**
             * 15米折返跑
             */
            $(".fifth_meter").undelegate('.fifth_meter', 'blur').blur(function () {
                var val = $(this).val().trim()?Number($(this).val().trim()).toString():$(this).val().trim();
                $(this).val(val);
                var studentId = $(this).parents("tr").attr("student_id");
                if (val){
                    var sex = $(this).parents('tr').attr('student_sex');
                    var result = false;
                    if (common_grade === '4' || common_grade === '5') {
                        if (sex == '0') {
                            result = eventController.fifthBoyCtrl4(val);
                        } else {
                            result = eventController.fifthGirlCtrl4(val);
                        }
                    } else if (common_grade === '8' || common_grade === '9') {
                        if (sex == '0') {
                            result = eventController.fifthBoyCtrl8(val);
                        } else {
                            result = eventController.fifthGirlCtrl8(val);
                        }
                    }

                    if (!result){
                        showError('15米折返跑值不合法，请重新录入');
                        $(this).val('');
                    }else {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }else {
                    var value = getLocalStorageValue(studentId, 'fifth_meter');
                    if (value != '' && value != SAVED_VALUE) {
                        setLocalStorageValue(studentId, 'currentModify', 1);
                    }
                }

            	//即时保存
            	var fifth_meter = $(this).val();
            	setLocalStorageValue(studentId, "fifth_meter", fifth_meter ? new Number(fifth_meter) : fifth_meter);
                if (fifth_meter === '-1') {
                    checkSingleProjectIsAllMiss('fifth_meter');
                    if (checkIsAllMissByStudentId(studentId)) {
                        $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                    }
                }
            });

            /**
             * 身高缺失
             */
            $('#height_miss').undelegate('#height_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.height');
                    var isAllFilling;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.height').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'height', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#height_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('height_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#height_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.height').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'height', '');
                        }

                    });
                    setExamStorageValue('height_miss', 0);
                }
                setExamStorageValue('heightIsChanged', 1);
                $(this).blur();

            });

            /**
             * 体重缺失
             */
            $('#weight_miss').undelegate('#weight_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.weight');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.weight').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'weight', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#weight_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('weight_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#weight_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.weight').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'weight', '');
                        }

                    });
                    setExamStorageValue('weight_miss', 0);
                }
                setExamStorageValue('weightIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第一次握力缺失
             */
            $('#power_first_miss').undelegate('#power_first_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.power_first');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.power_first').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            $(this).parent().next().find('input.power_second').removeAttr('readonly');
                            setLocalStorageValue(studentId, 'power_first', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#power_first_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('power_first_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#power_first_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.power_first').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            var power_second_value = getLocalStorageValue(studentId, 'power_second');
                            var power_second_miss_value = getExamStorageValue('power_second_miss');
                            if (power_second_value === -1 || power_second_miss_value === 1) {
                                if (power_second_value === -1 ) {
                                    $(this).parent().next().find('input.power_second').attr('readonly', 'readonly');
                                    if (power_second_miss_value !== 1) {
                                        $(this).parent().next().find('input.power_second').val('');
                                        setLocalStorageValue(studentId, 'power_second', '');
                                    }

                                }
                            }else {
                                $(this).parent().next().find('input.power_second').attr('readonly', 'readonly');
                                $(this).parent().next().find('input.power_second').val('');
                                setLocalStorageValue(studentId, 'power_second', '');
                            }
                            setLocalStorageValue(studentId, 'power_first', '');
                        }

                    });
                    setExamStorageValue('power_first_miss', 0);
                }
                setExamStorageValue('power_firstIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第二次握力缺失
             */
            $('#power_second_miss').undelegate('#power_second_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.power_second');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.power_second').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'power_second', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#power_second_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('power_second_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#power_second_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.power_second').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'power_second', '');
                        }

                    });
                    setExamStorageValue('power_second_miss', 0);
                }
                setExamStorageValue('power_secondIsChanged', 1);
                $(this).blur();
            });

            /**
             * 左眼视力值缺失
             */
            $('#left_eye_miss').undelegate('#left_eye_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.left_eye');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.left_eye').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'left_eye', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#left_eye_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('left_eye_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#left_eye_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.left_eye').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'left_eye', '');
                        }

                    });
                    setExamStorageValue('left_eye_miss', 0);
                }
                setExamStorageValue('left_eyeIsChanged', 1);
                $(this).blur();
            });
            /**
             * 右眼视力值缺失
             */
            $('#right_eye_miss').undelegate('#right_eye_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.right_eye');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.right_eye').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'right_eye', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#right_eye_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('right_eye_miss', 1);
                    }
                }else {
                    $('#right_eye_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.right_eye').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'right_eye', '');
                        }

                    });
                    setExamStorageValue('right_eye_miss', 0);
                }
                setExamStorageValue('right_eyeIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第一次肺活量缺失
             */
            $('#breath_first_miss').undelegate('#breath_first_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.breath_first');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.breath_first').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            $(this).parent().next().find('input.breath_second').removeAttr('readonly');
                            setLocalStorageValue(studentId, 'breath_first', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#breath_first_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('breath_first_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#breath_first_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.breath_first').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            var breath_second_value = getLocalStorageValue(studentId, 'breath_second');
                            var breath_second_miss_value = getExamStorageValue('breath_second_miss');
                            if (breath_second_value === -1 || breath_second_miss_value === 1) {
                                if (breath_second_value === -1) {
                                    $(this).parent().next().find('input.breath_second').attr('readonly', 'readonly');
                                    if (breath_second_miss_value !== 1) {
                                        $(this).parent().next().find('input.breath_second').val('');
                                        setLocalStorageValue(studentId, 'breath_second', '');
                                    }
                                }
                            }else {
                                $(this).parent().next().find('input.breath_second').attr('readonly', 'readonly');
                                $(this).parent().next().find('input.breath_second').val('');

                                setLocalStorageValue(studentId, 'breath_second', '');
                            }
                            setLocalStorageValue(studentId, 'breath_first', '');
                        }

                    });
                    setExamStorageValue('breath_first_miss', 0);
                }
                setExamStorageValue('breath_firstIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第二次肺活量缺失
             */
            $('#breath_second_miss').undelegate('#breath_second_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.breath_second');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.breath_second').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'breath_second', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#breath_second_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('breath_second_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#breath_second_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.breath_second').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'breath_second', '');
                        }

                    });
                    setExamStorageValue('breath_second_miss', 0);
                }
                setExamStorageValue('breath_secondIsChanged', 1);
                $(this).blur();
            });

            /**
             * 50米跑缺失
             */
            $('#fifty_miss').undelegate('#fifty_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.fifty_meter');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.fifty_meter').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'fifty_meter', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#fifty_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('fifty_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#fifty_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.fifty_meter').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'fifty_meter', '');
                        }

                    });
                    setExamStorageValue('fifty_miss', 0);
                }
                setExamStorageValue('fiftyIsChanged', 1);
                $(this).blur();
            });

            /**
             * 15米折返跑缺失
             */
            $('#fifth_miss').undelegate('#fifth_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.fifth_meter');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.fifth_meter').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'fifth_meter', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#fifth_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('fifth_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#fifth_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.fifth_meter').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'fifth_meter', '');
                        }

                    });
                    setExamStorageValue('fifth_miss', 0);
                }
                setExamStorageValue('fifthIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第一次立定跳远缺失
             */
            $('#jump_first_miss').undelegate('#jump_first_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.jump_first');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.jump_first').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            $(this).parent().next().find('input.jump_second').removeAttr('readonly');
                            setLocalStorageValue(studentId, 'jump_first', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#jump_first_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('jump_first_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#jump_first_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.jump_first').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            var jump_second_value = getLocalStorageValue(studentId, 'jump_second');
                            var jump_second_miss_value = getExamStorageValue('jump_second_miss');

                            var jump_third_miss_value = getExamStorageValue('jump_third_miss');

                            if (jump_second_value === -1 || jump_second_miss_value === 1) {
                                if (jump_second_value === -1) {
                                    $(this).parent().next().find('input.jump_second').attr('readonly', 'readonly');
                                    if (jump_second_miss_value !== 1) {
                                        $(this).parent().next().find('input.jump_second').val('');
                                        setLocalStorageValue(studentId, 'jump_second', '');
                                    }
                                }
                            }
                            if (jump_third_miss_value !== 1) {
                                $(this).parent().next().next().find('input.jump_third').attr('readonly', 'readonly');
                                $(this).parent().next().next().find('input.jump_third').val('');
                                setLocalStorageValue(studentId, 'jump_third', '');
                            }
                            setLocalStorageValue(studentId, 'jump_first', '');
                        }

                    });
                    setExamStorageValue('jump_first_miss', 0);
                }
                setExamStorageValue('jump_firstIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第二次立定跳远缺失
             */
            $('#jump_second_miss').undelegate('#jump_second_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.jump_second');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.jump_second').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            var jump_third_miss_value = getExamStorageValue('jump_third_miss');
                            if (jump_third_miss_value !== 1) {
                                $(this).parent().next().find('input.jump_third').removeAttr('readonly');
                            }
                            setLocalStorageValue(studentId, 'jump_second', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#jump_second_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('jump_second_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#jump_second_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.jump_second').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            var breath_second_value = getLocalStorageValue(studentId, 'jump_third');
                            var breath_second_miss_value = getExamStorageValue('jump_third_miss');
                            if (breath_second_value === -1 || breath_second_miss_value === 1) {
                                if (breath_second_value === -1) {
                                    $(this).parent().next().find('input.jump_third').attr('readonly', 'readonly');
                                    if (breath_second_miss_value !== 1) {
                                        $(this).parent().next().find('input.jump_third').val('');
                                        setLocalStorageValue(studentId, 'jump_third', '');
                                    }
                                }
                            }else {
                                $(this).parent().next().find('input.jump_third').attr('readonly', 'readonly');
                                $(this).parent().next().find('input.jump_third').val('');
                                setLocalStorageValue(studentId, 'jump_second', '');
                                setLocalStorageValue(studentId, 'jump_third', '');
                            }
                            setLocalStorageValue(studentId, 'jump_second', '');
                        }

                    });
                    setExamStorageValue('jump_second_miss', 0);
                }
                setExamStorageValue('jump_secondIsChanged', 1);
                $(this).blur();
            });

            /**
             * 第三次立定跳远缺失
             */
            $('#jump_third_miss').undelegate('#jump_third_miss', 'click').click(function () {
                if ($(this).hasClass('check-no')) {
                    var data = $('.table-inputScore').find('input.jump_third');
                    var isAllFilling = true;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].value == '' || data[i].value == '-1') {
                            isAllFilling = false;
                        }else {
                            isAllFilling = true;
                            break;
                        }
                    }
                    if (!isAllFilling) {
                        $('.table-inputScore').find('input.jump_third').each(function () {
                            $(this).val('-1');
                            $(this).attr('disabled', 'disabled');
                            var studentId = $(this).parents('tr.tr_students').attr('student_id');
                            setLocalStorageValue(studentId, 'jump_third', -1);
                            if (checkIsAllMissByStudentId(studentId)) {
                                $(this).parents('tr.tr_students').find('span.span-checkbox').trigger("click");
                            }
                        });
                        $('#jump_third_miss').removeClass('check-no').addClass('check-yes');
                        setExamStorageValue('jump_third_miss', 1);
                        checkIsAllMissByProjectName();
                    }
                }else {
                    $('#jump_third_miss').removeClass('check-yes').addClass('check-no');
                    checkSpanIsAllMissState();
                    $('.table-inputScore').find('input.jump_third').each(function () {
                        var studentId = $(this).parents('tr.tr_students').attr('student_id');
                        var is_empty = getLocalStorageValue(studentId, 'is_empty');
                        if (is_empty != 1) {
                            $(this).val('');
                            $(this).removeAttr('disabled');
                            setLocalStorageValue(studentId, 'jump_third', '');
                        }

                    });
                    setExamStorageValue('jump_third_miss', 0);
                }
                setExamStorageValue('jump_thirdIsChanged', 1);
                $(this).blur();
            });

            $("#recorder").undelegate('#recorder', 'blur').blur(function () {
                var value = $(this).val();
                setExamRecorderInfo('recorder', $.trim(value));
            });

            $('#auditor').undelegate('#auditor', 'blur').blur(function () {
                var value = $(this).val();
                setExamRecorderInfo('reviewer', $.trim(value));
            });

            $('#phoneNum').undelegate('#phoneNum', 'blur').blur(function () {
                var value = $(this).val();
                setExamRecorderInfo('contac_info', $.trim(value));
            });
        }

        /**
         * 提示
         * @param msg
         */
        function showSuccess(msg) {
            $('.tip-submitted>p').html(msg);
            $('.tip-submitted').show();
            $('.div-shade').show();
        }

        /**
         * 提示错误信息
         * @param error
         */
        function showError(error) {
            if ($('.tip-uncommitted').is(':visible')) return;

            $('.tip-uncommitted>p').html(error);
            $('.tip-uncommitted').show();
            $(".div-shade").show();
        }

        /**
         * 从本地浏览器缓存中取值
         */
        function getLocalStorageValue(studentId, key) {
        	var scoreMap = localStorage.getItem(studentId);
        	if (!scoreMap) {
        		return "";
        	}
        	var scoreJson = JSON.parse(scoreMap);
        	return !scoreJson ? "" : scoreJson[key];
        }

        /**
         * 将数据保存到浏览器缓存中
         */
        function setLocalStorageValue(studentId, key, value) {
            var scoreMap = localStorage.getItem(studentId);
            if (!scoreMap) {
                scoreMap = new Array();
            }
            var scoreJson = JSON.parse(scoreMap);
            scoreJson[key] = value;
            localStorage.setItem(studentId, JSON.stringify(scoreJson));
        }

        /**
         * 获取缓存中的考场缺测信息
         * @param key
         * @param value
         */
        function getExamStorageValue(key) {
            var examMap = localStorage.getItem(SCHOOL_EXAM_ID);
            if (!examMap) {
                return 0;
            }
            var examJson = JSON.parse(examMap);
            return !examJson[key] ? 0 : examJson[key];
        }

        /**
         * 将考场缺测信息保存到浏览器缓存中
         * @param key
         * @param value
         */
        function setExamStorageValue(key, value) {
            var examJson = localStorage.getItem(SCHOOL_EXAM_ID);
            var examMap;
            if (!examJson) {
                examMap = {};
            }else {
                examMap = JSON.parse(examJson);
            }
            examMap[key] = value;
            if (!examMap['school_code']) {
                examMap['school_code'] = SCHOOL_CODE;
            }
            if (!examMap['exam_room']) {
                examMap['exam_room'] = EXAM_ROOM;
            }
            localStorage.setItem(SCHOOL_EXAM_ID, JSON.stringify(examMap));
        }

        /**
         * 获取录入员信息
         * @param key
         * @returns {string}
         */
        function getExamRecorderInfo(key) {
            var examMap = localStorage.getItem(SCHOOL_EXAM_RECORDERINFO);
            if (!examMap) {
                return '';
            }
            var examJson = JSON.parse(examMap);
            return !examJson[key] ? '' : examJson[key];
        }

        /**
         * 保存录入员信息
         * @param key
         * @param value
         */
        function setExamRecorderInfo(key, value) {
            var recorderJson = localStorage.getItem(SCHOOL_EXAM_RECORDERINFO);
            var recorderInfo;
            recorderJson
            if (!recorderJson) {
                recorderInfo = {};
            }else {
                recorderInfo = JSON.parse(recorderJson);
            }
            recorderInfo[key] = value;
            localStorage.setItem(SCHOOL_EXAM_RECORDERINFO, JSON.stringify(recorderInfo));
        }

        /**
         * 清空这个学生的成绩缓存
         * @param studentId
         */
        function cleanStudentValue(studentId) {
            var scoreMap = localStorage.getItem(studentId);
            if (!scoreMap) {
                scoreMap = new Array();
            }
            var scoreJson = JSON.parse(scoreMap);
            scoreJson.height = '';
            scoreJson.weight = '';
            scoreJson.power_first = '';
            scoreJson.power_second = '';
            scoreJson.left_eye = '';
            scoreJson.right_eye = '';
            scoreJson.breath_first = '';
            scoreJson.breath_second = '';
            scoreJson.fifty_meter = '';
            scoreJson.jump_first = '';
            scoreJson.jump_second = '';
            scoreJson.jump_third = '';
            scoreJson.fifth_meter = '';
            localStorage.setItem(studentId, JSON.stringify(scoreJson));
        }

        self.bindData = bindData;
        self.initClassName = initClassName;

        self.initClick = function() {
        	//初始化学生名称
            $('.p-name').click(function () {
                $(this).hide();
                $(this).next().val($(this).html()).show().focus();
            });
            $('.td-name>input').blur(function () {
                $(this).hide();
                var value = $(this).val();
                $(this).prev().html(value).show();
                var oHeight = $(this).prev().height()+4;
                if(oHeight>66){
                    $(this).parent().parent().find("td,td>input").height(oHeight+"px");
                }
                if (value === '' || (value.length >0 && value.trim().length === 0)){
                    showError('考生姓名不能为空');
                    var attr = $(this).attr('student_name');
                    $(this).val(attr);
                    $(this).prev().html(attr);
                }else {
                    $(this).attr('student_name', value);
                    $(this).attr('title',value);
                    var student_id = $(this).parents('tr').attr('student_id');
                    setLocalStorageValue(student_id, 'student_name', value);
                    setLocalStorageValue(student_id, 'stuName', value);
                }

            });
        };

        /**
         * 1 如果服务器已经提交过数据，且数据都处于已提交状态，那么不允许进行修改，也不需要进行缓存
         * 2 如果当前浏览器中并没有该学生的浏览器缓存数据，那么存一份基本信息
         */
        self.initData = function(studentJson, examJson) {
            studentJson = JSON.parse(studentJson);
            var data = fixedServerData(studentJson, examJson);
            studentJson = data.studentJson;
            examJson = data.examJson;
            // studentJson = $("#stu_json").val();
        	$.each(studentJson, function(idx, obj) {
        	    if (idx === 0){
        	        SCHOOL_EXAM_ID = obj.barcode.substring(0, 13);
        	        SCHOOL_EXAM_RECORDERINFO = SCHOOL_EXAM_ID + '_recorderInfo';
                    window.localStorage.setItem(SCHOOL_EXAM_ID + IS_COMMIT, !obj.status ? 0 : obj.status);
        	        EXAM_ROOM = obj.exam_room;
        	        SCHOOL_CODE = obj.school_code;
        	        self. EXAM_ROOM=obj.exam_room;
                    self.SCHOOL_CODE = obj.school_code;
                    common_grade = SCHOOL_CODE.substring(SCHOOL_CODE.length - 3, SCHOOL_CODE.length - 2);
                    initExamData(examJson);
                }
        		var studentId = obj.id;
        	    obj.student_id = studentId;
        	    obj.stuName = obj.student_name;
        		var studentMap = localStorage.getItem(studentId);

        		if (!studentMap || localStorage.getItem(SCHOOL_EXAM_ID + IS_COMMIT) == 1) {
        			localStorage.setItem(studentId, JSON.stringify(obj));
        		}else {
                    // var local_is_empty = getLocalStorageValue(studentId, 'is_empty');
                    // if (obj.is_empty &&(obj.is_empty !== local_is_empty)) {
                    //     localStorage.setItem(studentId, JSON.stringify(obj));
                    // }
                    //假如该学生后台数据为空，则以后台数据为准
                    if (obj.is_empty === 1) {
                        var x;
                        for (x in obj) {
                            if (projectNames.contains(x) && obj[x] !== -1) {
                                obj[x] = -1
                            }
                        }
                        localStorage.setItem(studentId, JSON.stringify(obj));
                    }else {
                        // 在这一步骤当中进行本地数据与后台数据之间的糅合 xdchen3
                        blendExamAndResult(studentId, obj);
                    }
                }

        	});

        };

        //页面加载完成后，渲染页面数据
        self.buildPageData = function() {
        	//遍历每一条当前代填写数据
        	$("table.table-inputScore").find("tr.tr_students").each(function() {
        		var studentId = $(this).attr("student_id");
        		var studentMap = localStorage.getItem(studentId);
        		//如果没有数据或者已提交，则不进行数据重新渲染
        		if (studentMap == null || studentMap.status == 1) {
        			$(this).find("input").attr("readonly","readonly");
        			return;
        		}
            	var scoreJson = JSON.parse(studentMap);
        		$(this).attr('student_grade', scoreJson.className);
        		$(this).find("input.barcode").val(scoreJson.barcode);
        		//姓名需要特殊处理
        		$(this).find("p.p-name").html(scoreJson.student_name);
                var oHeight = $(this).find("p.p-name").height()+4;
                if(oHeight>66){
                    $(this).find("td,td>input").height(oHeight+"px");
                }
        		$(this).find('input.input_name').val(scoreJson.student_name);
        		//性别需要特殊处理
        		if (scoreJson.sex == 0) {
            		$(this).find("input.sex").val("男");
        		} else {
            		$(this).find("input.sex").val("女");
        		}
        		$(this).find("input.className").attr('grade_class',scoreJson.className);
                $(this).find("input.className").val(scoreJson.className);
                if (scoreJson.height == SAVED_VALUE) {
                    scoreJson.height = '';
                }
                var height = scoreJson.height;
                $(this).find("input.height").val((!height || height == MISSING_VALUE) ? height : height.toFixed(1));
                if (scoreJson.weight == SAVED_VALUE) {
                    scoreJson.weight = '';
                }
                var weight = scoreJson.weight;
                $(this).find("input.weight").val((!weight || weight == MISSING_VALUE) ? weight : weight.toFixed(1));
                if (scoreJson.power_first == SAVED_VALUE) {
                    scoreJson.power_first = '';
                }
                var power_first = scoreJson.power_first;
                $(this).find("input.power_first").val((power_first === undefined|| power_first === '' || power_first === MISSING_VALUE) ? power_first : power_first.toFixed(1));
                if (power_first === undefined || power_first === ''){
                    $(this).find("input.power_second").attr('readonly', 'readonly');
                }
                if (scoreJson.power_second == SAVED_VALUE) {
                    scoreJson.power_second = '';
                }
                var powerSecond = scoreJson.power_second;
                $(this).find("input.power_second").val((powerSecond === undefined|| powerSecond === '' || powerSecond === MISSING_VALUE) ? powerSecond : powerSecond.toFixed(1));
                if (scoreJson.left_eye == SAVED_VALUE) {
                    scoreJson.left_eye = '';
                }
                if (scoreJson.right_eye == SAVED_VALUE) {
                    scoreJson.right_eye = '';
                }
                var leftEye = scoreJson.left_eye;
                $(this).find("input.left_eye").val((!leftEye || leftEye == MISSING_VALUE) ? leftEye : leftEye.toFixed(1));
                var rightEye = scoreJson.right_eye;
                $(this).find("input.right_eye").val((!rightEye || rightEye == MISSING_VALUE) ? rightEye : rightEye.toFixed(1));
                if (scoreJson.breath_first == SAVED_VALUE) {
                    scoreJson.breath_first = '';
                }
                var breath_first = scoreJson.breath_first;
                $(this).find("input.breath_first").val(breath_first);
                if (!breath_first){
                    $(this).find("input.breath_second").attr('readonly', 'readonly');
                }
                if (scoreJson.breath_second == SAVED_VALUE) {
                    scoreJson.breath_second = '';
                }

        		$(this).find("input.breath_second").val(scoreJson.breath_second);
                if (scoreJson.fifty_meter == SAVED_VALUE) {
                    scoreJson.fifty_meter = '';
                }
                var fiftyMeter = scoreJson.fifty_meter;
                $(this).find("input.fifty_meter").val((!fiftyMeter || fiftyMeter == MISSING_VALUE) ? fiftyMeter : fiftyMeter.toFixed(1));
                if (scoreJson.jump_first == SAVED_VALUE) {
                    scoreJson.jump_first = '';
                }
                var jump_first = scoreJson.jump_first;
                $(this).find("input.jump_first").val(jump_first);
                if (!jump_first){
                    $(this).find("input.jump_second").attr('readonly', 'readonly');
                }
                if (scoreJson.jump_second == SAVED_VALUE) {
                    scoreJson.jump_second = '';
                }
                var jump_second = scoreJson.jump_second;
                if (!jump_second) {
                    $(this).find("input.jump_third").attr('readonly', 'readonly');
                }
                $(this).find("input.jump_second").val(jump_second);
                if (scoreJson.jump_third == SAVED_VALUE) {
                    scoreJson.jump_third = '';
                }
        		$(this).find("input.jump_third").val(scoreJson.jump_third);
                if (scoreJson.fifth_meter == SAVED_VALUE) {
                    scoreJson.fifth_meter = '';
                }
        		$(this).find("input.fifth_meter").val(scoreJson.fifth_meter);
        		var empty = scoreJson.is_empty;
        		if (empty == 1){
                    $(this).find('span.span-checkbox').removeClass('check-no').addClass('check-yes');
                    $(this).find('span.span-checkbox').attr('student_miss', 1);
                    $(this).find('input').attr("disabled","disabled");
                    $(this).find('.p-name').off();
                }else if (empty == 2) {
                    setLocalStorageValue(studentId, 'is_empty', 0);
                    $(this).find('span.span-checkbox').attr('student_miss', 0);
                }
                var status = scoreJson.status;
        		if (status === 1){
                    $(this).find('input').attr("disabled","disabled");
                    $(this).find('.span-checkbox').off().css('cursor','default');
                    $('#isAll_miss').css('cursor','default');
                    $(this).find('.p-name').off();
                    // var color = $(this).find('input').css('background-color');
                    // $(this).find('.td-name').css('background-color',color);
                }else if (status === 2) {
                    setLocalStorageValue(studentId, 'status', 0);
                }
        	});
            initSingleProject();
        	if (SCHOOL_EXAM_ID !== ''){
                var checkboxAllFlag = 1;
                var eachCount = 0;
                var checkLength = $('.span-checkbox').length;
                $('.span-checkbox').each(function (index) {
                    eachCount++;
                    if($(this).attr('student_miss') != 1){
                        checkboxAllFlag=0;
                        $('#isAll_miss').removeClass('check-yes').addClass('check-no');
                        return false;
                    }
                    if(eachCount>=checkLength){
                        if(checkboxAllFlag == 1){
                            $('#isAll_miss').removeClass('check-no').addClass('check-yes');
                        }
                    }
                });

                var isCommit = localStorage.getItem(SCHOOL_EXAM_ID + IS_COMMIT);
                if (isCommit == 1){
                    //该考场成绩已被提交，则所有数据不可编辑; 禁用"提交按钮"
                    $('.commit').removeClass('can-click').addClass('un-click').attr('disabled', 'disabled');
                    $('.save').removeClass('can-click').addClass('un-click').attr('disabled', 'disabled');
                    $('.span-checkbox-all').off().css('cursor','default');
                    $('#recorder,#auditor,#phoneNum').attr('disabled', 'disabled').css("cursor","not-allowed");
                }
            }
        };

        /**
         * 初始化录入员信息
         * @param schoolRecorder
         */
        self.initRecorderInfo = function (schoolRecorder) {
            schoolRecorder = JSON.parse(schoolRecorder);
            var localString = localStorage.getItem(SCHOOL_EXAM_RECORDERINFO);
            if (!localString) {
                $("#recorder").val(schoolRecorder.recorder);
                $("#auditor").val(schoolRecorder.reviewer);
                $("#phoneNum").val(schoolRecorder.contac_info);
                localStorage.setItem(SCHOOL_EXAM_RECORDERINFO, JSON.stringify(schoolRecorder));
            }else {
                var localInfo = JSON.parse(localString);
                if (schoolRecorder.recorder === undefined || schoolRecorder.recorder === '') {
                    $("#recorder").val(localInfo.recorder);

                }else {
                    $("#recorder").val(schoolRecorder.recorder);
                    setExamRecorderInfo('recorder', schoolRecorder.recorder);
                }
                if (schoolRecorder.reviewer === undefined || schoolRecorder.reviewer === '') {
                    $("#auditor").val(localInfo.reviewer);

                }else {
                    $("#auditor").val(schoolRecorder.reviewer);
                    setExamRecorderInfo('reviewer', schoolRecorder.reviewer);
                }

                if (schoolRecorder.contac_info === undefined || schoolRecorder.contac_info === '') {
                    $("#phoneNum").val(localInfo.contac_info);
                }else {
                    $("#phoneNum").val(schoolRecorder.contac_info);
                    setExamRecorderInfo('contac_info', schoolRecorder.contac_info);
                }

            }

        };

        /**
         * 初始化考场单项成绩缺测信息
         * @param examData
         */
        function initExamData(examData) {
            if (examData) {
                var data = JSON.parse(examData);
                var localString = localStorage.getItem(SCHOOL_EXAM_ID);
                if (!localString) {
                    localStorage.setItem(SCHOOL_EXAM_ID, examData);
                }else {
                    var localData = JSON.parse(localString);
                    var x;
                    for (x in data) {
                        var datum = data[x];
                        var localDatum = localData[x];
                        if (!localDatum || datum != localDatum) {
                            localData[x] = datum;
                        }
                    }
                    localStorage.setItem(SCHOOL_EXAM_ID, JSON.stringify(localData));
                }
            }

            //渲染视图
            var item = localStorage.getItem(SCHOOL_EXAM_ID);
            var itemObj = JSON.parse(item);

            var i;
            for (i in itemObj) {
                var content = itemObj[i];
                if (content === 1) {
                    var j = '#' + i;
                    $(j).removeClass('check-no').addClass('check-yes');
                }
            }
        }

        /**
         * 将当前考场的单项缺测数据与考生数据糅合起来
         * @param studentId
         * @param serverData  后台学生数据
         */
        function blendExamAndResult(studentId, serverData) {

            var examString = localStorage.getItem(SCHOOL_EXAM_ID);

            var examData = JSON.parse(examString);
            var x;
            //先去初始化单项缺失值
            for (x in examData) {
                var datum = examData[x];
                if (datum === 1) {
                    var projectName = project_result[x];
                    setLocalStorageValue(studentId, projectName, -1);
                }
            }
            var studentString = localStorage.getItem(studentId);
            var localData;
            if (!studentString) {
                localData = {};
            }else {
                localData = JSON.parse(studentString);
            }

            var y;
            for (y in serverData) {
                var serverDatum = serverData[y];
                if (serverDatum == undefined || serverDatum == SAVED_VALUE) {
                    if (localData[y] == MISSING_VALUE) {
                        setLocalStorageValue(studentId, y, '');
                    }else {
                        setLocalStorageValue(studentId, y, localData[y]);
                    }
                }else {
                    setLocalStorageValue(studentId, y, serverDatum);
                }
            }
            checkIsAllMissByStudentId(studentId);
        }

        /**
         * 初始化单项成绩
         */
        function initSingleProject() {
            var localString = localStorage.getItem(SCHOOL_EXAM_ID);
            var localExamData;
            if (!localString) {
                localExamData = {};
            }else {
                localExamData = JSON.parse(localString);
            }
            var x;
            for (x in localExamData) {
                if (localExamData[x] === 1) {
                    var projectResult = project_result[x];
                    var name = '.' + projectResult;
                    $(name).attr('disabled', 'disabled');
                }

            }
        }

        /**
         * 清空单项缺失的点击状态
         * @param misColJson
         */
        function clearProjectChangeState(misColJson) {
            var result = JSON.parse(misColJson);
            var x;
            for (x in result) {
                if (misColumnChangeStates.contains(x)) {
                    setExamStorageValue(x, 0);
                }
            }
        }

        /**
         * 判断当前学生的成绩是否为全部缺失
         * @param studentId
         */
        function checkIsAllMissByStudentId(studentId) {
            var dataString = localStorage.getItem(studentId);
            var data = JSON.parse(dataString);
            var x;
            var length = 0;
            for(x in data) {
                if (projectNames.contains(x) && data[x] === -1) {
                    length++;
                }
            }
            if (length === projectNames.length && getLocalStorageValue(studentId, 'is_empty') !== 1) {
                setLocalStorageValue(studentId, 'is_empty', 1);
                return true;
            }
            return false;
        }

        /**
         * 判断单项成绩是否全部缺失
         * @param projectName
         */
        function checkSingleProjectIsAllMiss(projectName) {
            var name = '.' + projectName;
            var length = 0;
            $(name).each(function () {
                if ($(this).val() === '-1') {
                    length ++;
                }else {
                    return false;
                }
            });
            if (length === $(name).length) {
                var resultProject = result_project[projectName];
                resultProject = '#' + resultProject;
                if ($(resultProject).hasClass('check-no')) {
                    $(resultProject).trigger('click');
                }

            }
        }

        /**
         * 判断当前单项缺失是否全部勾选上
         */
        function checkIsAllMissByProjectName() {
            var examString = localStorage.getItem(SCHOOL_EXAM_ID);
            var examData = JSON.parse(examString);
            var length = 0;
            var x;
            for (x in examData) {
                if (projectMissName.contains(x) && examData[x] === 1) {
                    length ++;
                }
            }
            if (length === projectMissName.length && $('#isAll_miss').hasClass('check-no')) {
                $('#isAll_miss').trigger('click');
            }
        }

        /**
         * 检查全部缺失span状态
         */
        function checkSpanIsAllMissState() {
            if ($('#isAll_miss').hasClass('check-yes')) {
                $('#isAll_miss').removeClass('check-yes').addClass('check-no');
                setExamStorageValue('isAll_miss', 0);
                $("table.table-inputScore").find("tr.tr_students").each(function () {
                    var studentId = $(this).attr("student_id");
                    var isMiss = $(this).find('span').attr('student_miss');
                    if (isMiss == 1) {
                        $(this).find('span').removeClass('check-yes').addClass('check-no');
                        $(this).find('span').attr('student_miss', 0);
                        $(this).find('.p-name').click(function () {
                            $(this).hide();
                            $(this).next().val($(this).html()).show().focus();
                        });
                    }
                    setLocalStorageValue(studentId, 'is_empty', 0);
                });
            }

        }

        /**
         * 批量处理单项缺失状态
         * @param state
         */
        function setSingleProjectState(state) {
            var examString = localStorage.getItem(SCHOOL_EXAM_ID);
            var examData = JSON.parse(examString);
            for (var x = 0; x < projectMissName.length; x++) {
                examData[projectMissName[x]] = state;
            }
            localStorage.setItem(SCHOOL_EXAM_ID, JSON.stringify(examData));
        }

        /**
         * 修正从后台获取的学生成绩与项目缺失数据
         * @param studentJson
         * @param examJson
         */
        function fixedServerData(studentJson, examJson) {
            var examData = {};
            if (examJson) {
                examData = JSON.parse(examJson);
                var x;
                for (x in examData) {
                    if (examData[x] === 1) {
                        $.each(studentJson, function (index, obj) {
                            var projectName = project_result[x];
                            if (obj[projectName] !== -1) {
                                examData[x] = 0;
                            }
                        })
                    }else {
                        var length = 0;
                        $.each(studentJson, function (index, obj) {
                            var projectName = project_result[x];
                            if (obj[projectName] === -1) {
                                length ++;
                            }
                        });
                        if (length === studentJson.length) {
                            examData[x] = 1;
                        }
                    }
                }

            }

            return {
                studentJson: studentJson,
                examJson: JSON.stringify(examData)
            };
        }

    }

    module.exports = new StudentTable();
});