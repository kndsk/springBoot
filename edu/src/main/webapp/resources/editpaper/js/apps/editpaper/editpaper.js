/**
 * @author gangwu3
 *
 */
require.config(requireConfig);
define(function(require, exports, module) {
   	var util = require('common/common'),
        dao = require('common/dao');
	  require('imageCtrl');
	  require('plugin');
	  require('pasteImgText');
	  require('ckeditor');
	  require('textCode');
	  require('selectui');
	  require('popbox');

	var addEvents = function(){
        // 确定
        $(document).on('click','#btn_createpaper', eventCtroller.okEvent);
        // 监听paperName值改变
        $(document).on('change','#input_paperName', eventCtroller.nameChangeEvent);
        //点击学段
		$("#sel_phase").bind("change",function(){
			eventCtroller.allPhase($(this).val());
		});
    };
    // 字符串替换
	function replaceAll(str, sptr, sptr1) {
		//输入有限制时的字符串替换
		var n = 0;
		if(str != null && str != ""){
			while (str.indexOf(sptr) >= 0) {
				str = str.replace(sptr, sptr1);
				n++;
			}
			return str;
		}else{
			return "";
		}
	}

	function containsSpecialChar(str){
		if(str.indexOf(",") != -1 || str.indexOf(".") != -1 || str.indexOf("?") != -1 || str.indexOf("/") != -1){
			return false;
		}else{
			return true;
		}
	}

	var eventCtroller = {
		nameChangeEvent:function(){
			if(!containsSpecialChar($(this).val())){
				$(this).css("border-color", "red");
				$("#paperNameTip").html("存在特殊字符!");
				window.specialCharFlag = true;
			}else{
				$(this).css("border-color", "#d4d4d4");
				$("#paperNameTip").html("问卷名称不能超过25个字，不能出现,./?字符");
				window.specialCharFlag = false;
			}
		},
		okEvent:function(){
			var parames = {};
			parames.id = $("#hd_paperId").val()!=""?$("#hd_paperId").val():-1;
			parames.name = $("#input_paperName").val();
			parames.guideLanguage = $("#text_paper_guidelanguage0").html();
			parames.profile = $("#text_paper_profile").val();
			parames.phase = $("#sel_phase").val();
			parames.subject = $("#sel_subject").val();
			parames.role = $("#sel_role").val();
			parames.eachFlag = $('.each-flag:radio:checked').val();
			var ts = replaceAll($("#text_paper_guidelanguage0").html(), "&nbsp;", "");
			ts = replaceAll(ts, " ", "");
			ts = replaceAll(ts, "<p></p>", "");
			ts = replaceAll(ts, "<p><br></p>", "");
			if($("#input_paperName").val() != "" && window.specialCharFlag == true){
				jAlert("问卷名称存在特殊字符!", "提示");
				return;
			}else if($("#input_paperName").val() == "" || $("#sel_phase").val() == -1|| $("#sel_subject").val() == -1 || $("#sel_role").val()== -1){
				jAlert("存在未输入项！", "提示");
				return;
			}
			util.ajax.ajaxPost(basePath+"/paper/savepaper", {paper:JSON.stringify(parames)}, saveBack, 'json');
		},
		allPhase:function(_value){

            var allTypeArry = [
            	{"value": -1, "name": "--请选择--"},
                {"value": 1, "name": "校长问卷(系统默认)"},
				{"value": 3, "name": "班主任问卷"},
                {"value": 9,"name": "思想品德教师问卷"},
                {"value": 6, "name": "物理教师问卷"},
                {"value": 7, "name": "生物教师问卷"},
                {"value": 8, "name": "地理教师问卷"},
                {"value": 5, "name": "科学教师问卷"},
                {"value": 4, "name": "品德与社会教师问卷"},
                {"value": 10, "name": "科学(自然)教师问卷"},
                {"value": 2,"name": "教师基本信息问卷(系统默认)"}
                ];

            var primarTypeArry = [
            	{"value": -1, "name": "--请选择--"},
				{"value": 1, "name": "校长问卷(系统默认)"},
				{"value": 3, "name": "班主任问卷"},
                {"value": 4, "name": "品德与社会教师问卷"},
                {"value": 10, "name": "科学(自然)教师问卷"},
                {"value": 2,"name": "教师基本信息问卷(系统默认)"}
            ];

            var seniorTypeArry = [
            	{"value": -1, "name": "--请选择--"},
				{"value": 1, "name": "校长问卷(系统默认)"},
				{"value": 3, "name": "班主任问卷"},
                {"value": 9, "name": "思想品德教师问卷"},
                {"value": 6, "name": "物理教师问卷"},
                { "value": 7,"name": "生物教师问卷"},
                {"value": 8, "name": "地理教师问卷"},
                {"value": 5, "name": "科学教师问卷"},
                {"value": 2,"name": "教师基本信息问卷(系统默认)"}
            ];

			$("#sel_subject").empty();
			var questTypeArry=[];
			if(_value==3||_value==-1){//全部
				questTypeArry=allTypeArry;
			}else if(_value==0){//小学
				questTypeArry=primarTypeArry;
			}else{
				questTypeArry=seniorTypeArry;
			}
			for(var i=0;i<questTypeArry.length;i++){
				var optionNode='<option value='+questTypeArry[i].value+'>'+questTypeArry[i].name+'</option>';
				$("#sel_subject").append(optionNode);
			}
		}
	};

	var saveBack = function(data){
		if(data.flag == 1){
			var paperId = data.data;
			//将本作答数据相关本地缓存清除
			if(window.localStorage){
				localStorage.removeItem(paperId+'_currentpage');
				localStorage.removeItem(paperId+'_userBehaviorPath');
				localStorage.removeItem(paperId+'_displayObj');
				localStorage.removeItem(paperId+'_result');
			}
			window.location.href = basePath+"/paperitem?paperId="+paperId;
		}else{
			jAlert(data.flagMsg, "提示");
		}
	};

	function initData(){
		var dataUrl = basePath + '/paper/getpaper',
        parmes = {
            paperId:$("#hd_paperId").val()
        };
		util.ajax.ajaxPost(dataUrl, parmes, function(data){
			 $("#input_paperName").val(data.data.name);
			 var cc = '<div contenteditable="true" class="content-edit" id="text_paper_guidelanguage0" type="text_paper_guidelanguage"  name="text_paper_guidelanguage0"  style="width: 545px;min-height: 186px;">'+data.data.guideLanguage+'</div>';
			 $(".RTF-box").html(cc);
			 util.initRichEditor($('.form-group'));
			 $("#text_paper_profile").val(data.data.profile);
			 $("#sel_phase   option[value='"+data.data.phase+"']").attr("selected",true);
			 eventCtroller.allPhase(data.data.phase);
			 $("#sel_subject   option[value='"+data.data.subject+"']").attr("selected",true);
			 $("#sel_role   option[value='"+data.data.role+"']").attr("selected",true);
			 $(".each-flag-box   input[value='"+data.data.eachFlag+"']").attr("checked",'checked');
			 $("#btn_createpaper").html("下一步");
		}, 'json');
	}

	var init = function(){
        addEvents();
        window.specialCharFlag = false;
        $(".header").find(".rightVoEnName").each(function() {
			$(this).removeClass("active");
		});
		$("#PaperManager").addClass("active");
		if($("#hd_paperId").val() != ""){
			initData();
		}
    };

    $(function(){
        init();
    })
})