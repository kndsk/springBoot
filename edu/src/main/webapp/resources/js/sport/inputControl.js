
define(function (require, exports, module) {
    var baseUrl = $("#hd_ctx").val();
    var projectId = $("#project_id").val();
    var totalNum = 0;
    var pageObj = require('paging');
    var paging = new pageObj.paging();

    var pageIndex = 0;
    var pageSize = 20;
    //重置select选择数据
    function resetSelect() {
        //重置省份下拉框
        var sysProvinceId = $("#sysProvinceId").val();
        if(sysProvinceId) {
            $('#select_province').val(sysProvinceId).attr('title',$('#select_province').find("option:selected").html());
            getArea(sysProvinceId);
        }
        else {
            $('#select_province').val('').attr('title','暂无');
        }
        //区县重置
        var sysCountryId = $("#sysCountryId").val();
        if(sysCountryId) {
            $('#select_area').val(sysCountryId).attr('title',$('#select_area').find("option:selected").html());
            getSchool(sysCountryId);
        }
        else {
            $('#select_area').val('').attr('title','暂无').html('<option style="display: none" value=\'\'>暂无</option>');
        }
        $('#select_school').val('').attr('title','暂无').html('<option style="display: none" value=\'\'>暂无</option>');
        $('#select_state').val('0');
        $('.select_text_ui').html('');
    }
    //获取省份
    function getProvince() {
        var provinceChoose = '<option value=\'\'>暂无</option>';
        var provinceList = [];
        $.get(baseUrl + '/getProvinceList', {
        }, function (data) {
            if (data.result) {
                provinceList = data.obj;
                for(var i=0;i<provinceList.length;i++){
                    provinceChoose = provinceChoose + '<option value ="' + provinceList[i].province_code + '">' + provinceList[i].province_name + '</option>'
                }
                $('#select_province').html(provinceChoose);

                //泽西哥20180105加入，如果当前是省或区县管理员，初始化相关信息。
                var sysProvinceId = $("#sysProvinceId").val();
                if(sysProvinceId) {
                    $('#select_province').val(sysProvinceId);
                    $('#select_province').attr('title',$('#select_province').find("option:selected").html());
                    $('#select_province').attr("disabled", "true");
                    getArea(sysProvinceId);
                }
            }else {

            }
        }).error(function () {

        });
    }
    //获取区县
    function getArea(provinceCode) {
        if (!provinceCode) return;
        var areaChoose = '<option value=\'\'>暂无</option>';
        var areaList = [];
        $.get(baseUrl + '/getCountryList', {
            provinceCode:provinceCode
        }, function (data) {
            if (data.result) {
                areaList = data.obj;
                for(var i=0;i<areaList.length;i++){
                    areaChoose = areaChoose + '<option value ="' + areaList[i].country_code + '">' + areaList[i].country_name + '</option>'
                }
                $('#select_area').html(areaChoose);

                //泽西哥20180105加入，如果当前是区县管理员，初始化相关信息。
                var sysCountryId = $("#sysCountryId").val();
                if(sysCountryId) {
                    $('#select_area').val(sysCountryId);
                    $('#select_area').attr('title',$('#select_area').find("option:selected").html());
                    $('#select_area').attr("disabled", "true");
                    getSchool(sysCountryId);
                }
            }else {
                // console.log(data.message);
            }
        }).error(function () {
            // console.log('错误');
        });
    }
    //获取学校
    function getSchool(countryCode) {
        if (!countryCode) return;
        var schoolChoose = '<option value=\'\'>暂无</option>';
        var SchoolList = [];
        $.get(baseUrl + '/getSchoolList', {
            countryCode:countryCode
        }, function (data) {
            if (data.result) {
                SchoolList = data.obj;
                for(var i=0;i<SchoolList.length;i++){
                    schoolChoose = schoolChoose + '<option value ="' + SchoolList[i].school_code + '">' + SchoolList[i].school_name + '</option>'
                }
                $('#select_school').html(schoolChoose);
            }else {
                // console.log(data.message);
            }
        }).error(function () {
            // console.log('错误');
        });
    }

    $(function () {
        //确定
        $('#determine').click(function () {
            pageIndex = 0;
            summaryResult();
            initResultTables();
        });
        //重置
        $("#reset_select").click(function () {
            resetSelect();
            pageIndex = 0;
            summaryResult();
            initResultTables();
        });
        //选择省份 获取区县
        $("#select_province").change(function () {
            //清空区县、清空学校下拉数据和title
            $('#select_area,#select_school').val('').attr('title','暂无').html('<option style="display: none" value=\'\'>暂无</option>');
            getArea($(this).val());
            $(this).attr('title',$(this).find("option:selected").html());
        });
        //选择区县 获取学校
        $("#select_area").click(function () {
            if($('#select_province').val() === ''){
                $(this).blur();
                $(".tip-select>p").html('请先选择省份！');
                $(".tip-select").show();
                $(".div-shade").show();
            }
        }).change(function () {
            //清空学校下拉数据和title
            $('#select_school').val('').attr('title','暂无').html('<option style="display: none" value=\'\'>暂无</option>');
            getSchool($(this).val());
            $(this).attr('title',$(this).find("option:selected").html());
        });
        //选择学校
        $("#select_school").click(function () {
            if($('#select_area').val() === ''){
                setTimeout(function () {$("#select_school").blur();},150);
                $(".tip-select>p").html('请先选择区县！');
                $(".tip-select").show();
                $(".div-shade").show();
            }
        }).change(function () {
            $(this).attr('title',$(this).find("option:selected").html());
        });

        $("body").off("click", ".temp_paging").on("click", ".temp_paging", function(){
            pageIndex = parseInt($(this).attr("page_no"));
            initResultTables();
        });

        $('#export').click(function () {
            exportExcel();
        });
        $('.close_button').unbind().click(function () {
            $(".tip-select").hide();
            $(".div-shade").hide();
        });
        summaryResult();
        initResultTables();
        //获取省份
        setTimeout(function () {
            getProvince();
        }, 1000);
    });


    function initResultTables() {
        var provinceCode = $('#select_province').val();
        var countryCode = $('#select_area').val();
        var schoolCode = $('#select_school').val();
        //泽西哥20180105加入，如果是省区县管理员，初始化数据范围
        var sysProvinceId = $("#sysProvinceId").val();
        var sysCountryId = $("#sysCountryId").val();
        if(sysProvinceId) {
            provinceCode = sysProvinceId;
            if(sysCountryId) {
                countryCode = sysCountryId;
            }
        }
        var status = $('#select_state').val();
        $.post(baseUrl + '/getSportResult', {
            pageIndex: pageIndex,
            pageSize: pageSize,
            statisticsStatus: status,
            project_id: projectId,
            provinceCode: provinceCode,
            countryCode: countryCode,
            schoolCode: schoolCode,
            time:new Date().getTime()
        }, function (data) {
            $('#tBody').html(data);
            var total = $('.totalStudents').val();
            if(total === "0"){
                $(".tip-select>p").html('暂无数据！');
                $(".tip-select").show(0, function () {
                        setTimeout(function () {$(".tip-select").hide();},2000);
                    }
                );
                $(".div-shade").show(0, function () {
                        setTimeout(function () {$(".div-shade").hide();},2000);
                    }
                );
                return ;
            }
            var content = paging.initPage(totalNum, pageIndex, pageSize);
            $("#projectlist_page").empty().append(content);
        });
    }

    /**
     * 导出excel
     */
    function exportExcel() {
        var provinceCode = $('#select_province').val();
        provinceCode = provinceCode ===''? undefined:provinceCode;
        var countryCode = $('#select_area').val();
        countryCode = countryCode === '' ? undefined : countryCode;
        var schoolCode = $('#select_school').val();
        schoolCode = schoolCode === '' ? undefined : schoolCode;
        var status = $('#select_state').val();

        var options = {
            url : baseUrl+"/exportSportDataList",
            data : {
                projectId : projectId,
                statisticsStatus:status,
                provinceCode: provinceCode,
                countryCode: countryCode,
                schoolCode: schoolCode
            }
        };
        var config = $.extend(true, {
            method : 'post'
        }, options);
        var form = $('<form method="'
            + config.method + '" />');
        form.attr('action', config.url);
        form.attr('target', '');
        for ( var key in config.data) {
            form.append('<input type="hidden" name="' + key + '" value="'
                + config.data[key] + '" />');
        }
        $(document.body).append(form);
        form[0].submit();
        form.remove();
    }

    function summaryResult() {
        var provinceCode = $('#select_province').val();
        var countryCode = $('#select_area').val();
        var schoolCode = $('#select_school').val();
        //泽西哥20180105加入，如果是省区县管理员，初始化数据范围
        var sysProvinceId = $("#sysProvinceId").val();
        var sysCountryId = $("#sysCountryId").val();
        if(sysProvinceId) {
            provinceCode = sysProvinceId;
            if(sysCountryId) {
                countryCode = sysCountryId;
            }
        }
        var status = $('#select_state').val();
        $.get(baseUrl + '/summarySportResult', {
            projectId : projectId,
            statisticsStatus:status,
            provinceCode: provinceCode,
            countryCode: countryCode,
            schoolCode: schoolCode
        }, function (data) {
            if (data.result && data.obj){
                var content = '汇总：当前有<span>';
                content += data.obj.totalNum ;
                if (provinceCode === ''){
                    content += '</span>个省，共有<span>';
                }else if (provinceCode !== '' && countryCode === ''){
                    content += '</span>个区县，共有<span>';
                }else {
                    content += '</span>所学校，共有<span>';
                }
                content += data.obj.totalStudents;
                content += '</span>名学生参与体育测试，其中<span>';
                content += data.obj.finishedStudent;
                content += '</span>名学生已完成测评，<span>';
                content += data.obj.unFinishedStudents;
                content += '</span>名未完成测评，完成率<span>';
                content += data.obj.percent + '</span>。';
                $('.summaryResult').html(content);
                totalNum = data.obj.totalNum;
                var contentHtml = paging.initPage(totalNum, pageIndex, pageSize);
                $("#projectlist_page").empty().append(contentHtml);
                if(data.obj.totalNum === 0){
                    $(".tip-select>p").html('暂无数据！');
                    $(".tip-select").show();
                    $(".div-shade").show();
                }
            }
        })
    }

});
